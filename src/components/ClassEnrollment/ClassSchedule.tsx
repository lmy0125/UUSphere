import React, { useState, useEffect, FC } from 'react';
import { Scrollbar } from '@/components/scrollbar';
import {
	Button,
	Card,
	CardHeader,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	useMediaQuery,
} from '@mui/material';
import type { Theme } from '@mui/material';
import { ClassInfo } from '@/types/class';
import { DropSectionModal } from '@/components/ClassEnrollment/ConfirmModals';
import { useClassEnrollmentContext } from '@/contexts/ClassEnrollmentContext';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface ClassScheduleProps {
	userId: string;
	quarter: string;
}

const ClassSchedule: FC<ClassScheduleProps> = ({ userId, quarter }) => {
	const { classInfoJoined, setClassInfoJoined, classInfoDropped, setClassInfoDropped } =
		useClassEnrollmentContext();
	const { data: session } = useSession();
	const [enrolledClasses, setEnrolledClasses] = useState<ClassInfo[]>([]);
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
	const editable = userId == session?.user.id;

	useEffect(() => {
		const getEnrolledClasses = async () => {
			try {
				const response = await axios.get(
					`/api/enrolledClasses?userId=${userId}&quarter=${quarter}`
				);
				console.log(response);
				const classes = response.data.classes.map((obj: any) => {
					const { courseId, professorId, course, ...rest } = obj;
					rest.name = obj.course.name;
					rest.instructor = obj.instructor.name;
					return rest;
				});
				setEnrolledClasses(classes);
			} catch (err) {
				console.error(err);
			}
		};

		if (session) {
			getEnrolledClasses();
		}
	}, [session, userId, quarter]);

	useEffect(() => {
		if (classInfoJoined) {
			setEnrolledClasses((prevArray) => [...prevArray, classInfoJoined]);
			setClassInfoJoined(undefined);
		}
	}, [classInfoJoined, setClassInfoJoined]);
	useEffect(() => {
		if (classInfoDropped) {
			setEnrolledClasses((prevArray) =>
				prevArray.filter((e, _) => e.id !== classInfoDropped.id)
			);
			setClassInfoDropped(undefined);
		}
	}, [classInfoDropped, setClassInfoDropped]);

	return (
		<>
			<Card sx={{ mt: 5 }}>
				<CardHeader title="Schedule" />
				<Divider />
				<Scrollbar>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell />
								<TableCell>Name</TableCell>
								{smUp && <TableCell width="25%">Title</TableCell>}
								{smUp && <TableCell width="25%">Instructor</TableCell>}
								<TableCell>Lecture</TableCell>
								{editable && <TableCell>Action</TableCell>}
							</TableRow>
						</TableHead>
						<TableBody>
							{enrolledClasses.map((c) => {
								return <ClassEntry key={c.id} classInfo={c} editable={editable} />;
							})}
						</TableBody>
					</Table>
				</Scrollbar>
			</Card>
		</>
	);
};

const ClassEntry = ({ classInfo, editable }: { classInfo: ClassInfo; editable: boolean }) => {
	const [dropSectionModal, setDropSectionModal] = useState(false);
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

	const lecture = classInfo.sections[0].meetings.filter((meeting) => meeting.type == 'LE');
	const startTime = lecture[0]?.startTime;
	const endTime = lecture[0]?.endTime;
	const days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
	const daysOfWeek = lecture[0]?.daysOfWeek.map((i) => days[i - 1]);

	return (
		<>
			<TableRow hover key={classInfo.id}>
				<TableCell />
				<TableCell>
					<Typography variant="subtitle2">{classInfo.code}</Typography>
					<Typography color="text.secondary" variant="body2">
						{classInfo.sections[0].code}
					</Typography>
					{!smUp && <Typography variant="body2">{classInfo.instructor}</Typography>}
				</TableCell>
				{smUp && <TableCell>{classInfo.name}</TableCell>}
				{smUp && <TableCell>{classInfo.instructor}</TableCell>}
				<TableCell>
					{daysOfWeek}
					<Typography color="text.secondary" variant="body2">
						{startTime} -- {endTime}
					</Typography>
				</TableCell>
				{editable && (
					<TableCell>
						<Button onClick={() => setDropSectionModal(true)} size="small">
							Drop
						</Button>
					</TableCell>
				)}
			</TableRow>
			<DropSectionModal
				open={dropSectionModal}
				setDropSectionModal={setDropSectionModal}
				sectionId={classInfo.sections[0].id}
				classInfo={classInfo}
			/>
		</>
	);
};

export default ClassSchedule;
