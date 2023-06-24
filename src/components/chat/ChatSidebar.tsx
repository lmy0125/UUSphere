import { ChangeEvent, FC, useEffect } from 'react';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import type { Theme } from '@mui/material';
import {
	Box,
	Button,
	Drawer,
	IconButton,
	Stack,
	SvgIcon,
	Typography,
	useMediaQuery,
} from '@mui/material';
// import { chatApi } from 'src/api/chat';
import { Scrollbar } from '@/components/scrollbar';
import { paths } from '@/paths';
// import { useSelector } from 'src/store';
import type { Contact, Thread } from '@/types/chat';
// import { ChatSidebarSearch } from './chat-sidebar-search';
import { ChatThreadItem } from './ChatThreadItem';
import { useChatContext } from '@/contexts/ChatContext';
import { ChannelSort, StreamChat } from 'stream-chat';
import { ChannelList } from 'stream-chat-react';

interface ChatSidebarProps {
	container?: HTMLDivElement | null;
	onClose?: () => void;
	open?: boolean;
	client: StreamChat;
}

export const ChatSidebar: FC<ChatSidebarProps> = (props) => {
	const { client, container, onClose, open, ...other } = props;
	const router = useRouter();
	const { userChannels } = useChatContext();
	// const [currentChannel, setCurrentChannel] = useState();
	const currentChannelId = router.query.id;

	const [searchFocused, setSearchFocused] = useState(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	//   const [searchResults, setSearchResults] = useState<Contact[]>([]);
	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

	const handleCompose = useCallback((): void => {
		router.push(paths.dashboard.chat + '?compose=true');
	}, [router]);

	//   const handleSearchChange = useCallback(
	//     async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
	//       const { value } = event.target;

	//       setSearchQuery(value);

	//       if (!value) {
	//         setSearchResults([]);
	//         return;
	//       }

	//       try {
	//         const contacts = await chatApi.getContacts({ query: value });

	//         setSearchResults(contacts);
	//       } catch (err) {
	//         console.error(err);
	//       }
	//     },
	//     []
	//   );

	const handleSearchClickAway = useCallback((): void => {
		if (searchFocused) {
			setSearchFocused(false);
			setSearchQuery('');
		}
	}, [searchFocused]);

	const handleSearchFocus = useCallback((): void => {
		setSearchFocused(true);
	}, []);

	//   const handleSearchSelect = useCallback(
	//     (contact: Contact): void => {
	//       // We use the contact ID as a thread key
	//       const threadKey = contact.id;

	//       setSearchFocused(false);
	//       setSearchQuery('');

	//       router.push(paths.dashboard.chat + `?threadKey=${threadKey}`);
	//     },
	//     [router]
	//   );

	const filters = { type: 'messaging', members: { $eq: [client.userID ?? ''] } };
	const sort: ChannelSort = { last_message_at: -1 };

	const content = (
		<div>
			<Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
				<Typography variant="h5" sx={{ flexGrow: 1 }}>
					Chats
				</Typography>
				{/* <Button
					onClick={handleCompose}
					startIcon={
						<SvgIcon>
							<PlusIcon />
						</SvgIcon>
					}
					variant="contained">
					Group
				</Button> */}
				{!mdUp && (
					<IconButton onClick={onClose}>
						<SvgIcon>
							<XIcon />
						</SvgIcon>
					</IconButton>
				)}
			</Stack>
			{/* <ChatSidebarSearch
        isFocused={searchFocused}
        onChange={handleSearchChange}
        onClickAway={handleSearchClickAway}
        onFocus={handleSearchFocus}
        onSelect={handleSearchSelect}
        query={searchQuery}
        results={searchResults}
      /> */}
			<Box sx={{ display: searchFocused ? 'none' : 'block' }}>
				{/* <Scrollbar>
					<Stack
						component="ul"
						spacing={0.5}
						sx={{
							listStyle: 'none',
							m: 0,
							p: 2,
						}}>
						{userChannels?.map((channel) => (
							<ChatThreadItem
								key={channel.id}
								active={currentChannelId === channel.id}
								channel={channel}
								thread={thread}
							/>
						))}
					</Stack>
				</Scrollbar> */}
				<ChannelList
					// List={CustomList}
					filters={filters}
					sort={sort}
					// Preview={CustomChannelPreview}
					// LoadingErrorIndicator={CustomErrorIndicator}
					// LoadingIndicator={CustomLoadingIndicator}
				/>
			</Box>
		</div>
	);

	if (mdUp) {
		return (
			<Drawer
				anchor="left"
				open={open}
				PaperProps={{
					sx: {
						position: 'relative',
						width: 380,
					},
				}}
				SlideProps={{ container }}
				variant="persistent"
				{...other}>
				{content}
			</Drawer>
		);
	}

	return (
		<Drawer
			anchor="left"
			hideBackdrop
			ModalProps={{
				container,
				sx: {
					pointerEvents: 'none',
					position: 'absolute',
				},
			}}
			onClose={onClose}
			open={open}
			PaperProps={{
				sx: {
					maxWidth: '100%',
					width: 380,
					pointerEvents: 'auto',
					position: 'absolute',
				},
			}}
			SlideProps={{ container }}
			variant="temporary"
			{...other}>
			{content}
		</Drawer>
	);
};

ChatSidebar.propTypes = {
	container: PropTypes.any,
	onClose: PropTypes.func,
	open: PropTypes.bool,
	client: PropTypes.any,
};
