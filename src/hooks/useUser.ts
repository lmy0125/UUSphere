import useSWR from 'swr';
import axios from 'axios';

export default function useUser(id: string) {
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const { data, error, isLoading } = useSWR(`/api/user/${id}`, fetcher);

	return {
		data,
		error,
		isLoading,
	};
}
