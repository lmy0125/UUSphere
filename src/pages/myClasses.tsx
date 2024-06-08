// import React, { useState } from 'react';
// import type { Page as PageType } from '@/types/page';
// import { Layout as DashboardLayout } from '@/layouts/dashboard';
// import { Box, CircularProgress, Container, Stack, Typography, Tabs, Tab } from '@mui/material';
// import axios from 'axios';
// import useSWR from 'swr';
// import { useSession } from 'next-auth/react';
// import { availableQuarters } from '@/constants/availableQuarters';

// const TemplatePage: PageType = () => {
// 	const [classIndex, setClassIndex] = useState(0);
// 	const [quarter, setQuarter] = useState();
// 	const { data: session } = useSession();
// 	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
// 	const { data } = useSWR(
// 		`/api/enrolledClasses?userId=${session?.user.id}&quarter=${availableQuarters[2]}`,
// 		fetcher
// 	);
// 	console.log(data);
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
// 					<Stack>
// 						<Typography variant="h4">My Classses</Typography>
// 						{/* <Typography variant="subtitle2">
// 							Share anything, anytime, anywhere. Your voice, your platform.
// 						</Typography> */}
// 					</Stack>
// 					<Tabs
// 						indicatorColor="primary"
// 						onChange={(_, value) => setClassIndex(value)}
// 						scrollButtons="auto"
// 						sx={{ px: 3 }}
// 						textColor="primary"
// 						value={classIndex}
// 						variant="scrollable">
// 						{/* {data?.classes?.map((c, index) => (
// 							<Tab key={index} label={c.code} />
// 						))} */}
// 					</Tabs>
// 				</Container>
// 			</Box>
// 		</>
// 	);
// };

// TemplatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// export default TemplatePage;
