import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			let className = req.query.name?.toString().toUpperCase() ?? '';
			className = insertSpaceBeforeNonLetter(className);
			const quarter = req.query.quarter?.toString();
			if (className == '') {
				res.status(200).json([]);
				return;
			}
			const classes = await prisma.class.findMany({
				where: {
					code: {
						contains: `${className}`,
					},
					quarter: quarter,
				},
				include: {
					sections: {
						select: {
							id: true,
							school_id: true,
							code: true,
							total_seats: true,
							meetings: true,
						},
					},
					course: { select: { name: true, description: true } },
					instructor: { select: { name: true } },
				},
			});

			res.status(200).json(classes);
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' + e });
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
