import React, { useRef } from 'react';
import Link from 'next/link';
import {
	Attachment,
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
import { Stack, Box, Typography, Paper } from '@mui/material';
import UserAvatar from '@/components/UserAvatar';

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
					ml: isMyMessage() ? 'auto' : 0,
					mr: !isMyMessage() ? 'auto' : 0,
					maxWidth: '80%',
				}}>
				<UserAvatar userId={message.user?.id} size={32} />
				<Box sx={{ flexShrink: 1 }}>
					<Stack
						sx={{ alignItems: 'center', mb: 1 }}
						direction={isMyMessage() ? 'row-reverse' : 'row'}
						spacing={2}>
						<Box
							sx={{
								a: {
									color: 'inherit',
									textDecoration: 'none',
									'&:hover': {
										textDecoration: 'underline',
									},
								},
							}}>
							<Link href={`/profile/${message.user?.id}`}>{message.user?.name}</Link>
						</Box>
						<Typography color="text.secondary" noWrap variant="caption">
							<MessageTimestamp />
						</Typography>
					</Stack>
					<Paper
						elevation={10}
						sx={{
							display: 'inline-block',
							backgroundColor: isMyMessage() ? '#797979' : 'background.paper',
							color: isMyMessage() ? 'primary.contrastText' : 'text.primary',
							float: isMyMessage() ? 'right' : 'left',
							px: 3,
							py: 2,
							borderRadius: 3,
						}}>
						{/* <MessageText /> */}

						<Typography>{message.text}</Typography>
						{hasAttachments && message.attachments && (
							<Box sx={{ pb: 2 }}>
								<Attachment attachments={message.attachments} />
							</Box>
						)}

						{showDetailedReactions && isReactionEnabled && (
							<ReactionSelector ref={reactionSelectorRef} />
						)}

						{/* {hasReactions && !showDetailedReactions && isReactionEnabled && <ReactionsList />} */}
						<MessageRepliesCountButton reply_count={message.reply_count} />
					</Paper>
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
