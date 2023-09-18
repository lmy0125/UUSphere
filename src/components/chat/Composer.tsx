import React, { HTMLAttributes, useState } from 'react';
import { MessageInput } from 'stream-chat-react';
import {
	Avatar,
	Box,
	Button,
	Autocomplete,
	Chip,
	TextField,
	Typography,
	ListItem,
	ListItemButton,
	ListItemAvatar,
	ListItemText,
	AutocompleteRenderGetTagProps,
} from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';
import { User } from '@prisma/client';

export default function Composer() {
	const [input, setInput] = useState('');
	const [recipients, setRecipients] = useState<User[]>([]);
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const { data: allUsers, isLoading } = useSWR<User[]>(`/api/users`, fetcher);

	// Function to handle input value change
	const handleInputChange = (
		event: React.SyntheticEvent<Element, Event>,
		newInputValue: React.SetStateAction<string>
	) => {
		setInput(newInputValue);
	};

	// Determine if the Autocomplete should be open
	const shouldOpen = input.trim() !== '' && allUsers !== undefined;

	const renderOption = (props: HTMLAttributes<HTMLLIElement>, option: User) => (
		<ListItem key={option.id} {...props}>
			<ListItemAvatar>
				<Avatar src={option.image} />
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
	// getTagProps: AutocompleteRenderGetTagProps, ownerState: AutocompleteOwnerState<...>
	const renderTags = (value: User[], getTagProps: AutocompleteRenderGetTagProps) => {
		return value.map((option, index) => (
			<Chip
				avatar={<Avatar src={option.image} />}
				label={option.name}
				{...getTagProps({ index })}
			/>
		));
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
					onChange={(_, newValue) => setRecipients(newValue)}
					options={allUsers ?? []}
					getOptionLabel={(option) => option.name}
					open={shouldOpen}
					onInputChange={handleInputChange}
					sx={{
						width: '100%',
						'.MuiInputBase-input': { height: '38px' },
						'.MuiInputBase-root': { py: 0.8 },
					}}
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

			<Button onClick={() => console.log(recipients)}>Print</Button>
			<Box sx={{ flexGrow: 1 }} />
			<MessageInput grow />
		</Box>
	);
}
