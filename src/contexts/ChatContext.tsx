import React, { useState, useEffect, createContext, useContext } from 'react';
import { StreamChat } from 'stream-chat';
import { useSession } from 'next-auth/react';
import { Class } from '@prisma/client';
import axios from 'axios';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import { Chat } from 'stream-chat-react';

interface ChatContextType {
	chatClient: StreamChat<CustomStreamChatGenerics> | undefined;
}

const ChatContext = createContext<ChatContextType>({
	chatClient: undefined,
});

const steam_api_key = process.env.NEXT_PUBLIC_STREAMCHAT_KEY as string;

export default function ChatContextProvider({ children }: { children: React.ReactNode }) {
	const [chatClient, setChatClient] = useState<StreamChat<CustomStreamChatGenerics>>();
	const { data: session, status } = useSession();

	useEffect(() => {
		const newClient = new StreamChat<CustomStreamChatGenerics>(steam_api_key);

		const initStreamChat = async () => {
			if (status !== 'authenticated') {
				return;
			}
			try {
				setChatClient(newClient);
				const { created_at, emailVerified, ...chatUser } = session.user;
				// connect user to stream chat
				await newClient.connectUser(chatUser, session.streamChatToken);
				newClient.on('connection.changed', () => setChatClient(newClient));
			} catch (err) {
				console.log('Failed to connect stream chat', err);
			}
		};

		initStreamChat();

		return () => {
			if (chatClient) {
				newClient.off('connection.changed', () => setChatClient(newClient));
				newClient.disconnectUser().then(() => console.log('connection closed'));
			}
		};
		// eslint-disable-next-line
	}, [status]);

	if (!chatClient) {
		return (
			<ChatContext.Provider value={{ chatClient: chatClient }}>{children}</ChatContext.Provider>
		);
	}

	return (
		<ChatContext.Provider value={{ chatClient: chatClient }}>
			<Chat client={chatClient} theme="str-chat__theme-light">
				{children}
			</Chat>
		</ChatContext.Provider>
	);
}

export const useChatContext = () => useContext(ChatContext);
