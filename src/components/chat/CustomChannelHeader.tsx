import React, { Dispatch, SetStateAction, useState } from 'react';
import { Box, Stack, Avatar, AvatarGroup, Divider, IconButton, Typography, useMediaQuery, Theme } from '@mui/material';
import { ChannelHeaderProps, TypingIndicator, useChannelPreviewInfo, useChannelStateContext } from 'stream-chat-react';
import InfoIcon from '@mui/icons-material/Info';
import { useSession } from 'next-auth/react';
import UserAvatar from '@/components/UserAvatar';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useChatStackContext } from '@/contexts/ChatStackContext';
import BackButton from '@/components/chat/BackButton';
import { User } from '@/types/User';

interface CustomChannelHeaderProps extends ChannelHeaderProps {
	onlineUsers?: User[];
}

const CustomChannelHeader = (props: CustomChannelHeaderProps) => {
	const { title, onlineUsers } = props;
	const { data: session } = useSession();
	const { channel, members, watcher_count } = useChannelStateContext();
	const { displayTitle } = useChannelPreviewInfo({ channel });
	const { showInfoSidebar, setShowInfoSidebar, setShowChannel } = useChatStackContext();
	const { name } = channel.data || {};

	if (channel.type === 'classroom') {
		return (
			<Stack
				direction="row"
				spacing={2}
				alignItems="center"
				sx={{
					px: 2,
					py: 1.5,
				}}>
				<BackButton setOpen={setShowChannel} />
				<Avatar variant="rounded" sx={{ textAlign: 'center' }}>
					{/* @ts-ignore */}
					{channel.data?.code}
				</Avatar>

				<div style={{ overflow: 'hidden' }}>
					<Typography
						variant="subtitle1"
						sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
						{title || name}
					</Typography>
					<Typography variant="body2" sx={{ color: '#505050' }}>
						{Object.keys(members ?? {}).length} members, {watcher_count} online
					</Typography>
				</div>

				<TypingIndicator />

				<IconButton
					color={showInfoSidebar ? 'primary' : 'default'}
					onClick={() => setShowInfoSidebar((prev) => !prev)}
					style={{ marginLeft: 'auto' }}>
					<InfoIcon sx={{ width: 30, height: 30 }} />
				</IconButton>
			</Stack>
		);
	} else if (channel.type === 'building') {
		return (
			<Stack
				direction="row"
				spacing={2}
				alignItems="center"
				sx={{
					px: 2,
					py: 1.5,
				}}>
				<Avatar variant="rounded" sx={{ textAlign: 'center' }}>
					{/* @ts-ignore */}
					{channel.data?.name[0]}
				</Avatar>

				<div style={{ overflow: 'hidden' }}>
					<Typography
						variant="subtitle1"
						sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
						{title || name}
					</Typography>
					<Typography variant="body2" sx={{ color: '#505050' }}>
						{onlineUsers?.length == 1 ? 'I am here with you ^_^' : onlineUsers?.length! - 1 + ' people with you'}
					</Typography>
				</div>

				<TypingIndicator />

				<IconButton
					color={showInfoSidebar ? 'primary' : 'default'}
					onClick={() => setShowInfoSidebar((prev) => !prev)}
					style={{ marginLeft: 'auto' }}>
					<InfoIcon sx={{ width: 30, height: 30 }} />
				</IconButton>
			</Stack>
		);
	} else {
		// One-to-one channel
		if (channel.data?.member_count && channel.data?.member_count === 2) {
			// filter out user themselves
			const recipient = Object.entries(members ?? []).filter(
				([key, value]) => value.user?.id !== session?.user.id
			)[0]?.[1]?.user;

			return (
				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
					sx={{
						px: 2,
						py: 1.5,
					}}>
					<BackButton setOpen={setShowChannel} />
					<UserAvatar userId={recipient?.id} />

					<div style={{ overflow: 'hidden' }}>
						<Typography
							variant="subtitle1"
							sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
							{displayTitle}
						</Typography>
						{watcher_count === 2 ? (
							<Typography variant="body2" sx={{ color: '#44b700' }}>
								Online
							</Typography>
						) : (
							<Typography variant="body2" sx={{ color: '#505050' }}>
								Offline
							</Typography>
						)}
					</div>

					<TypingIndicator />

					<IconButton
						color={showInfoSidebar ? 'primary' : 'default'}
						onClick={() => setShowInfoSidebar((prev) => !prev)}
						style={{ marginLeft: 'auto' }}>
						<InfoIcon sx={{ width: 30, height: 30 }} />
					</IconButton>
				</Stack>
			);
		}
		// Group channel
		else {
			const channelTitle = Object.entries(members ?? [])
				.filter(([key, value]) => value.user?.id != session?.user.id) // filter out user themselves
				.map(([key, value]) => value.user?.name)
				.join(', ');
			return (
				<>
					<Stack
						direction="row"
						spacing={2}
						alignItems="center"
						sx={{
							px: 2,
							py: 1.5,
						}}>
						<BackButton setOpen={setShowChannel} />
						<AvatarGroup
							max={2}
							sx={{
								...(Object.entries(members ?? []).length > 1 && {
									'& .MuiAvatar-root': {
										height: 30,
										width: 30,
										'&:nth-of-type(2)': {
											mt: '10px',
										},
									},
								}),
							}}>
							{Object.entries(members ?? [])
								.filter(([key, value]) => value.user?.id != session?.user.id) // filter out user themselves
								.map(([key, value]) => (
									<UserAvatar key={value.user?.id} userId={value.user?.id} />
								))}
						</AvatarGroup>

						<div style={{ overflow: 'hidden' }}>
							<Typography
								variant="subtitle1"
								sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
								{channelTitle}
							</Typography>
							<Typography variant="body2" sx={{ color: '#505050' }}>
								{Object.keys(members ?? {}).length} members, {watcher_count} online
							</Typography>
						</div>

						<TypingIndicator />

						<IconButton
							color={showInfoSidebar ? 'primary' : 'default'}
							onClick={() => setShowInfoSidebar((prev) => !prev)}
							style={{ marginLeft: 'auto' }}>
							<InfoIcon sx={{ width: 30, height: 30 }} />
						</IconButton>
					</Stack>
				</>
			);
		}
	}
};

export default CustomChannelHeader;
