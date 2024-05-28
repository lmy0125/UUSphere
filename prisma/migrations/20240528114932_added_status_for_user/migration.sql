-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Chilling', 'Studying', 'Eating', 'Sleeping');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Chilling';
