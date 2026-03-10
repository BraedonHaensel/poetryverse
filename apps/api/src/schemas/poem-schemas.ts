import { z } from 'zod'

// Validation limits
const TITLE_MIN = 3
const TITLE_MAX = 30
const POEM_MIN = 20
const POEM_MAX = 1000
const MIN_TAGS = 1
const MAX_TAGS = 5
const PROMPT_MIN = 20
const PROMPT_MAX = 1000

/**
 * Schema for validating poem creation requests.
 */
export const CreatePoemRequestSchema = z.object({
  body: z.object({
    typeId: z.string().nonempty('Poem type is required.'),
    poem: z
      .string()
      .min(POEM_MIN, `Poem must be at least ${POEM_MIN} characters.`)
      .max(POEM_MAX, `Poem must be at most ${POEM_MAX} characters.`),
    title: z
      .string()
      .min(TITLE_MIN, `Title must be at least ${TITLE_MIN} characters.`)
      .max(TITLE_MAX, `Poem must be at most ${TITLE_MAX} characters.`),
    tagIds: z
      .array(z.string())
      .min(MIN_TAGS, `Poem must have at least ${MIN_TAGS} tag.`)
      .max(MAX_TAGS, `Poem can have at most ${MAX_TAGS} tags`),
    publicVisibility: z.boolean(),
    createdWithAI: z.boolean(),
  }),
})

/**
 * Schema for validating poem ai generation requests.
 */
export const PoemAIRequestSchema = z.object({
  body: z.object({
    type: z.string().nonempty('Poem type is required.'),
    prompt: z
      .string()
      .min(PROMPT_MIN, `Prompt must be at least ${PROMPT_MIN} characters.`)
      .max(PROMPT_MAX, `Prompt must be at most ${PROMPT_MAX} characters.`),
  }),
})

/**
 * AI generation JSON Schema response.
 * Describes the type of poem and user prompt used when requesting an AI generated poem response.
 */
export const PoemAIResponseSchema = z.object({
  // The AI generated title of poem returned.
  title: z.string().describe('Title of the poem.'),

  // The AI generated poem returned.
  poem: z.string().describe('The generated poem text.'),
})

// Response Type expected from route post/api/generate.
export type PoemAIResponse = z.infer<typeof PoemAIResponseSchema>

// Type inferred from PoemAIRequestSchema.
export type PoemAIRequest = z.infer<typeof PoemAIRequestSchema>['body']

// Type inferred from CreatePoemRequestSchema.
export type CreatePoemRequest = z.infer<typeof CreatePoemRequestSchema>['body']
