import { PoemApprovalStatus, ReasonType } from '@prisma/client'
import damerauLevenshtein from 'damerau-levenshtein'

import { normalizePoemBody } from '../mappers/poem-mapper'
import {
  type PoemPlagiarismTriageResponse,
  PoemPlagiarismTriageResponseSchema,
} from '../schemas/gemini-response-schemas'
import { generateGeminiJSONResponse } from './ai'
import { prisma } from './db'
import { logger } from './logger'
import { getErrorStatus } from './utils'

export const POEM_DETECTION_THRESHOLDS = {
  plagiarismSimilarity: 0.8,
  plagiarismGeminiLikelihood: 0.7,
  plagiarismGeminiConfidence: 0.6,
  aiGeminiLikelihood: 0.7,
  aiGeminiConfidence: 0.6,
} as const

const AUTO_REPORT_REASON_MAX_LENGTH = 200

export interface PoemPlagiarismSimilarityMatch {
  poemId: string
  title: string
  similarity: number
}

interface RunPoemCreationPipelineInput<TCreatedPoem extends { id: string }> {
  poemBody: string
  isPublic: boolean
  createPoem: (moderation: {
    approvalStatus: PoemApprovalStatus
    plagiarismLikelihoodScore?: number | null
    aiLikelihoodScore?: number | null
  }) => Promise<TCreatedPoem>
}

type PoemCreationPipelineResult<TCreatedPoem extends { id: string }> =
  | {
      outcome: 'blocked_internal_plagiarism'
      similarity: {
        match: PoemPlagiarismSimilarityMatch
        threshold: number
      }
    }
  | {
      outcome: 'created'
      createdPoem: TCreatedPoem
      approvalStatus: PoemApprovalStatus
      plagiarismSimilarityMatch: PoemPlagiarismSimilarityMatch | null
      plagiarismTriage: PoemPlagiarismTriageResponse | null
      createdReport: {
        id: number
        reasonType: ReasonType
      } | null
    }

/** Finds the most similar existing poem using Damerau-Levenshtein similarity. */
export const detectPoemPlagiarismSimilarity = async (
  poemBody: string
): Promise<PoemPlagiarismSimilarityMatch | null> => {
  const normalizedBody = normalizePoemBody(poemBody)

  const existingPoems = await prisma.poem.findMany({
    select: {
      id: true,
      title: true,
      normalizedBody: true,
    },
  })

  let bestMatch: PoemPlagiarismSimilarityMatch | null = null

  for (const poem of existingPoems) {
    const normalizedExistingBody = String(poem.normalizedBody ?? '')
    const result = damerauLevenshtein(normalizedBody, normalizedExistingBody)
    const similarity = result.similarity

    if (!bestMatch || similarity > bestMatch.similarity) {
      bestMatch = {
        poemId: poem.id,
        title: poem.title,
        similarity,
      }
    }
  }

  return bestMatch
}

const addLineNumbersToPoem = (poemBody: string) =>
  poemBody
    .split('\n')
    .map((line, index) => `${index + 1}: ${line}`)
    .join('\n')

/** Uses Gemini to estimate whether a poem should be flagged for plagiarism review. */
export const triagePoemPlagiarismWithAI = async (
  poemBody: string
): Promise<PoemPlagiarismTriageResponse | null> => {
  const poemWithLineNumbers = addLineNumbersToPoem(poemBody)

  const prompt = `You are assisting with plagiarism triage for a poetry platform.

Your task is NOT to make a final accusation of plagiarism.
Your task is to estimate whether the poem should be sent for human review.

Evaluate the poem for:
1. unusually specific or distinctive phrasing,
2. repeated uncommon phrases that may indicate copying,
3. suspicious similarity to known poetic language or published text,
4. signs of paraphrased reuse,
5. whether the poem appears original but generic.

Important rules:
- Return valid JSON only.
- plagiarismLikelihood must be a number from 0.0 to 1.0.
- confidence must be a number from 0.0 to 1.0.
- Use "allow" only when there is low concern.
- Use "review" when there is moderate to high concern or uncertainty.
- Do not claim certainty unless there is strong evidence.
- Prefer conservative triage, especially with shorter poems.
- If grounded web results are available, include plausible sources in possibleSources.
- If no plausible sources are found, leave possibleSources empty.

The poem is provided with line numbers.

Poem:
${poemWithLineNumbers}`

  try {
    return await generateGeminiJSONResponse(
      prompt,
      PoemPlagiarismTriageResponseSchema
    )
  } catch (err: unknown) {
    const status = getErrorStatus(err)
    if (status === 429) {
      logger.warn('Gemini plagiarism triage rate limited; skipping triage.')
      return null
    }

    logger.warn(
      `Gemini plagiarism triage failed; skipping triage. ${String(err)}`
    )
    return null
  }
}

// TODO: Implement Gemini-based AI-authorship detection.
const detectPoemAIAuthorshipWithGemini = (_poemBody: string) => {
  return null as null | {
    aiLikelihood: number
    confidence: number
    reason: string
  }
}

const shouldFlagPlagiarismTriage = (triage: PoemPlagiarismTriageResponse) =>
  triage.plagiarismLikelihood >=
    POEM_DETECTION_THRESHOLDS.plagiarismGeminiLikelihood &&
  triage.confidence >= POEM_DETECTION_THRESHOLDS.plagiarismGeminiConfidence

const buildPlagiarismAutoReportReason = (
  triage: PoemPlagiarismTriageResponse
) => {
  const sourceSummary = triage.possibleSources
    .slice(0, 3)
    .map(
      (source) =>
        `${source.title} (${source.url}) similarity=${source.similarityEstimate.toFixed(2)}`
    )
    .join(' | ')

  const reason = [
    `Auto-generated from Gemini plagiarism triage.`,
    `likelihood=${triage.plagiarismLikelihood.toFixed(3)} confidence=${triage.confidence.toFixed(3)} recommendation=${triage.reviewRecommendation}`,
    triage.reason.slice(0, AUTO_REPORT_REASON_MAX_LENGTH).trim(),
    sourceSummary ? `possibleSources=${sourceSummary}` : undefined,
  ]
    .filter(Boolean)
    .join('\n')

  return reason.length > 0
    ? reason
    : 'Potential plagiarism flagged by automated triage.'
}

const createAutoReport = async ({
  poemId,
  reasonType,
  reason,
}: {
  poemId: string
  reasonType: ReasonType
  reason: string
}) => {
  return prisma.report.create({
    data: {
      reporterUserId: null,
      poemId,
      reasonType,
      reason,
    },
  })
}

/**
 * Simple creation pipeline:
 * - private poem => create UNCHECKED
 * - public poem => run checks
 *   - internal plagiarism fail => block
 *   - Gemini plagiarism threshold => create ADMIN_REVIEW + plagiarism report
 *   - Gemini AI threshold (TODO) => create ADMIN_REVIEW + AI report
 *   - otherwise => create APPROVED
 */
export const runPoemCreationPipeline = async <
  TCreatedPoem extends { id: string },
>({
  poemBody,
  isPublic,
  createPoem,
}: RunPoemCreationPipelineInput<TCreatedPoem>): Promise<
  PoemCreationPipelineResult<TCreatedPoem>
> => {
  if (!isPublic) {
    const createdPoem = await createPoem({
      approvalStatus: PoemApprovalStatus.UNCHECKED,
    })

    return {
      outcome: 'created',
      createdPoem,
      approvalStatus: PoemApprovalStatus.UNCHECKED,
      plagiarismSimilarityMatch: null,
      plagiarismTriage: null,
      createdReport: null,
    }
  }

  const plagiarismSimilarityMatch =
    await detectPoemPlagiarismSimilarity(poemBody)
  if (
    plagiarismSimilarityMatch &&
    plagiarismSimilarityMatch.similarity >=
      POEM_DETECTION_THRESHOLDS.plagiarismSimilarity
  ) {
    return {
      outcome: 'blocked_internal_plagiarism',
      similarity: {
        match: plagiarismSimilarityMatch,
        threshold: POEM_DETECTION_THRESHOLDS.plagiarismSimilarity,
      },
    }
  }

  const plagiarismTriage = await triagePoemPlagiarismWithAI(poemBody)
  if (plagiarismTriage && shouldFlagPlagiarismTriage(plagiarismTriage)) {
    const createdPoem = await createPoem({
      approvalStatus: PoemApprovalStatus.ADMIN_REVIEW,
      plagiarismLikelihoodScore: plagiarismTriage.plagiarismLikelihood,
    })

    const createdReport = await createAutoReport({
      poemId: createdPoem.id,
      reasonType: ReasonType.PLAGIARISM,
      reason: buildPlagiarismAutoReportReason(plagiarismTriage),
    })

    return {
      outcome: 'created',
      createdPoem,
      approvalStatus: PoemApprovalStatus.ADMIN_REVIEW,
      plagiarismSimilarityMatch,
      plagiarismTriage,
      createdReport: {
        id: createdReport.id,
        reasonType: ReasonType.PLAGIARISM,
      },
    }
  }

  const aiDetection = detectPoemAIAuthorshipWithGemini(poemBody)
  if (
    aiDetection &&
    aiDetection.aiLikelihood >= POEM_DETECTION_THRESHOLDS.aiGeminiLikelihood &&
    aiDetection.confidence >= POEM_DETECTION_THRESHOLDS.aiGeminiConfidence
  ) {
    const createdPoem = await createPoem({
      approvalStatus: PoemApprovalStatus.ADMIN_REVIEW,
      plagiarismLikelihoodScore: plagiarismTriage?.plagiarismLikelihood ?? null,
      aiLikelihoodScore: aiDetection.aiLikelihood,
    })

    const createdReport = await createAutoReport({
      poemId: createdPoem.id,
      reasonType: ReasonType.AI,
      reason: aiDetection.reason,
    })

    return {
      outcome: 'created',
      createdPoem,
      approvalStatus: PoemApprovalStatus.ADMIN_REVIEW,
      plagiarismSimilarityMatch,
      plagiarismTriage,
      createdReport: {
        id: createdReport.id,
        reasonType: ReasonType.AI,
      },
    }
  }

  const createdPoem = await createPoem({
    approvalStatus: PoemApprovalStatus.APPROVED,
    plagiarismLikelihoodScore: plagiarismTriage?.plagiarismLikelihood ?? null,
  })

  return {
    outcome: 'created',
    createdPoem,
    approvalStatus: PoemApprovalStatus.APPROVED,
    plagiarismSimilarityMatch,
    plagiarismTriage,
    createdReport: null,
  }
}
