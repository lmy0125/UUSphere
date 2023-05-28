import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			let query = req.query.name?.toString().toUpperCase() ?? '';
			query = insertSpaceBeforeNonLetter(query);
			const classes = await prisma.class_test.findMany({
				where: {
					class_name: {
						contains: `${query}`,
					},
				},
			});

			res.status(200).json(classes);
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}

function insertSpaceBeforeNonLetter(inputString: string) {
	inputString = inputString.replace(/\s/g, '');
	const nonLetterIndex = inputString.search(/[^A-Za-z]/);

	if (nonLetterIndex !== -1) {
		const modifiedString = inputString.split('');
		modifiedString.splice(nonLetterIndex, 0, ' ');
		return modifiedString.join('');
	}

	return inputString;
}
