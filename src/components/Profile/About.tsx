import type { FC } from 'react';
import PropTypes from 'prop-types';
import BookOpen01Icon from '@untitled-ui/icons-react/build/esm/BookOpen01';
import Briefcase01Icon from '@untitled-ui/icons-react/build/esm/Briefcase01';
import Home02Icon from '@untitled-ui/icons-react/build/esm/Home02';
import Mail01Icon from '@untitled-ui/icons-react/build/esm/Mail01';
import {
	Card,
	CardContent,
	CardHeader,
	LinearProgress,
	Link,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	SvgIcon,
	Typography,
} from '@mui/material';
import { User } from '@prisma/client';

interface SocialAboutProps {
    user: User;
	currentCity: string;
	currentJobCompany: string;
	currentJobTitle: string;
	email: string;
	originCity: string;
	previousJobCompany: string;
	previousJobTitle: string;
	profileProgress: number;
	quote: string;
}

const About: FC<SocialAboutProps> = (props) => {
	const {
        user,
		currentCity,
		currentJobCompany,
		currentJobTitle,
		email,
		originCity,
		previousJobCompany,
		previousJobTitle,
		profileProgress,
		quote,
		...other
	} = props;

	return (
		<Stack spacing={3} {...other}>
			<Card>
				<CardHeader title="About" />
				<CardContent>
					<Typography color="text.secondary" sx={{ mb: 2 }} variant="subtitle2">
						&quot;
						{user?.name} is lazy and letf nothing here.
						&quot;
					</Typography>
					<List disablePadding>
						<ListItem disableGutters divider>
							<ListItemAvatar>
								<SvgIcon color="action">
									<Briefcase01Icon />
								</SvgIcon>
							</ListItemAvatar>
							<ListItemText
								disableTypography
								primary={
									<Typography variant="subtitle2">
										Grade
										{/* <Link color="text.primary" href="#" variant="subtitle2">
											{currentJobCompany}
										</Link> */}
									</Typography>
								}
								secondary={
									<Typography color="text.secondary" variant="body2">
										Freshman
										{/* <Link color="text.secondary" href="#" variant="body2">
											{previousJobCompany}
										</Link> */}
									</Typography>
								}
							/>
						</ListItem>
						<ListItem disableGutters divider>
							<ListItemAvatar>
								<SvgIcon color="action">
									<BookOpen01Icon />
								</SvgIcon>
							</ListItemAvatar>
							<ListItemText
								primary={
									<Link
										color="text.secondary"
										sx={{ cursor: 'pointer' }}
										variant="caption">
										Add school or collage
									</Link>
								}
							/>
						</ListItem>
						<ListItem disableGutters divider>
							<ListItemAvatar>
								<SvgIcon color="action">
									<Home02Icon />
								</SvgIcon>
							</ListItemAvatar>
							<ListItemText
								disableTypography
								primary={
									<Typography variant="subtitle2">
										Lives in{' '}
										<Link color="text.primary" href="#" variant="subtitle2">
											{currentCity}
										</Link>
									</Typography>
								}
								secondary={
									<Typography color="text.secondary" variant="body2">
										Originally from{' '}
										<Link color="text.secondary" href="#" variant="body2">
											{originCity}
										</Link>
									</Typography>
								}
							/>
						</ListItem>
						<ListItem disableGutters>
							<ListItemAvatar>
								<SvgIcon color="action">
									<Mail01Icon />
								</SvgIcon>
							</ListItemAvatar>
							<ListItemText primary={<Typography variant="subtitle2">{email}</Typography>} />
						</ListItem>
					</List>
				</CardContent>
			</Card>
		</Stack>
	);
};

About.propTypes = {
	currentCity: PropTypes.string.isRequired,
	currentJobCompany: PropTypes.string.isRequired,
	currentJobTitle: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
	originCity: PropTypes.string.isRequired,
	previousJobCompany: PropTypes.string.isRequired,
	previousJobTitle: PropTypes.string.isRequired,
	profileProgress: PropTypes.number.isRequired,
	quote: PropTypes.string.isRequired,
};

export default About;
