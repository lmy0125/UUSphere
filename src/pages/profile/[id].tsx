import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { MessageChatSquare, UserPlus02, Edit01 } from '@untitled-ui/icons-react/build/esm';
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
} from '@mui/material';
// import { socialApi } from 'src/api/social';
import { RouterLink } from '@/components/router-link';
// import { Seo } from 'src/components/seo';
import { useMounted } from '@/hooks/use-mounted';
// import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { paths } from '@/paths';
// import { SocialConnections } from 'src/sections/dashboard/social/social-connections';
// import { SocialTimeline } from 'src/sections/dashboard/social/social-timeline';
import type { Page as PageType } from '@/types/page';
import type { Connection, Post, Profile } from '@/types/social';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import Calendar from '@/components/Calendar';
import { useSession } from 'next-auth/react';
import About from '@/components/Profile/About';
import ProfileEditForm from '@/components/Profile/ProfileEditForm';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import axios from 'axios';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const tabs = [
	{ label: 'About', value: 'about' },
	{ label: 'Friends', value: 'friends' },
	{ label: 'Schedule', value: 'schedule' },
	{ label: 'Clubs', value: 'clubs' },
];

// const usePosts = (): Post[] => {
//   const isMounted = useMounted();
//   const [posts, setPosts] = useState<Post[]>([]);

// //   const handlePostsGet = useCallback(
// //     async () => {
// //       try {
// //         const response = await socialApi.getPosts();

// //         if (isMounted()) {
// //           setPosts(response);
// //         }
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     },
// //     [isMounted]
// //   );

//   useEffect(
//     () => {
//     //   handlePostsGet();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   );

//   return posts;
// };

// const useConnections = (search: string = ''): Connection[] => {
//   const [connections, setConnections] = useState<Connection[]>([]);
//   const isMounted = useMounted();

//   const handleConnectionsGet = useCallback(
//     async () => {
//       const response = await socialApi.getConnections();

//       if (isMounted()) {
//         setConnections(response);
//       }
//     },
//     [isMounted]
//   );

//   useEffect(
//     () => {
//       handleConnectionsGet();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [search]
//   );

//   return connections.filter((connection) => {
//     return connection.name?.toLowerCase().includes(search);
//   });
// };

interface ProfileProps {
	initUser: User;
}

export const ProfilePage: PageType<ProfileProps> = ({ initUser }) => {
	const [user, setUser] = useState<User>(initUser);
	const [currentTab, setCurrentTab] = useState<string>('about');
	const [status, setStatus] = useState<string>('not_connected');
	const [profileFormToggle, setProfileFormToggle] = useState(false);
	//   const posts = usePosts();
	const [connectionsQuery, setConnectionsQuery] = useState<string>('');
	//   const connections = useConnections(connectionsQuery);
	const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
	const { data: session } = useSession();
	// const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	// const { data, error } = useSWR('api/user', fetcher);

	useEffect(() => {
		setIsAuthenticatedUser(session?.user.id == user.id);
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

	const handleConnectionsQueryChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>): void => {
			setConnectionsQuery(event.target.value);
		},
		[]
	);

	const showConnect = status === 'not_connected';
	const showPending = status === 'pending';

	// User Id doesn't exist
	if (!initUser) {
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
			{/* <Seo title="Dashboard: Social Profile" /> */}
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
								<Avatar
									src={user.image}
									sx={{
										height: 64,
										width: 64,
									}}
								/>
								<div>
									<Typography color="text.secondary" variant="overline">
										Rookie
									</Typography>
									<Typography
										variant="h6"
										style={{
											display: 'flex',
											justifyContent: 'center',
										}}>
										{user.name}
										{user.gender === 'Male' && (
											<MaleIcon fontSize="small" sx={{ ml: 1 }} />
										)}
										{user.gender === 'Female' && (
											<FemaleIcon fontSize="small" sx={{ ml: 1 }} />
										)}
										{user.gender === 'Non-binary' && (
											<HorizontalRuleIcon fontSize="small" sx={{ ml: 1 }} />
										)}
										{user.verifiedStudent && (
											<Tooltip title="Verified Student" arrow placement="top">
												<HowToRegIcon
													color="success"
													sx={{ ml: 1, height: 22, width: 22 }}
												/>
											</Tooltip>
										)}
									</Typography>
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
											xs: 'none',
										},
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
									<Dialog
										open={profileFormToggle}
										onClose={() => setProfileFormToggle(false)}
										scroll="body">
										<DialogContent>
											<ProfileEditForm
												user={user}
												setProfileFormToggle={setProfileFormToggle}
												setUser={setUser}
											/>
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
											xs: 'none',
										},
									}}>
									{showConnect && (
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
									)}
									<Button
										component={RouterLink}
										href={paths.dashboard.chat}
										size="small"
										startIcon={
											<SvgIcon>
												<MessageChatSquare />
											</SvgIcon>
										}
										variant="contained">
										Send Message
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
						{currentTab === 'about' && (
							<About user={user} setProfileFormToggle={setProfileFormToggle} />
						)}
						{currentTab === 'schedule' && <Calendar />}
					</Box>
				</Container>
			</Box>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (context) => {
	const id = context.query.id as string;

	const user = await prisma.user.findUnique({
		where: {
			id: id,
		},
	});

	return {
		props: { key: String(user?.id), initUser: JSON.parse(JSON.stringify(user)) },
	};
};

ProfilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProfilePage;
