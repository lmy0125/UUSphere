import React from 'react';
import ClassScheulde from '@/components/ClassEnrollment/ClassSchedule';
import Calendar from '@/components/Calendar';
import { ClassEnrollmentContextProvider } from '@/contexts/ClassEnrollmentContext';

interface ScheduleProps {
	userId: string;
}

export default function Schedule({ userId }: ScheduleProps) {
	return (
		<>
			<ClassEnrollmentContextProvider>
				<ClassScheulde userId={userId} />
			</ClassEnrollmentContextProvider>
			<Calendar userId={userId} />
		</>
	);
}
