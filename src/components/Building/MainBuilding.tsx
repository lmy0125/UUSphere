import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Paper } from '@mui/material';
import {
	Channel,
	MessageInput,
	MessageList,
	Thread,
	Window,
	useChatContext as useStreamChatContext,
} from 'stream-chat-react';
import { Channel as ChannelType } from 'stream-chat';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import CustomChannelHeader from '@/components/chat/CustomChannelHeader';
import CustomMessage from '@/components/chat/CustomMessage';
import { Divider } from '@mui/material';
import { DbBuilding } from '@/types/building';
import { supabaseClient } from '@/lib/supabase';
import { User } from '@/types/User';
import { ChannelInfoSidebar } from '@/components/chat/ChannelInfoSidebar';
import axios from 'axios';

export default function MainBuilding({ building }: { building: DbBuilding }) {
	const { data: session } = useSession();
	const [users, setUsers] = useState<User[] | undefined>([]);
	const [channel, setChannel] = useState<ChannelType<CustomStreamChatGenerics>>();
	const channelRef = useRef(channel);
	const { client, setActiveChannel } = useStreamChatContext<CustomStreamChatGenerics>();
	const channelId = building.id;

	useEffect(() => {
		// Join channel in stream.io
		const joinBuildingChannel = async () => {
			if (!channelId) {
				return;
			}
			const channel = client.channel('building', building.id, {
				name: building.name,
			});
			channelRef.current = channel;
			await channel.watch();
			await channel.addMembers([client.user?.id ?? '']);
			setChannel(channel);
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
	}, [channelId, setActiveChannel, client]);

	useEffect(() => {
		// Realtime update
		const buildingChannel = supabaseClient.channel(`buildings`, { config: { presence: { key: building.id } } });

		buildingChannel
			.on('presence', { event: 'sync' }, () => {
				const newState = buildingChannel.presenceState();
				console.log('sync', newState, newState[building.id]);
				setUsers(newState[building.id]?.map((object: any) => object.user));
			})
			.on('presence', { event: 'join' }, ({ key, newPresences }) => {
				console.log('join', key, newPresences);
			})
			.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
				console.log('leave', key, leftPresences);
			})
			.subscribe(async (status) => {
				const userStatus = {
					user: session?.user,
					online_at: new Date().toISOString(),
				};

				if (status !== 'SUBSCRIBED') {
					return;
				}
				const presenceTrackStatus = await buildingChannel.track(userStatus);
				console.log('presenceTrackStatus', presenceTrackStatus);
			});

		// // Modify database
		// const updateDatabase = async (buildingId: string | null) => {
		// 	console.log('buildingid', buildingId);
		// 	await axios.post(`/api/userToBuilding`, {
		// 		userId: session?.user.id,
		// 		buildingId: buildingId,
		// 	});
		// };
		// updateDatabase(building.id);

		return () => {
			// updateDatabase(null);
			buildingChannel.unsubscribe();
			supabaseClient.removeChannel(buildingChannel);
		};
	}, [building.id, session]);

	if (!channel) {
		return null;
	}

	return (
		<Box>
			<Paper
				component="main"
				elevation={10}
				sx={{
					backgroundColor: 'background.paper',
					flex: '1 1 auto',
					overflow: 'hidden',
					position: 'relative',
					height: 500,
				}}>
				<Channel channel={channel}>
					<Window hideOnThread>
						<CustomChannelHeader />
						<MessageList Message={CustomMessage} />
						<Divider />
						<MessageInput
							grow
							disableMentions
							// Input={CustomMessageInput}
						/>
					</Window>
					<Thread />
					<ChannelInfoSidebar />
				</Channel>
			</Paper>
		</Box>
	);
}
