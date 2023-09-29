import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Box, SwipeableDrawer, useMediaQuery, Theme } from '@mui/material';
import { useChatMobileContext } from '@/contexts/ChatMobileContext';

interface InfoSidebarContainerProps {
	children: ReactNode;
	isOpen: boolean;
	setIsChannelInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InfoSidebarContainer: React.FC<InfoSidebarContainerProps> = ({
	children,
	isOpen,
	setIsChannelInfoOpen,
}) => {
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

	if (!smUp) {
		return (
			<SwipeableDrawer
				anchor="right"
				open={isOpen}
				onOpen={() => setIsChannelInfoOpen(true)}
				onClose={() => setIsChannelInfoOpen(false)}
				disableBackdropTransition={!iOS}
				disableDiscovery={iOS}
				PaperProps={{
					sx: { width: '100vw' },
				}}>
				{children}
			</SwipeableDrawer>
		);
	}
    
	return (
		<>
			{isOpen && (
				<Box
					sx={{
						borderLeft: '1px solid #F2F4F7',
						minWidth: 280,
						width: '25%',
					}}>
					{children}
				</Box>
			)}
		</>
	);
};
