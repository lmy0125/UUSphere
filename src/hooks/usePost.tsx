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
		setContent,
		userId,
	}: {
		anonymous: boolean;
		content: string;
		setContent: React.Dispatch<React.SetStateAction<string>>;
		userId: string;
	}) => {
		try {
			await axios.post('/api/post', {
				anonymous,
				content,
				userId,
			});
			mutatePost();
			setContent('');
			toast.success('Post created');
		} catch (err) {
			toast.error('Error when create post');
		}
	};

	const deletePost = async (postId: string) => {
		try {
			await axios.delete(`api/post/${postId}`);
			mutatePost();
            toast.error('Post deleted');
		} catch (err) {
			alert('Failed joinSection ' + err);
			toast.error('Error when delete post');
		}
	};

	return { posts, isLoading, mutatePost, createPost, deletePost };
}
