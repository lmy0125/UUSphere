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
	Link as MUILink,
	Grid,
	Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useChannelPreviewInfo, useChannelStateContext } from 'stream-chat-react';
import PopUpProfileCard from './PopUpProfileCard';
import { ChannelMemberResponse } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';

interface ChannelInfoSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const ChannelInfoSidebar: React.FC<ChannelInfoSidebarProps> = ({ isOpen, onClose }) => {
	const { channel, members } = useChannelStateContext<CustomStreamChatGenerics>();
	const { displayImage, displayTitle } = useChannelPreviewInfo({ channel });

	if (isOpen) {
		if (channel.type === 'classroom') {
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
						{Object.entries(members!).map(([key, value]) => {
							return <PopUpProfileMenuItem key={key} value={value} />;
						})}
					</MenuList>
				</Box>
			);
		} else {
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
						<CardMedia sx={{ height: 120, backgroundColor: 'gray' }} src="" />
						<CardContent sx={{ pt: 0 }}>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									mb: 2,
									mt: '-50px',
								}}>
								<Avatar
									alt="user avatar"
									src={displayImage}
									sx={{
										border: '3px solid #FFFFFF',
										height: 100,
										width: 100,
									}}
								/>
							</Box>
							<MUILink
								align="center"
								color="text.primary"
								sx={{ display: 'block' }}
								underline="none"
								variant="h6"
								// href={`/profile/${user?.id}`}
							>
								{displayTitle}
							</MUILink>

							<Divider sx={{ my: 2 }} />

							<Grid container spacing={2} rowSpacing={1} pb={3}>
								<Grid xs={3}>
									<Typography variant="subtitle2">Major</Typography>
								</Grid>
								<Grid xs={9}>
									<Typography color="text.secondary" variant="body2">
										CS
									</Typography>
								</Grid>
								<Grid xs={3}>
									<Typography variant="subtitle2">College</Typography>
								</Grid>
								<Grid xs={9}>
									<Typography color="text.secondary" variant="body2">
										Budget
									</Typography>
								</Grid>
								<Grid xs={3}>
									<Typography variant="subtitle2">Grade</Typography>
								</Grid>
								<Grid xs={9}>
									<Typography color="text.secondary" variant="body2">
										Budget
									</Typography>
								</Grid>
							</Grid>
						</CardContent>
					</Box>
				</Box>
			);
		}
	} else return null;
};

const PopUpProfileMenuItem = ({
	key,
	value,
}: {
	key: string;
	value: ChannelMemberResponse<CustomStreamChatGenerics>;
}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	return (
		<div key={key}>
			<MenuItem onClick={(e) => setAnchorEl(e.currentTarget)}>
				<ListItemIcon>
					<Avatar src={value.user?.image} sx={{ width: 32, height: 32 }} />
				</ListItemIcon>
				<ListItemText sx={{ color: 'black' }}>{value.user?.name}</ListItemText>
			</MenuItem>
			<PopUpProfileCard anchorEl={anchorEl} setAnchorEl={setAnchorEl} user={value.user} />
		</div>
	);
};

export default ChannelInfoSidebar;
