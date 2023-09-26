import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query, body } = req;
	const { postId } = query;

	switch (method) {
		case 'GET':
			try {
				const post = await prisma.post.findUnique({
					where: { id: postId as string },
				});
				if (!post) {
					res.status(404).json({ error: 'Post not found' });
				} else {
					res.status(200).json(post);
				}
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Error fetching post' });
			}
			break;
		case 'PUT':
			try {
				const { anonymous, content } = JSON.parse(body);
				const updatedPost = await prisma.post.update({
					where: { id: postId as string },
					data: {
						anonymous,
						content,
					},
				});
				res.status(200).json(updatedPost);
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Error updating post' });
			}
			break;
		case 'DELETE':
			try {
				await prisma.post.delete({
					where: { id: postId as string },
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
