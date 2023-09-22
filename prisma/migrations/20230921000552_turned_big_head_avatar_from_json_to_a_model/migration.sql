/*
  Warnings:

  - You are about to drop the column `bigHeadAvatar` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bigHeadAvatar";

-- CreateTable
CREATE TABLE "BigHeadAvatar" (
    "id" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "accessory" TEXT,
    "body" TEXT,
    "circleColor" TEXT,
    "clothing" TEXT,
    "clothingColor" TEXT,
    "eyebrows" TEXT,
    "eyes" TEXT,
    "facialHair" TEXT,
    "graphic" TEXT,
    "hair" TEXT,
    "hairColor" TEXT,
    "hat" TEXT,
    "hatColor" TEXT,
    "lashes" TEXT,
    "lipColor" TEXT,
    "mouth" TEXT,
    "skinTone" TEXT,
    "mask" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BigHeadAvatar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BigHeadAvatar_userId_key" ON "BigHeadAvatar"("userId");

-- AddForeignKey
ALTER TABLE "BigHeadAvatar" ADD CONSTRAINT "BigHeadAvatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
