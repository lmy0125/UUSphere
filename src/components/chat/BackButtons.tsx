import { useChatStackContext } from '@/contexts/ChatStackContext';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { IconButton, useMediaQuery, Theme } from '@mui/material';

export const BackToChannelListButton = () => {
	const { setShowChannel } = useChatStackContext();
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	if (!smUp) {
		return (
			<IconButton onClick={() => setShowChannel(false)}>
				<ArrowBackIosNewOutlinedIcon />
			</IconButton>
		);
	}
	return <></>;
};

export const BackToChannelButton = () => {
	const { setShowInfoSidebar } = useChatStackContext();
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	if (!smUp) {
		return (
			<IconButton onClick={() => setShowInfoSidebar(false)}>
				<ArrowBackIosNewOutlinedIcon />
			</IconButton>
		);
	}
	return <></>;
};
