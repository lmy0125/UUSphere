import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { StreamChat } from 'stream-chat';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method == 'GET') {
		const session = await getServerSession(req, res, authOptions);
		// console.log(session);
		if (!session) {
			return res.status(401).json({ message: 'Unauthorized.' });
		}
		const user = await prisma.user.findUnique({
			where: {
				email: session.user?.email ?? '',
			},
			select: {
				id: true,
				name: true,
				image: true,
			},
		});
		// console.log(user);
		if (!user) {
			return res.status(401).json({ message: 'No user found.' });
		}
		// Initialize a Server Client
		const serverClient = StreamChat.getInstance(
			'ye8gadqbrbyn',
			'z8zp34zqx3p6a2g9x7xregs8zvunarm9kxdct99j4rurrjew6xdrnsdgsjdnz5et'
		);
		console.log('asdsadas', serverClient);

		// Create User Token
		const token = serverClient.createToken(user?.id);
		serverClient.disconnectUser();
		res.status(200).json({
			user: user,
			token: token,
			z: serverClient,
		});
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
