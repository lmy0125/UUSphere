import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Modal, Box, Typography, Button, Stack, Paper } from '@mui/material';
import { Logo } from '@/components/logo';

export default function AuthModal({
	open,
	setAuthModal,
}: {
	open: boolean;
	setAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [disabled, setDisabled] = useState(false);
	const signInWithGoogle = () => {
		// toast.loading('Redirecting...');
		setDisabled(true);
		// Perform sign in
		signIn('google', {
			callbackUrl: window.location.href,
		});
	};

	return (
		<Modal open={open} onClose={() => setAuthModal(false)}>
			<Paper sx={modalStyle} elevation={12}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Stack direction="row" alignItems="center">
						<Typography variant="h5" sx={{ fontWeight: 500 }}>
							Welcome to
						</Typography>
						<Logo width={95} height={42} />
					</Stack>

					<Typography align="center" color="text.secondary" sx={{ mt: 2 }} variant="body1">
						Log in with your UCSD email account to get full access of the platform.
					</Typography>
				</Box>
				<Stack alignItems="center" direction="row" spacing={3} sx={{ mt: 4 }}>
					<Button
						onClick={signInWithGoogle}
						fullWidth
						variant="outlined"
						color="inherit"
						disabled={disabled}
						sx={{ boarderColor: 'primary' }}>
						<Image src="/google.svg" alt="Google" width={32} height={32} />
						<Typography ml={1}>Login with Google</Typography>
					</Button>
				</Stack>
			</Paper>
		</Modal>
	);
}

const modalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%',
	maxWidth: 400,
	gradientBg: { backgroundImage: 'linear-gradient(to bottom, #00c4a8, white)' },
	bgcolor: 'background.paper',
	border: '2px',
	borderRadius: '4px',
	boxShadow: 24,
	px: 6,
	py:12,
};
