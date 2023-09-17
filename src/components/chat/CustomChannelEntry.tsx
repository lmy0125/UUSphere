import { PropsWithChildren } from 'react';
import {
	ChannelPreviewUIComponentProps,
	useChatContext,
	ChatDown,
	LoadingChannels,
	ChannelListMessengerProps,
	ChatDownProps,
} from 'stream-chat-react';
import { Stack, Avatar, Box, Typography } from '@mui/material';
import { formatDistanceStrict } from 'date-fns';
import { DefaultGenerics } from 'stream-chat';

export const CustomChannelPreview = (props: ChannelPreviewUIComponentProps<DefaultGenerics>) => {
	const { channel, setActiveChannel, displayImage, displayTitle } = props;

	const { channel: activeChannel } = useChatContext();

	const selected = channel?.id === activeChannel?.id;

	const renderMessageText = () => {
		if (!channel.state.messages.length) {
			if (channel.type === 'classroom') {
				return 'Welcome to ' + channel.data?.code;
			} else {
				return '';
			}
		}

		const lastMessageText = channel.state.messages[channel.state.messages.length - 1].text;

		const text = lastMessageText || 'message text';

		return text.length < 60 ? lastMessageText : `${text.slice(0, 70)}...`;
	};

	const getLastActivity = () => {
		if (!channel.data?.last_message_at) {
			return null;
		}

		return formatDistanceStrict(new Date(channel.data?.last_message_at as string), new Date(), {
			addSuffix: false,
		});
	};

	if (channel.type === 'classroom') {
		return (
			<Stack
				component="li"
				direction="row"
				onClick={() => setActiveChannel!(channel)}
				spacing={2}
				sx={{
					borderRadius: 2.5,
					cursor: 'pointer',
					px: 2,
					py: 1.5,
					mx: 1.5,
					my: 1,
					'&:hover': {
						backgroundColor: 'action.hover',
					},
					...(selected && {
						backgroundColor: 'action.hover',
					}),
				}}>
				<Avatar variant="rounded" sx={{ textAlign: 'center' }}>
					{/* @ts-ignore */}
					{channel.data?.code}
				</Avatar>
				<Box
					sx={{
						flexGrow: 1,
						overflow: 'hidden',
					}}>
					<Typography noWrap variant="subtitle2">
						{channel.data?.name || 'Channel'}
					</Typography>
					<Typography color="text.secondary" noWrap sx={{ flexGrow: 1 }} variant="subtitle2">
						{renderMessageText()}
					</Typography>
				</Box>
				{getLastActivity() && (
					<Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }} variant="caption">
						{getLastActivity()}
					</Typography>
				)}
			</Stack>
		);
	} else {
		return (
			<Stack
				component="li"
				direction="row"
				onClick={() => setActiveChannel!(channel)}
				spacing={2}
				sx={{
					borderRadius: 2.5,
					cursor: 'pointer',
					px: 2,
					py: 1.5,
					mx: 1.5,
					my: 1,
					'&:hover': {
						backgroundColor: 'action.hover',
					},
					...(selected && {
						backgroundColor: 'action.hover',
					}),
				}}>
				<Avatar src={displayImage} sx={{ textAlign: 'center' }} />
				<Box
					sx={{
						flexGrow: 1,
						overflow: 'hidden',
					}}>
					<Typography noWrap variant="subtitle2">
						{displayTitle || 'Channel'}
					</Typography>
					<Typography color="text.secondary" noWrap sx={{ flexGrow: 1 }} variant="subtitle2">
						{renderMessageText()}
					</Typography>
				</Box>
				{getLastActivity() && (
					<Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }} variant="caption">
						{getLastActivity()}
					</Typography>
				)}
			</Stack>
		);
	}
};

export const CustomChannelList = (props: PropsWithChildren<ChannelListMessengerProps>) => {
	const {
		children,
		error,
		loading,
		LoadingErrorIndicator = ChatDown,
		LoadingIndicator = LoadingChannels,
	} = props;

	if (error) {
		return (
			<LoadingErrorIndicator text="Loading Error - check your connection." type="connection" />
		);
	}

	if (loading) {
		return <LoadingIndicator />;
	}

	return <div>{children}</div>;
};

const CustomErrorIndicator = (props: ChatDownProps) => {
	const { text } = props;

	return <div>{text}</div>;
};

const CustomLoadingIndicator = () => {
	return <div>Loading, loading, loading...</div>;
};
