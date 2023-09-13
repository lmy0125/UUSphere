import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChatContext } from '@/contexts/ChatContext';
import { ChannelSort } from 'stream-chat';
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
import 'stream-chat-react/dist/css/v2/index.css';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import type { Theme } from '@mui/material';
import { Stack, Box, Divider, Button, Container, Typography, useMediaQuery } from '@mui/material';
// import { Seo } from 'src/components/seo';
// import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
// import { ChatComposer } from 'src/sections/dashboard/chat/chat-composer';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
// import { useDispatch } from 'src/store';
// import { thunks } from 'src/thunks/chat';
import type { Page as PageType } from '@/types/page';
import { useSession } from 'next-auth/react';
import CustomChannelHeader from '@/components/chat/CustomChannelHeader';
import CustomMessageInput from '@/components/chat/CustomMessageInput';
// import  CustomTriggerProvider  from '@/components/chat/CustomTriggerProvider';
import ChannelInfoSidebar from '@/components/chat/ChannelInfoSidebar';
import CustomMessage from '@/components/chat/CustomMessage';
import AuthModal from '@/components/AuthModal';

/**
 * NOTE:
 * In our case there two possible routes
 * one that contains /chat and one with a chat?threadKey={{threadKey}}
 * if threadKey does not exist, it means that the chat is in compose mode
 */

// const useThreads = (): void => {
//   const dispatch = useDispatch();

//   const handleThreadsGet = useCallback(
//     (): void => {
//       dispatch(thunks.getThreads());
//     },
//     [dispatch]
//   );

//   useEffect(
//     () => {
//       handleThreadsGet();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   );
// };

const useSidebar = () => {
	//   const searchParams = useSearchParams();
	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
	const [open, setOpen] = useState(mdUp);

	const handleScreenResize = useCallback((): void => {
		if (!mdUp) {
			setOpen(false);
		} else {
			setOpen(true);
		}
	}, [mdUp]);

	useEffect(
		() => {
			handleScreenResize();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[mdUp]
	);

	const handeParamsUpdate = useCallback((): void => {
		if (!mdUp) {
			setOpen(false);
		}
	}, [mdUp]);

	useEffect(
		() => {
			handeParamsUpdate();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
		// [searchParams]
	);

	const handleToggle = useCallback((): void => {
		setOpen((prevState) => !prevState);
	}, []);

	const handleClose = useCallback((): void => {
		setOpen(false);
	}, []);

	return {
		handleToggle,
		handleClose,
		open,
	};
};

const ChatPage: PageType = () => {
	const [isChannelInfoOpen, setIsChannelInfoOpen] = useState(false);
	const [authModal, setAuthModal] = useState(false);
	const { chatClient: client } = useChatContext();
	const { data: session, status } = useSession();
	const rootRef = useRef<HTMLDivElement | null>(null);
	const searchParams = useSearchParams();
	//   const compose = searchParams.get('compose') === 'true';
	const channelId = searchParams.get('channelId') || undefined;
	const sidebar = useSidebar();

	if (status === 'loading') {
		return <></>;
	} else if (status !== 'unauthenticated' || !client) {
		return (
			<Container maxWidth="xl" sx={{ mt: 2 }}>
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

	//   useThreads();

	//   const view = threadKey
	//     ? 'thread'
	//     : compose
	//       ? 'compose'
	//       : 'blank';
	// else if (!client) {
	// 	return <LoadingIndicator />;
	// }

	return (
		<>
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
					<Chat client={client} theme="str-chat__theme-light">
						<ChatSidebar
							container={rootRef.current}
							onClose={sidebar.handleClose}
							open={sidebar.open}
							client={client}
						/>
						<ChatContainer open={sidebar.open}>
							{/* <Box sx={{ p: 2 }}>
								<IconButton onClick={sidebar.handleToggle}>
									<SvgIcon>
										<Menu01Icon />
									</SvgIcon>
								</IconButton>
							</Box> */}
							{/* <Divider /> */}
							{/* <Stack
								sx={{
									flexGrow: 1,
									overflow: 'hidden',
								}}> */}
							<Channel>
								<Window hideOnThread>
									{/* <ChannelHeader /> */}
									<CustomChannelHeader setIsChannelInfoOpen={setIsChannelInfoOpen} />
									<MessageList Message={CustomMessage} />
									<Divider />
									<MessageInput
										grow
										// Input={CustomMessageInput}
									/>
								</Window>
								<Thread />
								<ChannelInfoSidebar
									isOpen={isChannelInfoOpen}
									onClose={() => setIsChannelInfoOpen((prev) => !prev)}
								/>
							</Channel>
							{/* </Stack> */}
						</ChatContainer>
					</Chat>
				</Box>
			</Box>
		</>
	);
};

ChatPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ChatPage;
