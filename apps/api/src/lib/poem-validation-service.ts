import { Poem, PoemApprovalStatus, ReasonType } from '@prisma/client'
import damerauLevenshtein from 'damerau-levenshtein'

import { POEM_INCLUDE_STATEMENT } from '../controllers/poem-controller'
import { normalizePoemBody } from '../mappers/poem-mapper'
import {
  type PoemAIDetectionResponse,
  PoemAIDetectionResponseSchema,
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
- suspiciousPassages may be empty if there are no clear signals.
- The reason should be concise, and at most 200 characters long.

The poem is provided with line numbers.

Poem: `

const AI_DETECTION_PROMPT = `You are assisting with AI-authorship triage for a poetry platform.

Your task is NOT to make a final accusation.
Your task is to estimate whether the poem should be sent for human review as potentially AI-generated.

Evaluate the poem for:
1. repetitive or templated phrasing,
2. unusually uniform tone and cadence,
3. generic abstraction with low concrete specificity,
4. signs of machine-like coherence across lines,
5. whether the poem appears human-authored despite polished style.

Important rules:
- Return valid JSON only.
- aiLikelihood must be a number from 0.0 to 1.0.
- confidence must be a number from 0.0 to 1.0.
- Prefer conservative triage, especially with shorter poems.
- suspiciousPassages may be empty if there are no clear signals.
- The reason should be concise, and at most 200 characters long.

The poem is provided with line numbers.

Poem: `

// Thresholds for AI and plagiarism detection.
export const POEM_DETECTION_THRESHOLDS = {
  internalPlagiarism: 0.8,
  plagiarismGeminiLikelihood: 0.7,
  plagiarismGeminiConfidence: 0.6,
  aiGeminiLikelihood: 0.7,
  aiGeminiConfidence: 0.6,
} as const

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

const detectPoemAIAuthorshipWithGemini = async (
  poemBody: string
): Promise<PoemAIDetectionResponse | null> => {
  const poemWithLineNumbers = addLineNumbersToPoem(poemBody)
  const prompt = AI_DETECTION_PROMPT + poemWithLineNumbers

  try {
    return await generateGeminiJSONResponse(
      prompt,
      PoemAIDetectionResponseSchema
    )
  } catch (err: unknown) {
    const status = getErrorStatus(err)
    if (status === 429) {
      logger.warn('Gemini AI-authorship triage rate limited; skipping triage.')
      return null
    }

    logger.warn(
      `Gemini AI-authorship triage failed; skipping triage. ${String(err)}`
    )
    return null
  }
}

const buildPlagiarismAutoReportReason = (
  triage: PoemPlagiarismTriageResponse
) => {
  const suspiciousPassagesSummary = triage.suspiciousPassages
    .slice(0, 3)
    .map(
      (passage) =>
        `lines ${passage.startLine}-${passage.endLine}: ${passage.whySuspicious}`
    )
    .join(' | ')

  const sourceSummary = triage.possibleSources
    .slice(0, 3)
    .map(
      (source) =>
        `${source.title} (${source.url}) similarity=${source.similarityEstimate.toFixed(2)}`
    )
    .join(' | ')

  const reasonSummary = triage.reason.trim()

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

const buildAIAutoReportReason = (detection: PoemAIDetectionResponse) => {
  const suspiciousPassagesSummary = detection.suspiciousPassages
    .slice(0, 3)
    .map(
      (passage) =>
        `lines ${passage.startLine}-${passage.endLine}: ${passage.whyLikelyAI}`
    )
    .join(' | ')

  const reasonSummary = detection.reason.trim()

  const reason = [
    `Auto-generated from Gemini AI-authorship triage.`,
    `likelihood=${detection.aiLikelihood.toFixed(3)} confidence=${detection.confidence.toFixed(3)}`,
    suspiciousPassagesSummary
      ? `suspiciousPassages=${suspiciousPassagesSummary}`
      : undefined,
    reasonSummary ? `reason=${reasonSummary}` : undefined,
  ]
    .filter(Boolean)
    .join('\n')

  return reason.length > 0
    ? reason
    : 'Potential AI-generated content flagged by automated triage.'
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

const shouldFlagPlagiarismTriage = (triage: PoemPlagiarismTriageResponse) =>
  triage.plagiarismLikelihood >=
    POEM_DETECTION_THRESHOLDS.plagiarismGeminiLikelihood &&
  triage.confidence >= POEM_DETECTION_THRESHOLDS.plagiarismGeminiConfidence

const shouldFlagAIDetection = (triage: PoemAIDetectionResponse) =>
  triage.aiLikelihood >= POEM_DETECTION_THRESHOLDS.aiGeminiLikelihood &&
  triage.confidence >= POEM_DETECTION_THRESHOLDS.aiGeminiConfidence

export const runPoemValidationPipeline = async (poem: Poem) => {
  const isPendingOrUnchecked =
    poem.approvalStatus === PoemApprovalStatus.PENDING ||
    poem.approvalStatus === PoemApprovalStatus.UNCHECKED

  if (!poem.isPublic || !isPendingOrUnchecked) {
    // Don't run the validation pipeline if the poem is private or has already been finalized.
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

  // Run AI detection check if the poem hasn't been marked as AI assisted already.
  const aiDetection = poem.isAIAssisted
    ? null
    : await detectPoemAIAuthorshipWithGemini(poem.body)
  if (
    aiDetection &&
    shouldFlagAIDetection(aiDetection) &&
    !createdReport // Only create another report if a plagiarism one wasnt already created.
  ) {
    createdReport = await createAutoReport({
      poemId: poem.id,
      reasonType: ReasonType.AI,
      reason: buildAIAutoReportReason(aiDetection),
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
