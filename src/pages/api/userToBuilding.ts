import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		try {
			const userId = req.body.userId;
			const buildingId = req.body.buildingId;
			let users;
			if (buildingId == null || buildingId == '') {
				users = await prisma.user.update({
					where: { id: userId },
					data: { buildingId: null },
				});
			} else {
				users = await prisma.user.update({
					where: { id: userId },
					data: { building: { connect: { id: buildingId } } },
				});
			}

			res.status(200).json(users);
		} catch (e) {
			res.status(500).json({ message: 'Failed to change building for user.' });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['POST']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
