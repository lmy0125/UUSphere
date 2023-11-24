import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import {
	Container,
	CircularProgress,
	Box,
	Button,
	Stack,
	Tabs,
	Tab,
	Typography,
} from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';
import { paths } from '@/paths';
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
	const [quarterIndex, setQuarterIndex] = useState(0);
	const quarters = ['WI24', 'FA23'];
	const router = useRouter();
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	let { data: mutualClassmates, isLoading } = useSWR<MutualClassmates>(
		status === 'authenticated'
			? `/api/mutualClassmates?quarter=${quarters[quarterIndex]}`
			: null,
		fetcher
	);

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

	if (status === 'loading' || isLoading) {
		return (
			<Container maxWidth="xl" sx={{ mt: 1 }}>
				<Typography variant="h4">Mutual Classmates</Typography>
				<Typography variant="subtitle2">
					Students who take more than one same classes as you
				</Typography>
				<Stack sx={{ alignItems: 'center', mt: 8 }}>
					<CircularProgress />
				</Stack>
			</Container>
		);
	}

	if (status === 'unauthenticated') {
		return (
			<Container maxWidth="xl" sx={{ mt: 1 }}>
				<Typography variant="h4">Mutual Classmates</Typography>
				<Typography variant="subtitle2">
					Students who take more than one same classes as you
				</Typography>
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
		<Container maxWidth="xl" sx={{ mt: 1, pb: 8 }}>
			<Stack spacing={2}>
				<div>
					<Typography variant="h4">Mutual Classmates</Typography>
					<Typography variant="subtitle2">
						Students who take more than one same classes as you
					</Typography>
				</div>
				<Box>
					<Tabs
						indicatorColor="primary"
						onChange={(_, value) => setQuarterIndex(value)}
						scrollButtons="auto"
						sx={{ px: 3 }}
						textColor="primary"
						value={quarterIndex}
						variant="scrollable">
						<Tab key={0} label="WI24" />
						<Tab key={1} label="FA23" />
					</Tabs>
				</Box>
				{Object.entries(mutualClassmates).length === 0 && !isLoading && (
					<Stack sx={{ alignItems: 'center' }}>
						<Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
							You have no mutual classmates yet.
						</Typography>
						<Button variant="contained" onClick={() => router.push(paths.index)}>
							Join Classes
						</Button>
					</Stack>
				)}
				{Object.entries(mutualClassmates ?? {}).map(([key, value]) => {
					let status = 'not_connected';
					const connection = {
						id: key,
						avatar: value.user.image,
						commonConnections: 0,
						name: value.user.name,
						status: status as ConnectionStatus,
					};
					return <ProfileCard key={key} user={value.user} connection={connection} />;
				})}
			</Stack>
		</Container>
	);
};

MutualClassmatesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MutualClassmatesPage;
