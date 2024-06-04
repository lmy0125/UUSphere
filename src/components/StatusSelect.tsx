import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Theme, useMediaQuery } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import DiningIcon from '@mui/icons-material/Dining';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import { useUser } from '@/hooks/useUser';
import { useSession } from 'next-auth/react';
import { Status } from '@/types/status';

export const StatusSelect = () => {
	const { data: session } = useSession();
	const { user, updateUser } = useUser({ userId: session?.user.id });
	const [status, setStatus] = useState<Status | undefined>(user?.status as Status);
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	const handleStatusChange = async (newStatus: Status) => {
		setStatus(newStatus);
		if (user) {
			updateUser({ ...user, status: newStatus });
		}
	};

	useEffect(() => {
		setStatus(user?.status as Status);
	}, [user]);

	return (
		<ButtonGroup aria-label="Basic button group">
			{[
				// Array of objects representing each status
				{ icon: <SelfImprovementIcon sx={{ fontSize: 20 }} />, text: Status.Chilling },
				{ icon: <LaptopMacIcon sx={{ fontSize: 20 }} />, text: Status.Studying },
				{ icon: <DiningIcon sx={{ fontSize: 20 }} />, text: Status.Eating },
				{ icon: <HotelIcon sx={{ fontSize: 20 }} />, text: Status.Sleeping },
			].map((s, index) =>
				smUp ? (
					<Button
						key={index}
						variant={s.text == status ? 'contained' : 'outlined'}
						startIcon={s.icon}
						onClick={() => handleStatusChange(s.text)}>
						{s.text}
					</Button>
				) : (
					<Button
						key={index}
						sx={{ px: 2, py: 1 }}
						variant={s.text == status ? 'contained' : 'outlined'}
						onClick={() => handleStatusChange(s.text)}>
						{s.icon}
					</Button>
				)
			)}
		</ButtonGroup>
	);
};
