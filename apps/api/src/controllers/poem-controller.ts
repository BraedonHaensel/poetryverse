import { GoogleGenAI } from '@google/genai'
import { prisma } from '@seng513/database'
import type { Request, Response } from 'express'

import { generateGeminiJSONResponse } from '../lib/ai'
import config from '../lib/config'
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

/** Init Google Gemini Client */
const geminiApiKey = config.GEMINI_API_KEY
if (!geminiApiKey) {
  throw new Error('Gemini API failed to retrieve from env')
}
const geminiClient = new GoogleGenAI({ apiKey: geminiApiKey })

/**
 * Creates a poem from validated request data.
 * @param req Express request containing the authenticated user and create payload.
 * @param res Express response object.
 * @returns 201 with the created poem and related type/tags.
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
 * @throws {HttpError} 429 when the Gemini API is rate limited.
 * @throws {HttpError} 500 when generation fails.
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
 * @throws {429} - Gemini API rate limit exceeded.
 * @throws {400} - Request prompts not satisfied.
 * @throws {500} - Poem Generation Request Fails.
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
    logger.error('Error interpreting poem: ', err)
    let status = 500

    if (
      typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      typeof (err as { status: unknown }).status === 'number'
    ) {
      status = (err as { status: number }).status
    }

    const message =
      status === 429 ? 'AI usage limit exceeded.' : 'Poem failed to generate.'
    return res.status(status).json({ error: message })
  }
}
