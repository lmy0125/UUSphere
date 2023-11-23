import React, { useState } from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import ClassScheulde from '@/components/ClassEnrollment/ClassSchedule';
import Calendar from '@/components/Calendar';
import { ClassEnrollmentContextProvider } from '@/contexts/ClassEnrollmentContext';

interface ScheduleProps {
	userId: string;
}

export default function Schedule({ userId }: ScheduleProps) {
	const [quarterIndex, setQuarterIndex] = useState(0);
	const quarters = ['WI24', 'FA23'];

	return (
		<>
			<Box>
				<Tabs
					indicatorColor="primary"
					onChange={(_, value) => setQuarterIndex(value)}
					scrollButtons="auto"
					sx={{ px: 3 }}
					textColor="primary"
					value={quarterIndex}
					variant="scrollable">
					<Tab key={0} label="WI24" />
					<Tab key={1} label="FA23" />
				</Tabs>
			</Box>
			<ClassEnrollmentContextProvider>
				<ClassScheulde userId={userId} quarter={quarters[quarterIndex]} />
			</ClassEnrollmentContextProvider>
			<Calendar userId={userId} quarter={quarters[quarterIndex]} />
		</>
	);
}
