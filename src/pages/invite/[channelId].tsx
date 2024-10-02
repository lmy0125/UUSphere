// pages/channels/join/[channelId].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
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
import Loading from '@/components/Loading';

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
	const [channelName, setChannelName] = useState<string>('');
	const [professorName, setProfessorName] = useState<string>('');
	const [isJoining, setIsJoining] = useState<boolean>(false);
	const [authModal, setAuthModal] = useState(false);
	const [sections, setSections] = useState<SectionWithString[]>([]);
	const [sectionId, setSectionId] = useState<string>('');

	const handleJoinChannel = async () => {
		setIsJoining(true);
		try {
			// add user to the channel
			await channel?.addMembers([chatClient.user?.id ?? '']); // join corresponding class
			// join corresponding class
			await axios.post('/api/joinClass', { sectionId: sectionId });
			// Redirect to the channel page after successful join
			router.push(`/chat?channelId=${channel?.id}`);
		} catch (error) {
			console.error('Failed to join channel:', error);
		} finally {
			setIsJoining(false);
		}
	};

	const [disabled, setDisabled] = useState(false);
	const signInWithGoogle = () => {
		setDisabled(true);
		// Perform sign in
		signIn('google', { callbackUrl: `/handleInvite?c=${channelId}&s=${sectionId}` });
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
			const className = response.data.code;
			setChannelName(className);
			const instructor = response.data.instructor.name;
			setProfessorName(instructor);

			const sections: Section[] = response.data.sections;

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
			setSectionId(sectionsWithString[0].id);
		};

		fetchSections();
		fetchChannel();
	}, [channelId]);

	if (sections.length == 0) {
		return <Loading />;
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
				<Box sx={{ my: 3 }}>
					<Typography variant="h6" gutterBottom>
						{channelName}
					</Typography>
					<Typography variant="body1" gutterBottom>
						<strong>Instructor:</strong> {professorName}
					</Typography>
				</Box>

				<Box sx={{ m: 1, mt: 3 }}>
					<FormControl sx={{ minWidth: 80 }}>
						<InputLabel id="section-label">Section</InputLabel>
						<Select
							labelId="section-label"
							value={sectionId}
							onChange={(e) => setSectionId(e.target.value as string)}
							autoWidth
							label="Section">
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
							onClick={signInWithGoogle}
							fullWidth
							variant="outlined"
							color="inherit"
							disabled={disabled}
							sx={{
								border: '1px solid rgba(0, 0, 0, .12)',
								boxShadow: '0 2px 4px rgba(0,0,0,.1)',
								mt: 2,
							}}>
							<Image src="/google.svg" alt="Google" width={20} height={20} />
							<Box ml={1}>Continue with Google</Box>
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
