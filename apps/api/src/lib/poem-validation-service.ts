import { Poem, PoemApprovalStatus, ReasonType } from '@prisma/client'
import damerauLevenshtein from 'damerau-levenshtein'

import { POEM_INCLUDE_STATEMENT } from '../controllers/poem-controller'
import { normalizePoemBody } from '../mappers/poem-mapper'
import {
  type PoemPlagiarismTriageResponse,
  PoemPlagiarismTriageResponseSchema,
} from '../schemas/gemini-response-schemas'
import { generateGeminiJSONResponse } from './ai'
import { prisma } from './db'
import { logger } from './logger'
import { getErrorStatus } from './utils'

// Prompt constants
const PLAGIARISM_PROMPT = `You are assisting with plagiarism triage for a poetry platform.

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
- Prefer conservative triage, especially with shorter poems.
- If grounded web results are available, include plausible sources in possibleSources.
- If no plausible sources are found, leave possibleSources empty.

The poem is provided with line numbers.

Poem: `

const _AI_DETECTION_PROMPT = ``

// Thresholds for AI and plagiarism detection.
export const POEM_DETECTION_THRESHOLDS = {
  internalPlagiarism: 0.8,
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

/** Finds the most similar existing poem using Damerau-Levenshtein similarity. */
export const detectInternalPlagiarism = async (
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

  const prompt = PLAGIARISM_PROMPT + poemWithLineNumbers

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
  const suspiciousPassagesSummary = triage.suspiciousPassages
    .slice(0, 3)
    .map(
      (passage) =>
        `lines ${passage.startLine}-${passage.endLine}: "${passage.text}" (${passage.whySuspicious})`
    )
    .join(' | ')

  const sourceSummary = triage.possibleSources
    .slice(0, 3)
    .map(
      (source) =>
        `${source.title} (${source.url}) similarity=${source.similarityEstimate.toFixed(2)}`
    )
    .join(' | ')

  const reasonSummary = triage.reason
    .slice(0, AUTO_REPORT_REASON_MAX_LENGTH)
    .trim()

  const reason = [
    `Auto-generated from Gemini plagiarism triage.`,
    `likelihood=${triage.plagiarismLikelihood.toFixed(3)} confidence=${triage.confidence.toFixed(3)}`,
    suspiciousPassagesSummary
      ? `suspiciousPassages=${suspiciousPassagesSummary}`
      : undefined,
    reasonSummary ? `reason=${reasonSummary}` : undefined,
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
export const runPoemValidationPipeline = async (poem: Poem) => {
  if (!poem.isPublic || poem.approvalStatus !== PoemApprovalStatus.UNCHECKED) {
    // Don't run the validation pipeline if the poem is private or has already been checked.
    return poem
  }

  let createdReport = null

  // Run external plagiarism check with Gemini.
  const plagiarismTriage = await triagePoemPlagiarismWithAI(poem.body)
  if (plagiarismTriage && shouldFlagPlagiarismTriage(plagiarismTriage)) {
    createdReport = await createAutoReport({
      poemId: poem.id,
      reasonType: ReasonType.PLAGIARISM,
      reason: buildPlagiarismAutoReportReason(plagiarismTriage),
    })
  }

  // Run AI detection check.
  const aiDetection = detectPoemAIAuthorshipWithGemini(poem.body)
  if (
    aiDetection &&
    aiDetection.aiLikelihood >= POEM_DETECTION_THRESHOLDS.aiGeminiLikelihood &&
    aiDetection.confidence >= POEM_DETECTION_THRESHOLDS.aiGeminiConfidence &&
    !createdReport // Only create another report if a plagiarism one wasnt already created.
  ) {
    createdReport = await createAutoReport({
      poemId: poem.id,
      reasonType: ReasonType.AI,
      reason: aiDetection.reason,
    })
  }

  // Update the poem with the new approval status and likelihood scoring.
  const updatedPoem = await prisma.poem.update({
    where: { id: poem.id },
    data: {
      approvalStatus: createdReport
        ? PoemApprovalStatus.ADMIN_REVIEW
        : PoemApprovalStatus.APPROVED,
      aiLikelihoodScore: aiDetection?.aiLikelihood,
      plagiarismLikelihoodScore: plagiarismTriage?.plagiarismLikelihood,
    },
    include: POEM_INCLUDE_STATEMENT,
  })

  return updatedPoem
}
