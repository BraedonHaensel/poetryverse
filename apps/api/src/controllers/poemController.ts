import { prisma } from '@seng513/database'
import type { NextFunction, Request, Response } from 'express'
import config from '../lib/config'
import { GoogleGenAI } from '@google/genai'
import { z, toJSONSchema } from 'zod'
import {
  PoemAIRequest,
  PoemAIResponse,
  aiGenSchema,
} from '../schemas/poemSchemas'
import { logger } from '../lib/logger'

/** Init Google Gemini Client */
const geminiApiKey = config.GEMINI_API_KEY
if (!geminiApiKey) {
  throw new Error('Gemini API failed to retrieve from env')
}
const geminiClient = new GoogleGenAI({ apiKey: geminiApiKey })

/**
 * Controller handling AI generated poems
 *
 * Sends type of poem and the prompt to handler and returns title and poem
 *
 * @param {Request<{}, {}, PoemAIRequest>} req - Express request containing generation request input.
 * @param {Response} res - Express response object containing generation response title and poem.
 * @returns {PoemAIRequest} responseJson - JSON response containing the generated poem.
 *
 * @throws {429} - Gemini API rate limit exceeded.
 * @throws {400} - Request prompts not satisfied.
 * @throws {500} - Poem Generation Request Fails.
 */

export const generateAIPoem = async (
  req: Request<{}, {}, PoemAIRequest>,
  res: Response
) => {
  try {
    logger.info('AI Poem Generating...')
    const { type, prompt } = req.body

    if (!type) {
      logger.warn('Type Not Recieved')
      return res.status(400).json({ error: 'type not provided' })
    }

    if (!prompt) {
      logger.warn('Prompt Not Recieved')
      return res.status(400).json({ error: 'prompt not provided' })
    }
    const geminiPrompt = `Generate a unique ${type} poem and title based off the following prompt: \n${prompt}`
    logger.info('Generating Title & Prompt')
    const result = await geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: geminiPrompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: toJSONSchema(aiGenSchema),
      },
    })

    const responseJSON: PoemAIResponse = aiGenSchema.parse(
      JSON.parse(result.text ?? '')
    )

    return res.status(200).json({ data: responseJSON })
  } catch (err: any) {
    logger.error('Error Generating Poem', err)
    const status = err?.status ?? 500
    const message =
      status === 429
        ? 'Rate limit exceeded, please try again later'
        : 'Poem failed to generate'
    return res.status(status).json({ error: message })
  }
}
