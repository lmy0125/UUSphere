import React, { useRef } from 'react';
import {
	Attachment,
	// Avatar,
	messageHasReactions,
	MessageOptions,
	MessageRepliesCountButton,
	MessageStatus,
	ReactionsList,
	MessageActions,
	MML,
	MessageText,
	MessageTimestamp,
	ReactionSelector,
	useMessageContext,
} from 'stream-chat-react';

import { Avatar, Stack, Box, Card, CardMedia, Typography, Link } from '@mui/material';

const CustomMessage = () => {
	const { isReactionEnabled, message, reactionSelectorRef, showDetailedReactions, isMyMessage } =
		useMessageContext();
	const messageWrapperRef = useRef(null);

	const hasReactions = messageHasReactions(message);
	const hasAttachments = message.attachments && message.attachments.length > 0;

	const contentType = 'text' as string;

	return (
		<Box
			className="wrapper"
			sx={{
				display: 'flex',
				alignItems: isMyMessage() ? 'flex-end' : 'flex-start',
				pb: 2,
			}}>
			<Stack
				alignItems="flex-start"
				direction={isMyMessage() ? 'row-reverse' : 'row'}
				spacing={2}
				sx={{
					maxWidth: 500,
					ml: isMyMessage() ? 'auto' : 0,
					mr: !isMyMessage() ? 'auto' : 0,
				}}>
				<Avatar
					src={message.user?.image}
					sx={{
						mt: 1,
						height: 32,
						width: 32,
					}}
				/>
				<Box sx={{ flexShrink: 0, maxWidth: '95%' }}>
					<Stack
						sx={{ alignItems: 'center', mb: 1, textAlign: isMyMessage() ? 'right' : '' }}
						direction={isMyMessage() ? 'row-reverse' : 'row'}
						spacing={2}>
						<Link color="inherit" sx={{ cursor: 'pointer'}} variant="subtitle2">
							{message.user?.name}
						</Link>
						<Typography color="text.secondary" noWrap variant="caption">
							<MessageTimestamp />
						</Typography>
					</Stack>
					<Card
						elevation={10}
						sx={{
							backgroundColor: isMyMessage() ? 'text.secondary' : 'background.paper',
							color: isMyMessage() ? 'primary.contrastText' : 'text.primary',
							px: 2,
							py: 0,
						}}>
						{/* <MessageText /> */}
						<p>{message.text}</p>
						{hasAttachments && message.attachments && (
							<Box sx={{ pb: 2 }}>
								<Attachment attachments={message.attachments} />
							</Box>
						)}

						{showDetailedReactions && isReactionEnabled && (
							<ReactionSelector ref={reactionSelectorRef} />
						)}

						{/* {hasReactions && !showDetailedReactions && isReactionEnabled && <ReactionsList />} */}
						{/* <MessageRepliesCountButton reply_count={message.reply_count} /> */}
					</Card>
				</Box>

				{/* <MessageOptions
						messageWrapperRef={messageWrapperRef}
						theme="sender"
					/> */}
			</Stack>
		</Box>
	);
};

export default CustomMessage;