import dotenv from 'dotenv'
dotenv.config()

import { Router } from 'express'
import { Request, Response } from 'express'
import { GoogleGenAI } from '@google/genai'
import { error } from 'console'
import { z, toJSONSchema } from 'zod'

const router = Router()

// Init Google Gemini Client
const geminiApiKey = process.env['GEMINI_API_KEY']

if (!geminiApiKey) {
  throw new Error('Gemini API failed to retrieve from env')
}

const geminiClient = new GoogleGenAI({ apiKey: geminiApiKey })

const aiGenSchema = z.object({
  title: z.string().describe('Title of the poem.'),
  poem: z.string().describe('The generated poem text.'),
})

type PoemAIResponse = z.infer<typeof aiGenSchema>

/**
 * AI generation prompt and type sent to Gemini Model
 * Describes the type of poem and user prompt used when requestion an ai generated poem response
 */
interface PoemAIRequest {
  /**
   * The type of poem the user requests to be generated
   */
  type: string
  /**
   * the description prompt of the poem requested
   */
  prompt: string
}

/**
 * Route serving AI generated poem form
 * @name post/api/users/generate
 * @function
 * @memberof module:routes/poemRoutes
 * @inner
 * @param {PoemAIRequest} req.body - Request body containing poem type and prompt
 * @param {Response} res - Express response object
 * @returns {PoemAIResponse} JSON response containing generated poem data
 */
router.post(
  '/generate',
  async (req: Request<{}, {}, PoemAIRequest>, res: Response) => {
    try {
      const { type, prompt } = req.body

      if (!type) {
        return res.status(400).json({ error: 'type not provided' })
      }

      if (!prompt) {
        return res.status(400).json({ error: 'prompt not provided' })
      }
      const geminiPrompt = `Generate a ${type} poem and title based off the following prompt: \n${prompt}`

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
      console.error('Error Generating Poem', err)
      const status = err?.status ?? 500
      const message =
        status === 429
          ? 'Rate limit exceeded, please try again later'
          : 'Poem failed to generate'
      return res.status(status).json({ error: message })
    }
  }
)

export default router
