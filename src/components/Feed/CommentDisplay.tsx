import type { FC } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import UserAvatar from '@/components/UserAvatar';
import { User, Comment } from '@prisma/client';
import { CommentDetails } from '@/types/comment';

interface CommentDisplayProps {
	author: User;
	comment: CommentDetails;
}

export const CommentDisplay: FC<CommentDisplayProps> = (props) => {
	const { author, comment } = props;

	const createdAt = () => {
		const timeInfo = formatDistanceToNowStrict(new Date(comment.createdAt));
		if (timeInfo.includes('second') || timeInfo.includes('seconds')) {
			return 'Just now';
		}
		return timeInfo + ' ago';
	};

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
				<Typography variant="body2" sx={{ mt: 1 }}>
					{comment.content}
				</Typography>
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
