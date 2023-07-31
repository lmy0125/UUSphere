import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

// return an integer that represents the number of enrolled student in either a class or a section
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			const id = req.query.sectionId?.toString() ?? '';

			if (id == '') {
				res.status(200).json([]);
				return;
			}

			const section = await prisma.section.findUnique({
				where: {
					id: id,
				},
				select: {
					students: true,
				},
			});

			res.status(200).json(section?.students.length);
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
