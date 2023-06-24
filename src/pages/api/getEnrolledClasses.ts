import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function getEnrolledClasses(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ message: 'Unauthorized.' });
	}

	if (req.method === 'GET') {
		try {
			const sections = await prisma.user.findUnique({
				where: {
					id: session.user.id,
				},
				select: {
					sections: { include: { class: { select: { code: true } }, meetings: true } },
				},
			});
			// console.log(sections);
			res.status(200).json(sections);
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
