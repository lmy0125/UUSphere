import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, body } = req;

	switch (method) {
		case 'GET':
			try {
				const comments = await prisma.comment.findMany({
					where: { postId: req.query.postId as string },
					include: { author: true },
					orderBy: {
						createdAt: 'desc', // Sort by createdAt in descending order (newest first)
					},
				});
				res.status(200).json(comments);
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Error fetching posts' });
			}
			break;
		case 'POST':
			try {
				// Check if user is authenticated
				const session = await getServerSession(req, res, authOptions);
				if (!session) {
					return res.status(401).json({ message: 'Unauthorized.' });
				}
				const { content, userId, postId } = body;
				const newComment = await prisma.comment.create({
					data: {
						content,
						author: { connect: { id: userId } },
						post: { connect: { id: postId } },
					},
				});
				res.status(200).json(newComment);
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
