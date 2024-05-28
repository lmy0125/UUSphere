import React, { useState } from 'react';
import Link from 'next/link';
import {
	Avatar,
	Typography,
	Box,
	Button,
	Divider,
	MenuList,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Card,
	CardMedia,
	CardContent,
	Grid,
	Stack,
	SwipeableDrawer,
	useMediaQuery,
	Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useChannelPreviewInfo, useChannelStateContext } from 'stream-chat-react';
import PopUpUserProfile from '@/components/chat/ChannelInfoSidebar/PopUpUserProfile';
import { ChannelMemberResponse, UserResponse } from 'stream-chat';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import { useSession } from 'next-auth/react';
import UserAvatar from '@/components/UserAvatar';
import { InfoSidebarContainer } from '@/components/chat/ChannelInfoSidebar/InfoSidebarContainer';
import BackButton from '@/components/chat/BackButton';
import FlatUserProfile from '@/components/chat/ChannelInfoSidebar/FlatUserProfile';
import { DropSectionModal } from '@/components/ClassEnrollment/ConfirmModals';
import { useChatStackContext } from '@/contexts/ChatStackContext';

export const ChannelInfoSidebar = () => {
	const [dropSectionModal, setDropSectionModal] = useState(false);
	const { data: session } = useSession();
	const { channel, members } = useChannelStateContext<CustomStreamChatGenerics>();
	const { displayTitle } = useChannelPreviewInfo({ channel });
	const { showInfoSidebar, setShowInfoSidebar } = useChatStackContext();

	if (channel.type === 'classroom' || (channel.data?.member_count && channel.data?.member_count > 2)) {
		return (
			<InfoSidebarContainer open={showInfoSidebar} setOpen={setShowInfoSidebar} title="Channel Details">
				<MenuList>
					{Object.entries(members ?? []).map(([key, value]) => {
						return <PopUpProfileMenuItem key={key} value={value} />;
					})}
				</MenuList>
				<Box sx={{ textAlign: 'center', mt: 3 }}>
					<Button variant="contained" color="error" onClick={() => setDropSectionModal(true)}>
						Leave Channel
					</Button>
				</Box>
				{/* <DropSectionModal open={dropSectionModal} setDropSectionModal={setDropSectionModal} /> */}
			</InfoSidebarContainer>
		);
	} else if (channel.type === 'building') {
		return (
			<InfoSidebarContainer open={showInfoSidebar} setOpen={setShowInfoSidebar} title="Channel Details">
				<MenuList>
					{Object.entries(members ?? []).map(([key, value]) => {
						return <PopUpProfileMenuItem key={key} value={value} />;
					})}
				</MenuList>
			</InfoSidebarContainer>
		);
	} else {
		// For personal channel type
		const getRecipient = (
			obj: Record<string, ChannelMemberResponse<CustomStreamChatGenerics>>,
			givenKey: string
		): UserResponse<CustomStreamChatGenerics> | undefined => {
			for (const key in obj) {
				if (key !== givenKey) {
					return obj[key].user;
				}
			}
			return undefined;
		};

		const recipient = getRecipient(members!, session?.user.id ?? '');
		return (
			<InfoSidebarContainer open={showInfoSidebar} setOpen={setShowInfoSidebar}>
				<Divider />
				<Box>
					<Box sx={{ height: 120, backgroundColor: '#4B6B8A' }} />
					<CardContent sx={{ pt: 0 }}>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								mb: 2,
								mt: '-50px',
							}}>
							<UserAvatar userId={recipient?.id ?? ''} size={100} border="3px solid #FFFFFF" />
						</Box>
						<Box
							sx={{
								a: {
									color: 'inherit',
									textDecoration: 'none',
									'&:hover': {
										textDecoration: 'underline',
									},
								},
								textAlign: 'center',
								fontWeight: 450,
							}}>
							<Link href={`/profile/${recipient?.id}`}>{displayTitle}</Link>
						</Box>

						<Divider sx={{ my: 2 }} />

						<Grid container spacing={2} rowSpacing={1} pb={3}>
							{recipient?.major && (
								<>
									<Grid xs={3} item>
										<Typography variant="subtitle2">Major</Typography>
									</Grid>
									<Grid xs={9} item>
										<Typography color="text.secondary" variant="body2">
											{recipient.major}
										</Typography>
									</Grid>
								</>
							)}

							{recipient?.college && (
								<>
									<Grid xs={3} item>
										<Typography variant="subtitle2">College</Typography>
									</Grid>
									<Grid xs={9} item>
										<Typography color="text.secondary" variant="body2">
											{recipient.college}
										</Typography>
									</Grid>
								</>
							)}

							{recipient?.grade && (
								<>
									<Grid xs={3} item>
										<Typography variant="subtitle2">Grade</Typography>
									</Grid>

									<Grid xs={9} item>
										<Typography color="text.secondary" variant="body2">
											{recipient.grade}
										</Typography>
									</Grid>
								</>
							)}
						</Grid>
					</CardContent>
				</Box>
			</InfoSidebarContainer>
		);
	}
};

const PopUpProfileMenuItem = ({ value }: { value: ChannelMemberResponse<CustomStreamChatGenerics> }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [showProfileCard, setShowProfileCard] = useState(false);
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	return (
		<Box>
			<MenuItem
				onClick={(e) => {
					setAnchorEl(e.currentTarget);
					setShowProfileCard(true);
				}}
				sx={{ px: 3 }}>
				<ListItemIcon>
					<UserAvatar userId={value.user?.id} size={32} />
				</ListItemIcon>
				<ListItemText sx={{ color: 'black' }}>{value.user?.name}</ListItemText>
			</MenuItem>
			{smUp ? (
				<PopUpUserProfile anchorEl={anchorEl} setAnchorEl={setAnchorEl} user={value.user} />
			) : (
				<FlatUserProfile user={value.user} open={showProfileCard} setOpen={setShowProfileCard} />
			)}
		</Box>
	);
};
