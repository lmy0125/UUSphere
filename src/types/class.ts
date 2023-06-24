export interface ClassInfo {
	id: string;
	code: string | null;
	name: string | null;
	instructor: string | null;
	quarter: string | null;
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
