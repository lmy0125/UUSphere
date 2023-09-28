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
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { ClassInfo } from '@/types/class';
import { joinSection, dropSection } from '@/utils/ClassEnrollmentActions';
import { useClassEnrollmentContext } from '@/contexts/ClassEnrollmentContext';
import { useChatContext } from '@/contexts/ChatContext';
import { Scrollbar } from '@/components/scrollbar';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	width: '80%',
	maxWidth: 800,
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
	const { chatClient } = useChatContext();
	const { setSectionJoined, setClassInfoJoined } = useClassEnrollmentContext();
	const handleClose = () => setJoinSectionModal(false);
	const handleConfirm = () => {
		setSectionJoined(sectionId);
		setClassInfoJoined(classInfo);
		if (chatClient) {
			joinSection(sectionId, classInfo, chatClient);
		}
		setJoinSectionModal(false);
	};
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

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
				<Scrollbar>
					<Table sx={{ mt: 2 }}>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Section</TableCell>
								{smUp && <TableCell width="45%">Title</TableCell>}
								<TableCell width="25%">Instructor</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>{classInfo.code}</TableCell>
								<TableCell>{classInfo.sections[0].code}</TableCell>
								{smUp && <TableCell>{classInfo.name}</TableCell>}
								<TableCell>{classInfo.instructor}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Scrollbar>
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
	const { chatClient } = useChatContext();
	const { setSectionDropped, setClassInfoDropped } = useClassEnrollmentContext();
	const handleClose = () => setDropSectionModal(false);
	const handleConfirm = () => {
		setSectionDropped(sectionId);
		setClassInfoDropped(classInfo);
		if (chatClient) {
			dropSection(sectionId, classInfo.id, chatClient);
		}
		setDropSectionModal(false);
	};
	const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

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
				<Scrollbar>
					<Table sx={{ mt: 2 }}>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Section</TableCell>
								{smUp && <TableCell width="45%">Title</TableCell>}
								<TableCell width="25%">Instructor</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>{classInfo.code}</TableCell>
								<TableCell>{classInfo.sections[0].code}</TableCell>
								{smUp && <TableCell>{classInfo.name}</TableCell>}
								<TableCell>{classInfo.instructor}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Scrollbar>
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
