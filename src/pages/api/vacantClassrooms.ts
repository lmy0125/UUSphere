import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ClassroomSchedules, ClassroomIdleTimes, TimeInterval } from '@/types/classroom';
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const classroomName = req.query.name?.toString().toUpperCase() ?? '';
	const day = Number(req.query.day) ?? -1;
	const startTime = req.query.startTime?.toString().toUpperCase() ?? '';
	const endTime = req.query.endTime?.toString().toUpperCase() ?? '';

	if (req.method === 'GET') {
		try {
			const fetchedData = await prisma.classroomIdleSchedule.findUnique({
				where: {
					quarter: 'WI24',
				},
				select: {
					data: true,
				},
			});
			if (
				fetchedData?.data &&
				typeof fetchedData?.data === 'object' &&
				Array.isArray(fetchedData?.data)
			) {
				const jsonArray = fetchedData?.data as Prisma.JsonArray;
				// Type converting
				const classroomIdelTimes: ClassroomIdleTimes[] = jsonArray.map((item) => {
					const classroomItem = item as ClassroomIdleTimes;
					return {
						name: classroomItem.name,
						idleTimes: classroomItem.idleTimes.map((intervalArray) =>
							intervalArray.map(
								(interval) =>
									({
										start: interval.start,
										end: interval.end,
									} as TimeInterval)
							)
						),
					} as ClassroomIdleTimes;
				});

				const filteredResult = filterIdleClassrooms(
					classroomIdelTimes,
					classroomName,
					day,
					startTime,
					endTime
				);
				res.status(200).json(filteredResult);
                return;
			}

			res.status(200).json({});
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

			if (!startInputTime || (startInputTime >= idleStartTime && endInputTime <= idleEndTime)) {
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
