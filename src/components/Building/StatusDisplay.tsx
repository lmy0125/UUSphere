import React, { useState, useEffect } from 'react';
import HotelIcon from '@mui/icons-material/Hotel';
import DiningIcon from '@mui/icons-material/Dining';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import { User } from '@/types/User';
import { Button, ButtonGroup, Theme, Paper, Stack, Typography, useMediaQuery } from '@mui/material';
import { Status } from '@/types/status';

export default function StatusDisplay({ users }: { users: User[] | undefined }) {
	console.log(users);
	const [statusCounts, setStatusCount] = useState<Record<Status, number>>();
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	// Function to count users by status
	function countUsersByStatus(users: User[]): Record<Status, number> {
		console.log(users);
		const statusCounts: Record<Status, number> = {
			[Status.Chilling]: 0,
			[Status.Studying]: 0,
			[Status.Eating]: 0,
			[Status.Sleeping]: 0,
		};

		for (const user of users) {
			if (statusCounts[user.status] !== undefined) {
				statusCounts[user.status]++;
			}
		}

		return statusCounts;
	}

	useEffect(() => {
		setStatusCount(countUsersByStatus(users ?? []));
	}, [users]);

	const icons = [
		<SelfImprovementIcon fontSize="large" />,
		<LaptopMacIcon fontSize="large" />,
		<DiningIcon fontSize="large" />,
		<HotelIcon fontSize="large" />,
	];

	return (
		<>
			{statusCounts && (
				<Stack direction="row" spacing={2}>
					{Object.entries(statusCounts).map(([status, count], index) => (
						<Paper key={status} elevation={10} sx={{ p: 1 }}>
							<Stack direction="row" alignItems="center">
								{icons[index]}
								<Typography variant="body2" color="text.priamry">
									{smUp && status + ':'} {count}
								</Typography>
							</Stack>
						</Paper>
					))}
				</Stack>
			)}
		</>
	);
}
