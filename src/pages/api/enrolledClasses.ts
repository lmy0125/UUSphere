import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getEnrolledClasses(req: NextApiRequest, res: NextApiResponse) {
	const userId = req.query.userId?.toString() ?? '';
	const quarter = req.query.quarter?.toString() ?? '';

	if (req.method === 'GET') {
		try {
			const sections = await prisma.user.findUnique({
				where: {
					id: userId,
				},
				select: {
					classes: {
						where: {
							quarter: quarter,
						},
						include: {
							sections: {
								where: {
									students: { some: { id: userId } },
								},
								select: {
									id: true,
									school_id: true,
									code: true,
									total_seats: true,
									meetings: true,
									class: { select: { code: true, instructor: true } },
								},
							},
							course: { select: { name: true } },
							instructor: { select: { name: true } },
						},
					},
				},
			});
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
