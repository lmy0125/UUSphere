import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, body } = req;

	switch (method) {
		case 'POST':
			try {
				const { commentId, userId } = body;
				// Check if the user has already liked the comment
				const existingLike = await prisma.like.findFirst({
					where: {
						commentId,
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
							commentId,
							userId,
						},
					});

					res.status(201).json(newLike);
				}
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Error liking the comment' });
			}
			break;
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).json({ message: `HTTP method ${method} is not supported.` });
	}
}
