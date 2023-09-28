import { FC, useMemo } from 'react';
import { useCallback, useState } from 'react';
import Link from 'next/link';
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
	Stack,
	SvgIcon,
	Tooltip,
	Typography,
	Menu,
	MenuItem,
} from '@mui/material';
// import type { Comment } from 'src/types/social';
// import { SocialComment } from './social-comment';
// import { SocialCommentAdd } from './social-comment-add';
import { Post, User, Like, Comment } from '@prisma/client';
import UserAvatar from '@/components/UserAvatar';
import { BigHead } from '@bigheads/core';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { allAthletes } from '@/constants/randomNames';

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
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const randomName = useMemo(() => {
		const randomIndex = Math.floor(Math.random() * allAthletes.length);
		return allAthletes[randomIndex];
	}, []);
	const randomAvatar = useMemo(() => {
		return (
			<Avatar>
				<BigHead mask={false} />
			</Avatar>
		);
	}, []);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleDelete = async () => {};
	const handleClose = () => {
		setAnchorEl(null);
	};

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
				avatar={post.anonymous ? randomAvatar : <UserAvatar userId={author.id} />}
				disableTypography
				title={
					post.anonymous ? (
						<Stack direction="row">
							<Typography variant="subtitle2">{randomName}</Typography>
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
						{/* <SvgIcon color="action">
							<ClockIcon />
						</SvgIcon> */}
						<Typography color="text.secondary" variant="caption">
							{formatDistanceToNowStrict(new Date(post.createdAt))} ago
						</Typography>
					</Stack>
				}
				action={
					session?.user.id === author.id && (
						<>
							<IconButton aria-label="settings" onClick={handleClick}>
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
								<MenuItem onClick={handleClose}>Edit</MenuItem>
								<MenuItem onClick={handleClose} sx={{ color: '#D32F2F' }}>
									Delete
								</MenuItem>
							</Menu>
						</>
					)
				}
			/>
			<Box sx={{ height: 64, width: 64 }}>
				<BigHead mask={false} />
			</Box>
			<BigHead mask={false} />
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
