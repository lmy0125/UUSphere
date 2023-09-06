import type { ChangeEvent, Dispatch, FC, MouseEvent, SetStateAction } from 'react';
import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import {
	Box,
	Button,
	Collapse,
	IconButton,
	LinearProgress,
	SvgIcon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from '@mui/material';
import { Scrollbar } from '@/components/scrollbar';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { ClassInfo, Section } from '@/types/class';
import AuthModal from '@/components/AuthModal';
import { JoinSectionModal, DropSectionModal } from '@/components/ClassEnrollment/ConfirmModals';
import { useClassEnrollmentContext } from '@/contexts/ClassEnrollmentContext';

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

const ClassRow: FC<{
	classInfo: ClassInfo;
}> = ({ classInfo: classInfo }) => {
	const { data: session } = useSession();
	const [expandSection, setExpandSection] = useState(false);
	const [hasClass, setHasClass] = useState(false);
	const [sectionTakenId, setSectionTakenId] = useState('');
	const [numOfEnrolledStudentForClass, setNumOfEnrolledStudentForClass] = useState(0);
	const [totalSeats, setTotalSeats] = useState(0);
	const [enrollmentRatio, setEnrollmentRatio] = useState(0);

	const handleClassToggle = () => {
		setExpandSection(!expandSection);
	};

	const checkHasClass = useCallback(async () => {
		if (!session) {
			return;
		}
		try {
			const res = await axios.post('api/checkHasClass', { classId: classInfo.id });
			if (res.data.classes.length == 1) {
				setHasClass(true);
				setSectionTakenId(res.data.classes[0].sections[0].id);
			}
		} catch (err) {
			console.error('Failed to checkHasClass' + err);
		}
	}, [classInfo.id, session]);

	const getNumOfEnrolledStudent = useCallback(async () => {
		try {
			const res = await axios.get(`api/getNumOfEnrolledStudentForClass?classId=${classInfo.id}`);
			if (res.data) {
				setNumOfEnrolledStudentForClass(res.data.numOfStudent);
				setTotalSeats(res.data.total_seats);
				setEnrollmentRatio(res.data.numOfStudent / res.data.total_seats);
			}
		} catch (err) {
			console.error('Failed to getNumOfEnrolledStudent' + err);
		}
	}, [classInfo.id]);

	useEffect(() => {
		checkHasClass();
		getNumOfEnrolledStudent();
	}, [checkHasClass, getNumOfEnrolledStudent]);

	return (
		<>
			<TableRow hover key={classInfo.id} style={hasClass ? { backgroundColor: '#d5f7ea' } : {}}>
				<TableCell
					padding="checkbox"
					sx={{
						...(expandSection && {
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
					<IconButton onClick={() => handleClassToggle()}>
						<SvgIcon>{expandSection ? <ChevronDownIcon /> : <ChevronRightIcon />}</SvgIcon>
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
					<Collapse in={expandSection} timeout="auto" unmountOnExit>
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
										// Modify the classInfo so that it only contains one specific section
										const oneSectionClassInfo = {
											...classInfo,
											sections: classInfo.sections.filter(
												(item) => item.id === section.id
											),
										};
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
												classInfo={oneSectionClassInfo}
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
	const { sectionJoined, setSectionJoined, sectionDropped, setSectionDropped } =
		useClassEnrollmentContext();
	const { data: session } = useSession();
	const [hasSection, setHasSection] = useState(section.id === sectionTakenId);
	const [inOtherSection, setInOtherSection] = useState(
		section.id !== sectionTakenId && hasClass === true
	);
	const [numOfEnrolledStudentForSection, setNumOfEnrolledStudentForSection] = useState(0);
	const [enrollmentRatio, setEnrollmentRatio] = useState(0);
	const [authModal, setAuthModal] = useState(false);
	const [joinSectionModal, setJoinSectionModal] = useState(false);
	const [dropSectionModal, setDropSectionModal] = useState(false);

	const lecture = section.meetings.filter((meeting) => meeting.type == 'LE');

	const startTime = lecture[0]?.startTime;
	const endTime = lecture[0]?.endTime;
	const days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
	const daysOfWeek = lecture[0]?.daysOfWeek.map((i) => days[i - 1]);

	const handleStateWhenJoinSection = useCallback(() => {
		setHasSection(true);
		setNumOfEnrolledStudentForSection((prevCount: number) => prevCount + 1);
		setHasClass(true);
		setSectionTakenId(section.id ?? '');
		setNumOfEnrolledStudentForClass((prevCount: number) => prevCount + 1);
	}, [section.id, setHasClass, setSectionTakenId, setNumOfEnrolledStudentForClass]);

	const handleStateWhenDropSection = useCallback(() => {
		setHasSection(false);
		setNumOfEnrolledStudentForSection((prevCount: number) => prevCount - 1);
		setHasClass(false);
		setSectionTakenId('');
		setNumOfEnrolledStudentForClass((prevCount: number) => prevCount - 1);
	}, [setHasClass, setSectionTakenId, setNumOfEnrolledStudentForClass]);

	const getNumOfEnrolledStudent = useCallback(async () => {
		try {
			const res = await axios.get(
				`api/getNumOfEnrolledStudentForSection?sectionId=${section.id}`
			);
			if (res.data) {
				setNumOfEnrolledStudentForSection(res.data);
				setEnrollmentRatio(res.data / section.total_seats!);
			}
		} catch (err) {
			console.error('Failed to getNumOfEnrolledStudent' + err);
		}
	}, [section.id, section.total_seats]);

	useEffect(() => {
		getNumOfEnrolledStudent();
	}, [getNumOfEnrolledStudent]);

	useEffect(() => {
		setInOtherSection(section.id !== sectionTakenId && hasClass);
	}, [hasClass, sectionTakenId, section.id]);

	// When user perform join or drop in the ClassSchedule or ConfirmModals component,
	// it will trigger either of these hooks
	useEffect(() => {
		if (sectionJoined === section.id) {
			handleStateWhenJoinSection();
			setSectionJoined('');
		}
	}, [sectionJoined, section.id, handleStateWhenJoinSection, setSectionJoined]);

	useEffect(() => {
		if (sectionDropped === section.id) {
			handleStateWhenDropSection();
			setSectionDropped('');
		}
	}, [sectionDropped, section.id, handleStateWhenDropSection, setSectionDropped]);

	useEffect(() => {
		setEnrollmentRatio(numOfEnrolledStudentForSection / section.total_seats!);
	}, [numOfEnrolledStudentForSection, section.total_seats]);

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
					<Button onClick={() => setDropSectionModal(true)} size="small">
						Drop
					</Button>
				) : (
					<Button
						onClick={() => {
							if (!session) {
								setAuthModal(!authModal);
								return;
							}
							setJoinSectionModal(true);
						}}
						size="small"
						disabled={inOtherSection}>
						Join
					</Button>
				)}
			</TableCell>
			<AuthModal open={authModal} setAuthModal={() => setAuthModal(false)} />
			<JoinSectionModal
				open={joinSectionModal}
				setJoinSectionModal={setJoinSectionModal}
				classInfo={classInfo}
				sectionId={section.id}
			/>
			<DropSectionModal
				open={dropSectionModal}
				setDropSectionModal={setDropSectionModal}
				classInfo={classInfo}
				sectionId={section.id}
			/>
		</TableRow>
	);
};
