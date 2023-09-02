import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { ClassInfo } from '@/types/class';
import { DropSectionModal } from '@/components/ClassEnrollment/ConfirmModals';
import { useClassEnrollmentContext } from '@/contexts/ClassEnrollmentContext';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const ClassSchedule = () => {
	const { classInfoJoined, setClassInfoJoined, classInfoDropped, setClassInfoDropped } =
		useClassEnrollmentContext();
	const { data: session } = useSession();
	const [enrolledClasses, setEnrolledClasses] = useState<ClassInfo[]>([]);

	useEffect(() => {
		const getEnrolledClasses = async () => {
			try {
				const response = await axios.get(`/api/getEnrolledClasses`);

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
	}, [session]);

	useEffect(() => {
		if (classInfoJoined) {
			setEnrolledClasses((prevArray) => [...prevArray, classInfoJoined]);
			setClassInfoJoined(undefined);
		}
	}, [classInfoJoined]);
	useEffect(() => {
		if (classInfoDropped) {
			setEnrolledClasses((prevArray) =>
				prevArray.filter((e, _) => e.id !== classInfoDropped.id)
			);
			setClassInfoDropped(undefined);
		}
	}, [classInfoDropped]);

	return (
		<>
			<Card sx={{ mt: 5 }}>
				<CardHeader title="My Schedule" />
				<Divider />
				<Scrollbar>
					<Table sx={{ minWidth: 700 }}>
						<TableHead>
							<TableRow>
								<TableCell />
								<TableCell>Name</TableCell>
								<TableCell width="45%">Title</TableCell>
								<TableCell width="25%">Instructor</TableCell>
								<TableCell>Action</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{enrolledClasses.map((c) => {
								return <ClassEntry key={c.id} classInfo={c} />;
							})}
						</TableBody>
					</Table>
				</Scrollbar>
			</Card>
		</>
	);
};

const ClassEntry = ({ classInfo }: { classInfo: ClassInfo }) => {
	const [dropSectionModal, setDropSectionModal] = useState(false);
	return (
		<>
			<TableRow hover key={classInfo.id}>
				<TableCell />
				<TableCell>
					<Typography variant="subtitle2">{classInfo.code}</Typography>
					<Typography color="text.secondary" variant="body2">
						{classInfo.sections[0].code}
					</Typography>
				</TableCell>
				<TableCell>{classInfo.name}</TableCell>
				<TableCell>{classInfo.instructor}</TableCell>
				<TableCell>
					<Button onClick={() => setDropSectionModal(true)} size="small">
						Drop
					</Button>
				</TableCell>
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
