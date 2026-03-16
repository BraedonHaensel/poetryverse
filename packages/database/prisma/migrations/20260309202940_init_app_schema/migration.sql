/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ReasonType" AS ENUM ('CUSTOM', 'AI', 'PLAGIARISM');

-- CreateEnum
CREATE TYPE "ResolutionType" AS ENUM ('KEEP', 'REMOVE', 'UPDATE_AI_TAG');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'RESOLVED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "RoleEnum" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "Poem" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isAIAssisted" BOOLEAN NOT NULL DEFAULT false,
    "aiLikelihoodScore" DOUBLE PRECISION,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoemType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PoemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoemTag" (
    "poemId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "PoemTag_pkey" PRIMARY KEY ("poemId","tagId")
);

-- CreateTable
CREATE TABLE "PoemLike" (
    "poemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoemLike_pkey" PRIMARY KEY ("poemId","userId")
);

-- CreateTable
CREATE TABLE "Follow" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "reporterUserId" TEXT,
    "poemId" TEXT NOT NULL,
    "resolvedByUserId" TEXT,
    "reasonType" "ReasonType" NOT NULL,
    "reason" TEXT NOT NULL,
    "resolution" "ResolutionType",
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Poem_typeId_idx" ON "Poem"("typeId");

-- CreateIndex
CREATE INDEX "Poem_authorId_idx" ON "Poem"("authorId");

-- CreateIndex
CREATE INDEX "Poem_createdAt_idx" ON "Poem"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PoemType_name_key" ON "PoemType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "PoemTag_tagId_idx" ON "PoemTag"("tagId");

-- CreateIndex
CREATE INDEX "PoemLike_userId_idx" ON "PoemLike"("userId");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE INDEX "Report_poemId_idx" ON "Report"("poemId");

-- CreateIndex
CREATE INDEX "Report_reporterUserId_idx" ON "Report"("reporterUserId");

-- CreateIndex
CREATE INDEX "Report_resolvedByUserId_idx" ON "Report"("resolvedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reporterUserId_poemId_key" ON "Report"("reporterUserId", "poemId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poem" ADD CONSTRAINT "Poem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poem" ADD CONSTRAINT "Poem_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PoemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoemTag" ADD CONSTRAINT "PoemTag_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "Poem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoemTag" ADD CONSTRAINT "PoemTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoemLike" ADD CONSTRAINT "PoemLike_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "Poem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoemLike" ADD CONSTRAINT "PoemLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "Poem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
