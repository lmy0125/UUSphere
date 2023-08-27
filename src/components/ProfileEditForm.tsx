import { useState, useEffect, FormEvent } from 'react';
import type { Dispatch, FC, SetStateAction } from 'react';
import {
	Autocomplete,
	Box,
	Button,
	CardActions,
	CardContent,
	CardHeader,
	Switch,
	TextField,
	Typography,
	Unstable_Grid2 as Grid,
} from '@mui/material';
import { genders, majors, homelands, grades, colleges } from '@/constants/personalInfoOptions';
import { User } from '@prisma/client';
import axios from 'axios';

interface PersonalInfo {
	name: string;
	email: string;
	gender: string;
	grade: string;
	college: string;
	major: string;
	homeland: string;
	bio: string;
}

interface ProfileEditFormProps {
	user: User;
	setUser: Dispatch<SetStateAction<User>>;
	setProfileFormToggle: Dispatch<SetStateAction<boolean>>;
}

const ProfileEditForm: FC<ProfileEditFormProps> = ({ user, setUser, setProfileFormToggle }) => {
	const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
		name: user.name,
		email: user.email,
		gender: user.gender ?? '',
		grade: user.grade ?? '',
		college: user.college ?? '',
		major: user.major ?? '',
		homeland: user.homeland ?? '',
		bio: user.bio ?? '',
	});

	const handleSubmit =  (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		axios.post('/api/updateUser', personalInfo);
		setUser({
			...user,
			name: personalInfo.name,
			gender: personalInfo.gender,
			grade: personalInfo.grade,
			college: personalInfo.college,
			major: personalInfo.major,
			homeland: personalInfo.homeland,
			bio: personalInfo.bio,
		});
		setProfileFormToggle(false);
	};

	return (
		<form onSubmit={(e)=>handleSubmit(e)}>
			<CardHeader
				title="Edit Profile"
				sx={{ textAlign: 'center', py: 1, pb: 0 }}
				titleTypographyProps={{ variant: 'h5' }}
			/>
			<CardContent>
				<Grid container spacing={4}>
					<Grid xs={12} md={6}>
						<TextField
							fullWidth
							label="Name"
							name="name"
							value={personalInfo.name}
							onChange={(e) => {
								setPersonalInfo({ ...personalInfo, name: e.target.value });
							}}
							required
							error={personalInfo.name.trim() === ''}
							helperText={personalInfo.name.trim() === '' ? 'Name is required!' : ''}
						/>
					</Grid>
					<Grid xs={12} md={6}>
						<Autocomplete
							// getOptionLabel={(option) => option.text}
							value={personalInfo.gender || null}
							options={genders}
							renderInput={(params): JSX.Element => (
								<TextField {...params} fullWidth label="Gender" name="gender" />
							)}
							onChange={(e, values) => {
								setPersonalInfo({ ...personalInfo, gender: values ?? '' });
							}}
						/>
					</Grid>
					<Grid xs={12} md={6}>
						<Autocomplete
							value={personalInfo.grade || null}
							options={grades}
							renderInput={(params): JSX.Element => (
								<TextField {...params} fullWidth label="Grade" name="grade" />
							)}
							onChange={(e, values) => {
								setPersonalInfo({ ...personalInfo, grade: values ?? '' });
							}}
						/>
					</Grid>
					<Grid xs={12} md={6}>
						<Autocomplete
							value={personalInfo.college || null}
							options={colleges}
							renderInput={(params): JSX.Element => (
								<TextField {...params} fullWidth label="College" name="college" />
							)}
							onChange={(e, values) => {
								setPersonalInfo({ ...personalInfo, college: values ?? '' });
							}}
						/>
					</Grid>
					<Grid xs={12} md={6}>
						<Autocomplete
							value={personalInfo.major || null}
							options={majors}
							renderInput={(params): JSX.Element => (
								<TextField {...params} fullWidth label="Major" name="major" />
							)}
							onChange={(e, values) => {
								setPersonalInfo({ ...personalInfo, major: values ?? '' });
							}}
						/>
					</Grid>
					<Grid xs={12} md={6}>
						<Autocomplete
							// getOptionLabel={(option) => option.label}
							value={
								personalInfo.homeland
									? { code: '', label: personalInfo.homeland, phone: '' }
									: null
							}
							options={homelands}
							isOptionEqualToValue={(option, value) => option.label === value.label}
							renderOption={(props, option) => (
								<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
									<img
										loading="lazy"
										width="20"
										src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
										srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
										alt=""
									/>
									{option.label} ({option.code})
								</Box>
							)}
							renderInput={(params): JSX.Element => (
								<TextField {...params} fullWidth label="Homeland" name="homeland" />
							)}
							onChange={(e, values) => {
								setPersonalInfo({ ...personalInfo, homeland: values?.label ?? '' });
							}}
						/>
					</Grid>
					<Grid xs={12}>
						<TextField
							fullWidth
							label="Bio"
							name="bio"
							value={personalInfo.bio}
							onChange={(e) => {
								setPersonalInfo({ ...personalInfo, bio: e.target.value });
							}}
							multiline
							rows={2}
						/>
					</Grid>
				</Grid>
			</CardContent>
			<CardActions
				sx={{
					justifyContent: 'flex-end',
					p: 2,
				}}>
				<Button color="primary" variant="contained" type="submit">
					Submit
				</Button>
			</CardActions>
		</form>
	);
};

export default ProfileEditForm;
