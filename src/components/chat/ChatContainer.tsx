import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Box, SwipeableDrawer, useMediaQuery, Theme } from '@mui/material';
import { useChatStackContext } from '@/contexts/ChatStackContext';

export const ChatContainerStyle = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean;
}>(({ theme, open }) => ({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	overflow: 'hidden',
	[theme.breakpoints.up('sm')]: {
		marginLeft: -380,
	},
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		[theme.breakpoints.up('sm')]: {
			marginLeft: 0,
		},
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

export const ChatContainer = ({ children }: { children: ReactNode }) => {
	const { showChannel, setShowChannel } = useChatStackContext();
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

	if (!smUp) {
		return (
			<SwipeableDrawer
				anchor="right"
				open={showChannel}
				onOpen={() => setShowChannel(true)}
				onClose={() => setShowChannel(false)}
				disableBackdropTransition={!iOS}
				disableDiscovery={iOS}
				PaperProps={{
					sx: { width: '100vw' },
				}}>
				{children}
			</SwipeableDrawer>
		);
	}
	return <ChatContainerStyle open={true}>{children}</ChatContainerStyle>;
};
