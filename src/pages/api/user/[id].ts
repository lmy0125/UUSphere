import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	if (req.method === 'GET') {
		try {
			const user = await prisma.user.findUnique({
				where: {
					id: id as string,
				},
			});

			res.status(200).json(user);
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' + e });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
