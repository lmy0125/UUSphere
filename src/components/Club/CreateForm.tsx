import type { FC } from 'react';
import { useState } from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
	Avatar,
	Box,
	Button,
	Chip,
	IconButton,
	Stack,
	SvgIcon,
	TextField,
	Typography,
} from '@mui/material';

export const CreateForm: FC = () => {
	// const tags: string[] = ['Full-Time'];
	const [clubName, setClubName] = useState('');
	const [clubDescription, setClubDescription] = useState('');
	const [privacy, setPrivacy] = useState('PUBLIC');
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState('');

	const handleAddTag = () => {
		if (!tags.includes(tagInput) && tagInput) {
			setTags([...tags, tagInput]);
			setTagInput('');
		}
	};

	const handleDeleteTag = (tagToDelete: string) => {
		setTags(tags.filter((tag) => tag !== tagToDelete));
	};

	// Add your submit logic here
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const clubData = { clubName, clubDescription, privacy, tags };
		console.log(clubData);
		// Here you would typically send this data to your backend
	};

	return (
		<Box sx={{ p: 3 }}>
			{/* <Stack spacing={4}>
					<Stack spacing={1}>
						<Typography variant="h5">Create Club</Typography>
					</Stack>
					<Stack spacing={4}>
						<TextField fullWidth label="Club Name" name="clubName" />
						<Stack spacing={2}>
							<Stack alignItems="center" direction="row" spacing={2}>
								<TextField fullWidth label="Tags" name="tags" />
								<IconButton>
									<SvgIcon>
										<PlusIcon />
									</SvgIcon>
								</IconButton>
							</Stack>
							<Stack alignItems="center" direction="row" flexWrap="wrap" spacing={1}>
								{tags.map((tag) => (
									<Chip
										avatar={<Avatar>{tag.slice(0, 1)}</Avatar>}
										key={tag}
										label={tag}
										onDelete={() => {}}
										variant="outlined"
									/>
								))}
							</Stack>
						</Stack>
					</Stack>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
						}}>
						<Button color="primary" type="submit" variant="contained">
							Next
						</Button>
					</Box>
				</Stack> */}
			<form onSubmit={(event) => event.preventDefault()}>
				<Stack spacing={2}>
					<Typography variant="h5">Create Club</Typography>
					<TextField
						label="Club Name"
						value={clubName}
						onChange={(e) => setClubName(e.target.value)}
						required
					/>
					<TextField
						label="Club Description"
						multiline
						rows={4}
						value={clubDescription}
						onChange={(e) => setClubDescription(e.target.value)}
						required
					/>
					{/* <FormControl fullWidth>
						<InputLabel>Privacy</InputLabel>
						<Select
							value={privacy}
							label="Privacy"
							onChange={(e) => setPrivacy(e.target.value)}>
							<MenuItem value="PUBLIC">Public</MenuItem>
							<MenuItem value="PRIVATE">Private</MenuItem>
						</Select>
					</FormControl> */}
					{/* <TextField
						label="Tags (press enter to add)"
						variant="outlined"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
					/>
					<Stack direction="row" spacing={1}>
						{tags.map((tag) => (
							<Chip key={tag} label={tag} onDelete={() => handleDeleteTag(tag)} />
						))}
					</Stack> */}
					<Stack spacing={2}>
						<Stack alignItems="center" direction="row" spacing={2}>
							<TextField
								fullWidth
								label="Tags"
								name="tags"
								value={tagInput}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleAddTag();
									}
								}}
								onChange={(e) => {
									setTagInput(e.target.value);
								}}
							/>
							<IconButton onClick={(e) => handleAddTag()}>
								<SvgIcon>
									<PlusIcon />
								</SvgIcon>
							</IconButton>
						</Stack>
						<Stack alignItems="center" direction="row" flexWrap="wrap" spacing={1}>
							{tags.map((tag) => (
								<Chip
									// avatar={<Avatar>{tag.slice(0, 1)}</Avatar>}
									key={tag}
									label={tag}
									onDelete={() => handleDeleteTag(tag)}
									variant="outlined"
								/>
							))}
						</Stack>
					</Stack>
					<Button type="submit" variant="contained">
						Create Club
					</Button>
				</Stack>
			</form>
		</Box>
	);
};
