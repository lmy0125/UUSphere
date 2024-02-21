import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query, body } = req;
	const { commentId } = query;
	const session = await getServerSession(req, res, authOptions);

	let comment;
	try {
		comment = await prisma.comment.findUnique({
			where: { id: commentId as string },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error fetching comment' });
	}
	switch (method) {
		// Get a specific comment
		case 'GET':
			if (!comment) {
				res.status(404).json({ error: 'Comment not found' });
			} else {
				res.status(200).json(comment);
			}
			break;
		// Modify a comment
		case 'PUT':
			if (comment?.userId != session.user.id) {
				return res.status(401).json({ message: 'You are not the author of this comment.' });
			}
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
		case 'DELETE':
			if (comment?.userId != session.user.id) {
				return res.status(401).json({ message: 'You are not the author of this comment.' });
			}
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
