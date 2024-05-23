import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			const buildings = await prisma.building.findMany({
				take: 4,
				orderBy: {
					users: {
						_count: 'desc',
					},
				},
				include: {
					users: true, // This line is optional depending on whether you want to fetch user details as well
					_count: {
						select: { users: true },
					},
				},
			});

			res.status(200).json(buildings);
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
