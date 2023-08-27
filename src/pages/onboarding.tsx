import React from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as MarketingLayout } from '@/layouts/marketing';
import { RouterLink } from '@/components/router-link';
import { paths } from '@/paths';
import { Box, Button, Container, Paper, Stack, SvgIcon, Typography } from '@mui/material';
import SignupForm from '@/components/SignupForm';

const OnboardingPage: PageType = () => {
	return (
		<Container component="main">
			<Paper
				sx={{
					mt: { xs: 4, md: 8 },
					mb: { xs: 4, md: 8 },
					p: { xs: 2, md: 3 },
				}}
				elevation={24}>
				<SignupForm />
			</Paper>
		</Container>
	);
};

// OnboardingPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default OnboardingPage;
