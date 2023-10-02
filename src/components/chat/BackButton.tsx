import { useChatStackContext } from '@/contexts/ChatStackContext';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { IconButton, useMediaQuery, Theme } from '@mui/material';

const BackButton = ({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	if (!smUp) {
		return (
			<IconButton onClick={() => setOpen(false)}>
				<ArrowBackIosNewOutlinedIcon />
			</IconButton>
		);
	}
	return <></>;
};
export default BackButton;
