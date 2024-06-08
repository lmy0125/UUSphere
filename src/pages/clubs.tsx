// import React, { useState } from 'react';
// import type { Page as PageType } from '@/types/page';
// import { Layout as DashboardLayout } from '@/layouts/dashboard';
// import {
// 	Box,
// 	Button,
// 	CircularProgress,
// 	Container,
// 	Stack,
// 	Typography,
// 	Tabs,
// 	Tab,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { CreateForm } from '@/components/Club/CreateForm';
// import { Explore } from '@/components/Club/Explore';
// import { Feed } from '@/components/Club/Feed';
// import { MyClubs } from '@/components/Club/MyClubs';

// const tabs = [
// 	{ label: 'Explore', value: 'explore' },
// 	{ label: 'Feed', value: 'feed' },
// 	{ label: 'My Clubs', value: 'myClubs' },
//     { label: '', value: '' },   // for the create form
// ];

// const ClubsPage: PageType = () => {
// 	const [curTab, setCurTab] = useState<String>('explore');
// 	// const tabs = ['Explore', 'Feed', 'My Clubs'];
// 	console.log(curTab);
// 	return (
// 		<>
// 			<Box
// 				component="main"
// 				sx={{
// 					flexGrow: 1,
// 					pb: 8,
// 					mt: 1,
// 				}}>
// 				<Container maxWidth="lg">
// 					<Stack direction="row" justifyContent="space-between" alignItems="center">
// 						<Typography variant="h4">Clubs</Typography>
// 						{/* <Typography variant="subtitle2">
//                             Share anything, anytime, anywhere. Your voice, your platform.
//                         </Typography> */}
// 						<Button
// 							variant="contained"
// 							sx={{ mr: 3 }}
// 							startIcon={<AddIcon />}
// 							onClick={() => setCurTab('create')}>
// 							Create
// 						</Button>
// 					</Stack>
// 					<Tabs
// 						indicatorColor="primary"
// 						onChange={(_, value) => setCurTab(value)}
// 						scrollButtons="auto"
// 						// sx={{ px: 1 }}
// 						textColor="primary"
// 						value={curTab == 'create' ? '' : curTab}
// 						variant="scrollable">
// 						{tabs.map((tab, index) => (
// 							<Tab key={index} label={tab.label} value={tab.value} />
// 						))}
// 					</Tabs>
// 					{curTab == 'explore' && <Explore />}
// 					{curTab == 'feed' && <Feed />}
// 					{curTab == 'myClubs' && <MyClubs />}
// 					{curTab == 'create' && <CreateForm />}
// 				</Container>
// 			</Box>
// 		</>
// 	);
// };

// ClubsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// export default ClubsPage;
