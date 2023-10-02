import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect } from 'react';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { SvgIcon, Theme } from '@mui/material';
import { Box, Button, Divider, Drawer, Stack, Typography, useMediaQuery } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { paths } from '@/paths';
// import { useSelector } from 'src/store';
// import { ChatSidebarSearch } from './chat-sidebar-search';
import { Channel, ChannelSort, StreamChat } from 'stream-chat';
import { ChannelList, SearchResultItemProps, SearchResultsListProps } from 'stream-chat-react';
import { useSession } from 'next-auth/react';
import { CustomChannelPreview, CustomChannelList } from './CustomChannelEntry';
import { CustomDropdown, CustomResultItem } from './CustomSearch';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import { useComposeModeContext } from '@/contexts/ComposeModeContext';
import { useChatStackContext } from '@/contexts/ChatStackContext';

interface ChatSidebarProps {
	client: StreamChat<CustomStreamChatGenerics>;
}

export const ChatSidebar: FC<ChatSidebarProps> = (props) => {
	const { client, ...other } = props;
	const { data: session } = useSession();
	const router = useRouter();
	const { setComposeMode } = useComposeModeContext();
	const [searchFocused, setSearchFocused] = useState(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	const { setShowChannel } = useChatStackContext();

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

	const classroomFilter = {
		type: { $eq: 'classroom' },
		members: { $in: [session?.user.id ?? ''] },
	};
	const customClassroomChannelFilterFunction = (channels: Channel[]) => {
		return channels.filter((channel) => {
			return channel.type === 'classroom';
		});
	};
	const messageFilter = {
		type: 'messaging',
		members: { $in: [session?.user.id ?? ''] },
		last_message_at: { $gt: '2021-01-15T09:30:20.45Z' },
	};
	const customMessageChannelFilterFunction = (channels: Channel[]) => {
		return channels.filter((channel) => {
			return channel.type === 'messaging';
		});
	};
	const sort: ChannelSort = { last_message_at: -1 };

	// TODO: Search functionality
	// const DropDown = (props: SearchResultsListProps) => <CustomDropdown {...props} />;
	// const SearchResult = (props: SearchResultItemProps) => <CustomResultItem {...props} />;
	// const additionalProps = {
	// 	DropdownContainer: DropDown,
	// 	SearchResultItem: SearchResult,
	// 	searchForChannels: true,
	// };

	const EmptyClassroomList = () => {
		return (
			<Stack sx={{ alignItems: 'center', py: 5 }}>
				<Typography sx={{ mb: 2, fontWeight: 500 }} color="text.secondary" variant="h5">
					You have no classes yet
				</Typography>
				<Button variant="contained" onClick={() => router.push(paths.index)}>
					Join Classes
				</Button>
			</Stack>
		);
	};

	const EmptyPersonalMessageList = () => {
		return (
			<Stack sx={{ alignItems: 'center', py: 5 }}>
				<Typography
					sx={{ textAlign: 'center', mb: 2, fontWeight: 500 }}
					color="text.secondary"
					variant="h5">
					You have no conversations yet
				</Typography>
			</Stack>
		);
	};

	const handleOpenComposer = () => {
		if (!smUp) {
			setShowChannel(true);
		}
		setComposeMode(true);
	};

	return (
		<Stack
			sx={{
				flex: smUp ? '0 0 380px' : '0 0 100vw',
				height: '100%',
				overflow: 'hidden',
			}}>
			<Stack alignItems="center" direction="row" spacing={2} sx={{ p: 2 }}>
				<Typography variant="h5" sx={{ flexGrow: 1 }}>
					Chats
				</Typography>

				<Button
					onClick={handleOpenComposer}
					startIcon={
						<SvgIcon>
							<EditNoteIcon />
						</SvgIcon>
					}
					variant="contained">
					New
				</Button>
			</Stack>
			<Divider />
			{/* <ChatSidebarSearch
        isFocused={searchFocused}
        onChange={handleSearchChange}
        onClickAway={handleSearchClickAway}
        onFocus={handleSearchFocus}
        onSelect={handleSearchSelect}
        query={searchQuery}
        results={searchResults}
      /> */}
			<Stack sx={{ flex: 1, overflowY: 'auto' }}>
				<Typography variant="subtitle1" sx={{ px: 2, py: 1 }}>
					Classrooms
				</Typography>

				<Box>
					<ChannelList
						channelRenderFilterFn={customClassroomChannelFilterFunction}
						filters={classroomFilter}
						sort={sort}
						// showChannelSearch
						// additionalChannelSearchProps={additionalProps}
						Preview={CustomChannelPreview}
						List={CustomChannelList}
						EmptyStateIndicator={EmptyClassroomList}
						// LoadingErrorIndicator={CustomErrorIndicator}
						// LoadingIndicator={CustomLoadingIndicator}
					/>
				</Box>

				<Divider />
				<Typography variant="subtitle1" sx={{ px: 2, py: 1 }}>
					Personal
				</Typography>
				<Box>
					<ChannelList
						channelRenderFilterFn={customMessageChannelFilterFunction}
						filters={messageFilter}
						sort={sort}
						// additionalChannelSearchProps={additionalProps}
						Preview={CustomChannelPreview}
						List={CustomChannelList}
						EmptyStateIndicator={EmptyPersonalMessageList}
					/>
				</Box>
			</Stack>
		</Stack>
	);
};

ChatSidebar.propTypes = {
	client: PropTypes.any,
};
