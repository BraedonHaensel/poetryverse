import { GoogleGenAI } from '@google/genai'
import { toJSONSchema } from 'zod'
import { ZodSchema } from 'zod'

import config from './config'

/** Init Google Gemini Client. */
const geminiApiKey = config.GEMINI_API_KEY
if (!geminiApiKey) {
  throw new Error('Gemini API failed to retrieve from env')
}
const geminiClient = new GoogleGenAI({ apiKey: geminiApiKey })

/**
 * Send an AI prompt to Google Gemini.
 * @param prompt AI promp that is sent.
 * @param schema Schema for AI response.
 * @returns The AI response.
 */
export const generateGeminiJSONResponse = async <T>(
  prompt: string,
  schema: ZodSchema<T>
): Promise<T> => {
  const result = await geminiClient.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: toJSONSchema(schema),
    },
  })

  return schema.parse(JSON.parse(result.text ?? ''))
}
