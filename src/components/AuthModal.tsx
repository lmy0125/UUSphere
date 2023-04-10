import React from 'react';
import Image from 'next/image';
import { Modal, Box, Typography, Button } from '@mui/material';

export default function AuthModal({
	open,
	setAuthModal,
}: {
	open: boolean;
	setAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<Modal
			open={open}
			onClose={() => setAuthModal(false)}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Box sx={modalStyle} className="text-center">
				<Typography id="modal-modal-title" variant="h6" component="h2">
					Continue with Google
				</Typography>
				<Button onClick={() => {}} variant="outlined" className='mt-4 border text-gray-500 w-full'>
					<Image src="/google.svg" alt="Google" width={32} height={32} />
					<Typography ml={1}>Sign in with Google</Typography>
				</Button>
			</Box>
		</Modal>
	);
}

const modalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px',
	borderRadius: '8px',
	boxShadow: 24,
	p: 4,
};
