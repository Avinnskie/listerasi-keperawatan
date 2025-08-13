-- CreateTable
CREATE TABLE "public"."CategoryOverview" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "overviewMarkdown" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryOverview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryOverview_category_key" ON "public"."CategoryOverview"("category");
