import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { CommentDetails } from '@/types/comment';
import toast from 'react-hot-toast';

export default function useComment({ postId }: { postId: string }) {
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const {
		data: comments,
		isLoading,
		mutate: mutateComment,
	} = useSWR<CommentDetails[]>(`/api/comment?postId=${postId}`, fetcher);

	const createComment = async ({ content, userId }: { content: string; userId: string }) => {
		try {
			await axios.post('/api/comment', {
				content,
				userId,
				postId,
			});
			mutateComment();
			toast.success('Comment created');
		} catch (err) {
			toast.error('Error when creating comment');
		}
	};

	const deleteComment = async (commentId: string) => {
		try {
			await axios.delete(`api/post/${commentId}`);
			mutateComment();
			toast.success('Comment deleted');
		} catch (err) {
			alert('Failed joinSection ' + err);
			toast.error('Error when deleting comment');
		}
	};

	return {
		comments,
		isLoading,
		mutateComment,
		createComment,
		deleteComment,
	};
}
