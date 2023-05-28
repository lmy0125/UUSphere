import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import type { Message, Participant } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { Channel } from 'stream-chat';

export interface User {
	id: string;
	avatar?: string;
	email?: string;
	name?: string;

	[key: string]: any;
}

const getAuthor = (message: Message, participants: Participant[], user: User) => {
	const participant = participants.find((participant) => participant.id === message.authorId);

	// This should never happen
	if (!participant) {
		return {
			name: 'Unknown',
			avatar: '',
			isUser: false,
		};
	}

	// Since chat mock db is not synced with external auth providers
	// we set the user details from user auth state instead of thread participants
	if (message.authorId === user.id) {
		return {
			name: 'Me',
			avatar: user.avatar,
			isUser: true,
		};
	}

	return {
		avatar: participant!.avatar,
		name: participant!.name,
		isUser: false,
	};
};

interface ChatMessagesProps {
	channel: Channel;
	messages: Message[];
	participants: Participant[];
}

export const ChatMessages: FC<ChatMessagesProps> = (props) => {
	const { channel, participants, ...other } = props;
	const user = {
		id: '5e86809283e28b96d2d38537',
		avatar: '/assets/avatars/avatar-anika-visser.png',
		name: 'Anika Visser',
		email: 'anika.visser@devias.io',
	};
	const messages = channel.state.messages;
	console.log('messages', messages);
	return (
		<Stack spacing={2} sx={{ p: 3 }} {...other}>
			{messages.map((message) => {
				// const author = getAuthor(message, participants, user);

				return (
					<ChatMessage
						key={message.id}
						messageInfo={message}
						// authorAvatar={author.avatar}
						// authorName={author.name}
						// body={message.body}
						// contentType={message.contentType}
						// createdAt={message.createdAt}
						// position={author.isUser ? 'right' : 'left'}
					/>
				);
			})}
		</Stack>
	);
};

ChatMessages.propTypes = {
	// @ts-ignore
	messages: PropTypes.array,
	// @ts-ignore
	participants: PropTypes.array,
};
