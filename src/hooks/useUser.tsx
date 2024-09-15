import axios from 'axios';
import useSWR from 'swr';
import { User } from '@/types/User';

export const useUser = ({ userId }: { userId?: string }) => {
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const { data: user, isLoading, mutate } = useSWR<User>(`/api/user/${userId}`, fetcher);
	const { data: allUsers } = useSWR<User[]>(`/api/user`, fetcher);

	const updateUser = async (data: User) => {
		let { sections, classes, ...user } = data;
		await axios.put(`/api/user/${userId}`, user);
		mutate();
	};

	return { user, allUsers, isLoading, mutate, updateUser };
};
