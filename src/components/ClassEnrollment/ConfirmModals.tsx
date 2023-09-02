import * as React from 'react';
import {
	Box,
	Button,
	Typography,
	Modal,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from '@mui/material';
import { ClassInfo } from '@/types/class';
import { joinSection, dropSection } from '@/utils/ClassEnrollmentActions';
import { useClassEnrollmentContext } from '@/contexts/ClassEnrollmentContext';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
};

export const JoinSectionModal = ({
	open,
	setJoinSectionModal,
	sectionId,
	classInfo,
}: {
	open: boolean;
	setJoinSectionModal: React.Dispatch<React.SetStateAction<boolean>>;
	sectionId: string;
	classInfo: ClassInfo;
}) => {
	const { setSectionJoined, setClassInfoJoined } = useClassEnrollmentContext();
	const handleClose = () => setJoinSectionModal(false);
	const handleConfirm = () => {
		setSectionJoined(sectionId);
		setClassInfoJoined(classInfo);
		joinSection(sectionId, classInfo);
		setJoinSectionModal(false);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Paper elevation={12} sx={style}>
				<Typography variant="h6" component="h2">
					Join Class
				</Typography>

				<Table sx={{ minWidth: 700, mt: 2 }}>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Section</TableCell>
							<TableCell width="45%">Title</TableCell>
							<TableCell width="25%">Instructor</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>{classInfo.code}</TableCell>
							<TableCell>{classInfo.sections[0].code}</TableCell>
							<TableCell>{classInfo.name}</TableCell>
							<TableCell>{classInfo.instructor}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						mt: 2,
					}}>
					<Button color="inherit" sx={{ mr: 2 }} onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="contained" onClick={handleConfirm}>
						Confirm
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
};

export const DropSectionModal = ({
	open,
	setDropSectionModal,
	sectionId,
	classInfo,
}: {
	open: boolean;
	setDropSectionModal: React.Dispatch<React.SetStateAction<boolean>>;
	sectionId: string;
	classInfo: ClassInfo;
}) => {
	const { setSectionDropped, setClassInfoDropped} = useClassEnrollmentContext();
	const handleClose = () => setDropSectionModal(false);
	const handleConfirm = () => {
		setSectionDropped(sectionId);
		setClassInfoDropped(classInfo);
		dropSection(sectionId, classInfo.id);
		setDropSectionModal(false);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Paper elevation={12} sx={style}>
				<Typography variant="h6" component="h2">
					Drop Class
				</Typography>

				<Table sx={{ minWidth: 700, mt: 2 }}>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Section</TableCell>
							<TableCell width="45%">Title</TableCell>
							<TableCell width="25%">Instructor</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>{classInfo.code}</TableCell>
							<TableCell>{classInfo.sections[0].code}</TableCell>
							<TableCell>{classInfo.name}</TableCell>
							<TableCell>{classInfo.instructor}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						mt: 2,
					}}>
					<Button color="inherit" sx={{ mr: 2 }} onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="contained" onClick={handleConfirm}>
						Confirm
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
};
