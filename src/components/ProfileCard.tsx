import type { FC } from 'react';
import { useCallback, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import {
	Avatar,
	Box,
	Button,
	Card,
	IconButton,
	Link,
	Stack,
	SvgIcon,
	Typography,
} from '@mui/material';
import type { Connection } from '@/types/social';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import useSWR from 'swr';
import { Class, User } from '@prisma/client';
import { useTheme } from '@mui/material/styles';

interface ProfileCardProps {
	userId: string;
	connection: Connection;
	mutualClasses?: string[];
}

interface ProfileCardInfo extends User {
	classes: Class[];
	mutualClasses: string[];
}

const ProfileCard: FC<ProfileCardProps> = (props) => {
	const theme = useTheme();
	const { connection } = props;
	const [status, setStatus] = useState(connection.status);
	// Todo: check connection status here for add friend functionality
	const { data: session } = useSession();

	const fetcher = (url: string) => axios.get(url).then((res) => res.data);
	const {
		data: profileCardInfo,
		error,
		isLoading,
	} = useSWR<ProfileCardInfo>(`/api/getProfileCardInfo?userId=${props.userId}`, fetcher);

	// put mutual classes at the front of the array
	function sortWithMutualClasses(longerArray: Class[], subsetArray: string[]) {
		// Find common elements between the two arrays
		const commonElements = longerArray.filter((obj) =>
			subsetArray.some((subsetObj) => subsetObj === obj.code)
		);
		// Sort the longer array based on the position of common elements in the subset array
		longerArray.sort((a, b) => {
			const aCommon = commonElements.some((obj) => obj.code === a.code);
			const bCommon = commonElements.some((obj) => obj.code === b.code);
			// If both elements are common, maintain their order in the longer array
			if (aCommon && bCommon) {
				return 0;
			}
			// If only 'a' is common, prioritize it to be before 'b' in the longer array
			if (aCommon) {
				return -1;
			}
			// If only 'b' is common, prioritize it to be before 'a' in the longer array
			if (bCommon) {
				return 1;
			}
			// If neither 'a' nor 'b' are common, maintain their original order
			return 0;
		});
	}
	sortWithMutualClasses(profileCardInfo?.classes ?? [], profileCardInfo?.mutualClasses ?? []);

	const handleConnectionAdd = useCallback((): void => {
		setStatus('pending');
		toast.success('Request sent');
	}, []);

	const handleConnectionRemove = useCallback((): void => {
		setStatus('not_connected');
	}, []);

	const showConnect = status === 'not_connected';
	const showPending = status === 'pending';
	const isSelf = status === 'self';

	if (!profileCardInfo) {
		return <></>;
	}

	return (
		<Box>
			<Card variant="outlined" sx={{ height: '100%' }}>
				<Stack
					alignItems="flex-start"
					direction="row"
					justifyContent="space-between"
					spacing={2}
					sx={{ p: 2 }}>
					<Stack alignItems="flex-start" direction="row" spacing={2}>
						<Avatar
							component="a"
							href="#"
							src={profileCardInfo.image}
							sx={{
								height: 56,
								width: 56,
							}}
						/>
						<Box sx={{ flexGrow: 1 }}>
							<Link
								color="text.primary"
								href={`/profile/${profileCardInfo.id}`}
								variant="subtitle1">
								{profileCardInfo.name}
							</Link>
							<Typography color="text.secondary" variant="body2">
								Freshman, Sixth, Biology
							</Typography>
							<Typography
								color="text.primary"
								variant="caption"
								sx={{ fontSize: '0.875rem' }}>
								Taking:{' '}
								{profileCardInfo.classes.map((c, idx) => (
									<Typography
										key={c.id}
										variant="caption"
										color={
											profileCardInfo.mutualClasses?.includes(c.code)
												? 'blue'
												: 'text.secondary'
										}
										sx={{ fontSize: '0.875rem' }}>
										{c.code}
										{idx != profileCardInfo.classes.length - 1 ? ',' : ''}{' '}
									</Typography>
								))}
							</Typography>
						</Box>
					</Stack>
					{isSelf && (
						<Button onClick={handleConnectionAdd} size="small" variant="outlined">
							View Profile
						</Button>
					)}
					{showConnect && (
						<Button onClick={handleConnectionAdd} size="small" variant="outlined">
							Connect
						</Button>
					)}
					{showPending && (
						<Button onClick={handleConnectionRemove} size="small" color="inherit">
							Pending
						</Button>
					)}
				</Stack>
			</Card>
		</Box>
	);
};

ProfileCard.propTypes = {
	// @ts-ignore
	connection: PropTypes.object,
};

export default ProfileCard;
