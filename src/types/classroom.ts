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
	[key: string]: any; // index signature
	name: string;
	idleTimes: TimeInterval[][];
}

export interface TimeInterval {
	start: string;
	end: string;
}

export interface ClassroomFilters {
	name: string;
	day: number;
	startTime: string;
	endTime: string;
}
