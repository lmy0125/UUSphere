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
	Collapse,
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
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useChatContext } from '@/contexts/ChatContext';
import { ClassInfo, Section } from '@/types/class';

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
	items?: ClassInfo[];
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

	return (
		<div>
			<Scrollbar>
				<Table sx={{ minWidth: 800 }}>
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>Name</TableCell>
							<TableCell width="40%">Title</TableCell>
							<TableCell width="25%">Instructor</TableCell>
							<TableCell>Total Seats</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((classInfo) => {
								return <ClassRow key={classInfo.id} classInfo={classInfo} />;
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

const ClassRow: FC<{ classInfo: ClassInfo }> = ({ classInfo: classInfo }) => {
	// const { client } = useChatContext();
	const [selected, setSelected] = useState(false);

	const handleProductToggle = () => {
		setSelected(!selected);
	};

	return (
		<>
			<TableRow hover key={classInfo.id}>
				<TableCell
					padding="checkbox"
					sx={{
						...(selected && {
							position: 'relative',
							'&:after': {
								position: 'absolute',
								content: '" "',
								top: 0,
								left: 0,
								backgroundColor: 'primary.main',
								width: 3,
								height: 'calc(100% + 1px)',
							},
						}),
					}}
					width="25%">
					<IconButton onClick={() => handleProductToggle()}>
						<SvgIcon>{selected ? <ChevronDownIcon /> : <ChevronRightIcon />}</SvgIcon>
					</IconButton>
				</TableCell>
				<TableCell>
					<Box sx={{ cursor: 'pointer' }}>
						<Typography variant="subtitle2">{classInfo.code}</Typography>
					</Box>
				</TableCell>
				<TableCell>
					<Typography variant="subtitle2">{classInfo.name}</Typography>
				</TableCell>
				<TableCell>
					<Box sx={{ cursor: 'pointer' }}>
						<Typography variant="subtitle2">{classInfo.instructor}</Typography>
					</Box>
				</TableCell>
				<TableCell>
					<LinearProgress
						value={5}
						variant="determinate"
						color="success"
						sx={{
							height: 8,
							width: 80,
						}}
					/>
					<Typography color="text.secondary" variant="body2">
						0 / 100
					</Typography>
				</TableCell>
			</TableRow>

			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={selected} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Section ID</TableCell>
										<TableCell>Section</TableCell>
										<TableCell>Total Seats</TableCell>
										<TableCell>Lecture</TableCell>
										<TableCell>Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{classInfo.sections.map((section: Section) => {
										return <SectionRow key={section.id} section={section} />;
									})}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

const SectionRow: FC<{ section: Section }> = ({ section: section }) => {
	const { data: session, status } = useSession();
	const [hasSection, setHasSection] = useState(false);
	const [authModal, setAuthModal] = useState(false);

	const quantityColor = section.total_seats! <= 100 ? 'success' : 'error';
	const lecture = section.meetings.filter((meeting) => meeting.type == 'LE');

	const startTime = lecture[0]?.startTime;
	const endTime = lecture[0]?.endTime;
	const days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
	const daysOfWeek = lecture[0]?.daysOfWeek.map((i) => days[i - 1]);

	const handleJoinClass = async (data: { sectionId: string }) => {
		// if not authenticated
		if (!session) {
			setAuthModal(!authModal);
			return;
		}
		// Add in database
		try {
			axios.post('api/joinClass', data);
			setHasSection(true);
		} catch (err) {
			alert('Something went wrong' + err);
		}

		// Join chat channel
		// console.log('query channel', client, classChannel.id);
		// const channels = await client?.queryChannels({});
		// console.log('query', channels);
		// if (channels?.length == 0 || !channels) {
		// 	console.log('create');
		// 	const channel = client?.channel('messaging', classChannel.id, {
		// 		name: classChannel.class_name ?? '',
		// 		members: [client.userID],
		// 	});
		// 	await channel?.create();
		// } else {
		// 	console.log('add');
		// 	await channels[0].addMembers([client.userID]);
		// }
	};

	const handleDropClass = async (data: { sectionId: string }) => {
		// if not authenticated
		if (!session) {
			setAuthModal(!authModal);
			return;
		}
		// Remove in databse
		try {
			axios.post('api/dropClass', data);
			setHasSection(false);
		} catch (err) {
			alert('Something went wrong' + err);
		}
		// Leave chat channel
		// const channels = await client?.queryChannels(filter);
		// console.log('drop', channels);
		// if (channels?.length == 0 || !channels) return;
		// await channels[0].removeMembers([session.user.id]);
	};

	const checkHasSection = async (sectionId: string | null) => {
		// if not authenticated
		if (!session) {
			setHasSection(false);
			return;
		}
		try {
			let res = await axios.post('api/hasSection', { sectionId: sectionId });
			if (res.data) {
				setHasSection(true);
			} else {
				setHasSection(false);
			}
		} catch (err) {
			// alert('Something went wrong' + err);
		}
	};

	useEffect(() => {
		checkHasSection(section.id);
	}, [section]);

	return (
		<TableRow key={section.school_id} style={hasSection ? { backgroundColor: '#d5f7ea' } : {}}>
			<TableCell component="th" scope="row">
				{section.school_id}
			</TableCell>
			<TableCell>{section.code}</TableCell>
			<TableCell>
				<LinearProgress
					value={section.total_seats!}
					variant="determinate"
					color={quantityColor}
					sx={{
						height: 8,
						width: 80,
					}}
				/>
				<Typography color="text.secondary" variant="body2">
					0 / {section.total_seats}
				</Typography>
			</TableCell>
			<TableCell>
				{daysOfWeek}
				<Typography color="text.secondary" variant="body2">
					{startTime} -- {endTime}
				</Typography>
			</TableCell>
			<TableCell>
				{hasSection ? (
					<Button onClick={() => handleDropClass({ sectionId: section.id })} size="small">
						Drop
					</Button>
				) : (
					<Button onClick={() => handleJoinClass({ sectionId: section.id })} size="small">
						Join
					</Button>
				)}
			</TableCell>
			<AuthModal open={authModal} setAuthModal={() => setAuthModal(false)} />
		</TableRow>
	);
};
