import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Modal, Box, Typography, Button, Stack } from '@mui/material';

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
		<Modal
			open={open}
			onClose={() => setAuthModal(false)}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Box sx={modalStyle}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Typography variant="h5">Sign up/Sign in</Typography>
					<Typography align="center" color="text.primary" sx={{ mt: 2 }} variant="body2">
						This product is in active development and ongoing improvement.
					</Typography>
				</Box>
				<Stack alignItems="center" direction="row" spacing={3} sx={{ mt: 4 }}>
					<Button onClick={signInWithGoogle} fullWidth color="inherit" disabled={disabled}>
						<Image src="/google.svg" alt="Google" width={32} height={32} />
						<Typography ml={1}>Sign in with Google</Typography>
					</Button>
				</Stack>
			</Box>
		</Modal>
	);
}

const modalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 500,
	bgcolor: 'background.paper',
	border: '2px',
	borderRadius: '8px',
	boxShadow: 24,
	p: 4,
};
