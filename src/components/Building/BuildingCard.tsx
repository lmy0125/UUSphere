import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '@prisma/client';
import { supabaseClient } from '@/lib/supabase';
import { useSession } from 'next-auth/react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import DiningIcon from '@mui/icons-material/Dining';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';

interface BuildingInfo {
	id: string;
	name: string;
	users: User[];
}

export default function BuildingCard({
	buildingId,
	userBuildingId,
}: {
	buildingId: string;
	userBuildingId: string | undefined;
}) {
	const { data: session } = useSession();
	const [buildingInfo, setBuildingInfo] = useState<BuildingInfo | null>(null);
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchBuildingInfo = async () => {
			const response = await axios.get(`/api/building?id=${buildingId}`);
			setBuildingInfo(response.data);
			setUsers(response.data.users ?? []);
		};
		fetchBuildingInfo();
	}, []);

	useEffect(() => {
		const buildingChannel = supabaseClient.channel(`building`, {
			config: { presence: { key: buildingId } },
		});
	}, []);

	return (
		<Card sx={{ maxWidth: 'md', width: '100%' }}>
			<CardContent
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					pb: 2,
				}}>
				<div>
					<Typography variant="h6" component="div">
						Acme Building
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Total People: 125
					</Typography>
				</div>
			</CardContent>
			<CardContent
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					gap: 2,
				}}>
				{[
					// Array of objects representing each status
					{ icon: <LaptopMacIcon fontSize="large" />, number: 75, text: 'Studying' },
					{ icon: <SelfImprovementIcon fontSize="large" />, number: 25, text: 'Relaxing' },
					{ icon: <DiningIcon fontSize="large" />, number: 15, text: 'Eating' },
					{ icon: <HotelIcon fontSize="large" />, number: 10, text: 'Sleeping' },
				].map((status) => (
					<Box key={status.text} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
						{status.icon}
						<Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
							{status.number}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{status.text}
						</Typography>
					</Box>
				))}
			</CardContent>
		</Card>
	);
}
