import { FC, useEffect, useMemo } from 'react';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import HeartIcon from '@untitled-ui/icons-react/build/esm/Heart';
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActionArea,
	CardHeader,
	CardMedia,
	Divider,
	IconButton,
	Stack,
	SvgIcon,
	Tooltip,
	Typography,
	Menu,
	MenuItem,
} from '@mui/material';
// import type { Comment } from 'src/types/social';
// import { Comment } from './Comment';
import { CommentCreate } from './CommentCreate';
import { CommentDisplay } from './CommentDisplay';
import { Post, User, Like, Comment } from '@prisma/client';
import UserAvatar from '@/components/UserAvatar';
import { BigHead } from '@bigheads/core';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { randomNames } from '@/constants/randomNames';
import { DeletePostModal } from '@/components/Feed/ConfirmModals';
import { CommentDetails } from '@/types/comment';
import useComment from '@/hooks/useComment';

interface PostDisplayProps {
	isLiked: boolean;
	media?: string;
	post: Post;
	author: User;
	likes: Like[];
	comments: CommentDetails[];
}

const PostDisplay: FC<PostDisplayProps> = (props) => {
	const { data: session } = useSession();
	const { post, author, isLiked: isLikedProp, likes, media, comments, ...other } = props;
	const { comments: fetchedComments } = useComment({ postId: post.id });
	const [displayComments, setDisplayComments] = useState(false);
	const [isLiked, setIsLiked] = useState<boolean>(props.isLiked);
	const [numOfLikes, setNumOfLikes] = useState<number>(likes.length);
	const [numOfComments, setNumOfComments] = useState<number>(fetchedComments?.length ?? 0);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [deletePostModal, setDeletePostModal] = useState(false);
	const [displayFullContent, setDisplayFullContent] = useState(false);
	const randomName = useMemo(() => {
		const randomIndex = Math.floor(Math.random() * randomNames.length);
		return randomNames[randomIndex];
	}, []);
	const randomAvatar = useMemo(() => {
		return (
			<Avatar>
				<Box sx={{ width: '100%', height: '100%' }}>
					<BigHead mask={false} />
				</Box>
			</Avatar>
		);
	}, []);

	const handleOptionButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLike = useCallback(async () => {
		if (session) {
			setIsLiked(true);
			setNumOfLikes((prevLikes) => prevLikes + 1);
			try {
				await axios.post('/api/post/like', {
					postId: post.id,
					userId: session.user.id,
				});
			} catch (err) {
				toast.error('Error when like post');
				setIsLiked(false);
				setNumOfLikes((prevLikes) => prevLikes - 1);
			}
		}
	}, [post.id, session]);

	const handleUnlike = useCallback(async () => {
		if (session) {
			setIsLiked(false);
			setNumOfLikes((prevLikes) => prevLikes - 1);
			try {
				await axios.post('/api/post/like', {
					postId: post.id,
					userId: session.user.id,
				});
			} catch (err) {
				toast.error('Error when unlike post');
				setIsLiked(true);
				setNumOfLikes((prevLikes) => prevLikes + 1);
			}
		}
	}, [post.id, session]);

	const createdAt = () => {
		const timeInfo = formatDistanceToNowStrict(new Date(post.createdAt));
		if (timeInfo.includes('second') || timeInfo.includes('seconds')) {
			return 'Just now';
		}
		return timeInfo + ' ago';
	};

	// Assuming roughly 100 characters per line as an example. Adjust this based on your actual layout and font size.
	const newlineCount = post.content.split('\n').length - 1;
	const maxCharsPerLine = 120;
	const maxLines = 3;
	const readMoreButton =
		post.content.length > maxCharsPerLine * maxLines || newlineCount > maxLines;

	const getInitialContent = () => {
		let initContent = post.content;
		if (readMoreButton) {
			if (newlineCount <= 3) {
				// If newline count is within limit, check length
				initContent = post.content.substring(0, maxCharsPerLine * maxLines) + '...';
			} else {
				// If more than 3 newlines, show content up to the third newline
				let lines = post.content.split('\n');
				initContent = lines.slice(0, maxLines+1).join('\n') + '\n...';
			}
		}
		return initContent;
	};

	useEffect(() => {
		setNumOfComments(fetchedComments?.length ?? 0);
	}, [fetchedComments]);

	return (
		<Card {...other}>
			<CardHeader
				avatar={post.anonymous ? randomAvatar : <UserAvatar userId={author.id} />}
				disableTypography
				title={
					post.anonymous ? (
						<Stack direction="row" spacing={1} alignItems="center">
							<Typography variant="subtitle2">{randomName}</Typography>{' '}
							<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 400 }}>
								Anonymous
							</Typography>
						</Stack>
					) : (
						<Box
							sx={{
								a: {
									fontSize: '0.875rem',
									fontWeight: 500,
									lineHeight: 1.57,
									color: '#111927',
									textDecoration: 'none',
									'&:hover': {
										textDecoration: 'underline',
									},
								},
							}}>
							<Link color="text.primary" href={`/profile/${author.id}`}>
								{author.name}
							</Link>
						</Box>
					)
				}
				subheader={
					<Stack alignItems="center" direction="row" spacing={1}>
						<Typography color="text.secondary" variant="caption">
							{createdAt()}
						</Typography>
					</Stack>
				}
				action={
					session?.user.id === author.id && (
						<>
							<IconButton aria-label="settings" onClick={handleOptionButtonClick}>
								<MoreHorizOutlinedIcon />
							</IconButton>
							<Menu
								id="basic-menu"
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}>
								{/* <MenuItem onClick={handleClose}>Edit</MenuItem> */}
								<MenuItem
									onClick={() => {
										setDeletePostModal(true);
										handleClose();
									}}
									sx={{ color: '#D32F2F' }}>
									Delete
								</MenuItem>
							</Menu>
							<DeletePostModal
								open={deletePostModal}
								setDeletePostModal={setDeletePostModal}
								postId={post.id}
							/>
						</>
					)
				}
			/>
			<Box
				sx={{
					pb: 2,
					px: 3,
				}}>
				<pre
					style={{
						whiteSpace: 'pre-wrap',
						margin: 0,
						fontSize: '1rem',
						fontWeight: 400,
						lineHeight: 1.5,
						fontFamily:
							'"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
					}}>
					{displayFullContent ? post.content : getInitialContent()}
				</pre>
				{readMoreButton && (
					<Button sx={{ p: 0 }} onClick={() => setDisplayFullContent(!displayFullContent)}>
						{displayFullContent ? 'Show Less' : 'Read More'}
					</Button>
				)}

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
				<Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 1 }}>
					<Stack direction="row" alignItems="center">
						<IconButton sx={{ p: 0, mr: 1 }} onClick={isLiked ? handleUnlike : handleLike}>
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
								<SvgIcon>
									<HeartIcon />
								</SvgIcon>
							)}
						</IconButton>

						<Typography color="text.secondary" variant="subtitle2">
							{numOfLikes}
						</Typography>
					</Stack>

					<Stack direction="row" alignItems="center">
						<IconButton onClick={() => setDisplayComments(!displayComments)}>
							<SvgIcon>
								<CommentIcon />
							</SvgIcon>
						</IconButton>

						<Typography color="text.secondary" variant="subtitle2">
							{numOfComments}
						</Typography>
					</Stack>
				</Stack>
				{displayComments && (
					<>
						<Divider sx={{ my: 3 }} />
						<Stack spacing={3}>
							<CommentCreate postId={post.id} />
							{fetchedComments?.map((comment) => (
								<CommentDisplay
									key={comment.id}
									author={comment.author}
									comment={comment}
									likes={comment.likes}
									isLiked={comment.likes.some((obj) => obj.userId === session?.user.id)}
									postId={post.id}
								/>
							))}
						</Stack>
					</>
				)}
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
