import React from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as MarketingLayout } from '@/layouts/marketing';
// import SignupForm from '@/components/SignupForm';
import { Hero } from '@/components/Landing/Hero';
import { Features } from '@/components/Landing/Features';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';

const HomePage: PageType = () => {
	return (
		<>
			<main>
				<Hero />
				<Features />
			</main>
		</>
	);
};

HomePage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	console.log('server side props', session);

	if (session) {
		if ((session as any).user.isNewUser) {
			return {
				redirect: {
					destination: '/onboarding',
					permanent: false,
				},
			};
		} else {
			return {
				redirect: {
					destination: '/gathering',
					permanent: false,
				},
			};
		}
	}

	return { props: {} };
};

export default HomePage;
