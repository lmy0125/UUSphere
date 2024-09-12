import { use, useEffect, useState, type FC, type ReactNode } from 'react';
import PropTypes from 'prop-types';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { NavColor } from '@/types/settings';
import type { Section } from '../config';
import { MobileNav } from '../mobile-nav';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { useMobileNav } from './use-mobile-nav';
import { Box, Button, Stack, Typography, Fade, Paper } from '@mui/material';
import TrapFocus from '@mui/material/Unstable_TrapFocus';
import { useUser } from '@/hooks/useUser';
import { useSession } from 'next-auth/react';
import { availableQuarters } from '@/constants/availableQuarters';
import { useRouter } from 'next/router';

const SIDE_NAV_WIDTH: number = 280;

const VerticalLayoutRoot = styled('div')(({ theme }) => ({
	display: 'flex',
	flex: '1 1 auto',
	maxWidth: '100%',
	[theme.breakpoints.up('lg')]: {
		paddingLeft: SIDE_NAV_WIDTH,
	},
}));

const VerticalLayoutContainer = styled('div')({
	display: 'flex',
	flex: '1 1 auto',
	flexDirection: 'column',
	width: '100%',
});

interface VerticalLayoutProps {
	children?: ReactNode;
	navColor?: NavColor;
	sections?: Section[];
}

export const VerticalLayout: FC<VerticalLayoutProps> = (props) => {
	const { children, sections, navColor } = props;
	const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
	const mobileNav = useMobileNav();

	const { data: session } = useSession();
	const { user } = useUser({ userId: session?.user.id });
	const [bannerOpen, setBannerOpen] = useState(false);
	const [numOfCurrentQuarterClasses, setNumOfCurrentQuarterClasses] = useState(0);
	const router = useRouter();

	const closeBanner = () => {
		setBannerOpen(false);
		localStorage.setItem('bannerShown', 'true');
	};

	useEffect(() => {
		if (user?.classes) {
			const currentQuarterClasses = user.classes.filter((c) => c.quarter === availableQuarters[0]);
			setNumOfCurrentQuarterClasses(currentQuarterClasses.length);
		}
	}, [user]);

	useEffect(() => {
		const bannerShown = localStorage.getItem('bannerShown');
    console.log('bannerShown', bannerShown, numOfCurrentQuarterClasses);
		if (!bannerShown && numOfCurrentQuarterClasses < 1) {
			setBannerOpen(true);
		} else {
			setBannerOpen(false);
		}
	}, [numOfCurrentQuarterClasses]);

	return (
		<>
			{bannerOpen && (
				<TrapFocus open disableAutoFocus disableEnforceFocus>
					<Fade appear={false} in={bannerOpen}>
						<Paper
							role="dialog"
							aria-modal="false"
							aria-label="Cookie banner"
							square
							variant="outlined"
							tabIndex={-1}
							sx={{
								zIndex: 9999,
								position: 'fixed',
								top: 0,
								left: 0,
								right: 0,
								m: 0,
								p: 2,
								borderWidth: 0,
								borderTopWidth: 1,
							}}>
							<Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 2, paddingX: 2 }}>
								<Box sx={{ flexShrink: 1, alignSelf: { xs: 'flex-start', sm: 'center' } }}>
									<Typography sx={{ fontWeight: 'bold' }}>
										Join classes to meet your future best friends
									</Typography>
									{/* <Typography variant="body2">
										example.com relies on cookies to improve your experience.
									</Typography> */}
								</Box>
								<Stack
									direction={{
										xs: 'row-reverse',
										sm: 'row',
									}}
									sx={{
										gap: 2,
										flexShrink: 0,
										alignSelf: { xs: 'flex-end', sm: 'center' },
									}}>
									<Button
										size="small"
										onClick={() => {
											router.push('/classes');
											setBannerOpen(false);
											localStorage.setItem('bannerShown', 'true');
										}}
										variant="contained">
										Join Classes
									</Button>
									<Button size="small" onClick={closeBanner}>
										Later
									</Button>
								</Stack>
							</Stack>
						</Paper>
					</Fade>
				</TrapFocus>
			)}

			<TopNav onMobileNavOpen={mobileNav.handleOpen} />
			{lgUp && <SideNav color={navColor} sections={sections} />}
			{!lgUp && (
				<MobileNav color={navColor} onClose={mobileNav.handleClose} open={mobileNav.open} sections={sections} />
			)}
			<VerticalLayoutRoot>
				<VerticalLayoutContainer>{children}</VerticalLayoutContainer>
			</VerticalLayoutRoot>
		</>
	);
};

VerticalLayout.propTypes = {
	children: PropTypes.node,
	navColor: PropTypes.oneOf<NavColor>(['blend-in', 'discreet', 'evident']),
	sections: PropTypes.array,
};
