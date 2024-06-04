import { PrismaClient } from '@prisma/client';
import classes from './classes_FA24.json' assert { type: 'json' };

const prisma = new PrismaClient();

// insert the classes.json to the database
async function main() {
	for (let c of classes) {
		const sections = eval(c.sections);

		const new_class = await prisma.class.create({
			data: {
				code: c.code,
				quarter: c.quarter,
				course: {
					connectOrCreate: {
						where: { code: c.code },
						create: {
							department: 'Undefined',
							code: c.code,
						},
					},
				},
				instructor: {
					connectOrCreate: {
						where: { name: c.instructor },
						create: { name: c.instructor, school: 'UCSD' },
					},
				},
				sections: {
					create: sections.map((section: any) => ({
						school_id: section.section_id.toString(),
						code: section.section_code,
						total_seats: section.total_seats,
						meetings: {
							create: section.meetings.map((meeting: any) => ({
								type: meeting.type,
								daysOfWeek: eval(meeting.daysOfWeek),
								startTime: meeting.startTime,
								endTime: meeting.endTime,
								location: meeting.location,
							})),
						},
					})),
				},
			},
			include: { instructor: true, sections: true, course: true },
		});
	}

	console.log('Finished');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
