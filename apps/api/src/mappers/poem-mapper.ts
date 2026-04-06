import { PoemApprovalStatus } from '@prisma/client'

import { CreatePoemRequest } from '../schemas/poem-schemas'

/** Normalizes poem text. */
export const normalizePoemBody = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, ' ') // Replace whitespace characters
    .replace(/[^a-z0-9\s]/g, '') // Replace special characters
    .trim()

interface CreatePoemMapperInput {
  authorId: string
  data: CreatePoemRequest
  tagIds: string[]
  approvalStatus?: PoemApprovalStatus
  plagiarismLikelihoodScore?: number | null
  aiLikelihoodScore?: number | null
}

/** Maps a validated create-poem request to Prisma create input. */
export const mapCreatePoemRequestToPrismaInput = ({
  authorId,
  data,
  tagIds,
  approvalStatus,
  plagiarismLikelihoodScore,
  aiLikelihoodScore,
}: CreatePoemMapperInput) => ({
  authorId,
  title: data.title,
  typeId: data.typeId,
  isPublic: data.publicVisibility,
  isAIAssisted: data.createdWithAI,
  approvalStatus: approvalStatus ?? PoemApprovalStatus.UNCHECKED,
  plagiarismLikelihoodScore: plagiarismLikelihoodScore ?? null,
  aiLikelihoodScore: aiLikelihoodScore ?? null,
  body: data.poem,
  normalizedBody: normalizePoemBody(data.poem),
  poemTags: {
    create: tagIds.map((tagId) => ({
      tag: { connect: { id: tagId } },
    })),
  },
})
