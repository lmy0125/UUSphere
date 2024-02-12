import type { FC } from 'react';
import { useState } from 'react';
import {
	Box,
	Button,
	Container,
	Stack,
	SvgIcon,
	Typography,
	Unstable_Grid2 as Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LinkExternal01Icon from '@untitled-ui/icons-react/build/esm/LinkExternal01';

interface Feature {
	id: string;
	title: string;
	description: string;
	imageDark: string;
	imageLight: string;
}

const features: Feature[] = [
	{
		id: '1',
		title: 'Access to vacant classrooms',
		description:
			'Find and utilize vacant classrooms on campus with ease. Ideal for studying, group work, or a quiet reading space away from the busy library.',
		imageDark: '/assets/home-features-experts-dark.png',
		imageLight: '/images/features/vacant-classrooms.png',
	},
	{
		id: '2',
		title: 'Join class group chat',
		description:
			'Instantly join a class-specific chat group to connect with classmates. Share resources, discuss coursework, and build a community without the need to set up separate channels.',
		imageDark: '/assets/home-features-figma-dark.png',
		imageLight: '/images/features/chat.png',
	},
	{
		id: '3',
		title: 'Discover multual classmates',
		description:
			'Discover and connect with students who are in multiple classes with you. Perfect for forming study groups or making new friends with similar academic interests.',
		imageDark: '/assets/home-features-tech-dark.png',
		imageLight: '/images/features/mutual-classmates.png',
	},
	{
		id: '4',
		title: 'Share you thoughts',
		description:
			'Share your experiences, vent, or offer insights on campus life. Engage with peers in a supportive space where everyone can relate and respond.',
		imageDark: '/assets/home-features-customize-dark.png',
		imageLight: '/images/features/broadcast.png',
	},
];

export const Features: FC = () => {
	const theme = useTheme();
	const [activeFeature, setActiveFeature] = useState<number>(0);
	const feature = features[activeFeature];
	const image = theme.palette.mode === 'dark' ? feature?.imageDark : feature?.imageLight;

	return (
		<Box
			sx={{
				backgroundColor: 'neutral.800',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'top center',
				backgroundImage: 'url("/assets/gradient-bg.svg")',
				color: 'common.white',
				py: 14,
			}}>
			<Container maxWidth="lg">
				<Stack spacing={2} sx={{ mb: 8 }}>
					<Typography align="center" color="inherit" variant="h3">
						What can you do with UUSphere?
					</Typography>
					{/* <Typography align="center" color="inherit" variant="subtitle2">
						Not just a set of tools, the package includes ready-to-deploy conceptual
						application.
					</Typography> */}
				</Stack>
				<Grid alignItems="center" container spacing={3}>
					<Grid xs={12} md={6}>
						<Stack spacing={1}>
							{features.map((feature, index) => {
								const isActive = activeFeature === index;

								return (
									<Box
										key={feature.id}
										onClick={() => setActiveFeature(index)}
										sx={{
											borderRadius: 2.5,
											color: 'neutral.400',
											cursor: 'pointer',
											p: 3,
											transition: (theme) =>
												theme.transitions.create(
													['background-color, box-shadow', 'color'],
													{
														easing: theme.transitions.easing.easeOut,
														duration: theme.transitions.duration.enteringScreen,
													}
												),
											...(isActive && {
												backgroundColor: 'primary.alpha12',
												boxShadow: (theme) => `${theme.palette.primary.main} 0 0 0 1px`,
												color: 'common.white',
											}),
											'&:hover': {
												...(!isActive && {
													backgroundColor: 'primary.alpha4',
													boxShadow: (theme) =>
														`${theme.palette.primary.main} 0 0 0 1px`,
													color: 'common.white',
												}),
											},
										}}>
										<Typography color="inherit" sx={{ mb: 1 }} variant="h6">
											{feature.title}
										</Typography>
										<Typography color="inherit" variant="body2">
											{feature.description}
										</Typography>
									</Box>
								);
							})}
						</Stack>
					</Grid>
					<Grid xs={12} md={6}>
						<Box
							sx={{
								'& img': {
									width: '100%',
								},
							}}>
							<img src={image} style={{ borderRadius: 20 }} />
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};
