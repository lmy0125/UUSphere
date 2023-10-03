import React from 'react';
import Link from 'next/link';
import {
	Avatar,
	Box,
	Button,
	Popper,
	Typography,
	Card,
	CardContent,
	ClickAwayListener,
	Divider,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { UserResponse } from 'stream-chat';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import { useChatContext } from 'stream-chat-react';
import UserAvatar from '@/components/UserAvatar';
import { MessageUser } from '@/utils/MessageUser';

interface ProfileCardProps {
	anchorEl: HTMLElement | null;
	setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
	user: UserResponse<CustomStreamChatGenerics> | undefined;
}

const PopupUserProfile: React.FC<ProfileCardProps> = ({ anchorEl, setAnchorEl, user }) => {
	const { client } = useChatContext();

	const handleMessageUser = async () => {
		setAnchorEl(null);
		if (user) {
			MessageUser(user.id);
		}
	};

	const open = Boolean(anchorEl);

	return (
		<Popper open={open} anchorEl={anchorEl} placement="left-start">
			<ClickAwayListener onClickAway={() => setAnchorEl(null)}>
				<Card sx={{ width: 320, pb: 5 }}>
					<Box sx={{ height: 120, backgroundColor: '#4B6B8A' }} />
					<CardContent sx={{ pt: 0 }}>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								mb: 2,
								mt: '-50px',
							}}>
							<UserAvatar userId={user?.id} size={100} border="3px solid #FFFFFF" />
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
							<Link href={`/profile/${user?.id}`}>{user?.name}</Link>
						</Box>

						<Divider sx={{ my: 2 }} />

						<Grid container spacing={2} rowSpacing={1} pb={3}>
							{user?.major && (
								<>
									<Grid xs={3}>
										<Typography variant="subtitle2">Major</Typography>
									</Grid>
									<Grid xs={9}>
										<Typography color="text.secondary" variant="body2">
											{user.major}
										</Typography>
									</Grid>
								</>
							)}

							{user?.college && (
								<>
									<Grid xs={3}>
										<Typography variant="subtitle2">College</Typography>
									</Grid>
									<Grid xs={9}>
										<Typography color="text.secondary" variant="body2">
											{user.college}
										</Typography>
									</Grid>
								</>
							)}

							{user?.grade && (
								<>
									<Grid xs={3}>
										<Typography variant="subtitle2">Grade</Typography>
									</Grid>

									<Grid xs={9}>
										<Typography color="text.secondary" variant="body2">
											{user.grade}
										</Typography>
									</Grid>
								</>
							)}
						</Grid>

						{client.user?.id !== user?.id && (
							<Button
								variant="contained"
								color="primary"
								onClick={handleMessageUser}
								sx={{ float: 'right' }}>
								Message
							</Button>
						)}
					</CardContent>
				</Card>
			</ClickAwayListener>
		</Popper>
	);
};

export default PopupUserProfile;
