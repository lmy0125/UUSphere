import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { useRouter } from 'next/router';
import { MessageChatSquare, Edit01 } from '@untitled-ui/icons-react/build/esm';
import {
	Avatar,
	Box,
	Button,
	Container,
	Divider,
	Stack,
	SvgIcon,
	Tab,
	Tabs,
	Tooltip,
	Typography,
	Dialog,
	DialogContent,
	Skeleton,
} from '@mui/material';
import { useMounted } from '@/hooks/use-mounted';
// import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
// import { SocialConnections } from 'src/sections/dashboard/social/social-connections';
// import { SocialTimeline } from 'src/sections/dashboard/social/social-timeline';
import type { Page as PageType } from '@/types/page';
import { useSession } from 'next-auth/react';
import About from '@/components/Profile/About';
import Schedule from '@/components/Profile/Schedule';
import Clubs from '@/components/Profile/Clubs';
import ProfileEditForm from '@/components/Profile/ProfileEditForm';
import UserAvatar from '@/components/UserAvatar';
import UserBadges from '@/components/UserBadges';
import { useUser } from '@/hooks/useUser';

const tabs = [
	{ label: 'About', value: 'about' },
	{ label: 'Schedule', value: 'schedule' },
	// { label: 'Friends', value: 'friends' },
	// { label: 'Clubs', value: 'clubs' },
];

export const ProfilePage: PageType = () => {
	const { client } = useChatContext();
	const router = useRouter();
	// const [user, setUser] = useState<User>(initUser);
	const [currentTab, setCurrentTab] = useState<string>('about');
	const [status, setStatus] = useState<string>('not_connected');
	const [profileFormToggle, setProfileFormToggle] = useState(false);
	const [connectionsQuery, setConnectionsQuery] = useState<string>('');
	//   const connections = useConnections(connectionsQuery);
	const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
	const { data: session } = useSession();
	const { user, isLoading } = useUser({ userId: router.query.id as string });

	useEffect(() => {
		setIsAuthenticatedUser(session?.user.id == user?.id);
	}, [session, user]);

	//   usePageView();

	const handleConnectionAdd = useCallback((): void => {
		setStatus('pending');
	}, []);

	const handleConnectionRemove = useCallback((): void => {
		setStatus('not_connected');
	}, []);

	const handleTabsChange = useCallback((event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value);
	}, []);

	const handleConnectionsQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		setConnectionsQuery(event.target.value);
	}, []);

	const handleMessageUser = async () => {
		if (client.user && user) {
			const channel = client.channel('messaging', {
				members: [client.user.id, user.id],
			});
			await channel.watch();
			router.push(`/chat?channelId=${channel.id}`);
		}
	};

	const showConnect = status === 'not_connected';
	const showPending = status === 'pending';

	if (isLoading) {
		return (
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pb: 8,
				}}>
				<Container maxWidth="lg">
					<div>
						<Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 5 }}>
							<Stack alignItems="center" direction="row" spacing={2}>
								<Skeleton variant="circular" width={64} height={64} />
								<div>
									<Skeleton variant="text" sx={{ fontSize: '1.4rem' }} width={100} />
									<Skeleton variant="text" sx={{ fontSize: '1.4rem' }} width={100} />
								</div>
							</Stack>
							<Box sx={{ flexGrow: 1 }} />
							<Skeleton variant="rounded" width={140} height={40} />
						</Stack>
					</div>
					<Skeleton variant="rounded" sx={{ mt: 5 }} width="100%" height={40} />
				</Container>
			</Box>
		);
	}

	// User Id doesn't exist
	if (!user) {
		return (
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pb: 8,
				}}>
				<Container maxWidth="lg">
					<h1>User does not exist.</h1>
				</Container>
			</Box>
		);
	}

	return (
		<>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pb: 8,
				}}>
				<Container maxWidth="lg">
					<div>
						{/* <Box
							style={{ backgroundImage: `url(${profile.cover})` }}
							sx={{
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
								backgroundSize: 'cover',
								borderRadius: 1,
								height: 348,
								position: 'relative',
								'&:hover': {
									'& button': {
										visibility: 'visible',
									},
								},
							}}>
							<Button
								startIcon={
									<SvgIcon>
										<Image01Icon />
									</SvgIcon>
								}
								sx={{
									backgroundColor: blueGrey[900],
									bottom: {
										lg: 24,
										xs: 'auto',
									},
									color: 'common.white',
									position: 'absolute',
									right: 24,
									top: {
										lg: 'auto',
										xs: 24,
									},
									visibility: 'hidden',
									'&:hover': {
										backgroundColor: blueGrey[900],
									},
								}}
								variant="contained">
								Change Cover
							</Button>
						</Box> */}
						<Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 5 }}>
							<Stack alignItems="center" direction="row" spacing={2}>
								<UserAvatar userId={router.query.id as string} size={64} />
								<div>
									{/* <Typography color="text.secondary" variant="overline">
										Rookie
									</Typography> */}
									<Stack direction="row" alignItems="center">
										<Typography
											variant="h6"
											style={{
												display: 'flex',
												justifyContent: 'center',
											}}>
											{user.name}
										</Typography>
										<UserBadges user={user} />
									</Stack>
								</div>
							</Stack>
							<Box sx={{ flexGrow: 1 }} />
							{isAuthenticatedUser ? (
								<Stack
									alignItems="center"
									direction="row"
									spacing={2}
									sx={{
										display: {
											md: 'block',
										},
										minWidth: 128,
									}}>
									<Button
										onClick={() => setProfileFormToggle(true)}
										size="small"
										startIcon={
											<SvgIcon>
												<Edit01 />
											</SvgIcon>
										}
										variant="outlined">
										Edit Profile
									</Button>
									<Dialog open={profileFormToggle} onClose={() => setProfileFormToggle(false)} scroll="body">
										<DialogContent>
											<ProfileEditForm user={user} setProfileFormToggle={setProfileFormToggle} />
										</DialogContent>
									</Dialog>
								</Stack>
							) : (
								<Stack
									alignItems="center"
									direction="row"
									spacing={2}
									sx={{
										display: {
											md: 'block',
										},
									}}>
									{/* {showConnect && (
										<Button
											onClick={handleConnectionAdd}
											size="small"
											startIcon={
												<SvgIcon>
													<UserPlus02 />
												</SvgIcon>
											}
											variant="outlined">
											Connect
										</Button>
									)}
									{showPending && (
										<Button
											color="primary"
											onClick={handleConnectionRemove}
											size="small"
											variant="outlined">
											Pending
										</Button>
									)} */}
									<Button
										onClick={handleMessageUser}
										size="small"
										startIcon={
											<SvgIcon>
												<MessageChatSquare />
											</SvgIcon>
										}
										variant="contained">
										Message
									</Button>
								</Stack>
							)}
						</Stack>
					</div>
					<Tabs
						indicatorColor="primary"
						onChange={handleTabsChange}
						scrollButtons="auto"
						sx={{ mt: 5 }}
						textColor="primary"
						value={currentTab}
						variant="scrollable">
						{tabs.map((tab) => (
							<Tab key={tab.value} label={tab.label} value={tab.value} />
						))}
					</Tabs>
					<Divider />
					<Box sx={{ mt: 3 }}>
						{/* {currentTab === 'timeline' && <SocialTimeline posts={posts} profile={profile} />} */}
						{/* {currentTab === 'connections' && (
							<SocialConnections
								connections={connections}
								onQueryChange={handleConnectionsQueryChange}
								query={connectionsQuery}
							/>
						)} */}
						{currentTab === 'about' && <About user={user} setProfileFormToggle={setProfileFormToggle} />}
						{currentTab === 'schedule' && <Schedule userId={router.query.id as string} />}

						{/* {currentTab === 'schedule' && <Calendar userId={router.query.id as string} />} */}
						{/* {currentTab === 'clubs' && <Clubs />} */}
					</Box>
				</Container>
			</Box>
		</>
	);
};

ProfilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProfilePage;
