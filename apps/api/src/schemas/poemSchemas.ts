import { z, toJSONSchema } from 'zod'

/**
 * AI generation prompt and type sent to Gemini Model
 * Describes the type of poem and user prompt used when requesting an AI generated poem response.
 */
export interface PoemAIRequest {
  /**
   * The type of poem the user requests to be generated
   */
  type: string
  /**
   * The description prompt of the poem requested
   */
  prompt: string
}

/**
 * AI generation JSON Schema response
 * Describes the type of poem and user prompt used when requesting an AI generated poem response.
 */
export const aiGenSchema = z.object({
  /**
   * The AI generated title of poem returned
   */
  title: z.string().describe('Title of the poem.'),
  /**
   * The AI generated poem returned
   */
  poem: z.string().describe('The generated poem text.'),
})

/** Response Type expected from route post/api/generate */
export type PoemAIResponse = z.infer<typeof aiGenSchema>
