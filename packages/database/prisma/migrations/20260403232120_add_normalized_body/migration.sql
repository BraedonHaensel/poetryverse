/*
  Warnings:

  - Added the required column `normalizedBody` to the `Poem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ReasonType" ADD VALUE 'INAPPROPRIATE';

-- AlterTable
ALTER TABLE "Poem" ADD COLUMN     "normalizedBody" TEXT NOT NULL;
