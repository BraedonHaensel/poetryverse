import { z } from 'zod'

/** Validates structured AI generation responses. */
export const PoemAIResponseSchema = z.object({
  title: z.string().describe('Title of the poem.'),
  poem: z.string().describe('The generated poem text.'),
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

/** Type returned by `PoemAIResponseSchema`. */
export type PoemAIResponse = z.infer<typeof PoemAIResponseSchema>

/** Type returned by `interpretSchema`. */
export type PoemInterpretResponse = z.infer<typeof PoemInterpretResponseSchema>

/** Type returned by `PoemPlagiarismTriageResponseSchema`. */
export type PoemPlagiarismTriageResponse = z.infer<
  typeof PoemPlagiarismTriageResponseSchema
>
