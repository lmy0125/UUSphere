import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, body } = req;
	switch (method) {
		// Get all post
		case 'GET':
			try {
				const posts = await prisma.post.findMany({
					include: { author: true, likes: true, comments: true },
					orderBy: {
						createdAt: 'desc', // Sort by createdAt in descending order (newest first)
					},
				});
				res.status(200).json(posts);
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Error fetching posts' });
			}
			break;
		// Creare a post
		case 'POST':
			// Check if user is authenticated
			const session = await getServerSession(req, res, authOptions);
			if (!session) {
				return res.status(401).json({ message: 'Unauthorized.' });
			}
			try {
				const { anonymous, content, userId } = body;
				const post = await prisma.post.create({
					data: {
						anonymous,
						content,
						author: { connect: { id: userId } },
					},
				});
				res.status(200).json(post);
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Error creating post' });
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).json({ message: `HTTP method ${method} is not supported.` });
	}
}
