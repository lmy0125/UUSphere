import React, { useEffect, useState } from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { useSession } from 'next-auth/react';
import { Box, Button, Container, Grid, Stack, Typography, Fade, Paper } from '@mui/material';
import TrapFocus from '@mui/material/Unstable_TrapFocus';
import axios from 'axios';
import MainBuilidng from '@/components/Building/MainBuilding';
import BuildingCard from '@/components/Building/BuildingCard';
import { BuildingInfo } from '@/types/building';
import { useLocationContext } from '@/contexts/LocationContext';

const GatheringPage: PageType = () => {
	const { nearestBuilding, error, buildingChannel, getPosition } = useLocationContext();

	// request for geolocation
	useEffect(() => {
		getPosition();
	}, []);

	// const [buildings, setBuildings] = useState<BuildingInfo[]>([]);

	// useEffect(() => {
	// 	const getBuildings = async () => {
	// 		const response = await axios.get(`/api/buildings`);
	// 		setBuildings(response.data);
	// 	};
	// 	getBuildings();
	// }, []);

	return (
		<Box
			component="main"
			sx={{
				flexGrow: 1,
				pb: 8,
				mt: 1,
			}}>
			<Container maxWidth="lg">
				<Stack justifyContent="space-between">
					<Typography variant="h4">Meet people in the same building</Typography>
					<Typography variant="subtitle2">You meeting here isn&apos;t mere coincidences.</Typography>
				</Stack>

				<div>
					<p>You are in: {nearestBuilding?.name}</p>
				</div>
				<MainBuilidng />
				{/* <Grid container spacing={4}>
						{buildings.map((building) => (
							<Grid item xs={12} sm={6} key={building.id}>
								<BuildingCard key={building.id} buildingInfo={building} />
							</Grid>
						))}
					</Grid> */}
			</Container>
		</Box>
	);
};

GatheringPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default GatheringPage;
