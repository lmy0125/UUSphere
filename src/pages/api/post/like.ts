import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, body } = req;

	switch (method) {
		case 'POST':
			try {
				const { postId, userId } = body;
				// Check if the user has already liked the post
				const existingLike = await prisma.like.findFirst({
					where: {
						postId,
						userId,
					},
				});

				if (existingLike) {
					// If the like already exists, delete it (unlike)
					await prisma.like.delete({
						where: {
							id: existingLike.id,
						},
					});

					res.status(204).end(); // No content, indicating successful unliking
				} else {
					// Create a new like
					const newLike = await prisma.like.create({
						data: {
							postId,
							userId,
						},
					});

					res.status(201).json(newLike);
				}
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Error liking the post' });
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).json({ message: `HTTP method ${method} is not supported.` });
	}
}
