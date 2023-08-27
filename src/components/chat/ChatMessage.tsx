import { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { Avatar, Box, Card, CardMedia, Link, Stack, Typography } from '@mui/material';
import { FormatMessageResponse, User } from 'stream-chat';
import { useChatContext } from '@/contexts/ChatContext';

interface ChatMessageProps {
	messageInfo: FormatMessageResponse;
	// authorAvatar?: string | null;
	// authorName: string;
	// body: string;
	// contentType: string;
	// createdAt: number;
	// position?: 'left' | 'right';
}

export const ChatMessage: FC<ChatMessageProps> = (props) => {
	const { messageInfo } = props;
	const [position, setPosition] = useState('left');
	const [author, setAuthor] = useState<User>();
	const { chatClient: client } = useChatContext();
	const contentType = 'text';

	useEffect(() => {
		const getAuthor = async () => {
			try {
				const authorQuery = await client?.queryUsers({ id: messageInfo.user!.id });
				setAuthor(authorQuery?.users[0]);
				if (authorQuery?.users[0].id == client?.user?.id) {
					setPosition('right');
				}
			} catch (err) {
				console.error(err);
			}
		};
		getAuthor();
	}, []);

	console.log('author', author, position);

	if (!author) {
		return <h1>Loading...</h1>
	}

	const ago = formatDistanceToNowStrict(messageInfo.created_at);

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: position === 'right' ? 'flex-end' : 'flex-start',
			}}
			// {...other}
		>
			<Stack
				alignItems="flex-start"
				direction={position === 'right' ? 'row-reverse' : 'row'}
				spacing={2}
				sx={{
					maxWidth: 500,
					ml: position === 'right' ? 'auto' : 0,
					mr: position === 'left' ? 'auto' : 0,
				}}>
				<Avatar
					src={author.image}
					sx={{
						height: 32,
						width: 32,
					}}
				/>
				<Box sx={{ flexGrow: 1 }}>
					<Card
						sx={{
							backgroundColor: position === 'right' ? 'primary.main' : 'background.paper',
							color: position === 'right' ? 'primary.contrastText' : 'text.primary',
							px: 2,
							py: 1,
						}}>
						<Box sx={{ mb: 1 }}>
							<Link color="inherit" sx={{ cursor: 'pointer' }} variant="subtitle2">
								{author.name}
							</Link>
						</Box>
						{/* {contentType === 'image' && (
							<CardMedia
								onClick={(): void => {}}
								image={body}
								sx={{
									height: 200,
									width: 200,
								}}
							/>
						)} */}
						{contentType === 'text' && (
							<Typography color="inherit" variant="body1">
								{messageInfo.text}
							</Typography>
						)}
					</Card>
					<Box
						sx={{
							display: 'flex',
							justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
							mt: 1,
							px: 2,
						}}>
						<Typography color="text.secondary" noWrap variant="caption">
							{ago} ago
						</Typography>
					</Box>
				</Box>
			</Stack>
		</Box>
	);
};

ChatMessage.propTypes = {
	// authorAvatar: PropTypes.string.isRequired,
	// authorName: PropTypes.string.isRequired,
	// body: PropTypes.string.isRequired,
	// contentType: PropTypes.string.isRequired,
	// createdAt: PropTypes.number.isRequired,
	// position: PropTypes.oneOf(['left', 'right']),
};
