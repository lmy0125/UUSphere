import { ClassroomSchedules, ClassroomIdleTimes, TimeInterval } from '@/types/classroom';
import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

async function main() {
	// try {
	// 	const classesFA23 = await prisma.class.findMany({
	// 		where: {
	// 			quarter: 'FA23',
	// 		},
	// 		select: {
	// 			sections: { select: { meetings: true } },
	// 		},
	// 	});

	// 	const classesWI24 = await prisma.class.findMany({
	// 		where: {
	// 			quarter: 'WI24',
	// 		},
	// 		select: {
	// 			sections: { select: { meetings: true } },
	// 		},
	// 	});

	// 	let classroomSchedules: any = {};

	// 	for (const c of classesFA23) {
	// 		for (const section of c.sections) {
	// 			for (const meeting of section.meetings) {
	// 				let { location } = meeting;
	// 				if (location && location != ' ' && location != 'TBA') {
	// 					classroomSchedules[location] = [];
	// 				}
	// 			}
	// 		}
	// 	}

	// 	for (const c of classesWI24) {
	// 		for (const section of c.sections) {
	// 			for (const meeting of section.meetings) {
	// 				let { location, sectionId, ...rest } = meeting;
	// 				if (location && location in classroomSchedules) {
	// 					classroomSchedules[location].push(rest);
	// 				} else {
	// 					if (location && location != ' ' && location != 'TBA') {
	// 						classroomSchedules[location] = [rest];
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}

	// 	const classroomIdelTimes: ClassroomIdleTimes[] = calculateIdleTimes(classroomSchedules);
	// 	const classroomsJsonArray: Prisma.JsonArray = classroomIdelTimes;
	// 	await prisma.classroomIdleSchedule.create({
	// 		data: {
	// 			quarter: 'WI24',
	// 			data: classroomsJsonArray,
	// 		},
	// 	});
	// 	console.log('Success');
	// } catch (e) {
	// 	console.log('Error');
	// }
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

function parseTime(time: string): number {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes; // Convert time to minutes for easy comparison
}

function formatTime(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
