import React, { useState, useEffect, createContext, useContext } from 'react';
import { StreamChat, Channel } from 'stream-chat';
import { useSession } from 'next-auth/react';
import { Class } from '@prisma/client';
import axios from 'axios';

interface ChatContextType {
	client: StreamChat | undefined;
	userChannels: Channel[] | undefined;
}

const ChatContext = createContext<ChatContextType>({ client: undefined, userChannels: undefined });

const steam_api_key = process.env.NEXT_PUBLIC_STREAMCHAT_KEY as string;

export default function ChatContextProvider({ children }: { children: React.ReactNode }) {
	const [chatClient, setChatClient] = useState<StreamChat>();
	const [userChannels, setUserChannels] = useState<Channel[]>();
	const { data: session, status } = useSession();

	useEffect(() => {
		const initChat = async () => {
			console.log('init', session);
			if (!session) {
				return;
			}
			const client = new StreamChat(steam_api_key);
			try {
				// connect user to stream chat
				await client.connectUser(session.user, session.streamChatToken);
				setChatClient(client);
				console.log('chat connected');
				
				// create/watch channel of every enrolled class
				// const response = await axios.get(`/api/getEnrolledClasses`);
				// const classes: Class_test[] = response.data;
				// for (let c of classes) {
				// 	const channel = client.channel('messaging', c.id, {
				// 		name: c.class_name ?? '',
				// 		members: [session.user.id],
				// 	});
				// 	await channel.watch();
				// 	console.log('watching', c.class_name);
				// }
			} catch (err) {
				console.log(err);
			}
		};

		// if (session && !chatClient) {
		// 	initChat();
		// }

		return () => {
			// if (chatClient) {
			// 	chatClient.disconnectUser();
			// 	console.log('chat disconnected');
			// }
		};
	}, [session]);

	// useEffect(() => {
	// 	const getUserChannels = async () => {
	// 		const channels = await chatClient?.queryChannels({
	// 			members: { $in: [session?.user.id ?? ''] },
	// 		});
	// 		setUserChannels(channels);
	// 	};
	// 	if (chatClient) {
	// 		getUserChannels();
	// 	}
	// }, [chatClient]);

	return (
		<ChatContext.Provider value={{ client: chatClient, userChannels: userChannels }}>
			{children}
		</ChatContext.Provider>
	);
}

export const useChatContext = () => useContext(ChatContext);
