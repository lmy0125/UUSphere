import React, { HTMLAttributes, useState } from 'react';
import {
	MessageInput,
	MessageToSend,
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
	ListItemText,
	AutocompleteRenderGetTagProps,
} from '@mui/material';
import { useComposeModeContext } from '@/contexts/ComposeModeContext';
import axios from 'axios';
import useSWR from 'swr';
import { User } from '@prisma/client';
import UserAvatar from '@/components/UserAvatar';

export default function Composer() {
	const [input, setInput] = useState('');
	const [recipients, setRecipients] = useState<User[]>([]);
	const { sendMessage } = useChannelActionContext();
	const { client, setActiveChannel } = useChatContext();
	const { setComposeMode } = useComposeModeContext();
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const { data: allUsers, isLoading } = useSWR<User[]>(`/api/users`, fetcher);
	// filter out the user themselves so they can't send message to themselves
	const options = allUsers?.filter((user) => user.id != client.user?.id);

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
			<ListItem key={option.id} {...props}>
				<ListItemAvatar>
					<UserAvatar userId={option.id} />
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
				option.email.toLowerCase().includes(inputValue.toLowerCase())
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
				sendMessage(message);
				setComposeMode(false);
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
				<Typography color="text.secondary" sx={{ mx: 1 }} variant="body2">
					To:
				</Typography>
				<Autocomplete
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
						'.MuiInputBase-input': { height: '38px' },
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
				/>
			</Box>

			<Box sx={{ flexGrow: 1 }} />
			<MessageInput grow overrideSubmitHandler={overrideSubmitHandler} />
		</Box>
	);
}
