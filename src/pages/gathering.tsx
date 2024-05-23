import React, { useEffect, useState } from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { useSession } from 'next-auth/react';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { supabaseClient } from '@/lib/supabase';
import { schoolBuildings } from '@/constants/buildings';
import { useGeolocated } from 'react-geolocated';
import axios from 'axios';
import MainBuilidng from '@/components/Building/MainBuilding';
import BuildingCard from '@/components/Building/BuildingCard';
import { DbBuilding } from '@/types/building';

interface Location {
	latitude: number;
	longitude: number;
}

const GatheringPage: PageType = () => {
	const [buildings, setBuildings] = useState<DbBuilding[]>([]);
	const [location, setLocation] = useState<Location | null>(null);
	// create two inputs for latitude and longitude
	const [latitude, setLatitude] = useState<number>(0);
	const [longitude, setLongitude] = useState<number>(0);

	const [nearestBuilding, setNearestBuilding] = useState<DbBuilding | undefined>(undefined);
	const [error, setError] = useState<string | null>(null);
	const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true,
		},
		// watchPosition: true,
	});

	const fetchNearestBuilding = async (latitude: number, longitude: number) => {
		try {
			const response = await fetch('/api/nearestBuilding', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ latitude, longitude }),
			});

			if (!response.ok) throw new Error('Failed to fetch the nearest building');

			const data = await response.json();
			setNearestBuilding(data.nearestBuilding);
		} catch (error) {
			console.error(error);
			setError('Failed to communicate with the API');
		}
	};

	// update nearest building when coords change
	// useEffect(() => {
	// 	const fetchLocation = () => {
	// 		if (!isGeolocationAvailable || !isGeolocationEnabled || !coords) {
	// 			setError('Geolocation is not available or not enabled');
	// 			return;
	// 		} else {
	// 			setError(null);
	// 		}
	// 		const { latitude, longitude } = coords;
	// 		setLocation({ latitude: location?.latitude ?? latitude, longitude: location?.longitude ?? longitude });
	// 		fetchNearestBuilding(latitude, longitude);
	// 	};

	// 	fetchLocation();
	// }, [isGeolocationAvailable, isGeolocationEnabled, coords, buildings]);

	useEffect(() => {
		const getBuildings = async () => {
			const response = await axios.get(`/api/buildings`);
			setBuildings(response.data);
			console.log('buildings', response.data);
		};
		getBuildings();
	}, []);

	// console.log('nearestBuilding', nearestBuilding?.name);

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
						<Typography variant="subtitle2">Gather here.</Typography>
					</Stack>

					<form>
						<label>Latitude:</label>
						<input value={latitude} onChange={(e) => setLatitude(Number(e.target.value))} />
						<label>Longitude:</label>
						<input value={longitude} onChange={(e) => setLongitude(Number(e.target.value))} />
						<Button
							type="submit"
							onClick={(e) => {
								e.preventDefault();
								fetchNearestBuilding(latitude, longitude);
							}}>
							Set Location
						</Button>
					</form>

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
								{nearestBuilding ? (
									<p>Nearest Building: {nearestBuilding.name}</p>
								) : (
									<p>Nearest Building: None</p>
								)}
							</>
						)}
					</div>
					{nearestBuilding ? <MainBuilidng building={nearestBuilding} /> : <div>Not able to locate you.</div>}
					<Grid container spacing={2}>
						{buildings.map((building) => (
							<Grid item xs={12} sm={6} md={3}>
								<BuildingCard
									key={building.id}
									buildingId={building.id}
									userBuildingId={nearestBuilding?.id ?? undefined}
								/>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
		</>
	);
};

GatheringPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default GatheringPage;
