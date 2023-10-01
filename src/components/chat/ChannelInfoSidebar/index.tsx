import React, { useState } from 'react';
import Link from 'next/link';
import {
	Avatar,
	Typography,
	Box,
	Divider,
	MenuList,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Card,
	CardMedia,
	CardContent,
	Grid,
	useMediaQuery,
	Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useChannelPreviewInfo, useChannelStateContext } from 'stream-chat-react';
import PopUpProfileCard from '@/components/chat/PopUpProfileCard';
import { ChannelMemberResponse, UserResponse } from 'stream-chat';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import { useSession } from 'next-auth/react';
import UserAvatar from '@/components/UserAvatar';
import { InfoSidebarContainer } from '@/components/chat/ChannelInfoSidebar/InfoSidebarContainer';
import { useChatStackContext } from '@/contexts/ChatStackContext';

export const ChannelInfoSidebar = () => {
	const { data: session } = useSession();
	const { channel, members } = useChannelStateContext<CustomStreamChatGenerics>();
	const { displayTitle } = useChannelPreviewInfo({ channel });
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	const { setShowInfoSidebar } = useChatStackContext();

	if (
		channel.type === 'classroom' ||
		(channel.data?.member_count && channel.data?.member_count > 2)
	) {
		return (
			<InfoSidebarContainer>
				<>
					<Box>
						<Box sx={{ pt: 1, pr: 1, textAlign: 'right' }}>
							<CloseIcon
								onClick={() => setShowInfoSidebar(false)}
								sx={{ cursor: 'pointer' }}
							/>
						</Box>
						<MenuList>
							{Object.entries(members ?? []).map(([key, value]) => {
								return <PopUpProfileMenuItem key={key} value={value} />;
							})}
						</MenuList>
					</Box>
				</>
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
			<InfoSidebarContainer>
				<Box sx={{ pt: 1, pr: 1, textAlign: 'right' }}>
					<CloseIcon onClick={() => setShowInfoSidebar(false)} sx={{ cursor: 'pointer' }} />
				</Box>
				<Box>
					<Box sx={{ height: 120, backgroundColor: 'gray' }} />
					<CardContent sx={{ pt: 0 }}>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								mb: 2,
								mt: '-50px',
							}}>
							<UserAvatar
								userId={recipient?.id ?? ''}
								size={100}
								border="3px solid #FFFFFF"
							/>
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

const PopUpProfileMenuItem = ({
	value,
}: {
	value: ChannelMemberResponse<CustomStreamChatGenerics>;
}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	return (
		<>
			<MenuItem onClick={(e) => setAnchorEl(e.currentTarget)}>
				<ListItemIcon>
					<UserAvatar userId={value.user?.id} size={32} />
				</ListItemIcon>
				<ListItemText sx={{ color: 'black' }}>{value.user?.name}</ListItemText>
			</MenuItem>
			<PopUpProfileCard anchorEl={anchorEl} setAnchorEl={setAnchorEl} user={value.user} />
		</>
	);
};
