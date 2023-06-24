import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Check if user is authenticated
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ message: 'Unauthorized.' });
	}

	const email = session.user?.email ?? '';
	const sectionId = req.body.sectionId;
	
	if (req.method === 'POST') {
		try {
			const updatedUser = await prisma.user.update({
				where: {
					email: email,
				},
				data: {
					sections: {
						disconnect: {
							id: sectionId,
						},
					},
				},
			});
			console.log("drop", updatedUser);
			res.status(200).json(updatedUser);
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
