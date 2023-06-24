import type { FC } from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import CreditCard01Icon from '@untitled-ui/icons-react/build/esm/CreditCard01';
import Settings04Icon from '@untitled-ui/icons-react/build/esm/Settings04';
import User03Icon from '@untitled-ui/icons-react/build/esm/User03';
import {
	Box,
	Button,
	Divider,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Popover,
	SvgIcon,
	Typography,
} from '@mui/material';
import { RouterLink } from '@/components/router-link';
// import { useAuth } from 'src/hooks/use-auth';
// import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
// import { Issuer } from 'src/utils/auth';
import { signOut } from 'next-auth/react';
import { useChatContext } from '@/contexts/ChatContext';

interface AccountPopoverProps {
	anchorEl: null | Element;
	onClose?: () => void;
	open?: boolean;
	user: {
		id: string;
		email: string;
		name: string;
		image: string;
	};
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
	const { anchorEl, onClose, open, user, ...other } = props;
	const { client } = useChatContext();
	const router = useRouter();
	// const auth = useAuth();
	// const user = useMockedUser();

	// const handleLogout = useCallback(
	//   async (): Promise<void> => {
	//     try {
	//       onClose?.();

	//       switch (auth.issuer) {
	//         case Issuer.Amplify: {
	//           await auth.signOut();
	//           break;
	//         }

	//         case Issuer.Auth0: {
	//           await auth.logout();
	//           break;
	//         }

	//         case Issuer.Firebase: {
	//           await auth.signOut();
	//           break;
	//         }

	//         case Issuer.JWT: {
	//           await auth.signOut();
	//           break;
	//         }

	//         default: {
	//           console.warn('Using an unknown Auth Issuer, did not log out');
	//         }
	//       }

	//       router.push(paths.index);
	//     } catch (err) {
	//       console.error(err);
	//       toast.error('Something went wrong!');
	//     }
	//   },
	//   [auth, router, onClose]
	// );

	const handleLogOut = async () => {
		signOut();
		await client?.disconnectUser();
	};

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{
				horizontal: 'center',
				vertical: 'bottom',
			}}
			disableScrollLock
			onClose={onClose}
			open={!!open}
			PaperProps={{ sx: { width: 200 } }}
			{...other}>
			<Box sx={{ p: 2 }}>
				<Typography variant="body1">{user.name}Name</Typography>
				<Typography color="text.secondary" variant="body2">
					{user.email}
				</Typography>
			</Box>
			<Divider />
			<Box sx={{ p: 1 }}>
				<ListItemButton
					component={RouterLink}
					href={paths.profile}
					onClick={onClose}
					sx={{
						borderRadius: 1,
						px: 1,
						py: 0.5,
					}}>
					<ListItemIcon>
						<SvgIcon fontSize="small">
							<User03Icon />
						</SvgIcon>
					</ListItemIcon>
					<ListItemText primary={<Typography variant="body1">Profile</Typography>} />
				</ListItemButton>
				<ListItemButton
					// component={RouterLink}
					// href={paths.dashboard.account}
					onClick={onClose}
					sx={{
						borderRadius: 1,
						px: 1,
						py: 0.5,
					}}>
					<ListItemIcon>
						<SvgIcon fontSize="small">
							<Settings04Icon />
						</SvgIcon>
					</ListItemIcon>
					<ListItemText primary={<Typography variant="body1">Settings</Typography>} />
				</ListItemButton>
				<ListItemButton
					// component={RouterLink}
					// href={paths.dashboard.index}
					onClick={onClose}
					sx={{
						borderRadius: 1,
						px: 1,
						py: 0.5,
					}}>
					<ListItemIcon>
						<SvgIcon fontSize="small">
							<CreditCard01Icon />
						</SvgIcon>
					</ListItemIcon>
					<ListItemText primary={<Typography variant="body1">Billing</Typography>} />
				</ListItemButton>
			</Box>
			<Divider sx={{ my: '0 !important' }} />
			<Box
				sx={{
					display: 'flex',
					p: 1,
					justifyContent: 'center',
				}}>
				<Button color="inherit" onClick={handleLogOut} size="small">
					Logout
				</Button>
			</Box>
		</Popover>
	);
};

AccountPopover.propTypes = {
	anchorEl: PropTypes.any,
	onClose: PropTypes.func,
	open: PropTypes.bool,
};
