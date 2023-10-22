import { useState, useEffect, PropsWithChildren } from 'react';
import {
	ChannelPreviewUIComponentProps,
	useChatContext,
	ChatDown,
	LoadingChannels,
	ChannelListMessengerProps,
	ChatDownProps,
} from 'stream-chat-react';
import { Stack, Avatar, AvatarGroup, Box, Badge, Chip, Typography } from '@mui/material';
import { formatDistanceStrict } from 'date-fns';
import { DefaultGenerics } from 'stream-chat';
import { useComposeModeContext } from '@/contexts/ComposeModeContext';
import { useChatStackContext } from '@/contexts/ChatStackContext';
import { useSession } from 'next-auth/react';
import UserAvatar from '@/components/UserAvatar';

export const CustomChannelPreview = (props: ChannelPreviewUIComponentProps<DefaultGenerics>) => {
	const { channel, setActiveChannel, displayTitle } = props;
	const [unreadMessageCount, setUnreadMessageCount] = useState(0);
	const { data: session } = useSession();
	const members = channel.state.members;
	const { setComposeMode } = useComposeModeContext();
	const { showChannel, setShowChannel } = useChatStackContext();

	const { channel: activeChannel } = useChatContext();

	const selected = channel?.id === activeChannel?.id;

	useEffect(() => {
		setUnreadMessageCount(channel.state.unreadCount);
	}, [channel.state.unreadCount, channel]);

	const renderMessageText = () => {
		if (!channel.state.messages.length) {
			if (channel.type === 'classroom') {
				return (
					<Typography
						color="text.secondary"
						noWrap
						sx={{ flexGrow: 1, fontSize: '0.875rem', fontWeight: 400 }}>
						{'Welcome to ' + channel.data?.code}
					</Typography>
				);
			} else {
				return '';
			}
		}

		const lastMessageText = channel.state.messages[channel.state.messages.length - 1].text;

		const text = lastMessageText || '';

		return (
			<Stack direction="row">
				<Typography
					color={unreadMessageCount > 0 ? 'text.primary' : 'text.secondary'}
					noWrap
					sx={{
						flexGrow: 1,
						fontSize: '0.875rem',
						fontWeight: unreadMessageCount > 0 ? 600 : 400,
					}}>
					{text.length < 60 ? lastMessageText : `${text.slice(0, 70)}...`}
				</Typography>
				{unreadMessageCount > 0 && (
					<Badge
						badgeContent={unreadMessageCount}
						color="primary"
						invisible={false}
						sx={{
							'.MuiBadge-root': { position: 'static' },
							'.MuiBadge-badge': { position: 'static', transform: 'none' },
							ml: 1,
						}}
					/>
				)}
			</Stack>
		);
	};

	const getLastActivity = () => {
		if (!channel.state?.last_message_at) {
			return null;
		}
		const timeInfo = formatDistanceStrict(channel.state?.last_message_at, new Date(), {
			addSuffix: false,
		});
		if (timeInfo.includes('seconds')) {
			return 'Just now';
		}
		return timeInfo;
	};

	const handleSelectChannel = async () => {
		setShowChannel(true);
		if (setActiveChannel) {
			setComposeMode(false);
			setActiveChannel(channel);
		}
		await channel.markRead();
		setUnreadMessageCount(0);
	};

	if (channel.type === 'classroom') {
		return (
			<Stack
				component="li"
				direction="row"
				onClick={handleSelectChannel}
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

				<Stack
					sx={{
						flexGrow: 1,
						overflow: 'hidden',
					}}>
					<Stack direction="row" justifyContent="space-between">
						<Typography noWrap variant="subtitle2">
							{channel.data?.name || 'Channel'}
						</Typography>
						{getLastActivity() && (
							<Typography
								color="text.secondary"
								sx={{ whiteSpace: 'nowrap' }}
								variant="caption">
								{getLastActivity()}
							</Typography>
						)}
					</Stack>

					{renderMessageText()}
				</Stack>
			</Stack>
		);
	} else {
		// One-to-one chat
		if ((channel.data?.member_count as number) === 2) {
			// filter out user themselves
			const recipient = Object.entries(members ?? []).filter(
				([key, value]) => value.user?.id !== session?.user.id
			)[0]?.[1]?.user;

			return (
				<Stack
					component="li"
					direction="row"
					onClick={handleSelectChannel}
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
					<UserAvatar userId={recipient?.id} size={42} />

					<Stack
						sx={{
							flexGrow: 1,
							overflow: 'hidden',
						}}>
						<Stack direction="row" justifyContent="space-between">
							<Typography noWrap variant="subtitle2">
								{displayTitle || 'Channel'}
							</Typography>
							{getLastActivity() && (
								<Typography
									color="text.secondary"
									sx={{ whiteSpace: 'nowrap' }}
									variant="caption">
									{getLastActivity()}
								</Typography>
							)}
						</Stack>

						{renderMessageText()}
					</Stack>
				</Stack>
			);
		}
		// Group chat
		else {
			const channelTitle = Object.entries(members ?? [])
				.filter(([key, value]) => value.user?.id != session?.user.id) // filter out user themselves
				.map(([key, value]) => value.user?.name)
				.join(', ');
			return (
				<Stack
					component="li"
					direction="row"
					onClick={handleSelectChannel}
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
					<Stack
						sx={{
							flexGrow: 1,
							overflow: 'hidden',
						}}>
						<Stack direction="row" justifyContent="space-between">
							<Typography noWrap variant="subtitle2">
								{channelTitle || 'Channel'}
							</Typography>
							{getLastActivity() && (
								<Typography
									color="text.secondary"
									sx={{ whiteSpace: 'nowrap' }}
									variant="caption">
									{getLastActivity()}
								</Typography>
							)}
						</Stack>

						{renderMessageText()}
					</Stack>
				</Stack>
			);
		}
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
