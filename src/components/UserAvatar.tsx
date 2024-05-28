import axios from 'axios';
import React from 'react';
import useSWR from 'swr';
import { User } from '@/types/User';
import { Avatar, Box, Skeleton } from '@mui/material';
import { BigHead } from '@bigheads/core';

interface UserAvatar {
	userId?: string;
	size?: number;
	border?: React.CSSProperties['border'];
}

export default function UserAvatar({ userId, size, border }: UserAvatar) {
	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const { data: user, isLoading } = useSWR<User>(`/api/user/${userId}`, fetcher);

	if (isLoading) {
		return <Skeleton variant="circular" width={size} height={size} />;
	}

	return (
		<>
			{user?.bigHeadAvatar?.selected ? (
				(() => {
					const { selected, backgroundColor, ...bigHeadStyle } = user.bigHeadAvatar;
					const cleanedBigHeadStyle = Object.fromEntries(
						Object.entries(bigHeadStyle).filter(([key, value]) => value !== null)
					);
					return (
						<Avatar
							sx={{
								height: size,
								width: size,
								backgroundColor: backgroundColor,
								border: border,
							}}>
							<Box sx={{ width: '100%', height: '100%' }}>
								<BigHead {...cleanedBigHeadStyle} />
							</Box>
						</Avatar>
					);
				})()
			) : (
				<Avatar
					src={user?.image}
					sx={{
						height: size,
						width: size,
						border: border,
					}}
				/>
			)}
		</>
	);
}
