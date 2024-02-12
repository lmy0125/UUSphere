import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { Box, Container, Card, Stack, Typography } from '@mui/material';
import useSWR from 'swr';
import axios from 'axios';
import { ClassroomFilters, ClassroomIdleTimes } from '@/types/classroom';
import { ClassroomTable } from '@/components/IdleClassrooms/ClassroomTable';
import { ClassroomSearch } from '@/components/IdleClassrooms/ClassroomSearch';

interface ClassroomSearchState {
	filters: ClassroomFilters;
	page: number;
	rowsPerPage: number;
}

const useClassroomSearch = () => {
	const now = new Date();
	const day = now.getDay();
	const hours = now.getHours(); // 0-23
	const minutes = now.getMinutes(); // 0-59

	const [state, setState] = useState<ClassroomSearchState>({
		filters: {
			name: '',
			day: day,
			startTime: hours + ':' + minutes,
			endTime: hours + ':' + minutes,
		},
		page: 0,
		rowsPerPage: 5,
	});

	const handleFiltersChange = useCallback((filters: ClassroomFilters): void => {
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

const VacantClassroomsPage: PageType = () => {
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const classroomSearch = useClassroomSearch();
	const filters = classroomSearch.state.filters;
	const { data: classroomsIdleTimes, isLoading } = useSWR<ClassroomIdleTimes[]>(
		`/api/vacantClassrooms?name=${filters.name}&day=${filters.day}&startTime=${filters.startTime}&endTime=${filters.endTime}`,
		fetcher
	);

	return (
		<>
			{/* <Seo title="Dashboard: Social Feed" /> */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pb: 8,
					mt: 1,
				}}>
				<Container maxWidth="lg">
					<Stack spacing={2}>
						<div>
							<Typography variant="h4">Vacant Classrooms</Typography>
							<Typography variant="subtitle2">
								Discover vacant classrooms for peaceful study sessions.
							</Typography>
							<Typography variant="subtitle2" color="text.secondary">
								The information below is derived from the class schedules listed on WebReg.
								Please note that other events may take place in these classrooms.
							</Typography>
						</div>

						<Card>
							<ClassroomSearch
								data-isloading={isLoading}
								onFiltersChange={classroomSearch.handleFiltersChange}
								day={filters.day}
							/>
							<ClassroomTable
								onPageChange={classroomSearch.handlePageChange}
								onRowsPerPageChange={classroomSearch.handleRowsPerPageChange}
								items={classroomsIdleTimes ?? []}
								count={classroomsIdleTimes?.length}
								page={classroomSearch.state.page}
								rowsPerPage={classroomSearch.state.rowsPerPage}
								day={filters.day}
							/>
						</Card>
					</Stack>
				</Container>
			</Box>
		</>
	);
};

VacantClassroomsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default VacantClassroomsPage;
