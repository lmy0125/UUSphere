import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			const url: string = 'https://api.producthunt.com/v2/api/graphql';
			// create variable of today's DateTime in YYYY-MM-DD format in PST
			const now = new Date();
			// Convert to PST time zone (-8 hours from UTC)
			// Note: This is a simplified way to convert to PST. For more accuracy, especially with daylight saving time,
			// consider using a library like `moment-timezone` or `date-fns-tz`.
			const pstTime = new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString().split('T')[0];
			console.log(pstTime);
			const graphQLQuery = {
				query: `
                    query Posts {
                        posts(order: VOTES, postedAfter: "${pstTime}") {
                            nodes {
                                description
                                name
                                tagline
                                website
                                votesCount
                                topics {
                                    nodes {
                                        name
                                    }
                                }
                                comments(first: 1) {
                                    nodes {
                                        body
                                    }
                                }
                            }
                            totalCount
                        }
                    }
                `,
			};
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer SvxgEJzeEF15cOHf0bz0DCus38v_P1aLc7LSVwj2iGE', // Include this if your GraphQL API requires authentication
				},
				body: JSON.stringify(graphQLQuery),
			};
			const response = await fetch(url, options);
			const data = await response.json();
			let formattedData = data.data.posts.nodes;
			res.status(200).json(formattedData);
		} catch (e) {
			res.status(500).json({ message: 'Failed to access product hunt.' });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}
