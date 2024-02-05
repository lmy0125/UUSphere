-- CreateTable
CREATE TABLE "ClassroomIdleSchedule" (
    "id" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassroomIdleSchedule_pkey" PRIMARY KEY ("id")
);
