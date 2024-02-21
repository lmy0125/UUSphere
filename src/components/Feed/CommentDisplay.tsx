import { useState, type FC, useCallback } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Box, Stack, Typography, IconButton, SvgIcon } from '@mui/material';
import HeartIcon from '@untitled-ui/icons-react/build/esm/Heart';
import DeleteIcon from '@mui/icons-material/Delete';
import UserAvatar from '@/components/UserAvatar';
import { User, Like } from '@prisma/client';
import { CommentDetails } from '@/types/comment';
import { DeleteCommentModal } from '@/components/Feed/ConfirmModals';

interface CommentDisplayProps {
	author: User;
	comment: CommentDetails;
	likes: Like[];
	isLiked: boolean;
	postId: string;
}

export const CommentDisplay: FC<CommentDisplayProps> = (props) => {
	const { postId, author, comment, likes } = props;
	const { data: session } = useSession();
	const [isLiked, setIsLiked] = useState<boolean>(props.isLiked);
	const [numOfLikes, setNumOfLikes] = useState<number>(likes.length);
	const [deleteCommentModal, setDeleteCommentModal] = useState(false);

	const createdAt = () => {
		const timeInfo = formatDistanceToNowStrict(new Date(comment.createdAt));
		if (timeInfo.includes('second') || timeInfo.includes('seconds')) {
			return 'Just now';
		}
		return timeInfo + ' ago';
	};

	const handleLike = useCallback(async () => {
		if (session) {
			setIsLiked(true);
			setNumOfLikes((prevLikes) => prevLikes + 1);
			try {
				await axios.post('/api/comment/like', {
					commentId: comment.id,
					userId: session.user.id,
				});
			} catch (err) {
				toast.error('Error when like comment');
				setIsLiked(false);
				setNumOfLikes((prevLikes) => prevLikes - 1);
			}
		}
	}, [comment.id, session]);

	const handleUnlike = useCallback(async () => {
		if (session) {
			setIsLiked(false);
			setNumOfLikes((prevLikes) => prevLikes - 1);
			try {
				await axios.post('/api/comment/like', {
					commentId: comment.id,
					userId: session.user.id,
				});
			} catch (err) {
				toast.error('Error when unlike comment');
				setIsLiked(true);
				setNumOfLikes((prevLikes) => prevLikes + 1);
			}
		}
	}, [comment.id, session]);

	return (
		<Stack alignItems="flex-start" direction="row" spacing={2}>
			<UserAvatar userId={author.id} />
			<Box
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'dark' ? 'neutral.900' : 'neutral.100',
					borderRadius: 1,
					p: 2,
					flexGrow: 1,
				}}>
				<Box
					sx={{
						alignItems: 'flex-start',
						display: 'flex',
						justifyContent: 'space-between',
					}}>
					<Typography variant="subtitle2">{author.name}</Typography>
					<Typography color="text.secondary" variant="caption">
						{createdAt()}
					</Typography>
				</Box>
				<Typography variant="body1" sx={{ mt: 1 }}>
					{comment.content}
				</Typography>
				<Stack direction="row" spacing={2} mt={1}>
					<Stack direction="row" alignItems="center">
						<IconButton
							sx={{ p: 0, mr: 1 }}
							size="large"
							onClick={isLiked ? handleUnlike : handleLike}>
							{isLiked ? (
								<SvgIcon
									sx={{
										color: 'error.main',
										'& path': {
											fill: (theme) => theme.palette.error.main,
											fillOpacity: 1,
										},
									}}>
									<HeartIcon />
								</SvgIcon>
							) : (
								<HeartIcon fontSize="inherit" />
							)}
						</IconButton>
						<Typography color="text.secondary" variant="subtitle2">
							{numOfLikes}
						</Typography>
					</Stack>

					{session?.user.id === author.id && (
						<Stack direction="row" alignItems="center">
							<IconButton onClick={() => setDeleteCommentModal(true)}>
								<DeleteIcon fontSize="inherit" />
							</IconButton>
							<DeleteCommentModal
								open={deleteCommentModal}
								setDeleteCommentModal={setDeleteCommentModal}
								commentId={comment.id}
								postId={postId}
							/>
						</Stack>
					)}
				</Stack>
			</Box>
		</Stack>
	);
};

// CommentDisplay.propTypes = {
// 	authorAvatar: PropTypes.string.isRequired,
// 	authorName: PropTypes.string.isRequired,
// 	authorRole: PropTypes.string.isRequired,
// 	content: PropTypes.string.isRequired,
// 	createdAt: PropTypes.number.isRequired,
// 	isLiked: PropTypes.bool.isRequired,
// 	likes: PropTypes.number.isRequired,
// };
