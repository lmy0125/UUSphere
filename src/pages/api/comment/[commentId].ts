import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query, body } = req;
	const { commentId } = query;

	switch (method) {
		// Get a specific comment
		case 'GET':
			try {
				const comment = await prisma.comment.findUnique({
					where: { id: commentId as string },
				});
				if (!comment) {
					res.status(404).json({ error: 'Comment not found' });
				} else {
					res.status(200).json(comment);
				}
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Error fetching comment' });
			}
			break;
		// Modify a comment
		// TODO: Protect this end point so that only author can make changes
		case 'PUT':
			try {
				const { content } = JSON.parse(body);
				const updateComment = await prisma.comment.update({
					where: { id: commentId as string },
					data: {
						content,
					},
				});
				res.status(200).json(updateComment);
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Error updating post' });
			}
			break;
		// Delete a post
		// TODO: Protect this end point so that only author can make changes
		case 'DELETE':
			try {
				await prisma.comment.delete({
					where: { id: commentId as string },
				});
				res.status(204).end();
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Error deleting post' });
			}
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).json({ message: `HTTP method ${method} is not supported.` });
	}
}
