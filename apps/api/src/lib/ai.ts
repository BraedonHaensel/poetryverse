import { GoogleGenAI } from '@google/genai'
import { toJSONSchema } from 'zod'
import { ZodSchema } from 'zod'

import config from './config'

/** Initializes the Gemini client. */
const geminiApiKey = config.GEMINI_API_KEY
if (!geminiApiKey) {
  throw new Error('Gemini API failed to retrieve from env')
}
const geminiClient = new GoogleGenAI({ apiKey: geminiApiKey })

/**
 * Sends a prompt to Gemini and validates the JSON response with Zod.
 * @param prompt Prompt text sent to Gemini.
 * @param schema Zod schema used to validate and type the response.
 * @returns Parsed response typed to the provided schema.
 * @throws {ZodError} If the Gemini response does not match the schema.
 * @throws {SyntaxError} If the Gemini response is not valid JSON.
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
