import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChatContext } from '@/contexts/ChatContext';
import {
	Chat,
	Channel,
	ChannelHeader,
	ChannelList,
	MessageInput,
	MessageList,
	Thread,
	Window,
	LoadingIndicator,
	VirtualizedMessageList,
	useMessageContext,
	ChannelListMessengerProps,
	ChatDownProps,
	ChannelPreviewUIComponentProps,
	useChatContext as useStreamChatContext,
} from 'stream-chat-react';
import { Channel as ChannelType } from 'stream-chat';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import 'stream-chat-react/dist/css/v2/index.css';
import { Stack, Box, Divider, Button, Container, Typography } from '@mui/material';
// import { Seo } from 'src/components/seo';
// import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import ComposeModeContextProvider, {
	ComposeModeContextConsumer,
} from '@/contexts/ComposeModeContext';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
// import { useDispatch } from 'src/store';
// import { thunks } from 'src/thunks/chat';
import type { Page as PageType } from '@/types/page';
import { useSession } from 'next-auth/react';
import CustomChannelHeader from '@/components/chat/CustomChannelHeader';
import CustomMessageInput from '@/components/chat/CustomMessageInput';
// import  CustomTriggerProvider  from '@/components/chat/CustomTriggerProvider';
import { ChannelInfoSidebar } from '@/components/chat/ChannelInfoSidebar';
import CustomMessage from '@/components/chat/CustomMessage';
import AuthModal from '@/components/AuthModal';
import Composer from '@/components/chat/Composer';
import { useChatStackContext } from '@/contexts/ChatStackContext';

const ChatPage: PageType = () => {
	const [authModal, setAuthModal] = useState(false);
	const { chatClient } = useChatContext();
	const { status } = useSession();
	const [currentChannel, setCurrentChannel] = useState<ChannelType<CustomStreamChatGenerics>>();
	const { client, setActiveChannel } = useStreamChatContext<CustomStreamChatGenerics>();
	const rootRef = useRef<HTMLDivElement | null>(null);
	const searchParams = useSearchParams();
	const channelId = searchParams.get('channelId') || undefined;
	const { setShowChannel } = useChatStackContext();

	useEffect(() => {
		const displayChannel = async () => {
			if (!channelId) {
				return;
			}
			const filter = {
				id: { $eq: channelId ?? '' },
				members: { $in: [client?.user?.id ?? ''] },
			};
			const channels = await client?.queryChannels(filter);
			if (channels && channels.length > 0) {
				setCurrentChannel(channels?.[0]);

				if (setActiveChannel && currentChannel) {
					setActiveChannel(currentChannel);
					setShowChannel(true);
				}
			}
		};
		displayChannel();
	}, [channelId, setActiveChannel, client, currentChannel]);

	if (status === 'loading') {
		return <></>;
	} else if (status !== 'authenticated' || !chatClient) {
		return (
			<Container maxWidth="xl" sx={{ mt: 1 }}>
				<Typography variant="h4">Chat</Typography>
				<Stack sx={{ alignItems: 'center', mt: 8 }}>
					<Button variant="contained" onClick={() => setAuthModal(true)}>
						Please login to use this feature
					</Button>
					<AuthModal open={authModal} setAuthModal={setAuthModal} />
				</Stack>
			</Container>
		);
	}
	//   usePageView();

	//   const view = threadKey
	//     ? 'thread'
	//     : compose
	//       ? 'compose'
	//       : 'blank';
	// if (!client) {
	// 	return <LoadingIndicator />;
	// }

	return (
		<ComposeModeContextProvider>
			{/* <Seo title="Dashboard: Chat" /> */}
			<Divider />
			<Box
				component="main"
				sx={{
					backgroundColor: 'background.paper',
					flex: '1 1 auto',
					overflow: 'hidden',
					position: 'relative',
				}}>
				<Box
					ref={rootRef}
					sx={{
						bottom: 0,
						display: 'flex',
						left: 0,
						position: 'absolute',
						right: 0,
						top: 0,
					}}>
					<ChatSidebar client={client} />

					<ChatContainer>
						<Channel>
							<ComposeModeContextConsumer>
								{(value) => {
									if (value.composeMode) {
										return <Composer />;
									}
									return (
										<>
											<Window hideOnThread>
												<CustomChannelHeader />
												<MessageList Message={CustomMessage} />
												<Divider />
												<MessageInput
													grow
													disableMentions
													// Input={CustomMessageInput}
												/>
											</Window>
											<Thread />
											<ChannelInfoSidebar />
										</>
									);
								}}
							</ComposeModeContextConsumer>
						</Channel>
					</ChatContainer>
				</Box>
			</Box>
		</ComposeModeContextProvider>
	);
};

ChatPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ChatPage;
