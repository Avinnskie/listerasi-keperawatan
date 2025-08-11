/*
  Warnings:

  - You are about to drop the column `category` on the `Materi` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Materi` table. All the data in the column will be lost.
  - Changed the type of `answer` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "public"."Materi" DROP COLUMN "category",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "answer",
ADD COLUMN     "answer" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."MateriType";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
