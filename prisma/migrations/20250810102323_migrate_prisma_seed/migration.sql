-- CreateTable
CREATE TABLE "public"."Materi" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Materi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "materiId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Materi_slug_key" ON "public"."Materi"("slug");

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES "public"."Materi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
