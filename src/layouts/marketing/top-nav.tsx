import type { FC, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import type { Theme } from '@mui/material';
import {
	Box,
	Button,
	Chip,
	Container,
	IconButton,
	Stack,
	SvgIcon,
	useMediaQuery,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Logo } from '@/components/logo';
import { RouterLink } from '@/components/router-link';
import { usePathname } from '@/hooks/use-pathname';
// import { useWindowScroll } from '@/hooks/use-window-scroll';
import { paths } from '@/paths';
// import { PagesPopover } from './pages-popover';
import { TopNavItem } from './top-nav-item';
import AuthModal from '@/components/AuthModal';
import { AccountButton } from '../dashboard/account-button';

interface Item {
	disabled?: boolean;
	external?: boolean;
	popover?: ReactNode;
	path?: string;
	title: string;
}

const items: Item[] = [
	{
		title: 'Components',
		path: paths.components.index,
	},
	{
		title: 'Pages',
		// popover: <PagesPopover />
	},
	{
		title: 'Docs',
		path: paths.docs,
		external: true,
	},
];

const TOP_NAV_HEIGHT: number = 64;

interface TopNavProps {
	onMobileNavOpen?: () => void;
}

export const TopNav: FC<TopNavProps> = (props) => {
	const [authModal, setAuthModal] = useState(false);
	const { onMobileNavOpen } = props;
	const pathname = usePathname();
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
	const [elevate, setElevate] = useState<boolean>(false);
	const offset = 64;
	const delay = 100;

	const handleWindowScroll = useCallback((): void => {
		if (window.scrollY > offset) {
			setElevate(true);
		} else {
			setElevate(false);
		}
	}, []);

	// useWindowScroll({
	//   handler: handleWindowScroll,
	//   delay
	// });

	return (
		<Box
			component="header"
			sx={{
				left: 0,
				position: 'fixed',
				right: 0,
				top: 0,
				pt: 2,
				zIndex: (theme) => theme.zIndex.appBar,
			}}>
			<Container
				maxWidth="lg"
				sx={{
					backdropFilter: 'blur(6px)',
					backgroundColor: 'transparent',
					borderRadius: 2.5,
					boxShadow: 'none',
					transition: (theme) =>
						theme.transitions.create('box-shadow, background-color', {
							easing: theme.transitions.easing.easeInOut,
							duration: 200,
						}),
					...(elevate && {
						backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
						boxShadow: 8,
					}),
				}}>
				<Stack direction="row" spacing={2} sx={{ height: TOP_NAV_HEIGHT }}>
					<Stack alignItems="center" direction="row" spacing={1} sx={{ flexGrow: 1 }}>
						<Stack
							alignItems="center"
							component={RouterLink}
							direction="row"
							display="inline-flex"
							href={paths.index}
							spacing={1}
							sx={{ textDecoration: 'none' }}>
							<Logo width={122} height={54} />

							{/* <Box
								sx={{
									color: 'text.primary',
									fontFamily: "'Plus Jakarta Sans', sans-serif",
									fontSize: 18,
									fontWeight: 800,
									letterSpacing: '0.3px',
									lineHeight: 2.5,
									'& span': {
										color: 'primary.main',
									},
								}}>
								UUSphere
							</Box> */}
						</Stack>
					</Stack>
					{mdUp && (
						<Stack alignItems="center" direction="row" spacing={2}>
							<Box component="nav" sx={{ height: '100%' }}>
								<Stack
									component="ul"
									alignItems="center"
									justifyContent="center"
									direction="row"
									spacing={1}
									sx={{
										height: '100%',
										listStyle: 'none',
										m: 0,
										p: 0,
									}}>
									{/* <>
                    {items.map((item) => {
                      const checkPath = !!(item.path && pathname);
                      const partialMatch = checkPath ? pathname.includes(item.path!) : false;
                      const exactMatch = checkPath ? pathname === item.path : false;
                      const active = item.popover ? partialMatch : exactMatch;

                      return (
                        <TopNavItem
                          active={active}
                          external={item.external}
                          key={item.title}
                          path={item.path}
                          popover={item.popover}
                          title={item.title}
                        />
                      );
                    })}
                  </> */}
								</Stack>
							</Box>
						</Stack>
					)}
					<Stack
						alignItems="center"
						direction="row"
						justifyContent="flex-end"
						spacing={2}
						sx={{ flexGrow: 1 }}>
						<AccountButton />
						<AuthModal open={authModal} setAuthModal={setAuthModal} />
						{/* {!mdUp && (
              <IconButton onClick={onMobileNavOpen}>
                <SvgIcon fontSize="small">
                  <Menu01Icon />
                </SvgIcon>
              </IconButton>
            )} */}
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
};

TopNav.propTypes = {
	onMobileNavOpen: PropTypes.func,
};
