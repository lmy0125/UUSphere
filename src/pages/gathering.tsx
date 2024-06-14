import React, { useEffect, useState } from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { useSession } from 'next-auth/react';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import axios from 'axios';
import MainBuilidng from '@/components/Building/MainBuilding';
import BuildingCard from '@/components/Building/BuildingCard';
import { BuildingInfo } from '@/types/building';
import { useLocationContext } from '@/contexts/LocationContext';

const GatheringPage: PageType = () => {
	const { nearestBuilding, error, buildingChannel } = useLocationContext();

	const [buildings, setBuildings] = useState<BuildingInfo[]>([]);

	useEffect(() => {
		const getBuildings = async () => {
			const response = await axios.get(`/api/buildings`);
			setBuildings(response.data);
		};
		getBuildings();
	}, []);

	return (
		<>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pb: 8,
					mt: 1,
				}}>
				<Container maxWidth="lg">
					<Stack justifyContent="space-between">
						<Typography variant="h4">Gathering</Typography>
						<Typography variant="subtitle2">You meeting here isn&apos;t mere coincidences.</Typography>
					</Stack>

					<div>
						{error ? (
							<p>Error: {error}</p>
						) : (
							<>
								{/* {location ? (
									<p>
										Latitude: {location.latitude}, Longitude: {location.longitude}
									</p>
								) : (
									<p>Fetching location...</p>
								)} */}
								{nearestBuilding ? <p>You are in: {nearestBuilding.name}</p> : <p>Nearest Building: None</p>}
							</>
						)}
					</div>
					{buildingChannel ? <MainBuilidng /> : <div>You are not near a school building.</div>}
					{/* <Grid container spacing={4}>
						{buildings.map((building) => (
							<Grid item xs={12} sm={6} key={building.id}>
								<BuildingCard key={building.id} buildingInfo={building} />
							</Grid>
						))}
					</Grid> */}
				</Container>
			</Box>
		</>
	);
};

GatheringPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default GatheringPage;
