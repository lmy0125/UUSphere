import { useState, useEffect } from 'react';
import type { FC } from 'react';
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
	gender?: string;
	grade?: string;
	college?: string;
	major?: string;
	homeland?: string;
}

const ProfileEditForm = ({ user }: { user: User }) => {
	const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
		name: user.name,
		email: user.email,
		gender: user.gender ?? '',
		grade: user.grade ?? '',
		college: user.college || '',
		major: user.college ?? '',
		homeland: user.homeland ?? '',
	});

	const onSubmit = async () => {
		const res = await axios.post('/api/updateUser', personalInfo);
		console.log('res', res);
	};

	return (
		<>
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
							required
							value={personalInfo.name}
							onChange={(e) => {
								setPersonalInfo({ ...personalInfo, name: e.target.value });
							}}
						/>
					</Grid>

					<Grid xs={12} md={6}>
						<Autocomplete
							// getOptionLabel={(option) => option.text}
							defaultValue={personalInfo.gender}
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
							defaultValue={personalInfo.grade}
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
							defaultValue={personalInfo.college}
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
							defaultValue={personalInfo.major}
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
							defaultValue={{ code: '', label: personalInfo.homeland, phone: '' }}
							options={homelands}
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
								setPersonalInfo({ ...personalInfo, homeland: values?.label });
							}}
						/>
					</Grid>
				</Grid>
			</CardContent>
			<CardActions
				sx={{
					justifyContent: 'flex-end',
					p: 2,
				}}>
				<Button color="primary" variant="contained" onClick={onSubmit}>
					Submit
				</Button>
			</CardActions>
		</>
	);
};

export default ProfileEditForm;
