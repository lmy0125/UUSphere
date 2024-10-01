// pages/channels/join/[channelId].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import {
	Typography,
	Button,
	Box,
	CircularProgress,
	Paper,
	Stack,
	Select,
	FormControl,
	InputLabel,
	MenuItem,
} from '@mui/material';
import { useChatContext as useStreamChatContext } from 'stream-chat-react';
import { Channel as ChannelType } from 'stream-chat';
import { CustomStreamChatGenerics } from '@/types/customStreamChat';
import { Logo } from '@/components/Logo';
import AuthModal from '@/components/AuthModal';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { Section } from '@/types/class';

interface InvitePageProps {
	channelId: string;
}

interface SectionWithString extends Section {
	formatString: string;
}

const InvitePage: React.FC<InvitePageProps> = ({ channelId }) => {
	const router = useRouter();
	const { data: session } = useSession();
	const { client: chatClient } = useStreamChatContext<CustomStreamChatGenerics>();
	const [channel, setChannel] = useState<ChannelType<CustomStreamChatGenerics>>();
	const [isJoining, setIsJoining] = useState<boolean>(false);
	const [authModal, setAuthModal] = useState(false);
	const [sections, setSections] = useState<SectionWithString[]>([]);
	const [selectedSection, setSelectedSection] = useState<string>('');

	const handleJoinChannel = async () => {
		setIsJoining(true);
		try {
			// add user to the channel
			await channel?.addMembers([chatClient.user?.id ?? '']); // join corresponding class
			// join corresponding class
			axios.post('/api/joinClass', { sectionId: selectedSection });
			// Redirect to the channel page after successful join
			router.push(`/chat?channelId=${channel?.id}`);
		} catch (error) {
			console.error('Failed to join channel:', error);
		} finally {
			setIsJoining(false);
		}
	};

	useEffect(() => {
		const fetchChannel = async () => {
			const filter = { type: 'classroom', id: { $eq: channelId } };

			const channels = await chatClient?.queryChannels(filter);
			if (channels) {
				setChannel(channels[0]);
			}
		};
		const fetchSections = async () => {
			const response = await axios.get(`/api/class/${channelId}`);
			const sections: Section[] = response.data;

			const getDaysOfWeek = (days: number[]): string => {
				const daysMapping: { [key: number]: string } = {
					1: 'M', // Monday
					2: 'Tu', // Tuesday
					3: 'W', // Wednesday
					4: 'Th', // Thursday
					5: 'F', // Friday
					6: 'Sa', // Saturday
					7: 'Su', // Sunday
				};

				// Map the days to abbreviations and join them as a string
				return days.map((day) => daysMapping[day]).join('');
			};
			const sectionsWithString = sections.map((section) => {
				const { code, meetings } = section;
				const lecture = meetings.filter((meeting) => meeting.type == 'LE')[0];
				let formatString;
				if (!lecture) {
					formatString = `${code}`;
				} else {
					const days = getDaysOfWeek(lecture.daysOfWeek);
					formatString = `${code}: ${days} ${lecture.startTime} -- ${lecture.endTime}`;
				}
				return { ...section, formatString };
			});
			setSections(sectionsWithString);
			setSelectedSection(sectionsWithString[0].id);
		};

		fetchSections();
		fetchChannel();
	}, [channelId]);

	if (sections.length == 0) {
		return null;
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				bgcolor: 'background.default',
			}}>
			{/* Container box with fixed width */}
			<Paper
				elevation={3}
				sx={{
					padding: 6,
					borderRadius: 2,
					minWidth: 380, // Set fixed width
					textAlign: 'center',
				}}>
				<Logo width={122} height={54} />
				<Typography variant="h5" gutterBottom>
					Join Group Chat
				</Typography>
				<Typography variant="h6" gutterBottom>
					{String(channel?.data?.code)}
				</Typography>

				<Box sx={{ m: 1, mt: 3 }}>
					<FormControl sx={{ minWidth: 80 }}>
						<InputLabel id="demo-simple-select-autowidth-label">Section</InputLabel>
						<Select
							labelId="demo-simple-select-autowidth-label"
							id="demo-simple-select-autowidth"
							value={selectedSection}
							onChange={(e) => setSelectedSection(e.target.value as string)}
							autoWidth
							label="Age">
							{sections.map((section) => (
								<MenuItem key={section.id} value={section.id}>
									{section.formatString}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>

				{!session ? (
					<>
						<Button
							variant="contained"
							onClick={() => signIn(undefined, { callbackUrl: `/channels/join/${channel?.id}` })}
							sx={{ mt: 2 }}>
							Login to Join
						</Button>
						<AuthModal open={authModal} setAuthModal={setAuthModal} />
					</>
				) : (
					<Button
						variant="contained"
						color="primary"
						onClick={handleJoinChannel}
						disabled={isJoining}
						sx={{ mt: 2 }}>
						{isJoining ? <CircularProgress size={24} color="inherit" /> : 'Accept and Join'}
					</Button>
				)}
			</Paper>
		</Box>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	// Get the `id` from `context.params`
	const { channelId } = context.params!;

	// You can now use `id` to fetch data or perform other server-side logic
	return {
		props: {
			channelId, // Pass `id` as a prop to the component
		},
	};
};

export default InvitePage;
