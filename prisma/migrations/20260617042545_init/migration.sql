-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "DocCategory" AS ENUM ('GENERAL', 'LICENSE', 'PAID_EDU');

-- CreateTable
CREATE TABLE "CollegeProfile" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "shortName" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "founded" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "kpp" TEXT NOT NULL,
    "ogrn" TEXT NOT NULL,
    "founder" TEXT NOT NULL,
    "founderUrl" TEXT NOT NULL,
    "directorName" TEXT NOT NULL,
    "directorPost" TEXT NOT NULL,
    "directorReceptionTime" TEXT NOT NULL,
    "directorPhone" TEXT NOT NULL,
    "directorEmail" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressShort" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneHref" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "workTime" TEXT NOT NULL,
    "mapCoords" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollegeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "NavItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "status" "NewsStatus" NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatItem" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "suffix" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "StatItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advantage" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Advantage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "forms" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "budgetPlaces" INTEGER NOT NULL,
    "paidPlaces" INTEGER NOT NULL,
    "foreignPlaces" INTEGER NOT NULL,
    "accredited" BOOLEAN NOT NULL,
    "budgetVacant" INTEGER NOT NULL,
    "paidVacant" INTEGER NOT NULL,
    "fgosHref" TEXT NOT NULL,
    "isMarketing" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SvedenSection" (
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "intro" TEXT,

    CONSTRAINT "SvedenSection_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "href" TEXT NOT NULL,
    "category" "DocCategory" NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StructUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "head" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "positionHref" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "StructUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernanceBody" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "GovernanceBody_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "fio" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "disciplines" TEXT NOT NULL,
    "eduLevel" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "academicStatus" TEXT NOT NULL,
    "retraining" TEXT NOT NULL,
    "qualImprovement" TEXT NOT NULL,
    "generalExp" TEXT NOT NULL,
    "specialExp" TEXT NOT NULL,
    "programs" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MtbItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "MtbItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OvzCondition" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "OvzCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stipend" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Stipend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finances" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "year" TEXT NOT NULL,
    "budgetVolume" TEXT NOT NULL,
    "income" TEXT NOT NULL,
    "spending" TEXT NOT NULL,
    "planHref" TEXT NOT NULL,

    CONSTRAINT "Finances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsItem_slug_key" ON "NewsItem"("slug");

-- CreateIndex
CREATE INDEX "NewsItem_status_publishedAt_idx" ON "NewsItem"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Program_code_key" ON "Program"("code");

-- CreateIndex
CREATE INDEX "Document_category_order_idx" ON "Document"("category", "order");
