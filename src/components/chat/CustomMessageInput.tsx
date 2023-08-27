import {
	ChatAutoComplete,
	EmojiIconLarge,
	EmojiPicker,
	SendButton,
	useMessageInputContext,
	useTranslationContext,
} from 'stream-chat-react';
import PropTypes from 'prop-types';
import Attachment01Icon from '@untitled-ui/icons-react/build/esm/Attachment01';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import Send01Icon from '@untitled-ui/icons-react/build/esm/Send01';
import { Avatar, Box, IconButton, OutlinedInput, Stack, SvgIcon, Tooltip } from '@mui/material';

const CustomMessageInput = () => {
	const { t } = useTranslationContext();

	const {
		closeEmojiPicker,
		emojiPickerIsOpen,
		handleEmojiKeyDown,
		handleSubmit,
		openEmojiPicker,
	} = useMessageInputContext();

	return (
		<Stack
			alignItems="center"
			direction="row"
			spacing={2}
			sx={{
				px: 3,
				py: 1,
			}}>
			<OutlinedInput
				// disabled={disabled}
				fullWidth
				// onChange={handleChange}
				// onKeyUp={handleKeyUp}
				sx={{height: 40}}
				placeholder="Leave a message"
				// value={body}
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
							// disabled={!body || disabled}
							onClick={handleSubmit}
						>
							<SvgIcon>
								<Send01Icon />
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
						<IconButton
							edge="end"
							// disabled={disabled}  onClick={handleAttach}
						>
							<SvgIcon>
								<Attachment01Icon />
							</SvgIcon>
						</IconButton>
					</Box>
				</Tooltip>
			</Box>
			{/* <input hidden ref={fileInputRef} type="file" /> */}
		</Stack>
	);
};

export default CustomMessageInput;
