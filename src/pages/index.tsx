import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	Container,
	Link,
	Stack,
	SvgIcon,
	Typography,
} from '@mui/material';
// import { productsApi } from 'src/api/products';
// import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
// import { RouterLink } from 'src/components/router-link';
// import { Seo } from 'src/components/seo';
// import { useMounted } from 'src/hooks/use-mounted';
// import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { paths } from '@/paths';
import { ClassSearch } from '@/components/ClassSearch';
import { ClassTable } from '@/components/ClassTable';
// import type { Page as PageType } from '@/types/page';
import type { Page as PageType } from '@/types/page';
import { ClassInfo } from '@/types/class';
import axios from 'axios';
import useSWR from 'swr';
import Calendar from '@/components/Calendar';

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

interface ClassStoreState {
	classes: ClassInfo[];
	classesCount: number;
}

const useClassStore = (searchState: ClassSearchState) => {
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const { data, error, isLoading } = useSWR(
		`/api/getClasses/?name=${searchState.filters.name}`,
		fetcher
	);
	if (error) {
		console.error('Failed to get classes', error);
		return { classes: [], classesCount: 0 };
	}
	if (isLoading) {
		return { classes: [], classesCount: 0 };
	}

	const classes = data.map((obj: any) => {
		const { courseId, professorId, course, ...rest } = obj;
		rest.name = obj.course.name;
		rest.instructor = obj.instructor.name;
		return rest;
	});

	return {
		classes: classes,
		classesCount: classes.length,
	};
};

const Page: PageType = () => {
	const classSearch = useClassSearch();
	const classStore = useClassStore(classSearch.state);

	// usePageView();

	return (
		<>
			{/* <Seo title="Dashboard: Product List" /> */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pb: 8,
				}}>
				<Container maxWidth="xl">
					<Stack spacing={2}>
						<Stack direction="row" justifyContent="space-between" spacing={4}>
							<Stack spacing={1}>
								<Typography variant="h4">Classes</Typography>
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
						</Stack>
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
					<Calendar />
				</Container>
			</Box>
		</>
	);
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
