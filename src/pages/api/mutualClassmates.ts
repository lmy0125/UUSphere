import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Check if user is authenticated
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ message: 'Unauthorized.' });
	}

	const quarter = req.query.quarter?.toString() ?? '';

	if (req.method === 'GET') {
		try {
			const user = await prisma.user.findFirst({
				where: {
					id: session?.user.id,
				},
				select: {
					classes: { where: { quarter: quarter } },
				},
			});

			const mutualClassesCount: Record<
				string,
				{ user: User; mutualClassCount: number; className: string[] }
			> = {};

			// loop through all classes
			for (let c of user?.classes ?? []) {
				const classId = c.id;
				const classInfo = await prisma.class.findUnique({
					where: {
						id: classId,
					},
					select: { id: true, students: true, code: true },
				});

				for (let student of classInfo?.students ?? []) {
					if (student.id != session.user.id) {
						// Increment the count of mutual classes for the current student
						if (mutualClassesCount.hasOwnProperty(student.id)) {
							mutualClassesCount[student.id].mutualClassCount++;
							mutualClassesCount[student.id].className.push(classInfo?.code ?? '');
						} else {
							mutualClassesCount[student.id] = {
								user: student,
								mutualClassCount: 1,
								className: [classInfo?.code ?? ''],
							};
						}
					}
				}
			}

			res.status(200).json(mutualClassesCount);
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['POST']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
