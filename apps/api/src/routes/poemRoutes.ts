import dotenv from 'dotenv'
dotenv.config()

import { Router } from 'express'
import { Request, Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { error } from 'console'

const router = Router()

// Init Google Gemini Client
const geminiApiKey = process.env['GEMINI_API_KEY']

if (!geminiApiKey) {
  throw new Error('Gemini API failed to retrieve from env')
}

const geminiClient = new GoogleGenerativeAI(geminiApiKey)

const model = geminiClient.getGenerativeModel({
  model: 'gemini-2.5-flash',
})

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
 * AI generation response returned by the gemini model
 * Returns a json schema that includes a ai generated title and poem
 */
interface PoemAIResponse {
  /**
   * The title suggested by the model based off the prompt
   */
  title: string
  /**
   * The poem suggested by the model based off the type and propmt requested
   */
  poem: string
}

/*Helper function: Parse AI Response*/
const generateParser = (responseText: string): PoemAIResponse => {
  const parsedJSON = responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()
  return JSON.parse(parsedJSON)
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

      if (!type || !prompt) {
        return res.status(400).json({ error: 'type or poem not provided' })
      }

      const geminiPrompt = `Generate a ${type} poem and title based off the following prompt below: \n ${prompt} \n Ensure that only the JSON is returned in the following format \n {"title": "...", "poem": "..."}`
      const result = await model.generateContent(geminiPrompt)
      const responseText = result.response.text()
      const responseJSON: PoemAIResponse = generateParser(responseText)

      return res.status(200).json({ data: responseJSON })
    } catch {
      console.error('Error Generating Poem')
      return res.status(500).json({ error: 'Poem Failed to generate' })
    }
  }
)

export default router
