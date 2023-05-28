import type { FC } from 'react';
import PropTypes from 'prop-types';
// import { formatDistanceStrict } from 'date-fns';
import { Avatar, avatarClasses, AvatarGroup, Box, Stack, Typography } from '@mui/material';
// import { useMockedUser } from 'src/hooks/use-mocked-user';
import type { Message, Participant, Thread } from '@/types/chat';
// import { customLocale } from 'src/utils/date-locale';
import { Channel } from 'stream-chat';
import { useRouter } from 'next/router';
import { paths } from '@/paths';

const getLastMessage = (thread: Thread): Message | undefined => {
	return thread.messages?.[thread.messages.length - 1];
};

const getRecipients = (participants: Participant[], userId: string): Participant[] => {
	return participants.filter((participant) => participant.id !== userId);
};

const getDisplayName = (recipients: Participant[]): string => {
	return recipients.map((participant) => participant.name).join(', ');
};

const getDisplayContent = (userId: string, lastMessage?: Message): string => {
	if (!lastMessage) {
		return '';
	}

	const author = lastMessage.authorId === userId ? 'Me: ' : '';
	const message = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.body;

	return `${author}${message}`;
};

const getLastActivity = (lastMessage?: Message): string | null => {
	if (!lastMessage) {
		return null;
	}
	return 'time stamp';
	// return formatDistanceStrict(
	//   lastMessage.createdAt,
	//   new Date(),
	//   {
	//     addSuffix: false,
	//     locale: customLocale
	//   });
};

interface ChatThreadItemProps {
	active?: boolean;
	thread: Thread;
	channel: Channel;
}

export const ChatThreadItem: FC<ChatThreadItemProps> = (props) => {
	const { active, thread, channel, ...other } = props;
	const router = useRouter();
	const user = {
		id: '5e86809283e28b96d2d38537',
		avatar: '/assets/avatars/avatar-anika-visser.png',
		name: 'Anika Visser',
		email: 'anika.visser@devias.io',
	};
	// console.log(channel);

	const recipients = getRecipients(thread.participants || [], user.id);
	const lastMessage = getLastMessage(thread);
	const lastActivity = getLastActivity(lastMessage);
	const displayName = getDisplayName(recipients);
	const displayContent = getDisplayContent(user.id, lastMessage);
	const groupThread = recipients.length > 1;
	const isUnread = !!(thread.unreadCount && thread.unreadCount > 0);

	const directToChannel = () => {
		if (!channel.id) {
			router.push(paths.chat);
		} else {
			router.push(paths.chat + `/${channel.id}`);
		}
	};

	return (
		<Stack
			component="li"
			direction="row"
			onClick={directToChannel}
			spacing={2}
			sx={{
				borderRadius: 2.5,
				cursor: 'pointer',
				px: 3,
				py: 2,
				'&:hover': {
					backgroundColor: 'action.hover',
				},
				...(active && {
					backgroundColor: 'action.hover',
				}),
			}}
			{...other}>
			{/* <div>
				<AvatarGroup
					max={2}
					sx={{
						[`& .${avatarClasses.root}`]: groupThread
							? {
									height: 26,
									width: 26,
									'&:nth-of-type(2)': {
										mt: '10px',
									},
							  }
							: {
									height: 36,
									width: 36,
							  },
					}}>
					{recipients.map((recipient) => (
						<Avatar key={recipient.id} src={recipient.avatar || undefined} />
					))}
				</AvatarGroup>
			</div> */}
			<Box
				sx={{
					flexGrow: 1,
					overflow: 'hidden',
				}}>
				<Typography noWrap variant="subtitle2">
					{channel.data?.name}
				</Typography>
				<Stack alignItems="center" direction="row" spacing={1}>
					{isUnread && (
						<Box
							sx={{
								backgroundColor: 'primary.main',
								borderRadius: '50%',
								height: 8,
								width: 8,
							}}
						/>
					)}
					<Typography color="text.secondary" noWrap sx={{ flexGrow: 1 }} variant="subtitle2">
						{displayContent}meg
					</Typography>
				</Stack>
			</Box>
			{lastActivity && (
				<Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }} variant="caption">
					{lastActivity}
				</Typography>
			)}
		</Stack>
	);
};

ChatThreadItem.propTypes = {
	active: PropTypes.bool,
	onSelect: PropTypes.func,
	// @ts-ignore
	thread: PropTypes.object.isRequired,
};

ChatThreadItem.defaultProps = {
	active: false,
};
