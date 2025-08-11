/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Materi` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `materiId` on the `Question` table. All the data in the column will be lost.
  - Added the required column `type` to the `Materi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."MateriType" AS ENUM ('PENGANTAR', 'SUB_MATERI');

-- CreateEnum
CREATE TYPE "public"."TestType" AS ENUM ('PRE', 'POST');

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_materiId_fkey";

-- AlterTable
ALTER TABLE "public"."Materi" DROP COLUMN "createdAt",
ADD COLUMN     "type" "public"."MateriType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "createdAt",
DROP COLUMN "materiId",
ADD COLUMN     "testId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Step" (
    "id" TEXT NOT NULL,
    "materiId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Test" (
    "id" TEXT NOT NULL,
    "materiId" TEXT NOT NULL,
    "type" "public"."TestType" NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Step" ADD CONSTRAINT "Step_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES "public"."Materi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Test" ADD CONSTRAINT "Test_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES "public"."Materi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "public"."Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
