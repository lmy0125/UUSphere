import React from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { Box, Container, Stack, Typography } from '@mui/material';
import PostAddForm from '@/components/Feed/PostAddForm';
import PostDisplay from '@/components/Feed/PostDisplay';

const PlaygroundPage: PageType = () => {
	return (
		<>
			{/* <Seo title="Dashboard: Social Feed" /> */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					pb: 8,
				}}>
				<Container maxWidth="lg">
					<Stack spacing={1}>
						<Typography variant="h4">Here&apos;s what your connections posted</Typography>
					</Stack>
					<Stack spacing={3} sx={{ mt: 3 }}>
						<PostAddForm />
						<PostDisplay isLiked={true} likes={20} />
						{/* {posts.map((post) => (
							<SocialPostCard
								key={post.id}
								authorAvatar={post.author.avatar}
								authorName={post.author.name}
								comments={post.comments}
								createdAt={post.createdAt}
								isLiked={post.isLiked}
								likes={post.likes}
								media={post.media}
								message={post.message}
							/>
						))} */}
					</Stack>
				</Container>
			</Box>
		</>
	);
};

PlaygroundPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PlaygroundPage;
