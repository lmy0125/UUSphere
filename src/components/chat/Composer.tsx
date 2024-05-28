import React, { HTMLAttributes, useState } from 'react';
import {
	MessageInput,
	MessageToSend,
	QuotedMessagePreview,
	useChannelActionContext,
	useChatContext,
} from 'stream-chat-react';
import {
	Avatar,
	Box,
	Autocomplete,
	Chip,
	TextField,
	Typography,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	AutocompleteRenderGetTagProps,
} from '@mui/material';
import { useComposeModeContext } from '@/contexts/ComposeModeContext';
import { useChatStackContext } from '@/contexts/ChatStackContext';
import axios from 'axios';
import useSWR from 'swr';
import { User } from '@prisma/client';
import UserAvatar from '@/components/UserAvatar';
import BackButton from '@/components/chat/BackButton';
import { ImageDropzone, FileUploadButton } from 'react-file-utils';

export default function Composer() {
	const [input, setInput] = useState('');
	const [recipients, setRecipients] = useState<User[]>([]);
	const { sendMessage } = useChannelActionContext();
	const { client, setActiveChannel } = useChatContext();
	const { setComposeMode } = useComposeModeContext();
	const { setShowChannel } = useChatStackContext();
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const { data: allUsers, isLoading } = useSWR<User[]>(`/api/user`, fetcher);
	// filter out the user themselves so they can't send message to themselves
	const options = allUsers?.filter((user) => user.id != client.user?.id);

	const handleMessageUser = async (user: User) => {
		if (client.user && user) {
			const channel = client.channel('messaging', {
				members: [client.user.id, user.id],
			});
			await channel.watch();
			setComposeMode(false);
			setActiveChannel(channel);
		}
	};

	// Function to handle input value change
	const handleInputChange = (
		event: React.SyntheticEvent<Element, Event>,
		newInputValue: React.SetStateAction<string>
	) => {
		setInput(newInputValue);
	};

	// Determine if the Autocomplete should be open
	const shouldOpen = input.trim() !== '' && allUsers !== undefined;

	const renderOption = (props: HTMLAttributes<HTMLLIElement>, option: User) => {
		return (
			<ListItem key={option.id} {...props} onClick={(e) => handleMessageUser(option)}>
				<ListItemAvatar>
					<UserAvatar userId={option.id} size={36} />
				</ListItemAvatar>
				<ListItemText
					primary={option.name}
					primaryTypographyProps={{
						noWrap: true,
						variant: 'subtitle2',
					}}
				/>
			</ListItem>
		);
	};

	const renderTags = (value: User[], getTagProps: AutocompleteRenderGetTagProps) => {
		return value.map((option, index) => {
			const { key, ...obj } = { ...getTagProps({ index }) };
			return (
				<Chip
					key={option.id}
					avatar={<UserAvatar userId={option.id} />}
					label={option.name}
					{...obj}
				/>
			);
		});
	};

	const filterOptions = (options: User[], { inputValue }: { inputValue: string }) => {
		return options.filter(
			(option) =>
				option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
				option.email.split('@')[0].toLowerCase().includes(inputValue.toLowerCase())
		);
	};

	const overrideSubmitHandler = async (message: MessageToSend, cid: string) => {
		const recipientsId: string[] = recipients.map((obj) => obj.id);
		if (client.user) {
			const channel = client.channel('messaging', {
				members: [client.user.id, ...recipientsId],
			});
			await channel.watch();
			if (setActiveChannel) {
				setActiveChannel(channel);
				await channel.sendMessage({
					text: message.text,
					attachments: message.attachments,
				});
				setComposeMode(false);
				setShowChannel(true);
			}
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
			}}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					p: 1,
				}}>
				<BackButton setOpen={setShowChannel} />
				<Typography color="text.secondary" sx={{ mx: 1 }} variant="body2">
					To:
				</Typography>
				{/* <Autocomplete
					multiple
					filterSelectedOptions
					value={recipients}
					onChange={(_, newValue) => {
						setRecipients(newValue);
					}}
					options={options ?? []}
					getOptionLabel={(option) => option.name}
					open={shouldOpen}
					onInputChange={handleInputChange}
					sx={{
						width: '100%',
						'.MuiInputBase-input': { height: '24px' },
					}}
					filterOptions={filterOptions}
					renderOption={renderOption}
					renderTags={renderTags}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="outlined"
							placeholder="Name or email"
							value={input}
						/>
					)}
				/> */}
				<Autocomplete
					options={options ?? []}
					getOptionKey={(option) => option.id}
					getOptionLabel={(_) => 'Creating...'}
					open={shouldOpen}
					onInputChange={handleInputChange}
					sx={{
						width: '100%',
						'.MuiInputBase-input': { height: '24px' },
					}}
					filterOptions={filterOptions}
					renderOption={renderOption}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="outlined"
							placeholder="Name or email"
							value={input}
						/>
					)}
				/>
			</Box>

			<Box sx={{ flexGrow: 1 }} />

			{/* <CustomMessageInput /> */}
			{/* <MessageInput grow disableMentions overrideSubmitHandler={overrideSubmitHandler} /> */}
		</Box>
	);
}

import {
	ChatAutoComplete,
	EmojiIconLarge,
	EmojiPicker,
	SendButton,
	Tooltip,
	useMessageInputContext,
	useTranslationContext,
} from 'stream-chat-react';

export const CustomMessageInput = () => {
	const { t } = useTranslationContext();

	const {
		closeEmojiPicker,
		emojiPickerIsOpen,
		handleEmojiKeyDown,
		handleSubmit,
		openEmojiPicker,
	} = useMessageInputContext();

	return (
		<div className="str-chat__message-input">
			<div className="str-chat__message-input-inner">
				<ImageDropzone>
					<div className="str-chat__file-input-container">
						<FileUploadButton
							handleFiles={function (files: FileList | File[]): void {
								throw new Error('Function not implemented.');
							}}
						/>
					</div>
					{/* <QuotedMessagePreview quotedMessage={undefined} /> */}
					{/* <UploadsPreview /> */}

					<div className="str-chat__message-textarea-container">
						<ChatAutoComplete />
						<EmojiPicker />
					</div>

					<SendButton sendMessage={handleSubmit} />
				</ImageDropzone>
				{/* <div className="str-chat__input-flat--textarea-wrapper">
					<ChatAutoComplete />
					<div className="str-chat__emojiselect-wrapper">
						<Tooltip>
							{emojiPickerIsOpen ? 'Close emoji picker' : 'Open emoji picker'}
						</Tooltip>
						<span
							className="str-chat__input-flat-emojiselect"
							onClick={emojiPickerIsOpen ? closeEmojiPicker : openEmojiPicker}
							onKeyDown={handleEmojiKeyDown}
							role="button"
							tabIndex={0}>
							<EmojiIconLarge />
						</span>
					</div>
					<EmojiPicker />
				</div>
				<SendButton sendMessage={handleSubmit} /> */}
			</div>
		</div>
	);
};
