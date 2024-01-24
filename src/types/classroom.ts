export interface ClassSchedule {
	daysOfWeek: number[];
	startTime: string;
	endTime: string;
	type: string;
}

export interface ClassroomSchedules {
	[classroom: string]: ClassSchedule[];
}

export interface ClassroomIdleTimes {
	name: string;
	idleTimes: TimeInterval[][];
}

export interface TimeInterval {
	start: string;
	end: string;
}
