import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query } = req;
	const { classId } = query;
	if (method === 'GET') {
		try {
			const c = await prisma.class.findUnique({
				where: { id: classId as string },
				select: { code: true, sections: { include: { meetings: true } }, instructor: { select: { name: true } } },
			});

			res.status(200).json(c);
		} catch (e) {
			res.status(500).json({ message: 'Failed to fetch class: ' + e });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
