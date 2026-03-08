import * as z from 'zod'

// Validation limits
const TITLE_MIN = 3
const TITLE_MAX = 30
const POEM_MIN = 20
const POEM_MAX = 1000
const MIN_TAGS = 1
const MAX_TAGS = 5

// Schema for validating the create poem from scratch form
export const CreateFromScratchSchema = z.object({
  type: z.string().nonempty('Please select a poem type.'),
  poem: z
    .string()
    .min(POEM_MIN, `Poem must be at least ${POEM_MIN} characters.`)
    .max(POEM_MAX, `Poem must be at most ${POEM_MAX} characters.`),
  title: z
    .string()
    .min(TITLE_MIN, `Title must be at least ${TITLE_MIN} characters.`)
    .max(TITLE_MAX, `Poem must be at most ${TITLE_MAX} characters.`),
  tags: z
    .array(z.string())
    .min(MIN_TAGS, `Poem must have at least ${MIN_TAGS} tags.`)
    .max(MAX_TAGS, `Poem can have at most ${MAX_TAGS} tags`),
  publicVisibility: z.boolean(),
  createdWithAI: z.boolean(),
})

// Type inferred from CreateFromScratchSchema
export type CreateFromScratchSchema = z.infer<typeof CreateFromScratchSchema>
