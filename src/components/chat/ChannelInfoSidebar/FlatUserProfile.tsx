import React, { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import { Avatar, Typography, Box, Button, Divider, CardContent, Grid } from '@mui/material';
import { InfoSidebarContainer } from '@/components/chat/ChannelInfoSidebar/InfoSidebarContainer';
import UserAvatar from '@/components/UserAvatar';
import { UserResponse } from 'stream-chat';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import { useChatContext } from 'stream-chat-react';
import { useChatStackContext } from '@/contexts/ChatStackContext';

export default function FlatUserProfile({
	user,
	open,
	setOpen,
}: {
	user: UserResponse<CustomStreamChatGenerics> | undefined;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const { client, setActiveChannel } = useChatContext();
	const { setShowInfoSidebar } = useChatStackContext();

	const handleMessageUser = async () => {
		if (client.user && user) {
			const channel = client.channel('messaging', {
				members: [client.user.id, user.id],
			});
			await channel.watch();
			setActiveChannel(channel);
			setOpen(false);
			setShowInfoSidebar(false);
		}
	};
	// For personal channel type
	return (
		<InfoSidebarContainer open={open} setOpen={setOpen}>
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
						<UserAvatar userId={user?.id ?? ''} size={100} border="3px solid #FFFFFF" />
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
								<Grid xs={3} item>
									<Typography variant="subtitle2">Major</Typography>
								</Grid>
								<Grid xs={9} item>
									<Typography color="text.secondary" variant="body2">
										{user.major}
									</Typography>
								</Grid>
							</>
						)}

						{user?.college && (
							<>
								<Grid xs={3} item>
									<Typography variant="subtitle2">College</Typography>
								</Grid>
								<Grid xs={9} item>
									<Typography color="text.secondary" variant="body2">
										{user.college}
									</Typography>
								</Grid>
							</>
						)}

						{user?.grade && (
							<>
								<Grid xs={3} item>
									<Typography variant="subtitle2">Grade</Typography>
								</Grid>

								<Grid xs={9} item>
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
			</Box>
		</InfoSidebarContainer>
	);
}
