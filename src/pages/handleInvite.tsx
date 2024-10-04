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
				// Get class info
				const classInfo = await prisma.class.findUnique({
					where: {
						id: channelId as string,
					},
					include: { course: { select: { name: true } }, instructor: { select: { name: true } } },
				});
				if (classInfo) {
					// Join the channel
					const channel = serverClient.channel('classroom', classInfo.id, {
						code: classInfo.code,
						name: classInfo.course?.name ?? undefined,
						instructor: classInfo.instructor,
						quarter: classInfo.quarter,
						created_by_id: session.user?.id,
					});
					await channel.create(); // Create if not exists
					await channel.addMembers([session.user?.id ?? '']);

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
