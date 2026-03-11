import { GoogleGenAI } from '@google/genai'
import type { Request, Response } from 'express'
import { toJSONSchema } from 'zod'

import config from '../lib/config'
import { logger } from '../lib/logger'
import {
  aiGenSchema,
  interpretSchema,
  PoemAIRequest,
  PoemAIResponse,
  PoemInterpretRequest,
  PoemInterpretResponse,
} from '../schemas/poem-schemas'

/** Init Google Gemini Client. */
const geminiApiKey = config.GEMINI_API_KEY
if (!geminiApiKey) {
  throw new Error('Gemini API failed to retrieve from env')
}
const geminiClient = new GoogleGenAI({ apiKey: geminiApiKey })

/**
 * Controller handling AI generated poems.
 * Sends type of poem and the prompt to handler and returns title and poem.
 * @param {Request} req - Express request containing generation request input.
 * @param {Response} res - Express response object containing generation response title and poem.
 * @returns {PoemAIRequest} responseJson - JSON response containing the generated poem.
 * @throws {429} - Gemini API rate limit exceeded.
 * @throws {400} - Request prompts not satisfied.
 * @throws {500} - Poem Generation Request Fails.
 */

export const generateAIPoem = async (
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  req: Request<{}, {}, PoemAIRequest>,
  res: Response
) => {
  try {
    logger.info('AI poem generating...')
    const { type, prompt } = req.body

    if (!type) {
      logger.warn('Type not recieved.')
      return res.status(400).json({ error: 'Type not provided' })
    }

    if (!prompt) {
      logger.warn('Prompt not recieved')
      return res.status(400).json({ error: 'Prompt not provided' })
    }
    const geminiPrompt = `Generate a unique ${type} poem and title based off the following prompt: \n${prompt}. \n Add new line characters (\n) to show line breaks.`
    logger.info('Generating title & prompt')
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
  } catch (err: unknown) {
    logger.error('Error generating poem: ', err)
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
      status === 429
        ? 'AI usage limit exceeded, please try again later.'
        : 'Poem failed to generate'
    return res.status(status).json({ error: message })
  }
}

/**
 * Controller handling interpretation of poems.
 * Sends type of poem, title, poem, and the prompt to handler and returns an interpretation.
 * @param {Request} req - Express request containing generation request input.
 * @param {Response} res - Express response object containing generation response title and poem.
 * @returns {PoemInterpretResponse} responseJson - JSON response containing the generated poem.
 * @throws {429} - Gemini API rate limit exceeded.
 * @throws {400} - Request prompts not satisfied.
 * @throws {500} - Poem Generation Request Fails.
 */

export const InterpretPoem = async (req: Request, res: Response) => {
  try {
    logger.info('Poem interpretation generating...')
    const { title, type, prompt, poem } = req.body as PoemInterpretRequest

    const geminiPrompt = `Provide a short interpretation of the following poem. Only include the interpretation in your response. Poem type: ${type}. Poem title: ${title}. Poem: ${poem}. User interpretation prompt: ${prompt}.`
    logger.info('Generating poem interpretation')
    const result = await geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: geminiPrompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: toJSONSchema(interpretSchema),
      },
    })

    const responseJSON: PoemInterpretResponse = interpretSchema.parse(
      JSON.parse(result.text ?? '')
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
      status === 429 ? 'AI usage limit exceeded' : 'Poem failed to generate'
    return res.status(status).json({ error: message })
  }
}
