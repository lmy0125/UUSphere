import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Box, Card, Container, Stack, Typography, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
// import { RouterLink } from 'src/components/router-link';
// import { useMounted } from 'src/hooks/use-mounted';
// import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { paths } from '@/paths';
import { ClassSearch } from '@/components/ClassEnrollment/ClassSearch';
import { ClassTable } from '@/components/ClassEnrollment/ClassTable';
import ClassSchedule from '@/components/ClassEnrollment/ClassSchedule';
import type { Page as PageType } from '@/types/page';
import axios from 'axios';
import useSWR from 'swr';
import { ClassEnrollmentContextProvider } from '@/contexts/ClassEnrollmentContext';
import { useSession } from 'next-auth/react';
import { availableQuarters } from '@/constants/availableQuarters';
import { ClassInfo } from '@/types/class';
import ClassEnrollment from '@/components/ClassEnrollment';

const ClassEnrollmentPage: PageType = () => {
	const { data: session } = useSession();
	const [quarter, setQuarter] = useState(availableQuarters[0]);

	// usePageView();

	return (
		<ClassEnrollmentContextProvider>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pb: 8,
				}}>
				<Container maxWidth="xl">
					<Stack spacing={2}>
						<Stack spacing={4} direction="row" alignItems="flex-end">
							<Typography variant="h4">Classes</Typography>
							<FormControl
								variant="standard"
								sx={{
									pb: 0.5,
									minWidth: 80,
									'& .MuiInput-underline': {
										border: 'none !important',
									},
								}}>
								<InputLabel>Quarter</InputLabel>
								<Select value={quarter} onChange={(event) => setQuarter(event.target.value)} label="Quarter">
									{availableQuarters.map((quarter: string, index) => {
										return (
											<MenuItem key={index} value={quarter}>
												{quarter.substring(0, 2)} {quarter.substring(2)}
											</MenuItem>
										);
									})}
									{/* <MenuItem value="FA23">FA 23</MenuItem>
									<MenuItem value="WI24">WI 24</MenuItem> */}
								</Select>
							</FormControl>
							{/* <Breadcrumbs separator={<BreadcrumbsSeparator />}>
									<Link
										color="text.primary"
										component={RouterLink}
										href={paths.dashboard.index}
										variant="subtitle2">
										Dashboard
									</Link>
									<Link
										color="text.primary"
										component={RouterLink}
										href={paths.dashboard.products.index}
										variant="subtitle2">
										Products
									</Link>
									<Typography color="text.secondary" variant="subtitle2">
										List
									</Typography>
								</Breadcrumbs> */}
						</Stack>
						<div>
							<Typography variant="subtitle2">Join classes and meet with your classmates!</Typography>
							{/* <Typography variant="subtitle2" color="text.secondary">
								Instructor ratings are currently fetched from ratemyprofessors.com
							</Typography> */}
						</div>

						<Card>
							<ClassEnrollment quarter={quarter} />
						</Card>
					</Stack>
					<Box sx={{ mt: 4 }}>
						<ClassSchedule userId={session?.user.id ?? ''} quarter={quarter} />
					</Box>
				</Container>
			</Box>
		</ClassEnrollmentContextProvider>
	);
};

ClassEnrollmentPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ClassEnrollmentPage;
