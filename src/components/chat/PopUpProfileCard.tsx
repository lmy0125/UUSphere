import React, { useState } from 'react';
import {
	Avatar,
	Box,
	Button,
	IconButton,
	Stack,
	Popper,
	Typography,
	Card,
	CardMedia,
	CardContent,
	Link,
	ClickAwayListener,
	Divider,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { UserResponse } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';
import { useChatContext } from 'stream-chat-react';

interface ProfileCardProps {
	anchorEl: HTMLElement | null;
	setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
	user: UserResponse<DefaultStreamChatGenerics> | undefined;
}

const PopupProfileCard: React.FC<ProfileCardProps> = ({ anchorEl, setAnchorEl, user }) => {
	const { client, setActiveChannel } = useChatContext();

	const handleMessageUser = async () => {
		setAnchorEl(null);
		if (client.user && user) {
			const channel = client.channel('messaging', {
				members: [client.user.id, user.id],
			});
			await channel.watch();
			setActiveChannel(channel);
		}
	};

	const open = Boolean(anchorEl);
	const id = open ? 'profile-card-popover' : undefined;

	return (
		<Popper
			id={id}
			open={open}
			anchorEl={anchorEl}
			placement="left-start"
			// anchorOrigin={{
			// 	vertical: 'top',
			// 	horizontal: 'left',
			// }}
			// transformOrigin={{
			// 	vertical: 'top',
			// 	horizontal: 'right',
			// }}
		>
			<ClickAwayListener onClickAway={() => setAnchorEl(null)}>
				<Card sx={{ width: 320, height: 400 }}>
					<CardMedia sx={{ height: 120, backgroundColor: 'gray' }} src='' />
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
								src={user?.image}
								sx={{
									border: '3px solid #FFFFFF',
									height: 100,
									width: 100,
								}}
							/>
						</Box>
						<Link
							align="center"
							color="text.primary"
							sx={{ display: 'block' }}
							underline="none"
							variant="h6"
							href={`/profile/${user?.id}`}>
							{user?.name}
						</Link>

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

						<Button
							variant="contained"
							color="primary"
							onClick={handleMessageUser}
							sx={{ float: 'right' }}>
							Message
						</Button>
					</CardContent>
				</Card>
			</ClickAwayListener>
		</Popper>
	);
};

export default PopupProfileCard;
