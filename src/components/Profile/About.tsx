import type { Dispatch, FC, SetStateAction } from 'react';
import PropTypes from 'prop-types';
import BookOpen01Icon from '@untitled-ui/icons-react/build/esm/BookOpen01';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
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
import { useSession } from 'next-auth/react';

interface SocialAboutProps {
	user: User;
	setProfileFormToggle: Dispatch<SetStateAction<boolean>>;
}

const About: FC<SocialAboutProps> = (props) => {
	const { user, setProfileFormToggle, ...other } = props;
	const { data: session } = useSession();

	return (
		<Stack spacing={3} {...other}>
			<Card>
				<CardHeader title="About" />
				<CardContent>
					<Typography color="text.secondary" sx={{ mb: 2 }} variant="subtitle2">
						&quot;
						{user?.name} is lazy and letf nothing here. &quot;
					</Typography>
					<List disablePadding>
						{(user.grade || user.id === session?.user.id) && (
							<ListItem disableGutters divider>
								<ListItemAvatar>
									<SvgIcon color="action">
										<SchoolIcon />
									</SvgIcon>
								</ListItemAvatar>
								<ListItemText
									disableTypography
									primary={<Typography variant="subtitle2">Grade</Typography>}
									secondary={
										user.grade ? (
											<Typography color="text.secondary" variant="body2">
												{user.grade}
											</Typography>
										) : (
											<Link
												color="text.secondary"
												sx={{ cursor: 'pointer' }}
												variant="caption"
												onClick={() => setProfileFormToggle(true)}>
												Add grade
											</Link>
										)
									}
								/>
							</ListItem>
						)}

						{(user.college || user.id === session?.user.id) && (
							<ListItem disableGutters divider>
								<ListItemAvatar>
									<SvgIcon color="action">
										<HomeWorkIcon />
									</SvgIcon>
								</ListItemAvatar>
								<ListItemText
									disableTypography
									primary={<Typography variant="subtitle2">College</Typography>}
									secondary={
										user.college ? (
											<Typography color="text.secondary" variant="body2">
												{user.college}
											</Typography>
										) : (
											<Link
												color="text.secondary"
												sx={{ cursor: 'pointer' }}
												variant="caption"
												onClick={() => setProfileFormToggle(true)}>
												Add college
											</Link>
										)
									}
								/>
							</ListItem>
						)}

						{(user.major || user.id === session?.user.id) && (
							<ListItem disableGutters divider>
								<ListItemAvatar>
									<SvgIcon color="action">
										<BookOpen01Icon />
									</SvgIcon>
								</ListItemAvatar>
								<ListItemText
									disableTypography
									primary={<Typography variant="subtitle2">Major</Typography>}
									secondary={
										user.major ? (
											<Typography color="text.secondary" variant="body2">
												{user.major}
											</Typography>
										) : (
											<Link
												color="text.secondary"
												sx={{ cursor: 'pointer' }}
												variant="caption"
												onClick={() => setProfileFormToggle(true)}>
												Add major
											</Link>
										)
									}
								/>
							</ListItem>
						)}

						{(user.homeland || user.id === session?.user.id) && (
							<ListItem disableGutters divider>
								<ListItemAvatar>
									<SvgIcon color="action">
										<PublicIcon />
									</SvgIcon>
								</ListItemAvatar>
								<ListItemText
									disableTypography
									primary={<Typography variant="subtitle2">Homeland</Typography>}
									secondary={
										user.homeland ? (
											<Typography color="text.secondary" variant="body2">
												{user.homeland}
											</Typography>
										) : (
											<Link
												color="text.secondary"
												sx={{ cursor: 'pointer' }}
												variant="caption"
												onClick={() => setProfileFormToggle(true)}>
												Add homeland
											</Link>
										)
									}
								/>
							</ListItem>
						)}
					</List>
				</CardContent>
			</Card>
		</Stack>
	);
};

About.propTypes = {};

export default About;
