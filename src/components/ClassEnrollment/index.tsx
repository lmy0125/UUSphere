import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { ClassSearch } from '@/components/ClassEnrollment/ClassSearch';
import { ClassTable } from '@/components/ClassEnrollment/ClassTable';
import axios from 'axios';
import useSWR from 'swr';
import { ClassInfo } from '@/types/class';

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

	const handlePageChange = useCallback((event: MouseEvent<HTMLButtonElement> | null, page: number): void => {
		setState((prevState) => ({
			...prevState,
			page,
		}));
	}, []);

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
		searchState.filters.name ? `/api/classes?name=${searchState.filters.name}&quarter=${quarter}` : null,
		fetcher
	);
	if (error) {
		console.error('Failed to get classes', error);
		return { classes: [], classesCount: 0, isLoading: isLoading };
	}
	if (isLoading) {
		return { classes: [], classesCount: 0, isLoading: isLoading };
	}

	const classes: ClassInfo[] = data?.map((obj: any) => {
		const { courseId, professorId, course, ...rest } = obj;
		rest.name = obj.course.name;
		rest.instructor = obj.instructor.name;
		rest.description = obj.course.description;
		return rest;
	});

	if (classes) {
		classes.sort((a: ClassInfo, b: ClassInfo) => {
			const aCode = a.code.split(' ')[1].match(/^(\d+)([A-Za-z]*)$/) ?? '';
			const bCode = b.code.split(' ')[1].match(/^(\d+)([A-Za-z]*)$/) ?? '';
			const aNum = parseInt(aCode[1], 10);
			const bNum = parseInt(bCode[1], 10);
			// Compare numeric parts
			if (aNum !== bNum) {
				return aNum - bNum;
			}

			const alphaA = aCode[2] || ''; // Ensure there's a fallback if no alphabetic part
			const alphaB = bCode[2] || '';
			return alphaA.localeCompare(alphaB);
		});
	}

	return {
		classes: classes,
		classesCount: classes?.length,
		isLoading: isLoading,
	};
};

export default function ClassEnrollment({ quarter }: { quarter: string }) {
	const classSearch = useClassSearch();
	const classStore = useClassStore(classSearch.state, quarter);

	useEffect(() => {
		classSearch.handlePageChange(null, 0);
	}, [quarter]);

	return (
		<>
			<ClassSearch onFiltersChange={classSearch.handleFiltersChange} data-isloading={classStore.isLoading} />
			<ClassTable
				onPageChange={classSearch.handlePageChange}
				onRowsPerPageChange={classSearch.handleRowsPerPageChange}
				items={classStore.classes}
				count={classStore.classes?.length}
				page={classSearch.state.page}
				rowsPerPage={classSearch.state.rowsPerPage}
			/>
		</>
	);
}
