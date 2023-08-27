import React, { Dispatch, SetStateAction, useState } from 'react';
import { Box, Stack, Avatar, AvatarGroup, IconButton, Typography } from '@mui/material';
import {
	ChannelHeaderProps,
	TypingIndicator,
	useChannelPreviewInfo,
	useChannelStateContext,
} from 'stream-chat-react';
import InfoIcon from '@mui/icons-material/Info';

interface CustomChannelHeaderProps extends ChannelHeaderProps {
	setIsChannelInfoOpen: React.Dispatch<SetStateAction<boolean>>;
}

const CustomChannelHeader = (props: CustomChannelHeaderProps) => {
	const { title, setIsChannelInfoOpen } = props;
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
};

export default CustomChannelHeader;
