import React from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { Box, Container, Stack, Typography } from '@mui/material';
import PostAddForm from '@/components/Feed/PostAddForm';
import PostDisplay from '@/components/Feed/PostDisplay';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import useSWR from 'swr';
import { PostDetails } from '@/types/post';

const PlaygroundPage: PageType = () => {
	const { data: session } = useSession();
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const { data: posts, isLoading, mutate } = useSWR<PostDetails[]>(`/api/post`, fetcher);

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
					<Stack >
						<Typography variant="h4">Playground</Typography>
						<Typography variant="subtitle2">Escape. Explore. Experience.</Typography>
					</Stack>
					<Stack spacing={2} sx={{ mt: 2 }}>
						{session && <PostAddForm mutate={mutate} />}
						{posts?.map((post) => (
							<PostDisplay
								key={post.id}
								post={post}
								author={post.author}
								likes={post.likes}
								comments={post.comments}
								isLiked={post.likes.some((obj) => obj.userId === session?.user.id)}
							/>
						))}
					</Stack>
				</Container>
			</Box>
		</>
	);
};

PlaygroundPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PlaygroundPage;
