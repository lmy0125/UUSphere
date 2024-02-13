export interface ClassInfo {
	id: string;
	code: string;
	name: string;
	instructor: string;
	description: string;
	quarter: string;
	sections: Section[];
}

export interface Section {
	id: string;
	code: string | null;
	total_seats: number | null;
	school_id: string | null;
	classId: string | null;
	meetings: Meeting[];
	class: ClassInfo;
}

export interface Meeting {
	id: string;
	type: string;
	daysOfWeek: number[];
	startTime: string | null;
	endTime: string | null;
	location: string | null;
	sectionId: string | null;
	section: Section;
}
