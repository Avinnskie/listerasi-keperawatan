/*
  Warnings:

  - Added the required column `category` to the `Materi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Materi` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."MateriType" AS ENUM ('PENGANTAR', 'SUB_MATERI');

-- AlterTable
ALTER TABLE "public"."Materi" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "type" "public"."MateriType" NOT NULL;
