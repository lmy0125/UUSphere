import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			const buildingId = req.query.id?.toString() ?? '';
			const building = await prisma.building.findUnique({ where: { id: buildingId }, include: { users: true } });
			res.status(200).json(building);
		} catch (e) {
			res.status(500).json({ message: 'Failed to get buildings.' });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
