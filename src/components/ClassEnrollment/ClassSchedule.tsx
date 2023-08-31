import React, { FC } from 'react';
import type { Page as PageType } from '@/types/page';
import { Layout as DashboardLayout } from '@/layouts/dashboard';
import { Scrollbar } from '@/components/scrollbar';
import {
	Box,
	Button,
	Card,
	CardHeader,
	Divider,
	IconButton,
	SvgIcon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableSortLabel,
	Tooltip,
	Typography,
} from '@mui/material';
import { ClassInfo } from '@/types/class';

interface ClassScheduleProps {
	enrolledClasses: ClassInfo[];
}

const ClassSchedule: FC<ClassScheduleProps> = ({ enrolledClasses }) => {
	return (
		<Card sx={{ mt: 5 }}>
			<CardHeader title="My Schedule" />
			<Divider />
			<Scrollbar>
				<Table sx={{ minWidth: 700 }}>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Instructor</TableCell>
							<TableCell align="right">Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{enrolledClasses.map((c) => {
							return (
								<TableRow hover key={c.id}>
									<TableCell>{c.code}</TableCell>
									<TableCell>{c.name}</TableCell>
									<TableCell>{c.instructor}</TableCell>
									<TableCell align="right">
										<Button
											// onClick={() => handleDropClass({ sectionId: section.id })}
											size="small">
											Drop
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Scrollbar>
		</Card>
	);
};

export default ClassSchedule;
