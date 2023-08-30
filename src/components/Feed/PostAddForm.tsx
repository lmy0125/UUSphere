import { FC, useState } from 'react';
import Attachment01Icon from '@untitled-ui/icons-react/build/esm/Attachment01';
import FaceSmileIcon from '@untitled-ui/icons-react/build/esm/FaceSmile';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import Link01Icon from '@untitled-ui/icons-react/build/esm/Link01';
import type { Theme } from '@mui/material';
import {
	Autocomplete,
	Avatar,
	Button,
	Box,
	Card,
	CardContent,
	IconButton,
	OutlinedInput,
	Stack,
	SvgIcon,
	useMediaQuery,
	TextField,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { homelands } from '@/constants/personalInfoOptions';

// import { useMockedUser } from 'src/hooks/use-mocked-user';
// import { getInitials } from 'src/utils/get-initials';

const PostAddForm: FC = (props) => {
	const { data: session } = useSession();
	const [region, setRegion] = useState({
		code: 'GLB',
		label: 'Global',
		phone: '',
	});
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	return (
		<Card {...props}>
			<CardContent>
				<Stack alignItems="flex-start" direction="row" spacing={2}>
					<Avatar
						src={session?.user.image}
						sx={{
							height: 40,
							width: 40,
						}}>
						{session?.user.name}
					</Avatar>
					<Stack spacing={3} sx={{ flexGrow: 1 }}>
						<OutlinedInput fullWidth multiline placeholder="Share your thoughts" rows={2} />
						<Stack
							alignItems="center"
							direction="row"
							justifyContent="space-between"
							spacing={3}>
							{smUp && (
								<Stack alignItems="center" direction="row" spacing={1}>
									<IconButton>
										<SvgIcon>
											<Image01Icon />
										</SvgIcon>
									</IconButton>
									<IconButton>
										<SvgIcon>
											<Attachment01Icon />
										</SvgIcon>
									</IconButton>
									<IconButton>
										<SvgIcon>
											<Link01Icon />
										</SvgIcon>
									</IconButton>
									<IconButton>
										<SvgIcon>
											<FaceSmileIcon />
										</SvgIcon>
									</IconButton>
								</Stack>
							)}

							<Stack alignItems="center" direction="row" spacing={1}>
								<Autocomplete
									value={region}
									options={homelands}
									isOptionEqualToValue={(option, value) => option.label === value.label}
									renderOption={(props, option) => (
										<Box
											component="li"
											sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
											{...props}>
											<img
												loading="lazy"
												width="20"
												src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
												srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
												alt=""
											/>
											{option.label}
										</Box>
									)}
									renderInput={(params): JSX.Element => (
										<TextField {...params} fullWidth label="Homeland" name="homeland" />
									)}
									// onChange={(e, values) => {
									// 	setPersonalInfo({ ...personalInfo, homeland: values?.label ?? '' });
									// }}
								/>
								<Button variant="contained">Post</Button>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default PostAddForm;
