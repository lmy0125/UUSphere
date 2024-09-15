import { PrismaClient } from '@prisma/client';
// import courses from './courses.json' assert { type: 'json' };

const prisma = new PrismaClient();

// update necessary courses data
async function main() {
	// for (let course of courses) {
	// 	const updated_course = await prisma.course.upsert({
	// 		where: { code: course.code },
	// 		update: {
	// 			department: course.department,
	// 			name: course.name,
	// 			units: course.units.toString(),
	// 			description: course.description,
	// 		},
	// 		create: {
	// 			code: course.code,
	// 			department: course.department,
	// 			name: course.name,
	// 			units: course.units.toString(),
	// 			description: course.description,
	// 			offered: {
	// 				connect: (
	// 					await prisma.class.findMany({
	// 						where: {
	// 							code: course.code,
	// 						},
	// 						select: { id: true }, // Only get the post ids to connect
	// 					})
	// 				).map((c: { id: any }) => ({ id: c.id })),
	// 			},
	// 		},
	// 	});
	// }

	// console.log('Finished');
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
