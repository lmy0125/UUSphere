import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { DbBuilding, MapBuilding } from '@/types/building';

type ResponseData = {
	nearestBuilding?: DbBuilding | undefined; // Define a more precise type based on the API response
	error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	if (req.method === 'POST') {
		const { latitude, longitude } = req.body;
		const apiKey = process.env.GOOGLE_MAPS_API_KEY;

		try {
			// const response = await fetch(url);
			const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Goog-FieldMask': 'places.displayName.text,places.types',
					'X-Goog-Api-Key': apiKey ?? '',
				},
				body: JSON.stringify({
					excludedPrimaryTypes: ['restaurant'],
					maxResultCount: 20,
					locationRestriction: {
						circle: {
							center: {
								latitude,
								longitude,
							},
							radius: 200,
						},
					},
					rankPreference: 'DISTANCE',
					languageCode: 'en',
				}),
			});
			const data = await response.json();
			const mapBuildings = data.places;

			const dbBuildings = await prisma.building.findMany({});
			const nearestBuilding = findMatchBuilding(mapBuildings, dbBuildings);
			res.status(200).json({ nearestBuilding });
		} catch (error) {
			res.status(500).json({ error: 'Failed to fetch nearest building' });
		}
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

function findMatchBuilding(mapBuildings: MapBuilding[], dbBuildings: DbBuilding[]): DbBuilding | undefined {
	for (const building of mapBuildings) {
		const buildingName = building.displayName.text;
		for (const signatureBuilding of dbBuildings) {
			if (buildingName.includes(signatureBuilding.name)) {
				return signatureBuilding;
			}
		}
	}
	return undefined;
}
