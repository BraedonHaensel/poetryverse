/*
  Warnings:

  - Added the required column `approvalStatus` to the `Poem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PoemApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'ADMIN_REVIEW');

-- AlterTable
ALTER TABLE "Poem" ADD COLUMN     "approvalStatus" "PoemApprovalStatus" NOT NULL,
ADD COLUMN     "plagiarismLikelihoodScore" DOUBLE PRECISION;
