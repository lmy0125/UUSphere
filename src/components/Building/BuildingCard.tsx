import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '@prisma/client';
import { supabaseClient } from '@/lib/supabase';
import { useSession } from 'next-auth/react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import DiningIcon from '@mui/icons-material/Dining';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import { BuildingInfo } from '@/types/building';

export default function BuildingCard({ buildingInfo }: { buildingInfo: BuildingInfo }) {
	const { data: session } = useSession();
	const [users, setUsers] = useState<User[]>([]);

	// useEffect(() => {
	// 	const fetchBuildingInfo = async () => {
	// 		const response = await axios.get(`/api/building?id=${buildingId}`);
	// 		setBuildingInfo(response.data);
	// 		setUsers(response.data.users ?? []);
	// 	};
	// 	fetchBuildingInfo();
	// }, []);

	useEffect(() => {
		// Realtime update
		const buildingChannel = supabaseClient.channel(`buildings`, { config: { presence: { key: buildingInfo.id } } });
		console.log(buildingInfo.name, buildingChannel);

		buildingChannel
			.on('presence', { event: 'sync' }, () => {
				const newState = buildingChannel.presenceState();
				// console.log(
				// 	'sync',
				// 	newState,
				// 	buildingInfo.name,
				// 	buildingInfo.id,
				// 	newState[buildingInfo.id],
				// 	newState[buildingInfo.id]?.map((object: any) => object.user)
				// );
			})
			.on('presence', { event: 'join' }, ({ key, newPresences }) => {
				console.log(
					'join',
					key,
					newPresences,
					buildingInfo.name,
					newPresences.map((object: any) => object.user)
				);
				setUsers(newPresences.map((object: any) => object.user));
			})
			.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
				console.log('leave', buildingInfo.name, key, leftPresences);
				setUsers(leftPresences.map((object: any) => object.user));
			})
			.subscribe(async (status) => {
				// const userStatus = {
				// 	user: session?.user,
				// 	online_at: new Date().toISOString(),
				// };
				// if (status !== 'SUBSCRIBED') {
				// 	return;
				// }
				// const presenceTrackStatus = await buildingChannel.track(userStatus);
				// console.log('presenceTrackStatus', presenceTrackStatus);
			});

		// return () => {
		// 	buildingChannel.unsubscribe();
		// 	supabaseClient.removeChannel(buildingChannel);
		// };
	}, [buildingInfo, session]);

	return (
		<Card sx={{ maxWidth: 'md', width: '100%' }}>
			<CardContent
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					pb: 2,
				}}>
				<div>
					<Typography variant="h6" component="div">
						{buildingInfo.name}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Total People: {users.length}
					</Typography>
				</div>
			</CardContent>
			<CardContent
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					gap: 2,
				}}>
				{[
					// Array of objects representing each status
					{ icon: <SelfImprovementIcon fontSize="large" />, number: 25, text: 'Chilling' },
					{ icon: <LaptopMacIcon fontSize="large" />, number: 75, text: 'Studying' },
					{ icon: <DiningIcon fontSize="large" />, number: 15, text: 'Eating' },
					{ icon: <HotelIcon fontSize="large" />, number: 10, text: 'Sleeping' },
				].map((status) => (
					<Box key={status.text} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
						{status.icon}
						<Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
							{status.number}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{status.text}
						</Typography>
					</Box>
				))}
			</CardContent>
		</Card>
	);
}
