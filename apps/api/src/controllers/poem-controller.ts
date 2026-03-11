import { GoogleGenAI } from '@google/genai'
import { prisma } from '@seng513/database'
import type { Request, Response } from 'express'
import { toJSONSchema } from 'zod'

import config from '../lib/config'
import { badRequest, HttpError } from '../lib/http-errors'
import { logger } from '../lib/logger'
import { getErrorStatus } from '../lib/utils'
import { mapCreatePoemRequestToPrismaInput } from '../mappers/poem-mapper'
import type { AuthRequest } from '../middleware/auth'
import {
  CreatePoemRequest,
  PoemAIRequest,
  PoemAIResponse,
  PoemAIResponseSchema,
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
  logger.info('AI Poem Generating...')
  const { type, prompt } = req.body as PoemAIRequest

  const geminiPrompt = `Generate a unique ${type} poem and title based off the following prompt: \n${prompt}`
  logger.info('Generating Title & Prompt')

  let result: { text?: string | null }
  try {
    result = await geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: geminiPrompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: toJSONSchema(PoemAIResponseSchema),
      },
    })
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

  const responseJSON: PoemAIResponse = PoemAIResponseSchema.parse(
    JSON.parse(result.text ?? '')
  )

  return res.status(200).json({ data: responseJSON })
}
