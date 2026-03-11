import { z } from 'zod'

const PROMPT_MIN = 20
const PROMPT_MAX = 1000

/**
 * AI generation prompt and type sent to gemini model.
 * Describes the type of poem and user prompt used when requesting an AI generated poem response.
 */
export interface PoemAIRequest {
  /**
   * The type of poem the user requests to be generated.
   */
  type: string
  /**
   * The description prompt of the poem requested.
   */
  prompt: string
}

/**
 * AI generation JSON Schema response.
 * Describes the type of poem and user prompt used when requesting an AI generated poem response.
 */
export const aiGenSchema = z.object({
  /**
   * The AI generated title of poem returned.
   */
  title: z.string().describe('Title of the poem.'),
  /**
   * The AI generated poem returned
   */
  poem: z.string().describe('The generated poem text.'),
})

/** Response Type expected from route api/poems/generate*/
export type PoemAIResponse = z.infer<typeof aiGenSchema>

/**
 * AI interpretation title, prompt, poem, and type sent to gemini model.
 * Describes the title, type of poem, poem, and interpretation prompt the user requests that is sent to the gemini model.
 */
export const PoemInterpretRequestSchema = z.object({
  body: z.object({
    title: z.string().nonempty('Poem type is required'),
    type: z.string().nonempty('Poem title is required.'),
    prompt: z
      .string()
      .min(PROMPT_MIN, `Prompt must be at least ${PROMPT_MIN} characters.`)
      .max(PROMPT_MAX, `Prompt must be at most ${PROMPT_MAX} characters.`),
    poem: z.string().nonempty('Poem is required.'),
  }),
})

export type PoemInterpretRequest = z.infer<
  typeof PoemInterpretRequestSchema
>['body']

/**
 * AI interpretation JSON schema response.
 * Describes interepretation response expected schema.
 */
export const interpretSchema = z.object({
  /**
   * The interpretation of poem recieved.
   */
  interpretation: z
    .string()
    .describe('Interpretation provided from interpret call'),
})

/** Response Type expected from route api/poems/interpret */
export type PoemInterpretResponse = z.infer<typeof interpretSchema>
