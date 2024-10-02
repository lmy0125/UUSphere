import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { ChannelFilters, DefaultGenerics, StreamChat } from 'stream-chat';
import prisma from '@/lib/prisma';

const MiddlewarePage = () => {
	return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	// Retrieve the session to check if the user is authenticated
	const session = await getSession(context);

	if (!session) {
		// If no session exists, redirect to the login page
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const { query } = context; // Extract query parameters from context
	const { c: channelId, s: sectionId } = query;

	try {
		const serverClient = StreamChat.getInstance(
			process.env.NEXT_PUBLIC_STREAMCHAT_KEY! as string,
			process.env.STREAMCHAT_SECRET! as string
		);
		// create the user if it is not in the chat db yet
		const { created_at, emailVerified, ...chatUser } = session.user;
		await serverClient.upsertUser(chatUser);

		const handleJoinChannel = async () => {
			try {
				const filter = { type: 'classroom', id: { $eq: channelId as string } };

				const channels = await serverClient?.queryChannels(filter as ChannelFilters<DefaultGenerics>);
				const channel = channels[0];

				// add user to the channel
				await channel.addMembers([session.user.id]); // join corresponding class

				// check if user is already in the class
				const user = await prisma.user.findUnique({
					where: {
						email: session.user.email,
					},
					select: {
						classes: true,
					},
				});
				const hasClass = user?.classes?.some((c) => c.id == channelId) ?? false;
				if (hasClass) {
					return;
				} else {
					// join corresponding class
					await prisma.user.update({
						where: {
							email: session.user.email,
						},
						data: {
							sections: {
								connect: {
									id: sectionId as string,
								},
							},
							classes: {
								connect: {
									id: channelId as string,
								},
							},
						},
					});
				}
			} catch (error) {
				console.error('Failed to join channel:', error);
			}
		};

		if (session.user.verifiedStudent) {
			handleJoinChannel();
		}

		// After completing the operations, redirect the user to the desired page
		return {
			redirect: {
				destination: `/chat?channelId=${channelId}&isNew=${session.user.isNewUser}`, // Replace with your desired destination page
				permanent: false,
			},
		};
	} catch (error) {
		console.error('Error during the operation:', error);
		// Handle the error and optionally redirect to an error page or show an error message
		return {
			redirect: {
				destination: '/error', // Optional: Redirect to an error page
				permanent: false,
			},
		};
	}
};

export default MiddlewarePage;
