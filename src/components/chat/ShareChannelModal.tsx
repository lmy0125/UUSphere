import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';

const ShareChannelModal = ({
	channelId,
	channelName,
	isOpen,
	onClose,
}: {
	channelId: string;
	channelName: string;
	isOpen: boolean;
	onClose: () => void;
}) => {
	const { data: session } = useSession();
	const [link, setLink] = useState('');

	// Generate the invite link based on your app URL structure

	useEffect(() => {
		const generateInviteLink = () => {
			const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
			return `${baseUrl}/invite/${channelId}`;
		};
		if (channelId && session?.user) {
			const inviteLink = generateInviteLink();
			setLink(inviteLink);
		}
	}, [channelId, session]);

	return (
		<Modal open={isOpen} onClose={onClose}>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					bgcolor: 'background.paper',
					border: '2px solid #000',
					boxShadow: 24,
					p: 4,
					borderRadius: 2,
				}}>
				<Typography variant="h6" component="h2">
					Share group chat for {channelName}
				</Typography>
				<TextField
					fullWidth
					label="Invite Link"
					value={link}
					variant="outlined"
					margin="normal"
					InputProps={{
						readOnly: true,
					}}
				/>
				<Button variant="contained" fullWidth onClick={() => navigator.clipboard.writeText(link)}>
					Copy Link
				</Button>
				<Box display="flex" justifyContent="center" my={4}>
					<QRCodeSVG value={link} />
				</Box>
				<Button variant="outlined" fullWidth onClick={onClose}>
					Close
				</Button>
			</Box>
		</Modal>
	);
};

export default ShareChannelModal;
