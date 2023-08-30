import type { ChangeEvent, Dispatch, FC, MouseEvent, SetStateAction } from 'react';
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
		<>
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
		</>
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
	const [selected, setSelected] = useState(false);
	const [hasClass, setHasClass] = useState(false);
	const [sectionTakenId, setSectionTakenId] = useState('');
	const [numOfEnrolledStudentForClass, setNumOfEnrolledStudentForClass] = useState(0);
	const [totalSeats, setTotalSeats] = useState(0);
	const [enrollmentRatio, setEnrollmentRatio] = useState(0);

	const handleProductToggle = () => {
		setSelected(!selected);
	};

	const checkHasClass = async () => {
		try {
			const res = await axios.post('api/checkHasClass', { classId: classInfo.id });
			if (res.data) {
				setHasClass(true);
				setSectionTakenId(res.data.classes[0].sections[0].id);
			}
		} catch (err) {
			console.error('Failed to checkHasSection' + err);
		}
	};

	const getNumOfEnrolledStudent = async () => {
		try {
			const res = await axios.get(`api/getNumOfEnrolledStudentForClass?classId=${classInfo.id}`);
			if (res.data) {
				setNumOfEnrolledStudentForClass(res.data.numOfStudent);
				setTotalSeats(res.data.total_seats);
				setEnrollmentRatio(res.data.numOfStudent / res.data.total_seats);
			}
		} catch (err) {
			console.error('Failed to checkHasSection' + err);
		}
	};

	useEffect(() => {
		checkHasClass();
		getNumOfEnrolledStudent();
	});

	return (
		<>
			<TableRow hover key={classInfo.id} style={hasClass ? { backgroundColor: '#d5f7ea' } : {}}>
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
						value={enrollmentRatio * 100}
						variant="determinate"
						color={
							enrollmentRatio <= 0.5
								? 'success'
								: enrollmentRatio <= 0.75
								? 'warning'
								: 'error'
						}
						sx={{
							height: 8,
							width: 80,
						}}
					/>
					<Typography color="text.secondary" variant="body2">
						{numOfEnrolledStudentForClass} / {totalSeats}
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
										return (
											<SectionRow
												key={section.id}
												section={section}
												sectionTakenId={sectionTakenId}
												setSectionTakenId={setSectionTakenId}
												hasClass={hasClass}
												setHasClass={setHasClass}
												setNumOfEnrolledStudentForClass={
													setNumOfEnrolledStudentForClass
												}
												classInfo={classInfo}
											/>
										);
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

const SectionRow: FC<{
	section: Section;
	sectionTakenId: string;
	setSectionTakenId: Dispatch<SetStateAction<string>>;
	hasClass: boolean;
	setHasClass: Dispatch<SetStateAction<boolean>>;
	setNumOfEnrolledStudentForClass: Dispatch<SetStateAction<number>>;
	classInfo: ClassInfo;
}> = ({
	section: section,
	sectionTakenId: sectionTakenId,
	setSectionTakenId: setSectionTakenId,
	hasClass: hasClass,
	setHasClass: setHasClass,
	setNumOfEnrolledStudentForClass: setNumOfEnrolledStudentForClass,
	classInfo: classInfo,
}) => {
	const { chatClient } = useChatContext();
	const { data: session } = useSession();
	const [hasSection, setHasSection] = useState(section.id === sectionTakenId);
	const [inOtherSection, setInOtherSection] = useState(
		section.id !== sectionTakenId && hasClass === true
	);
	const [numOfEnrolledStudentForSection, setNumOfEnrolledStudentForSection] = useState(0);
	const [enrollmentRatio, setEnrollmentRatio] = useState(0);
	const [authModal, setAuthModal] = useState(false);

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
			setHasClass(true);
			setSectionTakenId(section.id ?? '');
			setNumOfEnrolledStudentForSection((prevCount: number) => prevCount + 1);
			setNumOfEnrolledStudentForClass((prevCount: number) => prevCount + 1);
		} catch (err) {
			alert('Something went wrong' + err);
		}

		// Join chat channel
		if (!chatClient) {
			console.error('Chat service is down.');
			return;
		}
		const channel = chatClient.channel('classroom', classInfo.id, {
			code: classInfo.code,
			name: classInfo.name ?? undefined,
			instructor: classInfo.instructor,
			quarter: classInfo.quarter,
		});
		await channel.watch();
		await channel.addMembers([session.user.id]);
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
			setHasClass(false);
			setSectionTakenId('');
			setNumOfEnrolledStudentForSection((prevCount: number) => prevCount - 1);
			setNumOfEnrolledStudentForClass((prevCount: number) => prevCount - 1);
		} catch (err) {
			alert('Something went wrong' + err);
		}

		if (!chatClient) {
			console.error('Chat service is down.');
			return;
		}
		// Leave chat channel
		const filter = { type: 'classroom', id: { $eq: classInfo.id } };

		const channels = await chatClient.queryChannels(filter);
		if (channels) {
			await channels[0].stopWatching();
			await channels[0].removeMembers([session.user.id]);
		}
	};

	const getNumOfEnrolledStudent = async () => {
		try {
			const res = await axios.get(
				`api/getNumOfEnrolledStudentForSection?sectionId=${section.id}`
			);
			if (res.data) {
				setNumOfEnrolledStudentForSection(res.data);
				setEnrollmentRatio(res.data / section.total_seats!);
			}
		} catch (err) {
			console.error('Failed to checkHasSection' + err);
		}
	};

	useEffect(() => {
		getNumOfEnrolledStudent();
	});

	useEffect(() => {
		setInOtherSection(section.id !== sectionTakenId && hasClass);
	}, [hasClass, sectionTakenId]);

	return (
		<TableRow key={section.id} style={hasSection ? { backgroundColor: '#d5f7ea' } : {}}>
			<TableCell component="th" scope="row">
				{section.school_id}
			</TableCell>
			<TableCell>{section.code}</TableCell>
			<TableCell>
				<LinearProgress
					value={enrollmentRatio * 100}
					variant="determinate"
					color={
						enrollmentRatio <= 0.5 ? 'success' : enrollmentRatio <= 0.75 ? 'warning' : 'error'
					}
					sx={{
						height: 8,
						width: 80,
					}}
				/>
				<Typography color="text.secondary" variant="body2">
					{numOfEnrolledStudentForSection} / {section.total_seats}
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
					<Button
						onClick={() => handleJoinClass({ sectionId: section.id })}
						size="small"
						disabled={inOtherSection}>
						Join
					</Button>
				)}
			</TableCell>
			<AuthModal open={authModal} setAuthModal={() => setAuthModal(false)} />
		</TableRow>
	);
};
