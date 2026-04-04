import { ReasonType } from '@prisma/client'
import { z } from 'zod'

// Validation limits.
const TITLE_MIN = 3
const TITLE_MAX = 40
const POEM_MIN = 20
const POEM_MAX = 1000
const MIN_TAGS = 1
const MAX_TAGS = 5
const PROMPT_MIN = 20
const PROMPT_MAX = 1000
const REPORT_REASON_MIN = 3
const REPORT_REASON_MAX = 200

/** Validates `GET /api/poems` query params. */
export const GetPoemsRequestSchema = z.object({
  authorId: z.string().optional(),
})

/** Validates `GET /api/poems/:id` route params. */
export const GetPoemByIdRequestSchema = z.object({
  params: z.object({
    id: z.cuid('Poem ID must be a valid CUID.'),
  }),
})

/** Validates `PATCH /api/poems/:id` route params. */
export const UpdatePoemParamSchema = z.object({
  params: z.object({
    id: z.cuid('Poem ID must be a valid CUID.'),
  }),
})

/** Validates `PATCH /api/poems/:id` request bodies. */
export const UpdatePoemBodySchema = z.object({
  body: z.object({
    isPublic: z.boolean().optional(),
  }),
})

/** Validates `DELETE /api/poems/:id` route params. */
export const DeletePoemSchema = GetPoemByIdRequestSchema

/** Validates `POST /api/poems` request bodies. */
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

/** Validates `POST /api/poems/generate` request bodies. */
export const PoemAIRequestSchema = z.object({
  body: z.object({
    typeId: z.string().nonempty('Poem type is required.'),
    prompt: z
      .string()
      .min(PROMPT_MIN, `Prompt must be at least ${PROMPT_MIN} characters.`)
      .max(PROMPT_MAX, `Prompt must be at most ${PROMPT_MAX} characters.`),
  }),
})

/** Validates structured AI generation responses. */
export const PoemAIResponseSchema = z.object({
  title: z.string().describe('Title of the poem.'),
  poem: z.string().describe('The generated poem text.'),
})

/** Validates `POST /api/poems/interpret` request bodies. */
export const PoemInterpretRequestSchema = z.object({
  body: z.object({
    prompt: z
      .string()
      .min(PROMPT_MIN, `Prompt must be at least ${PROMPT_MIN} characters.`)
      .max(PROMPT_MAX, `Prompt must be at most ${PROMPT_MAX} characters.`),
    poemId: z.string().nonempty('Poem is required.'),
  }),
})

/** Validates structured AI interpretation responses. */
export const PoemInterpretResponseSchema = z.object({
  interpretation: z
    .string()
    .describe('Interpretation provided from interpret call'),
})

/** Validates structured AI plagiarism triage responses. */
export const PoemPlagiarismTriageResponseSchema = z.object({
  plagiarismLikelihood: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'A score from 0.0 to 1.0 estimating likelihood of substantial external reuse.'
    ),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'A score from 0.0 to 1.0 for confidence in the plagiarism estimate.'
    ),
  reviewRecommendation: z.enum(['allow', 'review']),
  reason: z.string(),
  suspiciousPassages: z.array(
    z.object({
      text: z.string(),
      startLine: z.number().int(),
      endLine: z.number().int(),
      whySuspicious: z.string(),
    })
  ),
  possibleSources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      matchedText: z.string(),
      similarityEstimate: z.number().min(0).max(1),
    })
  ),
  notesForAdmin: z.string(),
})

/** Validates `PUT /api/poems/like` request bodies. */
export const LikePoemRequestSchema = z.object({
  body: z.object({
    poemId: z.string().nonempty('Poem is required.'),
  }),
})

/** Validates `DELETE /api/poems/like` request bodies. */
export const UnlikePoemRequestSchema = LikePoemRequestSchema

/** Validates `POST /api/poems/report` request bodies. */
export const ReportPoemRequestSchema = z.object({
  body: z.object({
    poemId: z.string().nonempty('Poem is required.'),
    reasonType: z.enum(ReasonType),
    reason: z
      .string()
      .min(
        REPORT_REASON_MIN,
        `Report reason must be at least ${REPORT_REASON_MIN} characters.`
      )
      .max(
        REPORT_REASON_MAX,
        `Report reason must be at most ${REPORT_REASON_MAX} characters.`
      ),
  }),
})

/** Validates structured AI interpretation responses. */
export const ReportPoemResponseSchema = z.object({
  reportId: z.string().describe('Id of the created poem report.'),
})

/** Type returned by `interpretSchema`. */
export type PoemInterpretResponse = z.infer<typeof PoemInterpretResponseSchema>

/** Type returned by `PoemAIResponseSchema`. */
export type PoemAIResponse = z.infer<typeof PoemAIResponseSchema>

/** Type returned by `PoemPlagiarismTriageResponseSchema`. */
export type PoemPlagiarismTriageResponse = z.infer<
  typeof PoemPlagiarismTriageResponseSchema
>

/** Request body type for `PoemAIRequestSchema`. */
export type PoemAIRequest = z.infer<typeof PoemAIRequestSchema>['body']

/** Query params type for `GetPoemsRequestSchema`. */
export type GetPoemsRequest = z.infer<typeof GetPoemsRequestSchema>

/** Route params type for `GetPoemByIdRequestSchema`. */
export type GetPoemByIdRequest = z.infer<
  typeof GetPoemByIdRequestSchema
>['params']

/** Route params type for `UpdatePoemParamSchema`. */
export type UpdatePoemParamRequest = z.infer<
  typeof UpdatePoemParamSchema
>['params']

/** Request body type for `UpdatePoemBodySchema`. */
export type UpdatePoemBodyRequest = z.infer<typeof UpdatePoemBodySchema>['body']

/** Route params type for `DeletePoemSchema`. */
export type DeletePoemRequest = z.infer<typeof DeletePoemSchema>['params']

/** Request body type for `CreatePoemRequestSchema`. */
export type CreatePoemRequest = z.infer<typeof CreatePoemRequestSchema>['body']

/** Request body type for `PoemInterpretRequestSchema`. */
export type PoemInterpretRequest = z.infer<
  typeof PoemInterpretRequestSchema
>['body']

/** Request body type for `LikePoemRequestSchema`. */
export type LikePoemRequest = z.infer<typeof LikePoemRequestSchema>['body']

/** Request body type for `UnlikePoemRequestSchema`. */
export type UnlikePoemRequest = z.infer<typeof UnlikePoemRequestSchema>['body']

/** Request body type for `ReportPoemSchema`. */
export type ReportPoemRequest = z.infer<typeof ReportPoemRequestSchema>['body']
