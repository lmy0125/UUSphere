import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { useGeolocated } from 'react-geolocated';
import { DbBuilding, BuildingInfo } from '@/types/building';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Channel as ChannelType } from 'stream-chat';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import { useChatContext as useStreamChatContext } from 'stream-chat-react';

interface LocationContextType {
	nearestBuilding: DbBuilding | null;
	error: string | null;
	buildingChannel: ChannelType<CustomStreamChatGenerics> | null;
}

const LocationContext = createContext<LocationContextType>({
	nearestBuilding: null,
	error: null,
	buildingChannel: null,
});

export default function LocationContextProvider({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();
	const [nearestBuilding, setNearestBuilding] = useState<DbBuilding | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [buildingChannel, setBuildingChannel] = useState<ChannelType<CustomStreamChatGenerics> | null>(null);
	const channelRef = useRef(buildingChannel);
	const { client } = useStreamChatContext<CustomStreamChatGenerics>();
	const router = useRouter();

	// Always use the hook but control its activation
	const geoSettings = {
		positionOptions: {
			enableHighAccuracy: true,
		},
		watchPosition: router.pathname !== '/',
		suppressLocationOnMount: router.pathname === '/',
	};
	const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated(geoSettings);

	const fetchNearestBuilding = async (latitude: number, longitude: number) => {
		try {
			const response = await fetch('/api/nearestBuilding', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ latitude, longitude }),
			});

			if (!response.ok) throw new Error('Failed to fetch the nearest building');

			const data = await response.json();
			setNearestBuilding(data.nearestBuilding);
		} catch (error) {
			console.error(error);
			setError('Failed to communicate with the API');
		}
	};

	// update nearest building when coords change
	useEffect(() => {
		const fetchLocation = () => {
			if (!isGeolocationAvailable || !isGeolocationEnabled || !coords) {
				setError('Geolocation is not available or not enabled');
				return;
			} else {
				setError(null);
			}
			const { latitude, longitude } = coords;
			fetchNearestBuilding(latitude, longitude);
		};

		fetchLocation();
	}, [isGeolocationAvailable, isGeolocationEnabled, coords]);

	useEffect(() => {
		// Modify database
		const updateDatabase = async (buildingId: string | undefined) => {
			if (session && session.user) {
				await axios.post(`/api/userToBuilding`, {
					userId: session.user.id,
					buildingId: buildingId,
				});
			}
		};
		updateDatabase(nearestBuilding?.id);

		return () => {
			updateDatabase(undefined);
		};
	}, [nearestBuilding, session?.user.id]);

	useEffect(() => {
		// Join channel in stream.io
		const joinBuildingChannel = async () => {
			if (!client || !client._user || !nearestBuilding) {
				return;
			}
			let channel;

			let channelId = nearestBuilding.id;
			if (channelId == '89286e04-b99d-4102-934a-9c08ea566abe') {
				channelId = 'af998b9a-cac0-456d-92a2-83c0eb90e4ad';
			}
			// Grouped two buildings into one channel
			if (nearestBuilding.name == 'UC San Diego Softball Field' || nearestBuilding.name == 'Triton Soccer Stadium') {
				channel = client.channel('building', channelId, {
					name: 'Rimac Field',
				});
			} else {
				channel = client.channel('building', channelId, {
					name: nearestBuilding.name,
				});
			}

			channelRef.current = channel;
			await channel.watch();
			setBuildingChannel(channel);
		};
		joinBuildingChannel();

		// const leaveBuildingChannel = async () => {
		// 	console.log('remove', channelRef.current, session?.user?.name);
		// 	await channelRef.current?.stopWatching();
		// 	await channelRef.current?.removeMembers([session?.user?.id ?? '']);
		// };
		// return () => {
		// 	leaveBuildingChannel();
		// };
	}, [nearestBuilding, client]);

	return (
		<LocationContext.Provider value={{ nearestBuilding, error, buildingChannel }}>
			{children}
		</LocationContext.Provider>
	);
}

export const useLocationContext = () => useContext(LocationContext);

export const LocationContextConsumer = LocationContext.Consumer;
