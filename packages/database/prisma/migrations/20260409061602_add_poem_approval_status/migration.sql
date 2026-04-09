-- CreateEnum
CREATE TYPE "PoemApprovalStatus" AS ENUM ('PENDING', 'UNCHECKED', 'ADMIN_REVIEW', 'APPROVED');

-- AlterTable
ALTER TABLE "Poem" ADD COLUMN     "approvalStatus" "PoemApprovalStatus" NOT NULL DEFAULT 'UNCHECKED',
ADD COLUMN     "plagiarismLikelihoodScore" DOUBLE PRECISION;
