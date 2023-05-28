import type { ChangeEvent, FC, MouseEvent } from 'react';
import { Fragment, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import {
	Box,
	Button,
	CardContent,
	Divider,
	Grid,
	IconButton,
	InputAdornment,
	LinearProgress,
	MenuItem,
	Stack,
	SvgIcon,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { Scrollbar } from '@/components/scrollbar';
import { Class_test } from '@prisma/client';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useChatContext } from '@/contexts/ChatContext';

// interface Filters {
// 	name?: string;
// }

// interface ClassSearchState {
// 	filters: Filters;
// 	page: number;
// 	rowsPerPage: number;
// }

// const useClassSearch = () => {
// 	const [state, setState] = useState<ClassSearchState>({
// 		filters: {
// 			name: undefined,
// 		},
// 		page: 0,
// 		rowsPerPage: 5,
// 	});

// 	const handleFiltersChange = useCallback((filters: Filters): void => {
// 		setState((prevState) => ({
// 			...prevState,
// 			filters,
// 		}));
// 	}, []);

// 	const handlePageChange = useCallback(
// 		(event: MouseEvent<HTMLButtonElement> | null, page: number): void => {
// 			setState((prevState) => ({
// 				...prevState,
// 				page,
// 			}));
// 		},
// 		[]
// 	);

// 	const handleRowsPerPageChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
// 		setState((prevState) => ({
// 			...prevState,
// 			rowsPerPage: parseInt(event.target.value, 10),
// 		}));
// 	}, []);

// 	return {
// 		handleFiltersChange,
// 		handlePageChange,
// 		handleRowsPerPageChange,
// 		state,
// 	};
// };

// interface ClassesStoreState {
// 	classes: Class_test[];
// 	classesCount: number;
// }

// const useProductsStore = (searchState: ClassSearchState) => {
// 	const isMounted = useMounted();
// 	const [state, setState] = useState<ProductsStoreState>({
// 		products: [],
// 		productsCount: 0,
// 	});

// 	const handleProductsGet = useCallback(async () => {
// 		try {
// 			const response = await productsApi.getProducts(searchState);

// 			if (isMounted()) {
// 				setState({
// 					products: response.data,
// 					productsCount: response.count,
// 				});
// 			}
// 		} catch (err) {
// 			console.error(err);
// 		}
// 	}, [searchState, isMounted]);

// 	useEffect(
// 		() => {
// 			handleProductsGet();
// 		},
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 		[searchState]
// 	);

// 	return {
// 		...state,
// 	};
// };

interface ClassTableProps {
	count?: number;
	items?: Class_test[];
	onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
	onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	page?: number;
	rowsPerPage?: number;
}

export const ClassTable: FC<ClassTableProps> = (props) => {
	const {
		count = 0,
		items = [],
		onPageChange = () => {},
		onRowsPerPageChange,
		page = 0,
		rowsPerPage = 0,
	} = props;
	const [currentProduct, setCurrentProduct] = useState<string | null>(null);

	return (
		<div>
			<Scrollbar>
				<Table sx={{ minWidth: 800 }}>
					<TableHead>
						<TableRow>
							<TableCell width="20%">Name</TableCell>
							<TableCell width="30%">Instructor</TableCell>
							<TableCell>Seats</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((classChannel) => {
								return <ClassRow key={classChannel.id} classChannel={classChannel} />;
							})}
					</TableBody>
				</Table>
			</Scrollbar>
			<TablePagination
				component="div"
				count={count}
				onPageChange={onPageChange}
				onRowsPerPageChange={onRowsPerPageChange}
				page={page}
				rowsPerPage={rowsPerPage}
				rowsPerPageOptions={[5, 10, 25]}
			/>
		</div>
	);
};

ClassTable.propTypes = {
	count: PropTypes.number,
	items: PropTypes.array,
	onPageChange: PropTypes.func,
	onRowsPerPageChange: PropTypes.func,
	page: PropTypes.number,
	rowsPerPage: PropTypes.number,
};

import AuthModal from '@/components/AuthModal';
const ClassRow: FC<{ classChannel: Class_test }> = ({ classChannel }) => {
	const { client } = useChatContext();
	const { data: session, status } = useSession();
	const [hasClass, setHasClass] = useState(false);
	const [authModal, setAuthModal] = useState(false);

	async () => {
		const test = await client?.queryChannels({ id: 'd7151316-27f4-41c8-92e6-73c8f224a480' });
		console.log('test', test);
	};

	const handleJoinClass = async (data: { classId: string }) => {
		// if not authenticated
		if (!session) {
			setAuthModal(!authModal);
			return;
		}
		// Add in database
		axios.post('api/joinClass', data);
		setHasClass(true);
		// Join chat channel
		const channels = await client?.queryChannels({ id: classChannel.id });
		if (channels?.length == 0 || !channels) {
			const channel = client?.channel('messaging', classChannel.id, {
				name: classChannel.class_name ?? '',
				members: [session.user.id],
			});
			await channel?.watch();
		} else {
			await channels[0].addMembers([session.user.id]);
		}
	};

	const handleDropClass = async (data: { classId: string }) => {
		// if not authenticated
		if (!session) {
			setAuthModal(!authModal);
			return;
		}
		// Remove in databse
		axios.post('api/dropClass', data);
		setHasClass(false);
		// Leave chat channel
		const channels = await client?.queryChannels({ id: classChannel.id });
		if (channels?.length == 0 || !channels) return;
		await channels[0].removeMembers([session.user.id]);
	};
	
	const checkHasClass = async (classId: string | null) => {
		// if not authenticated
		if (!session) {
			setHasClass(false);
			return;
		}
		try {
			let res = await axios.post('api/hasClass', { classId: classId });
			if (res.data) {
				setHasClass(true);
			} else {
				setHasClass(false);
			}
		} catch (err) {
			console.log('err', err);
		}
	};

	useEffect(() => {
		checkHasClass(classChannel.id);
	}, [classChannel]);

	return (
		<TableRow hover key={classChannel.id}>
			<TableCell>
				<Box sx={{ cursor: 'pointer' }}>
					<Typography variant="subtitle2">{classChannel.class_name}</Typography>
				</Box>
			</TableCell>
			<TableCell>
				<Box sx={{ cursor: 'pointer' }}>
					<Typography variant="subtitle2">{classChannel.instructor}</Typography>
				</Box>
			</TableCell>
			<TableCell>
				{/* <LinearProgress
                value={5}
                variant="determinate"
                color={quantityColor}
                sx={{
                    height: 8,
                    width: 36,
                }}
            /> */}
				<Typography color="text.secondary" variant="body2">
					{classChannel.total_seats}
				</Typography>
			</TableCell>
			<TableCell>
				{hasClass ? (
					<Button onClick={() => handleDropClass({ classId: classChannel.id })} size="small">
						Drop
					</Button>
				) : (
					<Button onClick={() => handleJoinClass({ classId: classChannel.id })} size="small">
						Join
					</Button>
				)}
			</TableCell>
			<AuthModal open={authModal} setAuthModal={() => setAuthModal(false)} />
		</TableRow>
	);
};
