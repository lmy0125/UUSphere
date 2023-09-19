import React, { Dispatch, SetStateAction, useState } from 'react';
import { Box, Stack, Avatar, AvatarGroup, IconButton, Typography } from '@mui/material';
import {
	ChannelHeaderProps,
	TypingIndicator,
	useChannelPreviewInfo,
	useChannelStateContext,
} from 'stream-chat-react';
import InfoIcon from '@mui/icons-material/Info';
import { useSession } from 'next-auth/react';

interface CustomChannelHeaderProps extends ChannelHeaderProps {
	setIsChannelInfoOpen: React.Dispatch<SetStateAction<boolean>>;
}

const CustomChannelHeader = (props: CustomChannelHeaderProps) => {
	const { title, setIsChannelInfoOpen } = props;
	const { data: session } = useSession();
	const { channel, members, watcher_count } = useChannelStateContext();
	const { displayImage, displayTitle } = useChannelPreviewInfo({ channel });
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
					onClick={() => setIsChannelInfoOpen((prev) => !prev)}
					style={{ marginLeft: 'auto' }}>
					<InfoIcon sx={{ width: 30, height: 30 }} />
				</IconButton>
			</Stack>
		);
	} else {
		// One-to-one channel
		if (channel.data?.member_count && channel.data?.member_count === 2) {
			return (
				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
					sx={{
						px: 2,
						py: 1.5,
					}}>
					<Avatar src={displayImage} />

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
						onClick={() => setIsChannelInfoOpen((prev) => !prev)}
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
									<Avatar key={key} src={value.user?.image} />
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
							onClick={() => setIsChannelInfoOpen((prev) => !prev)}
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
