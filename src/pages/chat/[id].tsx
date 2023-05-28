import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
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

const useSidebar = () => {
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
	const router = useRouter();
	const rootRef = useRef<HTMLDivElement | null>(null);
	//   const compose = searchParams.get('compose') === 'true';
	const channelId = router.query.id as string;
	const sidebar = useSidebar();

	//   usePageView();

	//   const view = threadKey
	//     ? 'thread'
	//     : compose
	//       ? 'compose'
	//       : 'blank';

	const view = channelId ? 'channel' : 'blank';

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
					<ChatSidebar
						container={rootRef.current}
						onClose={sidebar.handleClose}
						open={sidebar.open}
					/>
					<ChatContainer open={sidebar.open}>
						<Box sx={{ p: 2 }}>
							<IconButton onClick={sidebar.handleToggle}>
								<SvgIcon>
									<Menu01Icon />
								</SvgIcon>
							</IconButton>
						</Box>
						<Divider />
						{view === 'channel' && <ChatChannel channelId={channelId} />}
						{/* {view === 'compose' && <ChatComposer />} */}
						{view === 'blank' && <ChatBlank />}
					</ChatContainer>
				</Box>
			</Box>
		</>
	);
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
