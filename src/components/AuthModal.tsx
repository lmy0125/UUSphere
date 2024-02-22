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
			<Paper sx={modalStyle} elevation={10}>
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

					<Typography align="center" color="neutral.600" sx={{ mt: 4 }} variant="body1">
						Login/Signup with your UCSD email account to get full access of the platform.
					</Typography>
				</Box>

				<Button
					onClick={signInWithGoogle}
					fullWidth
					variant="outlined"
					color="inherit"
					disabled={disabled}
					sx={{
						border: '1px solid rgba(0, 0, 0, .12)',
						boxShadow: '0 2px 4px rgba(0,0,0,.1)',
						mt: 6,
					}}>
					<Image src="/google.svg" alt="Google" width={32} height={32} />
					<Box ml={1}>Continue with Google</Box>
				</Button>
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
	backgroundImage: 'linear-gradient( rgba(0,196,168,0.6) 0%, white 40%)',
	border: '2px',
	borderRadius: '16px',
	// boxShadow: '0 2px 4px rgba(0,0,0,.06)',
	px: 6,
	py: 8,
};
