import { GoogleGenAI } from '@google/genai'
import type { Request, Response } from 'express'
import { toJSONSchema } from 'zod'

import config from '../lib/config'
import { HttpError } from '../lib/http-errors'
import { logger } from '../lib/logger'
import {
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

const getErrorStatus = (err: unknown): number | undefined => {
  if (typeof err !== 'object' || err === null) {
    return undefined
  }

  const status = (err as { status?: unknown }).status
  return typeof status === 'number' ? status : undefined
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
        'Rate limit exceeded, please try again later',
        err
      )
    }

    throw new HttpError(500, 'Poem failed to generate', err)
  }

  const responseJSON: PoemAIResponse = PoemAIResponseSchema.parse(
    JSON.parse(result.text ?? '')
  )

  return res.status(200).json({ data: responseJSON })
}
