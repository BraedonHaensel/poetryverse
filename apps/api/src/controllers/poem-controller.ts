import { prisma } from '@seng513/database'
import type { Request, Response } from 'express'

import { generateGeminiJSONResponse } from '../lib/ai'
import { badRequest, HttpError } from '../lib/http-errors'
import { logger } from '../lib/logger'
import { getErrorStatus } from '../lib/utils'
import { mapCreatePoemRequestToPrismaInput } from '../mappers/poem-mapper'
import type { AuthRequest } from '../middleware/auth'
import {
  CreatePoemRequest,
  interpretSchema,
  PoemAIRequest,
  PoemAIResponseSchema,
  PoemInterpretRequest,
} from '../schemas/poem-schemas'

/**
 * Creates a poem for the authenticated user.
 * @param req Express request with a validated create-poem body.
 * @param res Express response object.
 * @returns A 201 response containing the created poem.
 * @throws {HttpError} 400 if the poem type or any tag ID is invalid.
 */
export const createPoem = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest

  logger.info(
    `Received a request to create a poem by a user with ID: ${authReq.auth.userId}`
  )

  const poemData = req.body as CreatePoemRequest

  // Get poem tags and type from db first.
  const uniqueTagIds = [...new Set(poemData.tagIds)]
  const [poemType, existingTags] = await Promise.all([
    prisma.poemType.findUnique({
      where: { id: poemData.typeId },
      select: { id: true },
    }),
    prisma.tag.findMany({
      where: { id: { in: uniqueTagIds } },
      select: { id: true },
    }),
  ])

  // Check poem type and tags in request are all valid.
  if (!poemType) {
    throw badRequest('Invalid poem type.')
  }

  if (existingTags.length !== uniqueTagIds.length) {
    const foundTagIds = new Set(existingTags.map((tag) => tag.id))
    const missingTagIds = uniqueTagIds.filter((id) => !foundTagIds.has(id))
    throw badRequest('One or more tags are invalid.', { missingTagIds })
  }

  // Create the poem.
  const createdPoem = await prisma.poem.create({
    data: mapCreatePoemRequestToPrismaInput({
      authorId: authReq.auth.userId,
      data: poemData,
      tagIds: uniqueTagIds,
    }),
    include: {
      type: true,
      poemTags: true,
    },
  })

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
  logger.info(`Generating AI Poem for user with ID: ${authReq.auth.userId}`)

  const { type, prompt } = req.body as PoemAIRequest

  const geminiPrompt = `Generate a unique ${type} poem and title based off the following prompt: \n${prompt}. \n Add new line characters (\n) to show line breaks.`
  logger.info('Generating title & prompt')

  try {
    const responseJSON = await generateGeminiJSONResponse(
      geminiPrompt,
      PoemAIResponseSchema
    )

    return res.status(200).json({ data: responseJSON })
  } catch (err: unknown) {
    const status = getErrorStatus(err)

    if (status === 429) {
      throw new HttpError(
        429,
        'Rate limit exceeded, please try again later.',
        err
      )
    }

    throw new HttpError(500, 'Poem failed to generate.', err)
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
  try {
    logger.info('Poem interpretation generating...')
    const { title, type, prompt, poem } = req.body as PoemInterpretRequest

    const geminiPrompt = `Provide a short interpretation of the following poem. Only include the interpretation in your response. Poem type: ${type}. Poem title: ${title}. Poem: ${poem}. User interpretation prompt: ${prompt}.`
    const responseJSON = await generateGeminiJSONResponse(
      geminiPrompt,
      interpretSchema
    )

    return res.status(200).json({ data: responseJSON })
  } catch (err: unknown) {
    const status = getErrorStatus(err)

    if (status === 429) {
      throw new HttpError(
        429,
        'Rate limit exceeded, please try again later.',
        err
      )
    }

    throw new HttpError(500, 'Poem failed to generate.', err)
  }
}
