import { CreatePoemRequest } from '../schemas/poem-schemas'

interface CreatePoemMapperInput {
  authorId: string
  data: CreatePoemRequest
  tagIds: string[]
}

/** Maps a validated create-poem request to Prisma create input. */
export const mapCreatePoemRequestToPrismaInput = ({
  authorId,
  data,
  tagIds,
}: CreatePoemMapperInput) => ({
  authorId,
  title: data.title,
  typeId: data.typeId,
  isPublic: data.publicVisibility,
  isAIAssisted: data.createdWithAI,
  body: data.poem,
  poemTags: {
    create: tagIds.map((tagId) => ({
      tag: { connect: { id: tagId } },
    })),
  },
})
