import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	const userId = req.query.userId?.toString();

	if (req.method === 'GET') {
		try {
			const user = await prisma.user.findUnique({
				where: {
					id: userId,
				},
				include: {
					classes: true,
				},
			});

			let theirClasses: string[] = [];
			user?.classes.forEach((c) => {
				theirClasses.push(c.code);
			});

			if (session) {
				const myself = await prisma.user.findUnique({
					where: {
						id: session.user.id,
					},
					include: {
						classes: true,
					},
				});
				let myClasses: string[] = [];
				myself?.classes.forEach((c) => {
					myClasses.push(c.code);
				});

				const mutualClasses = theirClasses.filter((element) => myClasses.includes(element));

				res.status(200).json({ ...user, mutualClasses: mutualClasses });
			} else {
				res.status(200).json(user);
			}
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
