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
	useMessageContext,
	ChannelListMessengerProps,
	ChatDownProps,
	ChannelPreviewUIComponentProps,
	useChatContext as useStreamChatContext,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import type { Theme } from '@mui/material';
import { Box, Divider, IconButton, SvgIcon, useMediaQuery } from '@mui/material';
// import { Seo } from 'src/components/seo';
// import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { ChatBlank } from '@/components/chat/ChatBlank';
// import { ChatComposer } from 'src/sections/dashboard/chat/chat-composer';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatChannel } from '@/components/chat/ChatChannel';
// import { useDispatch } from 'src/store';
// import { thunks } from 'src/thunks/chat';
import type { Page as PageType } from '@/types/page';

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

const Page: PageType = () => {
	const { client } = useChatContext();
	const rootRef = useRef<HTMLDivElement | null>(null);
	const searchParams = useSearchParams();
	//   const compose = searchParams.get('compose') === 'true';
	const channelId = searchParams.get('channelId') || undefined;
	const sidebar = useSidebar();

	const filters = { type: 'messaging' };
	const sort: ChannelSort = { last_message_at: -1 };
	//   usePageView();

	//   useThreads();

	//   const view = threadKey
	//     ? 'thread'
	//     : compose
	//       ? 'compose'
	//       : 'blank';

	if (!client) {
		return <LoadingIndicator />;
	}

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
						<ChannelList
							// List={CustomList}
							filters={filters}
							sort={sort}
							// Preview={CustomChannelPreview}
							// LoadingErrorIndicator={CustomErrorIndicator}
							// LoadingIndicator={CustomLoadingIndicator}
						/>
						<ChatContainer open={sidebar.open}>
							{/* <Box sx={{ p: 2 }}>
								<IconButton onClick={sidebar.handleToggle}>
									<SvgIcon>
										<Menu01Icon />
									</SvgIcon>
								</IconButton>
							</Box> */}
							<Divider />
							<Channel>
								<Window>
									<ChannelHeader />
									<MessageList
									// Message={CustomMessage}
									/>
									<MessageInput />
								</Window>
								<Thread />
							</Channel>
						</ChatContainer>
					</Chat>
					{/* <ChatSidebar
						container={rootRef.current}
						onClose={sidebar.handleClose}
						open={sidebar.open}
					/> */}
				</Box>
			</Box>
		</>
	);
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
