import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Box, SwipeableDrawer, useMediaQuery, Theme } from '@mui/material';
import { useChatStackContext } from '@/contexts/ChatStackContext';

interface InfoSidebarContainerProps {
	children: ReactNode;
}

export const InfoSidebarContainer: React.FC<InfoSidebarContainerProps> = ({ children }) => {
	const { showInfoSidebar, setShowInfoSidebar } = useChatStackContext();
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

	if (!smUp) {
		return (
			<SwipeableDrawer
				anchor="right"
				open={showInfoSidebar}
				onOpen={() => setShowInfoSidebar(true)}
				onClose={() => setShowInfoSidebar(false)}
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
			{showInfoSidebar && (
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
