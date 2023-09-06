import React, { useState, useEffect, createContext, useContext } from 'react';
import { StreamChat, Channel } from 'stream-chat';
import { useSession } from 'next-auth/react';
import { Class } from '@prisma/client';
import axios from 'axios';

interface ChatContextType {
	chatClient: StreamChat | undefined;
	userChannels: Channel[] | undefined;
}

const ChatContext = createContext<ChatContextType>({
	chatClient: undefined,
	userChannels: undefined,
});

const steam_api_key = process.env.NEXT_PUBLIC_STREAMCHAT_KEY as string;

export default function ChatContextProvider({ children }: { children: React.ReactNode }) {
	const [chatClient, setChatClient] = useState<StreamChat>();
	const [userChannels, setUserChannels] = useState<Channel[]>();
	const { data: session, status } = useSession();

	useEffect(() => {
		const initStreamChat = async () => {
			if (!session) {
				return;
			}
			const client = new StreamChat(steam_api_key);
			try {
				const { created_at, ...chatUser } = session.user;

				// connect user to stream chat
				await client.connectUser(chatUser, session.streamChatToken);
				setChatClient(client);
			} catch (err) {
				console.log('Failed to connect stream chat', err);
			}
		};

		initStreamChat();
	}, [session]);

	useEffect(() => {
		return () => {
			if (chatClient) {
				chatClient.disconnectUser();
			}
		};
	}, [chatClient]);

	return (
		<ChatContext.Provider value={{ chatClient: chatClient, userChannels: userChannels }}>
			{children}
		</ChatContext.Provider>
	);
}

export const useChatContext = () => useContext(ChatContext);
