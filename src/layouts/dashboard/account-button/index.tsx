import type { FC } from 'react';
import { useState } from 'react';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import { Button, Avatar, Box, ButtonBase, SvgIcon } from '@mui/material';
// import { useMockedUser } from '@/hooks/use-mocked-user';
import { usePopover } from '@/hooks/use-popover';
import { AccountPopover } from './account-popover';
import { useSession } from 'next-auth/react';
import AuthModal from '@/components/AuthModal';

export const AccountButton: FC = () => {
	const [authModal, setAuthModal] = useState(false);
	const popover = usePopover<HTMLButtonElement>();
	const { data: session, status } = useSession();
	const user = session?.user;
	
	if (status === 'loading') {
		return (
			<Avatar
				sx={{
					height: 32,
					width: 32,
				}}>
				<SvgIcon>
					<User01Icon />
				</SvgIcon>
			</Avatar>
		);
	}

	if (!user) {
		return (
			<>
				<Button onClick={() => setAuthModal(!authModal)} variant="contained">
					Login
				</Button>
				<AuthModal open={authModal} setAuthModal={() => setAuthModal(false)} />
			</>
		);
	}

	return (
		<>
			<Box
				component={ButtonBase}
				onClick={popover.handleOpen}
				ref={popover.anchorRef}
				sx={{
					alignItems: 'center',
					display: 'flex',
					borderWidth: 2,
					borderStyle: 'solid',
					borderColor: 'divider',
					height: 40,
					width: 40,
					borderRadius: '50%',
				}}>
				<Avatar
					sx={{
						height: 32,
						width: 32,
					}}
					src={user?.image as string | undefined}>
					<SvgIcon>
						<User01Icon />
					</SvgIcon>
				</Avatar>
			</Box>
			<AccountPopover
				anchorEl={popover.anchorRef.current}
				onClose={popover.handleClose}
				open={popover.open}
				user={user}
			/>
		</>
	);
};
