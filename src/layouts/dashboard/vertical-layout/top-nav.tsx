import { useState, type FC } from 'react';
import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import type { Theme } from '@mui/material';
import {
	Button,
	ButtonGroup,
	Box,
	IconButton,
	MenuItem,
	Stack,
	NativeSelect,
	SvgIcon,
	useMediaQuery,
	Typography,
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import DiningIcon from '@mui/icons-material/Dining';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import { alpha } from '@mui/material/styles';
import { AccountButton } from '../account-button';
import { Status } from '@/types/status';
// import { ContactsButton } from '../contacts-button';
// import { LanguageSwitch } from '../language-switch';
// import { NotificationsButton } from '../notifications-button';
import SearchBox from '../SearchBox';

const TOP_NAV_HEIGHT: number = 64;
const SIDE_NAV_WIDTH: number = 280;

interface TopNavProps {
	onMobileNavOpen?: () => void;
}

export const TopNav: FC<TopNavProps> = (props) => {
	const { onMobileNavOpen, ...other } = props;
	const [status, setStatus] = useState<string>(Status.Chilling);
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

	const handleStatusChange = (newStatus: string) => {
		setStatus(newStatus);
	};

	return (
		<Box
			component="header"
			sx={{
				backdropFilter: 'blur(6px)',
				backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
				position: 'sticky',
				left: {
					lg: `${SIDE_NAV_WIDTH}px`,
				},
				top: 0,
				width: {
					lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
				},
				zIndex: (theme) => theme.zIndex.appBar,
			}}
			{...other}>
			<Stack
				alignItems="center"
				direction="row"
				justifyContent="space-between"
				spacing={2}
				sx={{
					minHeight: TOP_NAV_HEIGHT,
					px: 2,
					py: 2,
				}}>
				<Stack alignItems="center" direction="row" spacing={2}>
					{!lgUp && (
						<IconButton onClick={onMobileNavOpen}>
							<SvgIcon>
								<Menu01Icon />
							</SvgIcon>
						</IconButton>
					)}
					{smUp && (
						<Typography variant="h4" fontFamily="Roboto">
							UCSD
						</Typography>
					)}
					{/* <SearchBox /> */}
				</Stack>
				<Stack alignItems="center" direction="row" spacing={2}>
					<ButtonGroup aria-label="Basic button group">
						{[
							// Array of objects representing each status
							{ icon: <SelfImprovementIcon sx={{ fontSize: 20 }} />, text: Status.Chilling },
							{ icon: <LaptopMacIcon sx={{ fontSize: 20 }} />, text: Status.Studying },
							{ icon: <DiningIcon sx={{ fontSize: 20 }} />, text: Status.Eating },
							{ icon: <HotelIcon sx={{ fontSize: 20 }} />, text: Status.Sleeping },
						].map((s, index) =>
							smUp ? (
								<Button
									key={index}
									variant={s.text == status ? 'contained' : 'outlined'}
									startIcon={s.icon}
									onClick={() => handleStatusChange(s.text)}>
									{s.text}
								</Button>
							) : (
								<Button
									key={index}
									sx={{ px: 2, py: 1 }}
									variant={s.text == status ? 'contained' : 'outlined'}
									onClick={() => handleStatusChange(s.text)}>
									{s.icon}
								</Button>
							)
						)}
					</ButtonGroup>

					{/* <LanguageSwitch />
          <NotificationsButton />
          <ContactsButton /> */}
					<AccountButton />
				</Stack>
			</Stack>
		</Box>
	);
};

TopNav.propTypes = {
	onMobileNavOpen: PropTypes.func,
};
