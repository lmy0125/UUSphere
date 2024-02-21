import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query, body } = req;
	const { postId } = query;
	const session = await getServerSession(req, res, authOptions);

	let post;
	try {
		post = await prisma.post.findUnique({
			where: { id: postId as string },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error fetching post' });
	}

	switch (method) {
		// Get a specific post
		case 'GET':
			if (!post) {
				res.status(404).json({ error: 'Post not found' });
			} else {
				res.status(200).json(post);
			}
			break;
		// Modify a post
		case 'PUT':
			if (post?.userId != session.user.id) {
				return res.status(401).json({ message: 'You are not the author of this post.' });
			}
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
		// Delete a post
		case 'DELETE':
			if (post?.userId != session.user.id) {
				return res.status(401).json({ message: 'You are not the author of this post.' });
			}
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
