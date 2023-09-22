import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { BigHeadAvatar } from '@prisma/client';

type ObjectWithProperties = Record<string, any>;

function excludeProperties<T extends ObjectWithProperties>(obj: T, keysToExclude: string[]): T {
	const result: T = {} as T;
	for (const key in obj) {
		if (obj.hasOwnProperty(key) && !keysToExclude.includes(key)) {
			result[key] = obj[key];
		}
	}
	return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const userId = req.query.id?.toString() ?? '';
		try {
			let user = await prisma.user.findUnique({
				where: {
					id: userId,
				},
				include: {
					bigHeadAvatar: true,
				},
			});
			// exclude id and userId in bigHeadAvatar to match type defined in @/types/User
			if (user && user.bigHeadAvatar) {
				const bigHeadAvatarWithoutId = excludeProperties(user.bigHeadAvatar, ['id', 'userId']);
				user.bigHeadAvatar = bigHeadAvatarWithoutId;
			}
			res.status(200).json(user);
		} catch (e) {
			res.status(500).json({ message: 'Failed to get user.' });
		}
	} else if (req.method === 'PUT') {
		// Check if user is authenticated
		const session = await getServerSession(req, res, authOptions);
		if (!session) {
			return res.status(401).json({ message: 'Unauthorized.' });
		}

		const email = session.user?.email ?? '';
		const data = req.body;
		try {
			const updatedUser = await prisma.user.update({
				where: {
					email: email,
				},
				data: {
					name: data.name,
					gender: data.gender,
					grade: data.grade,
					college: data.college,
					major: data.major,
					homeland: data.homeland,
					bio: data.bio,
					bigHeadAvatar: {
						update: {
							mask: false,
							...data.bigHeadAvatar,
						},
					},
				},
				select: {
					bigHeadAvatar: true,
				},
			});
			res.status(200).json(updatedUser);
		} catch (e) {
			res.status(500).json({ message: 'Failed to update user. ' + e });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['GET', 'PUT']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
