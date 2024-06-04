import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		try {
			const userId = req.body.userId;
			const status = req.body.status;

			const user = await prisma.user.update({
				where: { id: userId },
				data: { status: status },
			});

			res.status(200).json(user);
		} catch (e) {
			res.status(500).json({ message: 'Failed to update status for user.', e });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['POST']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
