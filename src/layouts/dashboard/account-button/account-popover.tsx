import type { FC } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
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
	const { chatClient: client } = useChatContext();

	const handleLogOut = async () => {
		signOut();
		client?.disconnectUser();
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
				<Typography
					variant="body1"
					sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
					{user.name}
				</Typography>
				<Typography
					color="text.secondary"
					variant="body2"
					sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
					{user.email}
				</Typography>
			</Box>
			<Divider />
			<Box
				sx={{
					p: 1,
					a: {
						color: 'inherit',
						textDecoration: 'none',
					},
				}}>
				<Link href={`/profile/${user.id}`} passHref legacyBehavior>
					<ListItemButton
						component={RouterLink}
						href={`/profile/${user.id}`}
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
				</Link>
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
