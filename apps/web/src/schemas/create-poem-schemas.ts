import * as z from 'zod'

// Validation limits
const TITLE_MIN = 3
const TITLE_MAX = 40
const POEM_MIN = 20
const POEM_MAX = 1000
const MIN_TAGS = 1
export const MAX_TAGS = 5 // exported for use by the tags form field
const PROMPT_MIN = 20
const PROMPT_MAX = 1000

/**
 * Schema for validating the create poem from scratch form.
 */
export const CreateFromScratchSchema = z.object({
  typeId: z.string().nonempty('Please select a poem type.'),
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
})

// Type inferred from CreateFromScratchSchema
export type CreateFromScratchSchema = z.infer<typeof CreateFromScratchSchema>

/**
 * Schema for validating the create poem with AI form.
 */
export const CreateWithAISchema = z.object({
  typeId: z.string().nonempty('Please select a poem type.'),
  prompt: z
    .string()
    .min(PROMPT_MIN, `Prompt must be at least ${PROMPT_MIN} characters.`)
    .max(PROMPT_MAX, `Prompt must be at most ${PROMPT_MAX} characters.`),
  title: z
    .string()
    .min(TITLE_MIN, `Title must be at least ${TITLE_MIN} characters.`)
    .max(TITLE_MAX, `Poem must be at most ${TITLE_MAX} characters.`),
  poem: z
    .string()
    .min(POEM_MIN, `Poem must be at least ${POEM_MIN} characters.`)
    .max(POEM_MAX, `Poem must be at most ${POEM_MAX} characters.`),
  tagIds: z
    .array(z.string())
    .min(MIN_TAGS, `Poem must have at least ${MIN_TAGS} tag.`)
    .max(MAX_TAGS, `Poem can have at most ${MAX_TAGS} tags`),
  publicVisibility: z.boolean(),
})

// Type inferred from CreateWithAISchema
export type CreateWithAISchema = z.infer<typeof CreateWithAISchema>
