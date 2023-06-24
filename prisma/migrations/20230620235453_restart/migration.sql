/*
  Warnings:

  - You are about to drop the `Class_WI23` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Class_test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Class_WI23ToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Class_testToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Class_WI23ToUser" DROP CONSTRAINT "_Class_WI23ToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_Class_WI23ToUser" DROP CONSTRAINT "_Class_WI23ToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_Class_testToUser" DROP CONSTRAINT "_Class_testToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_Class_testToUser" DROP CONSTRAINT "_Class_testToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- DropTable
DROP TABLE "Class_WI23";

-- DropTable
DROP TABLE "Class_test";

-- DropTable
DROP TABLE "_Class_WI23ToUser";

-- DropTable
DROP TABLE "_Class_testToUser";

-- CreateTable
CREATE TABLE "Course" (
    "department" TEXT,
    "code" TEXT,
    "name" TEXT,
    "units" TEXT,
    "description" TEXT,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "total_seats" INTEGER NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "daysOfWeek" INTEGER[],
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "location" TEXT,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_id_key" ON "Course"("id");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_id_fkey" FOREIGN KEY ("id") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_id_fkey" FOREIGN KEY ("id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_id_fkey" FOREIGN KEY ("id") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
