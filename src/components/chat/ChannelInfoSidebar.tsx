import { useState } from 'react';
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
	Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useChannelPreviewInfo, useChannelStateContext } from 'stream-chat-react';
import PopUpProfileCard from './PopUpProfileCard';
import { ChannelMemberResponse, UserResponse } from 'stream-chat';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import { useSession } from 'next-auth/react';
import UserAvatar from '@/components/UserAvatar';

interface ChannelInfoSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const ChannelInfoSidebar: React.FC<ChannelInfoSidebarProps> = ({ isOpen, onClose }) => {
	const { data: session } = useSession();
	const { channel, members } = useChannelStateContext<CustomStreamChatGenerics>();
	const { displayTitle } = useChannelPreviewInfo({ channel });

	if (isOpen) {
		if (
			channel.type === 'classroom' ||
			(channel.data?.member_count && channel.data?.member_count > 2)
		) {
			return (
				<Box
					sx={{
						borderLeft: '1px solid #F2F4F7',
						minWidth: 280,
						width: '25%',
					}}>
					<Box sx={{ pt: 1, pr: 1, textAlign: 'right' }}>
						<CloseIcon onClick={onClose} sx={{ cursor: 'pointer' }} />
					</Box>
					<MenuList>
						{Object.entries(members ?? []).map(([key, value]) => {
							return <PopUpProfileMenuItem key={key} value={value} />;
						})}
					</MenuList>
				</Box>
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
				<Box
					sx={{
						borderLeft: '1px solid #F2F4F7',
						minWidth: 280,
						width: '25%',
					}}>
					<Box sx={{ pt: 1, pr: 1, textAlign: 'right' }}>
						<CloseIcon onClick={onClose} sx={{ cursor: 'pointer' }} />
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
				</Box>
			);
		}
	} else return null;
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

export default ChannelInfoSidebar;
