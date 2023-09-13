import React, { useState, useEffect } from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { Container, Tab, Tabs, Box, Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';
import ProfileCard from '@/components/ProfileCard';
import { ConnectionStatus } from '@/types/social';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import AuthModal from '@/components/AuthModal';

interface MutualClassmates {
	[classmateId: string]: {
		user: User;
		mutualClassCount: number;
		className: string[];
	};
}

const MutualClassmatesPage: PageType = () => {
	const { status } = useSession();
	const [authModal, setAuthModal] = useState(false);
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

	if (status === 'loading') {
		return <></>;
	}

	if (status === 'unauthenticated') {
		return (
			<Container maxWidth="xl" sx={{ mt: 2 }}>
				<Typography variant="h4">Mutual Classmates</Typography>
				<Stack sx={{ alignItems: 'center', mt: 8 }}>
					<Button variant="contained" onClick={() => setAuthModal(true)}>
						Please login to use this feature
					</Button>
					<AuthModal open={authModal} setAuthModal={setAuthModal} />
				</Stack>
			</Container>
		);
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
