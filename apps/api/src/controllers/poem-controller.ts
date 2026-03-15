import { prisma } from '@seng513/database'
import type { Request, Response } from 'express'

import { generateGeminiJSONResponse } from '../lib/ai'
import { badRequest, HttpError, notFound } from '../lib/http-errors'
import { logger } from '../lib/logger'
import { getErrorStatus } from '../lib/utils'
import { mapCreatePoemRequestToPrismaInput } from '../mappers/poem-mapper'
import type { AuthRequest } from '../middleware/auth'
import {
  CreatePoemRequest,
  LikePoemRequest,
  PoemAIRequest,
  PoemAIResponseSchema,
  PoemInterpretRequest,
  PoemInterpretResponseSchema,
  UnlikePoemRequest,
} from '../schemas/poem-schemas'

// Include statement for fetching poems from the database with Prisma.
const poemIncludeStatement = {
  type: true,
  poemTags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
}

/**
 * Creates a poem for the authenticated user.
 * @param req Express request with a validated create-poem body.
 * @param res Express response object.
 * @returns A 201 response containing the created poem.
 * @throws {HttpError} 400 if the poem type or any tag ID is invalid.
 */
export const createPoem = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest

  logger.info(`Creating poem for userId=${authReq.auth.userId}`)

  const poemData = req.body as CreatePoemRequest

  // Get poem tags and type from db first.
  const [_poemType, existingTags] = await Promise.all([
    validateAndReturnPoemType(poemData.typeId),
    validateAndReturnPoemTags(poemData.tagIds),
  ])

  // TODO: add AI-likelihood scoring & plagiarism check steps in here

  // Create the poem.
  const createdPoem = await prisma.poem.create({
    data: mapCreatePoemRequestToPrismaInput({
      authorId: authReq.auth.userId,
      data: poemData,
      tagIds: existingTags.map((tag) => tag.id),
    }),
    include: poemIncludeStatement,
  })

  logger.info(
    `Created poem id=${createdPoem.id} userId=${authReq.auth.userId} typeId=${createdPoem.typeId} tagCount=${createdPoem.poemTags.length}`
  )

  // Return the created poem
  return res.status(201).json({ data: createdPoem })
}

/**
 * Generates a poem from the validated request body.
 * @param req Express request with `type` and `prompt` in `req.body`.
 * @param res Express response object.
 * @returns 200 with `{ data: { title, poem } }`.
 * @throws {HttpError} 429 if the Gemini API is rate limited.
 * @throws {HttpError} 500 if the generation fails.
 */
export const generateAIPoem = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest
  const { typeId, prompt } = req.body as PoemAIRequest
  logger.info(
    `Generating AI poem for userId=${authReq.auth.userId} typeId=${typeId} promptLength=${prompt.length}`
  )

  const type = await validateAndReturnPoemType(typeId)
  const startedAt = Date.now()
  const geminiPrompt = `Generate a unique ${type.name} poem and title based off the following prompt: \n${prompt}. \n Add new line characters (\n) to show line breaks.`

  try {
    const responseJSON = await generateGeminiJSONResponse(
      geminiPrompt,
      PoemAIResponseSchema
    )
    logger.info(
      `Generated AI poem for userId=${authReq.auth.userId} typeId=${typeId} durationMs=${Date.now() - startedAt}`
    )

    return res.status(200).json({ data: responseJSON })
  } catch (err: unknown) {
    const status = getErrorStatus(err)

    if (status === 429) {
      logger.warn(
        `AI poem generation rate limited for userId=${authReq.auth.userId} typeId=${typeId}`
      )
      throw new HttpError(
        429,
        'Rate limit exceeded.',
        err,
        'AI usage limit exceeded. Please try again in a moment.'
      )
    }

    throw new HttpError(
      500,
      'Poem failed to generate.',
      err,
      'We could not generate your poem right now. Please try again.'
    )
  }
}

/**
 * Controller handling interpretation of poems.
 * Sends type of poem, title, poem, and the prompt to handler and returns an interpretation.
 * @param req - Express request containing generation request input.
 * @param res - Express response object containing generation response title and poem.
 * @returns responseJson - JSON response containing the generated poem.
 * @throws {HttpError} 429 if Gemini rate limits the request.
 * @throws {HttpError} 500 if interpretation fails.
 */
export const interpretPoem = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const authReq = req as AuthRequest
  try {
    const { prompt, poemId } = req.body as PoemInterpretRequest
    logger.info(
      `Generating interpretation for userId=${authReq.auth.userId} poemId=${poemId} promptLength=${prompt.length}`
    )

    const poem = await validateAndReturnPoem(poemId)
    const startedAt = Date.now()

    const geminiPrompt = `Provide a short interpretation of the following poem. Only include the interpretation in your response. 
                          Poem type: ${poem.type.name}. Poem title: ${poem.title}. Poem: ${poem.body}. User interpretation prompt: ${prompt}.`

    const responseJSON = await generateGeminiJSONResponse(
      geminiPrompt,
      PoemInterpretResponseSchema
    )
    logger.info(
      `Generated interpretation for userId=${authReq.auth.userId} poemId=${poemId} durationMs=${Date.now() - startedAt}`
    )

    return res.status(200).json({ data: responseJSON })
  } catch (err: unknown) {
    const status = getErrorStatus(err)

    if (status === 429) {
      logger.warn(
        `Poem interpretation rate limited for userId=${authReq.auth.userId}`
      )
      throw new HttpError(
        429,
        'Rate limit exceeded.',
        err,
        'AI usage limit exceeded. Please try again in a moment.'
      )
    }

    throw new HttpError(
      500,
      'Poem failed to generate.',
      err,
      'We could not interpret this poem right now. Please try again.'
    )
  }
}

/**
 * Likes a poem for the authenticated user.
 * @param req Express request with a validated poem ID.
 * @param res Express response object.
 * @returns A 200 response confirming the liked state and current like count.
 * @throws {HttpError} 404 if the poem does not exist.
 */
export const likePoem = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest
  const { poemId } = req.body as LikePoemRequest

  logger.info(`Liking poem for userId=${authReq.auth.userId} poemId=${poemId}`)

  await validateAndReturnPoem(poemId)

  await prisma.poemLike.upsert({
    where: {
      poemId_userId: {
        poemId,
        userId: authReq.auth.userId,
      },
    },
    update: {},
    create: {
      poemId,
      userId: authReq.auth.userId,
    },
  })

  const likesCount = await prisma.poemLike.count({
    where: { poemId },
  })

  logger.info(
    `Liked poem for userId=${authReq.auth.userId} poemId=${poemId} likesCount=${likesCount}`
  )

  return res.status(200).json({
    data: {
      poemId,
      liked: true,
      likesCount,
    },
  })
}

/**
 * Unlikes a poem for the authenticated user.
 * @param req Express request with a validated poem ID.
 * @param res Express response object.
 * @returns A 200 response confirming the unliked state and current like count.
 * @throws {HttpError} 404 if the poem does not exist.
 */
export const unlikePoem = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest
  const { poemId } = req.body as UnlikePoemRequest

  logger.info(
    `Unliking poem for userId=${authReq.auth.userId} poemId=${poemId}`
  )

  await validateAndReturnPoem(poemId)

  await prisma.poemLike.deleteMany({
    where: {
      poemId,
      userId: authReq.auth.userId,
    },
  })

  const likesCount = await prisma.poemLike.count({
    where: { poemId },
  })

  logger.info(
    `Unliked poem for userId=${authReq.auth.userId} poemId=${poemId} likesCount=${likesCount}`
  )

  return res.status(200).json({
    data: {
      poemId,
      liked: false,
      likesCount,
    },
  })
}

/** Validates the typeId against poem types in the database  */
const validateAndReturnPoemType = async (typeId: string) => {
  const poemType = await prisma.poemType.findUnique({
    where: { id: typeId },
  })
  if (!poemType) {
    logger.warn(`Invalid poem type: typeId=${typeId}`)
    throw badRequest('Invalid poem type.')
  }
  return poemType
}

/** Validates tagIds against poem tags in the database. */
const validateAndReturnPoemTags = async (tagIds: string[]) => {
  // Get tags from database.
  const uniqueTagIds = [...new Set(tagIds)]
  const existingTags = await prisma.tag.findMany({
    where: { id: { in: uniqueTagIds } },
  })

  // Check for any invalid tags.
  if (existingTags.length !== uniqueTagIds.length) {
    const foundTagIds = new Set(existingTags.map((tag) => tag.id))
    const missingTagIds = uniqueTagIds.filter((id) => !foundTagIds.has(id))
    logger.warn(`Invalid poem tags: missingTagIds=${missingTagIds.join(',')}`)
    throw badRequest('One or more tags are invalid.', { missingTagIds })
  }
  return existingTags
}

/** validates poemId against poems in the database */
const validateAndReturnPoem = async (poemId: string) => {
  const poem = await prisma.poem.findUnique({
    where: { id: poemId },
    include: poemIncludeStatement,
  })

  if (!poem) {
    logger.warn(`Poem not found: poemId=${poemId}`)
    throw notFound('Invalid poem ID')
  }
  return poem
}
