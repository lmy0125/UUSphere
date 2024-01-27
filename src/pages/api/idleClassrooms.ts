import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ClassroomSchedules, ClassroomIdleTimes, TimeInterval } from '@/types/classroom';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const classroomName = req.query.name?.toString().toUpperCase() ?? '';
	const day = Number(req.query.day) ?? -1;
	const startTime = req.query.startTime?.toString().toUpperCase() ?? '';
	const endTime = req.query.endTime?.toString().toUpperCase() ?? '';
	// console.log(classroomName)
	if (req.method === 'GET') {
		try {
			const classesFA23 = await prisma.class.findMany({
				where: {
					quarter: 'FA23',
				},
				select: {
					sections: { select: { meetings: true } },
				},
			});

			const classesWI24 = await prisma.class.findMany({
				where: {
					quarter: 'WI24',
				},
				select: {
					sections: { select: { meetings: true } },
				},
			});

			let classroomSchedules: any = {};

			for (const c of classesFA23) {
				for (const section of c.sections) {
					for (const meeting of section.meetings) {
						let { location } = meeting;
						if (location && location != ' ' && location != 'TBA') {
							classroomSchedules[location] = [];
						}
					}
				}
			}

			for (const c of classesWI24) {
				for (const section of c.sections) {
					for (const meeting of section.meetings) {
						let { location, sectionId, ...rest } = meeting;
						if (location && location in classroomSchedules) {
							classroomSchedules[location].push(rest);
						} else {
							if (location && location != ' ' && location != 'TBA') {
								classroomSchedules[location] = [rest];
							}
						}
					}
				}
			}

			const classroomIdelTimes: ClassroomIdleTimes[] = calculateIdleTimes(classroomSchedules);
			const filteredResult = filterIdleClassrooms(
				classroomIdelTimes,
				classroomName,
				day,
				startTime,
				endTime
			);
			res.status(200).json(filteredResult);
		} catch (e) {
			res.status(500).json({ message: 'Something went wrong' });
		}
	}
	// HTTP method not supported!
	else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
	}
}

function calculateIdleTimes(schedules: ClassroomSchedules): ClassroomIdleTimes[] {
	const classroomsIdleTimes: ClassroomIdleTimes[] = [];

	for (const classroom in schedules) {
		const idleTimes: TimeInterval[][] = Array.from({ length: 7 }, () => []); // 7 days in a week

		for (let day = 0; day < 7; day++) {
			// Monday to Friday
			const daySchedules = schedules[classroom].filter((schedule) =>
				schedule.daysOfWeek.includes(day)
			);
			daySchedules.sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

			let currentTime = 0; // Start of the day in minutes

			for (const schedule of daySchedules) {
				const startTime = parseTime(schedule.startTime);
				const endTime = parseTime(schedule.endTime);

				if (startTime - currentTime > 10) {
					// Check if idle time is greater 10 minutes
					idleTimes[day].push({ start: formatTime(currentTime), end: formatTime(startTime) });
				}
				currentTime = endTime;
			}

			if (24 * 60 - currentTime > 10) {
				// If there's idle time at the end of the day longer than 10 minutes
				idleTimes[day].push({ start: formatTime(currentTime), end: '24:00' });
			}
		}

		classroomsIdleTimes.push({ name: classroom, idleTimes });
	}
	classroomsIdleTimes.sort((a, b) => a.name.localeCompare(b.name));
	return classroomsIdleTimes;
}

function filterIdleClassrooms(
	classroomsIdleTimes: ClassroomIdleTimes[],
	classroomName: string,
	day: number,
	startTime: string,
	endTime: string
): ClassroomIdleTimes[] {
	const idleClassrooms: ClassroomIdleTimes[] = [];
	const startInputTime = parseTime(startTime);
	const endInputTime = parseTime(endTime); // if no query for endTime

	for (const classroomInfo of classroomsIdleTimes) {
		// filter for classroomName
		classroomName = classroomName.toUpperCase();
		classroomName = insertSpaceBeforeNonLetter(classroomName);
		if (classroomName != '' && !classroomInfo.name.includes(classroomName)) {
			continue;
		}

		const idleTimesForDay = classroomInfo.idleTimes[day];

		for (const idleTime of idleTimesForDay) {
			const idleStartTime = parseTime(idleTime.start);
			const idleEndTime = parseTime(idleTime.end);

			if (!startInputTime || startInputTime >= idleStartTime && endInputTime <= idleEndTime) {
				idleClassrooms.push(classroomInfo);
				break; // Break out of the loop if a matching idle period is found
			}
		}
	}

	return idleClassrooms;
}

function parseTime(time: string): number {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes; // Convert time to minutes for easy comparison
}

function formatTime(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function insertSpaceBeforeNonLetter(inputString: string) {
	inputString = inputString.replace(/\s/g, '');
	const nonLetterIndex = inputString.search(/[^A-Za-z]/);

	if (nonLetterIndex !== -1) {
		const modifiedString = inputString.split('');
		modifiedString.splice(nonLetterIndex, 0, ' ');
		return modifiedString.join('');
	}
	return inputString;
}
