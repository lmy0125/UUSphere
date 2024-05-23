/*
  Warnings:

  - The primary key for the `Building` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Building` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `buildingId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_buildingId_fkey";

-- AlterTable
ALTER TABLE "Building" DROP CONSTRAINT "Building_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Building_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "buildingId",
ADD COLUMN     "buildingId" UUID;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE SET NULL ON UPDATE CASCADE;
