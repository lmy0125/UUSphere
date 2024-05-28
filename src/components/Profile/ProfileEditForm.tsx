import { useState, useEffect, FormEvent } from 'react';
import type { Dispatch, FC, SetStateAction } from 'react';
import {
	Avatar,
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
	Stack,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	useMediaQuery,
	Theme,
} from '@mui/material';
import { genders, majors, homelands, grades, colleges } from '@/constants/personalInfoOptions';
import { User } from '@/types/User';
import { BigHeadAvatar, BigHeadStyle } from '@/types/User';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import { BigHead } from '@bigheads/core';
import { GithubPicker } from 'react-color';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useUser } from '@/hooks/useUser';

interface ProfileEditFormProps {
	user: User;
	setProfileFormToggle: Dispatch<SetStateAction<boolean>>;
}

const bigHeadOptions: Record<string, string[]> = {
	accessory: ['none', 'roundGlasses', 'tinyGlasses', 'shades'],
	body: ['chest', 'breasts'],
	circleColor: ['blue'],
	clothing: ['naked', 'shirt', 'dressShirt', 'vneck', 'tankTop', 'dress'],
	clothingColor: ['white', 'blue', 'black', 'green', 'red'],
	eyebrows: ['raised', 'leftLowered', 'serious', 'angry', 'concerned'],
	eyes: ['normal', 'leftTwitch', 'happy', 'content', 'squint', 'simple', 'dizzy', 'wink', 'heart'],
	facialHair: ['none', 'none2', 'none3', 'stubble', 'mediumBeard'],
	graphic: ['none', 'redwood', 'gatsby', 'vue', 'react', 'graphQL'],
	hair: ['none', 'long', 'bun', 'short', 'pixie', 'balding', 'buzz', 'afro', 'bob'],
	hairColor: ['blonde', 'orange', 'black', 'white', 'brown', 'blue', 'pink'],
	hat: ['none', 'none2', 'none3', 'none4', 'none5', 'beanie', 'turban'],
	hatColor: ['white', 'blue', 'black', 'green', 'red'],
	lashes: ['true', 'false'],
	lipColor: ['red', 'purple', 'pink', 'turqoise', 'green'],
	mouth: ['grin', 'sad', 'openSmile', 'lips', 'open', 'serious', 'tongue'],
	skinTone: ['light', 'yellow', 'brown', 'dark', 'red', 'black'],
};

const ProfileEditForm: FC<ProfileEditFormProps> = ({ user, setProfileFormToggle }) => {
	const [personalInfo, setPersonalInfo] = useState<User>({
		...user,
		name: user.name,
		email: user.email,
		image: user.image,
		gender: user.gender ?? '',
		grade: user.grade ?? '',
		college: user.college ?? '',
		major: user.major ?? '',
		homeland: user.homeland ?? '',
		bio: user.bio ?? '',
		bigHeadAvatar: user.bigHeadAvatar,
	});
	const { mutate, updateUser } = useUser({ userId: user.id });
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	// pick random value for each attribute in the bigHeadOptions above
	const getRandomValue = (key: keyof BigHeadStyle) => {
		const values = bigHeadOptions[key];
		const randomIndex = Math.floor(Math.random() * values.length);
		return values[randomIndex];
	};
	// call above method for every attribute
	const generateRandomAvatar = () => {
		const randomSelections: BigHeadStyle = {};
		for (const key in bigHeadOptions) {
			randomSelections[key as keyof BigHeadStyle] = getRandomValue(key as keyof BigHeadStyle);
		}
		setPersonalInfo({
			...personalInfo,
			bigHeadAvatar: {
				...randomSelections,
				selected: personalInfo.bigHeadAvatar?.selected ?? false,
				backgroundColor: personalInfo.bigHeadAvatar?.backgroundColor ?? '#a9c8e6',
			},
		});
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		updateUser(personalInfo);
		mutate();
		setProfileFormToggle(false);
	};

	useEffect(() => {
		// init the bigHeadAvatar for the first time for users.
		// So that the avatar won't change if user switch between original and bighead
		if (!personalInfo.bigHeadAvatar) {
			generateRandomAvatar();
		}
	}, []);

	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			<CardHeader
				title="Edit Profile"
				sx={{ textAlign: 'center', py: 1, pb: 0 }}
				titleTypographyProps={{ variant: 'h5' }}
			/>
			<CardContent>
				<Grid container spacing={4}>
					<Grid xs={12}>
						<Stack direction="column" alignItems="center">
							{!personalInfo.bigHeadAvatar?.selected ? (
								<Avatar
									src={personalInfo.image}
									sx={{
										height: 160,
										width: 160,
									}}
								/>
							) : (
								(() => {
									const { selected, backgroundColor, ...bigHeadStyle } = personalInfo.bigHeadAvatar;
									const cleanedBigHeadStyle = Object.fromEntries(
										Object.entries(bigHeadStyle).filter(([key, value]) => value !== null)
									);
									return (
										<Box sx={{ display: 'flex' }}>
											<Box sx={{ pl: smUp ? 22 : 0 }}>
												<Avatar
													sx={{
														height: 160,
														width: 160,
														backgroundColor: personalInfo.bigHeadAvatar?.backgroundColor ?? '#a9c8e6',
													}}>
													<Box sx={{ width: '100%', height: '100%' }}>
														<BigHead {...cleanedBigHeadStyle} mask={false} />
													</Box>
												</Avatar>
												{!smUp && (
													<Stack alignItems="center" spacing={2}>
														<Box>
															<Typography variant="subtitle2" color="text.secondary">
																Background color
															</Typography>
															<GithubPicker
																width="137px"
																triangle="hide"
																colors={[
																	'#a9c8e6', // Light Blue
																	'#b4e3c4', // Light Green
																	'#c7b5d4', // Light Purple
																	'#f0cbaa', // Light Orange
																	'#f0a3a0', // Light Red
																	'#ffb1c1', // Light Pink
																	'#abdbd0', // Light Teal
																	'#c8d6d7', // Light Gray
																	'#f9e79f', // Light Yellow
																	'#e6b58d', // Light Brown
																]}
																color={personalInfo.bigHeadAvatar.backgroundColor ?? '#a9c8e6'}
																onChangeComplete={(color) => {
																	setPersonalInfo({
																		...personalInfo,
																		bigHeadAvatar: {
																			...personalInfo.bigHeadAvatar,
																			backgroundColor: color.hex,
																			selected: true,
																		},
																	});
																}}
															/>
														</Box>

														<Button
															variant="contained"
															onClick={generateRandomAvatar}
															startIcon={<AutorenewIcon />}>
															Reroll
														</Button>
													</Stack>
												)}
											</Box>
											{smUp && (
												<Stack alignItems="center" spacing={2} sx={{ ml: 5 }}>
													<Box>
														<Typography variant="subtitle2" color="text.secondary">
															Background color
														</Typography>
														<GithubPicker
															width="137px"
															triangle="hide"
															colors={[
																'#a9c8e6', // Light Blue
																'#b4e3c4', // Light Green
																'#c7b5d4', // Light Purple
																'#f0cbaa', // Light Orange
																'#f0a3a0', // Light Red
																'#ffb1c1', // Light Pink
																'#abdbd0', // Light Teal
																'#c8d6d7', // Light Gray
																'#f9e79f', // Light Yellow
																'#e6b58d', // Light Brown
															]}
															color={personalInfo.bigHeadAvatar.backgroundColor ?? '#a9c8e6'}
															onChangeComplete={(color) => {
																setPersonalInfo({
																	...personalInfo,
																	bigHeadAvatar: {
																		...personalInfo.bigHeadAvatar,
																		backgroundColor: color.hex,
																		selected: true,
																	},
																});
															}}
														/>
													</Box>

													<Button
														variant="contained"
														onClick={generateRandomAvatar}
														startIcon={<AutorenewIcon />}>
														Reroll
													</Button>
												</Stack>
											)}
										</Box>
									);
								})()
							)}
							<FormControl>
								<FormLabel id="demo-row-radio-buttons-group-label">Avatar</FormLabel>
								<RadioGroup
									row
									value={personalInfo.bigHeadAvatar?.selected ? 'bighead' : 'original'}
									onChange={(event) =>
										setPersonalInfo({
											...personalInfo,
											bigHeadAvatar: {
												...personalInfo.bigHeadAvatar,
												selected: (event.target as HTMLInputElement).value === 'bighead',
											},
										})
									}>
									<FormControlLabel value="original" control={<Radio />} label="Original" />
									<FormControlLabel value="bighead" control={<Radio />} label="Big Head" />
								</RadioGroup>
							</FormControl>
						</Stack>
					</Grid>
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
							value={personalInfo.homeland ? { code: '', label: personalInfo.homeland, phone: '' } : null}
							options={homelands}
							isOptionEqualToValue={(option, value) => option.label === value.label}
							renderOption={(props, option) => (
								<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
									<img
										loading="lazy"
										width="20"
										src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
										srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
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
