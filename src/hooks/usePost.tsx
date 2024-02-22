import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { PostDetails } from '@/types/post';
import toast from 'react-hot-toast';

export default function usePost() {
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const {
		data: posts,
		isLoading,
		mutate: mutatePost,
	} = useSWR<PostDetails[]>(`/api/post`, fetcher);

	const createPost = async ({
		anonymous,
		content,
		userId,
	}: {
		anonymous: boolean;
		content: string;
		userId: string;
	}) => {
		try {
			await axios.post('/api/post', {
				anonymous,
				content,
				userId,
			});
			mutatePost();
			toast.success('Post created');
		} catch (err) {
			toast.error('Error when creating post');
		}
	};

	const deletePost = async (postId: string) => {
		try {
			await axios.delete(`api/post/${postId}`);
			mutatePost();
			toast.success('Post deleted');
		} catch (err) {
			alert('Failed joinSection ' + err);
			toast.error('Error when deleting post');
		}
	};

	return { posts, isLoading, mutatePost, createPost, deletePost };
}
