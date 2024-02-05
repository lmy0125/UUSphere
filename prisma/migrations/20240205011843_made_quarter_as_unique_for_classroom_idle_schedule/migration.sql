/*
  Warnings:

  - A unique constraint covering the columns `[quarter]` on the table `ClassroomIdleSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClassroomIdleSchedule_quarter_key" ON "ClassroomIdleSchedule"("quarter");
