import * as React from 'react';
import { Box, Button, Typography, Modal, Paper } from '@mui/material';
import usePost from '@/hooks/usePost';
import useComment from '@/hooks/useComment';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	width: '80%',
	maxWidth: 800,
};

export const DeletePostModal = ({
	open,
	setDeletePostModal,
	postId,
}: {
	open: boolean;
	setDeletePostModal: React.Dispatch<React.SetStateAction<boolean>>;
	postId: string;
}) => {
	const { deletePost } = usePost();
	const handleClose = () => setDeletePostModal(false);
	const handleConfirm = () => {
		setDeletePostModal(false);
		deletePost(postId);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Paper elevation={12} sx={style}>
				<Typography variant="h6" component="h2" sx={{ mb: 2 }}>
					Delete Post
				</Typography>
				<Typography variant="body1">Are you sure you want to delete this post?</Typography>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						mt: 2,
					}}>
					<Button color="inherit" sx={{ mr: 2 }} onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="contained" onClick={handleConfirm}>
						Confirm
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
};

export const DeleteCommentModal = ({
	open,
	setDeleteCommentModal,
	commentId,
	postId,
}: {
	open: boolean;
	setDeleteCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
	commentId: string;
	postId: string;
}) => {
	const { deleteComment } = useComment({ postId });
	const handleClose = () => setDeleteCommentModal(false);
	const handleConfirm = () => {
		setDeleteCommentModal(false);
		deleteComment(commentId);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Paper elevation={12} sx={style}>
				<Typography variant="h6" component="h2" sx={{ mb: 2 }}>
					Delete Comment
				</Typography>
				<Typography variant="body1">Are you sure you want to delete this comment?</Typography>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						mt: 2,
					}}>
					<Button color="inherit" sx={{ mr: 2 }} onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="contained" onClick={handleConfirm}>
						Confirm
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
};
