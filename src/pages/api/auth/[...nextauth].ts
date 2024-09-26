import NextAuth from 'next-auth';
// import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
// import nodemailer from 'nodemailer';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { StreamChat } from 'stream-chat';

// const transporter = nodemailer.createTransport({
// 	host: process.env.EMAIL_SERVER_HOST,
// 	port: process.env.EMAIL_SERVER_PORT,
// 	auth: {
// 		user: process.env.EMAIL_SERVER_USER,
// 		pass: process.env.EMAIL_SERVER_PASSWORD,
// 	},
// 	secure: true,
// });

// const emailsDir = path.resolve(process.cwd(), 'emails');

// const sendVerificationRequest = ({ identifier, url }) => {
// 	const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
// 		encoding: 'utf8',
// 	});
// 	const emailTemplate = Handlebars.compile(emailFile);
// 	transporter.sendMail({
// 		from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
// 		to: identifier,
// 		subject: 'Your sign-in link for SupaVacation',
// 		html: emailTemplate({
// 			base_url: process.env.NEXTAUTH_URL,
// 			signin_url: url,
// 			email: identifier,
// 		}),
// 	});
// };

// const sendWelcomeEmail = async ({ user }) => {
// 	const { email } = user;

// 	try {
// 		const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
// 			encoding: 'utf8',
// 		});
// 		const emailTemplate = Handlebars.compile(emailFile);
// 		await transporter.sendMail({
// 			from: `"✨ SupaVacation" ${process.env.EMAIL_FROM}`,
// 			to: email,
// 			subject: 'Welcome to SupaVacation! 🎉',
// 			html: emailTemplate({
// 				base_url: process.env.NEXTAUTH_URL,
// 				support_email: 'support@themodern.dev',
// 			}),
// 		});
// 	} catch (error) {
// 		console.log(`❌ Unable to send welcome email to user (${email})`);
// 	}
// };

function getEmailDomain(email: string): string | null {
	// Use a regular expression to match the domain part of the email address
	const domainMatch = email.match(/@([a-zA-Z0-9.-]+)$/);

	// Check if the regular expression matched and extract the domain
	if (domainMatch && domainMatch.length > 1) {
		return domainMatch[1];
	}

	// If no match is found, return null or handle the case as needed
	return null;
}

export const authOptions = {
	adapter: PrismaAdapter(prisma),
	pages: {
		signIn: '/',
		signOut: '/',
		error: '/',
		verifyRequest: '/',
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }: any) {
			return true; // Default to next-auth default callback behavior
		},
		async session({ session, token, user }: any) {
			const serverClient = StreamChat.getInstance(
				process.env.STREAMCHAT_KEY! as string,
				process.env.STREAMCHAT_SECRET! as string
			);
			// Set verified Student
			const { email } = user;
			const emailDomain = getEmailDomain(email);
			user.verifiedStudent = emailDomain === 'ucsd.edu';
			await prisma.user.update({
				where: {
					email: email,
				},
				data: {
					verifiedStudent: user.verifiedStudent,
				},
			});

			// Check if the user is signing in for the first time
			const userCreationTime = await prisma.user.findUnique({
				where: { id: user.id },
				select: { created_at: true },
			});

			// Consider a user new if their account was created in the last 1 minutes
			const isNewUser =
				userCreationTime && new Date().getTime() - userCreationTime.created_at.getTime() < 1 * 60 * 1000;
			user.isNewUser = isNewUser;

			// Create User Token
			token = serverClient.createToken(user?.id);
			session.streamChatToken = token;
			session.user = user;
			return session;
		},
		async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
			// Allows relative callback URLs
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
	},

	// events: { createUser: sendWelcomeEmail },
};

export default NextAuth(authOptions);
