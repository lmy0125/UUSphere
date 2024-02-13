import React from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';
import PostAddForm from '@/components/Feed/PostAddForm';
import PostDisplay from '@/components/Feed/PostDisplay';
import { useSession } from 'next-auth/react';
import usePost from '@/hooks/usePost';

const BroadcastPage: PageType = () => {
	const { data: session, status } = useSession();
	const { posts, isLoading, mutatePost } = usePost();

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
					<Stack>
						<Typography variant="h4">Broadcast</Typography>
						<Typography variant="subtitle2">
							Share anything, anytime, anywhere. Your voice, your platform.
						</Typography>
					</Stack>
					<Stack spacing={2} sx={{ mt: 2 }}>
						{session && <PostAddForm mutate={mutatePost} />}
						{status === 'loading' || isLoading ? (
							<Stack sx={{ alignItems: 'center', mt: 8 }}>
								<CircularProgress />
							</Stack>
						) : (
							posts?.map((post) => (
								<PostDisplay
									key={post.id}
									post={post}
									author={post.author}
									likes={post.likes}
									comments={post.comments}
									isLiked={post.likes.some((obj) => obj.userId === session?.user.id)}
								/>
							))
						)}
					</Stack>
				</Container>
			</Box>
		</>
	);
};

BroadcastPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BroadcastPage;
