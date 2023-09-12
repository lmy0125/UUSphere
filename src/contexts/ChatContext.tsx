import React, { useState, useEffect, createContext, useContext } from 'react';
import { StreamChat, Channel } from 'stream-chat';
import { useSession } from 'next-auth/react';
import { Class } from '@prisma/client';
import axios from 'axios';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';

interface ChatContextType {
	chatClient: StreamChat<CustomStreamChatGenerics> | undefined;
	userChannels: Channel[] | undefined;
}

const ChatContext = createContext<ChatContextType>({
	chatClient: undefined,
	userChannels: undefined,
});

const steam_api_key = process.env.NEXT_PUBLIC_STREAMCHAT_KEY as string;

export default function ChatContextProvider({ children }: { children: React.ReactNode }) {
	const [chatClient, setChatClient] = useState<StreamChat<CustomStreamChatGenerics>>();
	const [userChannels, setUserChannels] = useState<Channel[]>();
	const { data: session, status } = useSession();

	useEffect(() => {
		const initStreamChat = async () => {
			if (status !== "authenticated") {
				console.log('return in initStreamChat')
				return;
			}
			console.log('session', session);
			const client = new StreamChat<CustomStreamChatGenerics>(steam_api_key);
			try {
				const { created_at, emailVerified, ...chatUser } = session.user;

				// connect user to stream chat
				console.log('connect chat');
				await client.connectUser(chatUser, session.streamChatToken);
				setChatClient(client);
			} catch (err) {
				console.log('Failed to connect stream chat', err);
			}
		};

		initStreamChat();
	}, [status]);

	useEffect(() => {
		return () => {
			if (chatClient) {
				console.log("Chat disconnected");
				chatClient.disconnectUser();
			}
		};
		// eslint-disable-next-line
	}, []);

	return (
		<ChatContext.Provider value={{ chatClient: chatClient, userChannels: userChannels }}>
			{children}
		</ChatContext.Provider>
	);
}

export const useChatContext = () => useContext(ChatContext);
