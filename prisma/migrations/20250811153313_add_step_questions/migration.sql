-- CreateTable
CREATE TABLE "public"."StepQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "answer" INTEGER NOT NULL,
    "stepId" TEXT NOT NULL,

    CONSTRAINT "StepQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."StepQuestion" ADD CONSTRAINT "StepQuestion_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "public"."Step"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
