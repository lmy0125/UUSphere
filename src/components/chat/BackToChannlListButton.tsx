import { useChatMobileContext } from '@/contexts/ChatMobileContext';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { IconButton, useMediaQuery, Theme } from '@mui/material';

const BackToChannelListButton = () => {
	const { setShowChannel } = useChatMobileContext();
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

export default BackToChannelListButton;
