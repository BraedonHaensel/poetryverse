import { CreatePoemRequest } from '../schemas/poem-schemas'

interface CreatePoemMapperInput {
  authorId: string
  data: CreatePoemRequest
  tagIds: string[]
}

/**
 * Maps the validated create-poem request into Prisma's create payload.
 */
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
