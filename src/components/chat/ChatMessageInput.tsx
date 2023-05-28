import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Attachment01Icon from '@untitled-ui/icons-react/build/esm/Attachment01';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import Send01Icon from '@untitled-ui/icons-react/build/esm/Send01';
import { Avatar, Box, IconButton, OutlinedInput, Stack, SvgIcon, Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import { Channel } from 'stream-chat';

interface ChatMessageAddProps {
	disabled?: boolean;
	onSend?: (value: string) => void;
	channel: Channel;
}

export const ChatMessageInput: FC<ChatMessageAddProps> = (props) => {
	const { disabled, onSend, channel, ...other } = props;
	const { data: session, status } = useSession();

	const user = session?.user;
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [message, setMessage] = useState<string>('');

	const handleAttach = useCallback((): void => {
		fileInputRef.current?.click();
	}, []);

	// TODO: need to work for both enter key
	const sendMessage = async () => {
		if (!message) {
			return;
		}
		await channel.sendMessage({
			text: message,
		});
		setMessage('');
	};

	const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>): void => {
		if (event.code === 'Enter' || event.code === 'NumpadEnter') {
			sendMessage();
		}
	};

	return (
		<Stack
			alignItems="center"
			direction="row"
			spacing={2}
			sx={{
				px: 3,
				py: 1,
			}}
			{...other}>
			<Avatar
				sx={{
					display: {
						xs: 'none',
						sm: 'inline',
					},
				}}
				src={user?.image}
			/>
			<OutlinedInput
				disabled={disabled}
				fullWidth
				onChange={(e) => setMessage(e.target.value)}
				onKeyUp={handleKeyUp}
				placeholder="Leave a message"
				size="small"
				value={message}
			/>
			<Box
				sx={{
					alignItems: 'center',
					display: 'flex',
					m: -2,
					ml: 2,
				}}>
				<Tooltip title="Send">
					<Box sx={{ m: 1 }}>
						<IconButton
							color="primary"
							disabled={!message || disabled}
							sx={{
								backgroundColor: 'primary.main',
								color: 'primary.contrastText',
								'&:hover': {
									backgroundColor: 'primary.dark',
								},
							}}
							onClick={sendMessage}>
							<SvgIcon>
								<Send01Icon />
							</SvgIcon>
						</IconButton>
					</Box>
				</Tooltip>
				<Tooltip title="Attach photo">
					<Box
						sx={{
							display: {
								xs: 'none',
								sm: 'inline-flex',
							},
							m: 1,
						}}>
						<IconButton disabled={disabled} edge="end" onClick={handleAttach}>
							<SvgIcon>
								<Camera01Icon />
							</SvgIcon>
						</IconButton>
					</Box>
				</Tooltip>
				<Tooltip title="Attach file">
					<Box
						sx={{
							display: {
								xs: 'none',
								sm: 'inline-flex',
							},
							m: 1,
						}}>
						<IconButton disabled={disabled} edge="end" onClick={handleAttach}>
							<SvgIcon>
								<Attachment01Icon />
							</SvgIcon>
						</IconButton>
					</Box>
				</Tooltip>
			</Box>
			<input hidden ref={fileInputRef} type="file" />
		</Stack>
	);
};

ChatMessageInput.propTypes = {
	disabled: PropTypes.bool,
	onSend: PropTypes.func,
};

ChatMessageInput.defaultProps = {
	disabled: false,
};
