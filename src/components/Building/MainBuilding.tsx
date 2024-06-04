import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Paper } from '@mui/material';
import { Channel, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import CustomChannelHeader from '@/components/chat/CustomChannelHeader';
import CustomMessage from '@/components/chat/CustomMessage';
import { Divider } from '@mui/material';
import { DbBuilding } from '@/types/building';
import { supabaseClient } from '@/lib/supabase';
import { User } from '@/types/User';
import { ChannelInfoSidebar } from '@/components/chat/ChannelInfoSidebar';
import { useLocationContext } from '@/contexts/LocationContext';

export default function MainBuilding() {
	const { data: session } = useSession();
	const [users, setUsers] = useState<User[] | undefined>([]);
	const { nearestBuilding, buildingChannel } = useLocationContext();

	useEffect(() => {
		// Realtime update
		if (nearestBuilding) {
			const buildingChannel = supabaseClient.channel(`buildings`, {
				config: { presence: { key: nearestBuilding.id } },
			});

			buildingChannel
				.on('presence', { event: 'sync' }, () => {
					const newState = buildingChannel.presenceState();
					console.log('sync', newState, newState[nearestBuilding.id]);
					setUsers(newState[nearestBuilding.id]?.map((object: any) => object.user));
				})
				.on('presence', { event: 'join' }, ({ key, newPresences }) => {
					// console.log('join', key, newPresences);
				})
				.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
					// console.log('leave', key, leftPresences);
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
					// console.log('presenceTrackStatus', presenceTrackStatus);
				});
		}
		// return () => {
		// 	buildingChannel?.unsubscribe();
		// 	supabaseClient.removeChannel(buildingChannel);
		// };
	}, [nearestBuilding, session]);

	if (!buildingChannel) {
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
				<Channel channel={buildingChannel}>
					<Window hideOnThread>
						<CustomChannelHeader onlineUsers={users} />
						<MessageList Message={CustomMessage} />
						<Divider />
						<MessageInput
							grow
							disableMentions
							// Input={CustomMessageInput}
						/>
					</Window>
					<Thread />
					<ChannelInfoSidebar onlineUsers={users} />
				</Channel>
			</Paper>
		</Box>
	);
}
