import type { FC } from 'react';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import ClockIcon from '@untitled-ui/icons-react/build/esm/Clock';
import HeartIcon from '@untitled-ui/icons-react/build/esm/Heart';
import Share07Icon from '@untitled-ui/icons-react/build/esm/Share07';
import {
	Avatar,
	Box,
	Card,
	CardActionArea,
	CardHeader,
	CardMedia,
	Divider,
	IconButton,
	Link,
	Stack,
	SvgIcon,
	Tooltip,
	Typography,
} from '@mui/material';
// import type { Comment } from 'src/types/social';
// import { SocialComment } from './social-comment';
// import { SocialCommentAdd } from './social-comment-add';
import { Post, User, Like, Comment } from '@prisma/client';
import UserAvatar from '@/components/UserAvatar';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PostDisplayProps {
	isLiked: boolean;
	media?: string;
	post: Post;
	author: User;
	likes: Like[];
	comments: Comment[];
}

const PostDisplay: FC<PostDisplayProps> = (props) => {
	const { data: session } = useSession();
	const { post, author, isLiked: isLikedProp, likes, media, ...other } = props;
	const [isLiked, setIsLiked] = useState<boolean>(props.isLiked);
	const [numOfLikes, setNumOfLikes] = useState<number>(likes.length);

	const handleLike = useCallback(async () => {
		if (session) {
			setIsLiked(true);
			setNumOfLikes((prevLikes) => prevLikes + 1);
			try {
				await axios.post('/api/likePost', {
					postId: post.id,
					userId: session.user.id,
				});
			} catch (err) {
				toast.error('Error when like post');
				setIsLiked(false);
				setNumOfLikes((prevLikes) => prevLikes - 1);
			}
		}
	}, []);

	const handleUnlike = useCallback(async () => {
		if (session) {
			setIsLiked(false);
			setNumOfLikes((prevLikes) => prevLikes - 1);
			try {
				await axios.post('/api/likePost', {
					postId: post.id,
					userId: session.user.id,
				});
			} catch (err) {
				toast.error('Error when unlike post');
				setIsLiked(true);
				setNumOfLikes((prevLikes) => prevLikes + 1);
			}
		}
	}, []);

	return (
		<Card {...other}>
			<CardHeader
				avatar={<UserAvatar userId={author.id} />}
				disableTypography
				subheader={
					<Stack alignItems="center" direction="row" spacing={1}>
						{/* <SvgIcon color="action">
							<ClockIcon />
						</SvgIcon> */}
						<Typography color="text.secondary" variant="caption">
							{formatDistanceToNowStrict(new Date(post.createdAt))} ago
						</Typography>
					</Stack>
				}
				title={
					<Stack alignItems="center" direction="row">
						<Link color="text.primary" href="#" variant="subtitle2">
							{author.name}
						</Link>
					</Stack>
				}
				action={
					<IconButton aria-label="settings">
						<MoreHorizOutlinedIcon />
					</IconButton>
				}
			/>
			<Box
				sx={{
					pb: 2,
					px: 3,
				}}>
				<Typography variant="body1">{post.content}</Typography>
				{media && (
					<Box sx={{ mt: 3 }}>
						<CardActionArea>
							<CardMedia
								image={media}
								sx={{
									backgroundPosition: 'top',
									height: 500,
								}}
							/>
						</CardActionArea>
					</Box>
				)}
				<Stack
					alignItems="center"
					direction="row"
					justifyContent="space-between"
					spacing={2}
					sx={{ mt: 2 }}>
					<div>
						<Stack alignItems="center" direction="row">
							{isLiked ? (
								<Tooltip title="Unlike">
									<IconButton onClick={handleUnlike}>
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
									</IconButton>
								</Tooltip>
							) : (
								<Tooltip title="Like">
									<IconButton onClick={handleLike}>
										<SvgIcon>
											<HeartIcon />
										</SvgIcon>
									</IconButton>
								</Tooltip>
							)}
							<Typography color="text.secondary" variant="subtitle2">
								{numOfLikes}
							</Typography>
						</Stack>
					</div>
				</Stack>
				{/* <Divider sx={{ my: 3 }} />
				<Stack spacing={3}>
					{comments.map((comment) => (
						<SocialComment
							authorAvatar={comment.author.avatar}
							authorName={comment.author.name}
							createdAt={comment.createdAt}
							key={comment.id}
							message={comment.message}
						/>
					))}
				</Stack>
				<Divider sx={{ my: 3 }} />
				<SocialCommentAdd /> */}
			</Box>
		</Card>
	);
};

// PostDisplay.propTypes = {
// 	isLiked: PropTypes.bool.isRequired,
// 	likes: PropTypes.number.isRequired,
// 	media: PropTypes.string,
// };

export default PostDisplay;
