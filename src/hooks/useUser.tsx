import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { User } from '@/types/User';

export const useUser = ({ userId }: { userId?: string }) => {
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const { data: user, isLoading, mutate } = useSWR<User>(`/api/user/${userId}`, fetcher);
	const { data: allUsers } = useSWR<User[]>(`/api/user`, fetcher);

	const updateUser = async (data: User) => {
		await axios.put(`/api/user/${userId}`, data);
		mutate();
	};

	return { user, allUsers, isLoading, mutate, updateUser };
};
