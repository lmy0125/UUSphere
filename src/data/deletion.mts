import { PrismaClient } from '@prisma/client';
import classes from './classes.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
	const deleteClasses = prisma.class.deleteMany({});

	const deleteProfessors = prisma.professor.deleteMany({});

	const deleteSections = prisma.section.deleteMany({});

	const deleteMeetings = prisma.meeting.deleteMany({});

	const transaction = await prisma.$transaction([deleteMeetings, deleteSections, deleteClasses, deleteProfessors]);
	console.log("Finished");
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
