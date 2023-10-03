import { useChatStackContext } from '@/contexts/ChatStackContext';
import { useChatContext } from 'stream-chat-react';

export const MessageUser = async (userId: string) => {
	const { client, setActiveChannel } = useChatContext();
	const { setShowChannel } = useChatStackContext();

	if (client && client.user) {
		const channel = client.channel('messaging', {
			members: [client.user.id, userId],
		});
		await channel.watch();
		setActiveChannel(channel);
		setShowChannel(true);
	}
};
