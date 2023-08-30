import React from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as MarketingLayout } from '@/layouts/marketing';
import { RouterLink } from '@/components/router-link';
import { paths } from '@/paths';
import { Box, Button, Container, Paper, Stack, SvgIcon, Typography } from '@mui/material';
// import SignupForm from '@/components/SignupForm';
import Hero from '@/components/Onboarding/Hero';

const OnboardingPage: PageType = () => {
	return (
		<>
			<main>
				<Hero />
			</main>
		</>
	);
};

OnboardingPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default OnboardingPage;
