import type { NextApiRequest, NextApiResponse } from 'next';
import ratings from '@mtucourses/rate-my-professors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const instructor = req.query.professor?.toString() ?? '';
	if (req.method === 'GET') {
		try {
			const schools = await ratings.searchSchool('University of California San Diego');
			if (instructor) {
				const split = instructor.split(', ');
				let fullName = instructor;
				if (split.length > 1) {
					const firstName = split[1].split(' ')[0];
					const lastName = split[0];
					fullName = firstName + ' ' + lastName;
				}
				const teachers = await ratings.searchTeacher(fullName, schools[0].id);
				if (teachers.length > 0) {
					const rating = await ratings.getTeacher(teachers[0].id);
					res.status(200).json(rating.avgRating);
				}
			}
			// else {
			res.status(200).json(-1);
			// }
		} catch (e) {
			res.status(500).json({ message: 'Failed to get user. ' + e });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
