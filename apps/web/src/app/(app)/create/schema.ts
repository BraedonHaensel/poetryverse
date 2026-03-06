import * as z from 'zod'

// Input character limits
const TITLE_MIN = 3
const TITLE_MAX = 30
const POEM_MIN = 20
const POEM_MAX = 1000

// Schema for validating the create poem from scratch form
export const CreateFromScratchSchema = z.object({
  type: z.string().min(1, 'Please select a poem type.'),
  poem: z
    .string()
    .min(POEM_MIN, `Poem must be at least ${POEM_MIN} characters.`)
    .max(POEM_MAX, `Poem must be at most ${POEM_MAX} characters.`),
  title: z
    .string()
    .min(TITLE_MIN, `Title must be at least ${TITLE_MIN} characters.`)
    .max(TITLE_MAX, `Poem must be at most ${TITLE_MAX} characters.`),
  publicVisibility: z.boolean(),
  createdWithAI: z.boolean(),
})

// Type inferred from CreateFromScratchSchema
export type CreateFromScratchSchema = z.infer<typeof CreateFromScratchSchema>
