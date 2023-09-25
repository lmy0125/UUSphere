// pages/api/submitForm.js
import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SERVER_HOST,
	port: process.env.EMAIL_SERVER_PORT,
	auth: {
		user: process.env.EMAIL_SERVER_USER,
		pass: process.env.EMAIL_SERVER_PASSWORD,
	},
	secure: true,
} as SMTPTransport.Options);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Check if user is authenticated
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ message: 'Unauthorized.' });
	}

	if (req.method === 'POST') {
		try {
			// Get form data from the request body
			const { recipientEmail, type, subject, message } = req.body;

			// Define email data
			const mailOptions = {
				from: process.env.EMAIL_SERVER_USER,
				to: process.env.EMAIL_SERVER_USER, // Recipient's email address
				subject: `[Contact: ${type}]${subject}`,
				text: `Name: ${session.user.name}\nEmail: ${recipientEmail}\nMessage: ${message}`,
			};

			// Send the email
			await transporter.sendMail(mailOptions);

			res.status(200).json({ message: 'Email sent successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	} else {
		res.status(405).json({ message: 'Method not allowed' });
	}
}
