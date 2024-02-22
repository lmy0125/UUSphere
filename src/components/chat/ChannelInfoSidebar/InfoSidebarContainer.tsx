import { Dispatch, ReactNode, SetStateAction } from 'react';
import {
	Stack,
	Typography,
	Box,
	Divider,
	SwipeableDrawer,
	useMediaQuery,
	Theme,
} from '@mui/material';
import BackButton from '../BackButton';

interface InfoSidebarContainerProps {
	children: ReactNode;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	title?: string;
}

export const InfoSidebarContainer: React.FC<InfoSidebarContainerProps> = ({
	children,
	open,
	setOpen,
	title,
}) => {
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

	if (!smUp) {
		return (
			<SwipeableDrawer
				anchor="right"
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				disableBackdropTransition={!iOS}
				disableDiscovery={iOS}
				PaperProps={{
					sx: { width: '100vw' },
				}}>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{
						px: 2,
						py: 1.5,
					}}>
					<BackButton setOpen={setOpen} />
					<Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
						{title}
					</Typography>
					<Box sx={{ width: 32 }}></Box>
				</Stack>
				<Divider />
				{children}
			</SwipeableDrawer>
		);
	}

	return (
		<>
			{open && (
				<Box
					sx={{
						borderLeft: '1px solid #F2F4F7',
						minWidth: 280,
						width: '25%',
						overflow: 'auto',
						pb: 5,
					}}>
					{children}
				</Box>
			)}
		</>
	);
};
