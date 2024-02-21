import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, SvgIcon } from '@mui/material';
// import AlignLeft02Icon from 'src/icons/untitled-ui/duocolor/align-left-02';
// import BarChartSquare02Icon from 'src/icons/untitled-ui/duocolor/bar-chart-square-02';
// import Building04Icon from 'src/icons/untitled-ui/duocolor/building-04';
// import CalendarIcon from 'src/icons/untitled-ui/duocolor/calendar';
// import CheckDone01Icon from 'src/icons/untitled-ui/duocolor/check-done-01';
// import CreditCard01Icon from 'src/icons/untitled-ui/duocolor/credit-card-01';
// import CurrencyBitcoinCircleIcon from 'src/icons/untitled-ui/duocolor/currency-bitcoin-circle';
// import File01Icon from 'src/icons/untitled-ui/duocolor/file-01';
// import GraduationHat01Icon from 'src/icons/untitled-ui/duocolor/graduation-hat-01';
// import HomeSmileIcon from '@/icons/untitled-ui/duocolor/home-smile';
// import LayoutAlt02Icon from 'src/icons/untitled-ui/duocolor/layout-alt-02';
// import LineChartUp04Icon from 'src/icons/untitled-ui/duocolor/line-chart-up-04';
// import Lock01Icon from 'src/icons/untitled-ui/duocolor/lock-01';
// import LogOut01Icon from 'src/icons/untitled-ui/duocolor/log-out-01';
// import Mail03Icon from 'src/icons/untitled-ui/duocolor/mail-03';
// import Mail04Icon from 'src/icons/untitled-ui/duocolor/mail-04';
// import MessageChatSquareIcon from 'src/icons/untitled-ui/duocolor/message-chat-square';
// import ReceiptCheckIcon from 'src/icons/untitled-ui/duocolor/receipt-check';
// import Share07Icon from 'src/icons/untitled-ui/duocolor/share-07';
// import ShoppingBag03Icon from 'src/icons/untitled-ui/duocolor/shopping-bag-03';
// import ShoppingCart01Icon from 'src/icons/untitled-ui/duocolor/shopping-cart-01';
// import Truck01Icon from 'src/icons/untitled-ui/duocolor/truck-01';
// import Upload04Icon from 'src/icons/untitled-ui/duocolor/upload-04';
// import Users03Icon from 'src/icons/untitled-ui/duocolor/users-03';
// import XSquareIcon from 'src/icons/untitled-ui/duocolor/x-square';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SchoolIcon from '@mui/icons-material/School';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HubIcon from '@mui/icons-material/Hub';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import EmojiPeopleIcon from '@mui/icons-material/Diversity3';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import WifiTetheringOutlinedIcon from '@mui/icons-material/WifiTetheringOutlined';
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { tokens } from '@/locales/tokens';
import { paths } from '@/paths';

export interface Item {
	disabled?: boolean;
	external?: boolean;
	icon?: ReactNode;
	items?: Item[];
	label?: ReactNode;
	path?: string;
	title: string;
}

export interface Section {
	items: Item[];
	subheader?: string;
}

export const useSections = () => {
	const { t } = useTranslation();

	return useMemo(() => {
		return [
			{
				items: [
					{
						title: t(tokens.nav.classes),
						path: paths.classes,
						icon: (
							<SvgIcon fontSize="small">
								<SchoolIcon />
							</SvgIcon>
						),
					},
					{
						title: t(tokens.nav.chat),
						path: paths.chat,
						icon: (
							<SvgIcon fontSize="small">
								<QuestionAnswerIcon />
							</SvgIcon>
						),
					},
					{
						title: t(tokens.nav.mutualClassmates),
						path: paths.mutualClassmates,
						icon: (
							<SvgIcon fontSize="small">
								<ConnectWithoutContactIcon />
							</SvgIcon>
						),
					},

					{
						title: t(tokens.nav.broadcast),
						path: paths.broadcast,
						icon: (
							<SvgIcon fontSize="small">
								<WifiTetheringOutlinedIcon />
							</SvgIcon>
						),
					},
					{
						title: t(tokens.nav.vacantClassrooms),
						path: paths.vacantClassrooms,
						icon: (
							<SvgIcon fontSize="small">
								<ChairAltIcon />
							</SvgIcon>
						),
					},
					{
						title: t(tokens.nav.contact),
						path: paths.contact,
						icon: (
							<SvgIcon fontSize="small">
								<ContactMailIcon />
							</SvgIcon>
						),
					},

					// {
					// 	title: t(tokens.nav.test),
					// 	path: paths.test,
					// 	icon: (
					// 		<SvgIcon fontSize="small">
					// 			<EmojiPeopleIcon />
					// 		</SvgIcon>
					// 	),
					// },
				],
			},
		];
	}, [t]);
};
