import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

// return the number of enrolled student in a class and the num of total seat of a class
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			const id = req.query.classId?.toString() ?? '';

			if (id == '') {
				res.status(200).json([]);
				return;
			}

			const c = await prisma.class.findUnique({
				where: {
					id: id,
				},
				select: {
					students: true,
					sections: { select: { total_seats: true } },
				},
			});

			const totalSeats = c?.sections.reduce((acc, item) => acc + item.total_seats, 0);

			res.status(200).json({ numOfStudent: c?.students.length, total_seats: totalSeats });
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
