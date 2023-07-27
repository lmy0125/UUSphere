import React, { useState, useEffect } from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { Container, Tab, Tabs, Box, Stack, Typography } from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';
import ProfileCard from '@/components/ProfileCard';
import { ConnectionStatus } from '@/types/social';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface MutualClassmates {
	[classmateId: string]: {
		user: User;
		mutualClassCount: number;
		className: string[];
	};
}

const MutualClassmatesPage: PageType = () => {
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	let {
		data: mutualClassmates,
		error,
		isLoading,
	} = useSWR<MutualClassmates>('/api/getMutualClassmates', fetcher);

	function sortByNumOfMutualClass(nestedDict: MutualClassmates) {
		// Filter out entries with at least two common classes
		const filteredEntries = Object.entries(nestedDict).filter(([key, value]) => {
			return value['mutualClassCount'] >= 2;
		});

		const sortedEntries = filteredEntries.sort((a, b) => {
			return b[1]['mutualClassCount'] - a[1]['mutualClassCount'];
		});

		const sortedDict: MutualClassmates = {};
		sortedEntries.forEach(([key, value]) => {
			sortedDict[key] = value;
		});

		return sortedDict;
	}
	mutualClassmates = sortByNumOfMutualClass(mutualClassmates ?? {});

	const { data: session, status } = useSession();
	if (!session && status === 'unauthenticated') {
		return <div>Login First</div>;
	}

	return (
		<Container maxWidth="xl">
			<Stack spacing={2}>
				<Typography variant="h4">Students who take the same class as you</Typography>
				{Object.entries(mutualClassmates ?? {}).map(([key, value]) => {
					let status = 'not_connected';
					const connection = {
						id: key,
						avatar: value.user.image,
						commonConnections: 0,
						name: value.user.name,
						status: status as ConnectionStatus,
					};
					return <ProfileCard key={key} userId={key} connection={connection} />;
				})}
			</Stack>
		</Container>
	);
};

MutualClassmatesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MutualClassmatesPage;
