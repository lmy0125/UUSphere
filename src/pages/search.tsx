import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { GetServerSideProps } from 'next';
import prisma from '@/lib/prisma';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import type { Page as PageType } from '@/types/page';
import { Container, Tab, Tabs, Box, Typography } from '@mui/material';
import type { Connection, ConnectionStatus } from '@/types/social';
import ProfileCard from '@/components/ProfileCard';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface TabOption {
	label: string;
	value: string;
}
const tabs: TabOption[] = [
	{
		label: 'All',
		value: 'all',
	},
	{
		label: 'Courses',
		value: 'courses',
	},
	{
		label: 'People',
		value: 'people',
	},
	{
		label: 'Posts',
		value: 'posts',
	},
];

interface SearchResult {
	users: User[];
}

const SearchResultPage: PageType<SearchResult> = ({ users }) => {
	const [currentTab, setCurrentTab] = useState(0);
	const searchParams = useSearchParams();
	const { data: session } = useSession();

	return (
		<Container maxWidth="xl">
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					indicatorColor="primary"
					onChange={(_, value) => setCurrentTab(value)}
					scrollButtons="auto"
					sx={{ px: 3 }}
					textColor="primary"
					value={currentTab}
					variant="scrollable">
					{tabs.map((tab) => (
						<Tab key={tab.value} label={tab.label} />
					))}
				</Tabs>
			</Box>
			<TabPanel value={currentTab} index={0}>
				{users?.map((user) => {
					let status = 'not_connected';
					if (user.id == session?.user.id) {
						status = 'self';
					}
					const connection = {
						id: user.id,
						avatar: user.image,
						commonConnections: 0,
						name: user.name,
						status: status as ConnectionStatus,
					};
					return (
						<Box sx={{ mb: 3 }} key={connection.id}>
							<ProfileCard user={user} connection={connection} />
						</Box>
					);
				})}
			</TabPanel>
			<TabPanel value={currentTab} index={1}>
				Item Two
			</TabPanel>
			<TabPanel value={currentTab} index={2}>
				Item Three
			</TabPanel>
			<TabPanel value={currentTab} index={3}>
				Posts
			</TabPanel>
		</Container>
	);
};

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box sx={{ p: 2 }}>{children}</Box>}
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<SearchResult> = async (context) => {
	const query = context.query.query as string;
	if (!query) {
		return {
			props: { users: [] },
		};
	}

	const users = await prisma.user.findMany({
		where: {
			OR: [
				{ email: { contains: query, mode: 'insensitive' } },
				{ name: { contains: query, mode: 'insensitive' } },
			],
		},
	});

	return {
		props: { users: JSON.parse(JSON.stringify(users)) },
	};
};

SearchResultPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SearchResultPage;
