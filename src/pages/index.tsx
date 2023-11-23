import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import {
	Box,
	Card,
	Container,
	Stack,
	Typography,
	FormControl,
	Select,
	InputLabel,
	MenuItem,
} from '@mui/material';
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

interface Filters {
	name?: string;
}

interface ClassSearchState {
	filters: Filters;
	page: number;
	rowsPerPage: number;
}

const useClassSearch = () => {
	const [state, setState] = useState<ClassSearchState>({
		filters: {
			name: undefined,
		},
		page: 0,
		rowsPerPage: 5,
	});

	const handleFiltersChange = useCallback((filters: Filters): void => {
		setState((prevState) => ({
			...prevState,
			filters,
			page: 0,
		}));
	}, []);

	const handlePageChange = useCallback(
		(event: MouseEvent<HTMLButtonElement> | null, page: number): void => {
			setState((prevState) => ({
				...prevState,
				page,
			}));
		},
		[]
	);

	const handleRowsPerPageChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		setState((prevState) => ({
			...prevState,
			rowsPerPage: parseInt(event.target.value, 10),
		}));
	}, []);

	return {
		handleFiltersChange,
		handlePageChange,
		handleRowsPerPageChange,
		state,
	};
};

const useClassStore = (searchState: ClassSearchState, quarter: string) => {
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const { data, error, isLoading } = useSWR(
		searchState.filters.name
			? `/api/classes?name=${searchState.filters.name}&quarter=${quarter}`
			: null,
		fetcher
	);
	if (error) {
		console.error('Failed to get classes', error);
		return { classes: [], classesCount: 0 };
	}
	if (isLoading) {
		return { classes: [], classesCount: 0 };
	}

	const classes = data?.map((obj: any) => {
		const { courseId, professorId, course, ...rest } = obj;
		rest.name = obj.course.name;
		rest.instructor = obj.instructor.name;
		rest.description = obj.course.description;
		return rest;
	});

	return {
		classes: classes,
		classesCount: classes?.length,
	};
};

const ClassEnrollmentPage: PageType = () => {
	const { data: session } = useSession();
	const [quarter, setQuarter] = useState('WI24');
	const classSearch = useClassSearch();
	const classStore = useClassStore(classSearch.state, quarter);

	useEffect(() => {
		classSearch.handlePageChange(null, 0);
	}, [quarter]);
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
								<Select
									value={quarter}
									onChange={(event) => setQuarter(event.target.value)}
									label="Quarter">
									<MenuItem value="FA23">FA 23</MenuItem>
									<MenuItem value="WI24">WI 24</MenuItem>
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
						<Typography variant="subtitle2" color="text.secondary">
							Instructor ratings are currently from ratemyprofessors.com
						</Typography>

						<Card>
							<ClassSearch onFiltersChange={classSearch.handleFiltersChange} />
							<ClassTable
								onPageChange={classSearch.handlePageChange}
								onRowsPerPageChange={classSearch.handleRowsPerPageChange}
								items={classStore.classes}
								count={classStore.classes?.length}
								page={classSearch.state.page}
								rowsPerPage={classSearch.state.rowsPerPage}
							/>
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
