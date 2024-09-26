import React, { useEffect, useState } from 'react';
import type { Page as PageType } from '@/types/page';
import {
	Box,
	Button,
	Stepper,
	Step,
	StepLabel,
	Typography,
	Paper,
	useMediaQuery,
	Theme,
} from '@mui/material';
import { getSession, useSession } from 'next-auth/react';
import ClassEnrollment from '@/components/ClassEnrollment';
import { availableQuarters } from '@/constants/availableQuarters';
import ProfileForm from '@/components/OnBoarding/ProfileForm';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/useUser';
import { User } from '@/types/User';
import { GetServerSideProps } from 'next';

const steps = ['Profile Completion', 'Join Classes'];

const OnBoardingPage: PageType = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	const [activeStep, setActiveStep] = React.useState(0);
	const { user, updateUser, mutate } = useUser({ userId: session?.user.id });
	const [personalInfo, setPersonalInfo] = useState<User | null>(null);

	const quarter = availableQuarters[0];

	const handleNext = () => {
		const newActiveStep = activeStep + 1;
		setActiveStep(newActiveStep);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleComplete = () => {
		if (personalInfo) {
			updateUser(personalInfo);
			mutate();
		}
		router.push('/chat');
	};

	useEffect(() => {
		if (user) {
			setPersonalInfo({
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
		}
	}, [user]);

	if (!personalInfo) {
		return null;
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: smUp ? 'center' : '',
				minHeight: '100vh',
				py: smUp ? 10 : 0,
			}}>
			<Paper
				elevation={3}
				sx={{
					p: smUp ? 4 : 2,
					width: '100%',
					maxWidth: smUp ? '60%' : '100%',
				}}>
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				<Box sx={{ mt: 4 }}>
					{activeStep === steps.length ? (
						<>
							<Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
							<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
								<Box sx={{ flex: '1 1 auto' }} />
								<Button onClick={handleComplete}>Finish</Button>
							</Box>
						</>
					) : (
						<>
							{/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1} content</Typography> */}

							{activeStep === 0 && <ProfileForm personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} />}
							{activeStep === 1 && <ClassEnrollment quarter={quarter} />}

							<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
								{activeStep > 0 && (
									<Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
										Back
									</Button>
								)}
								<Box sx={{ flex: '1 1 auto' }} />
								{activeStep < steps.length - 1 ? (
									<Button onClick={handleNext} variant="contained">
										Next
									</Button>
								) : (
									<Button onClick={handleComplete} variant="contained">
										Finish
									</Button>
								)}
							</Box>
						</>
					)}
				</Box>
			</Paper>
		</Box>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);

	if (session) {
		if (!(session as any).user.isNewUser) {
			return {
				redirect: {
					destination: '/chat',
					permanent: false,
				},
			};
		}
	}

	return { props: {} };
};

export default OnBoardingPage;
