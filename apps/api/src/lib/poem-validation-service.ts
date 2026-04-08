import { Poem, PoemApprovalStatus, ReasonType } from '@prisma/client'
import damerauLevenshtein from 'damerau-levenshtein'

import { getPoemInclude } from '../controllers/poem-controller'
import { normalizePoemBody } from '../mappers/poem-mapper'
import {
  type PoemAIDetectionResponse,
  PoemAIDetectionResponseSchema,
  type PoemPlagiarismTriageResponse,
  PoemPlagiarismTriageResponseSchema,
} from '../schemas/gemini-response-schemas'
import { generateGeminiJSONResponse } from './ai'
import config from './config'
import { prisma } from './db'
import { logger } from './logger'
import { getErrorStatus } from './utils'
import { get } from 'http'

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
  plagiarismGeminiLikelihood: 0.8,
  plagiarismGeminiConfidence: 0.7,
  aiGeminiLikelihood: 0.8,
  aiGeminiConfidence: 0.7,
} as const

export interface PoemPlagiarismSimilarityMatch {
  poemId: string
  title: string
  similarity: number
}

/**
 * Finds the most similar existing poem in the database using Damerau-Levenshtein similarity.
 * @param poemBody Raw poem body submitted by a user.
 * @returns The best similarity match if at least one poem exists; otherwise `null`.
 */
export const detectInternalPlagiarism = async (
  poemBody: string
): Promise<PoemPlagiarismSimilarityMatch | null> => {
  const startedAt = Date.now()
  const normalizedBody = normalizePoemBody(poemBody)
  logger.info(
    `Running internal plagiarism scan normalizedBodyLength=${normalizedBody.length}`
  )

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

  if (bestMatch) {
    logger.info(
      `Internal plagiarism scan complete existingPoemCount=${existingPoems.length} bestMatchPoemId=${bestMatch.poemId} similarity=${bestMatch.similarity.toFixed(3)} durationMs=${Date.now() - startedAt}`
    )
  } else {
    logger.info(
      `Internal plagiarism scan complete existingPoemCount=0 durationMs=${Date.now() - startedAt}`
    )
  }

  return bestMatch
}

/** Adds line numbers to each line in the provided poem body for model prompting. */
const addLineNumbersToPoem = (poemBody: string) =>
  poemBody
    .split('\n')
    .map((line, index) => `${index + 1}: ${line}`)
    .join('\n')

/**
 * Uses Gemini to estimate whether a poem should be routed for plagiarism-focused admin review.
 * @param poemBody Raw poem body to triage.
 * @returns A structured triage response, or `null` when triage is skipped due to rate limit/errors.
 */
const triagePoemPlagiarismWithAI = async (
  poemBody: string
): Promise<PoemPlagiarismTriageResponse | null> => {
  const startedAt = Date.now()
  const poemWithLineNumbers = addLineNumbersToPoem(poemBody)
  logger.info(`Starting Gemini plagiarism triage poemLength=${poemBody.length}`)

  const prompt = PLAGIARISM_PROMPT + poemWithLineNumbers

  try {
    const triage = await generateGeminiJSONResponse(
      prompt,
      PoemPlagiarismTriageResponseSchema
    )
    logger.info(
      `Gemini plagiarism triage complete likelihood=${triage.plagiarismLikelihood.toFixed(3)} confidence=${triage.confidence.toFixed(3)} suspiciousPassagesCount=${triage.suspiciousPassages.length} durationMs=${Date.now() - startedAt}`
    )
    return triage
  } catch (err: unknown) {
    const status = getErrorStatus(err)
    if (status === 429) {
      logger.warn(
        `Gemini plagiarism triage rate limited; skipping triage. durationMs=${Date.now() - startedAt}`
      )
      return null
    }

    logger.warn(
      `Gemini plagiarism triage failed; skipping triage. durationMs=${Date.now() - startedAt} error=${String(err)}`
    )
    return null
  }
}

/** Uses Gemini to estimate whether a poem appears likely AI-authored. */
const detectPoemAIAuthorshipWithGemini = async (
  poemBody: string
): Promise<PoemAIDetectionResponse | null> => {
  const startedAt = Date.now()
  const poemWithLineNumbers = addLineNumbersToPoem(poemBody)
  logger.info(
    `Starting Gemini AI-authorship triage poemLength=${poemBody.length}`
  )
  const prompt = AI_DETECTION_PROMPT + poemWithLineNumbers

  try {
    const detection = await generateGeminiJSONResponse(
      prompt,
      PoemAIDetectionResponseSchema
    )
    logger.info(
      `Gemini AI-authorship triage complete likelihood=${detection.aiLikelihood.toFixed(3)} confidence=${detection.confidence.toFixed(3)} suspiciousPassagesCount=${detection.suspiciousPassages.length} durationMs=${Date.now() - startedAt}`
    )
    return detection
  } catch (err: unknown) {
    const status = getErrorStatus(err)
    if (status === 429) {
      logger.warn(
        `Gemini AI-authorship triage rate limited; skipping triage. durationMs=${Date.now() - startedAt}`
      )
      return null
    }

    logger.warn(
      `Gemini AI-authorship triage failed; skipping triage. durationMs=${Date.now() - startedAt} error=${String(err)}`
    )
    return null
  }
}

/** Builds a moderator-facing reason string for plagiarism auto-reports. */
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

/** Builds a moderator-facing reason string for AI-authorship auto-reports. */
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

/** Persists an automated moderation report for a poem. */
const createAutoReport = async ({
  poemId,
  reasonType,
  reason,
}: {
  poemId: string
  reasonType: ReasonType
  reason: string
}) => {
  logger.info(`Creating auto-report poemId=${poemId} reasonType=${reasonType}`)
  const createdReport = await prisma.report.create({
    data: {
      reporterUserId: null,
      poemId,
      reasonType,
      reason,
    },
  })

  logger.info(
    `Created auto-report reportId=${createdReport.id} poemId=${poemId} reasonType=${reasonType}`
  )

  return createdReport
}

/** Returns whether plagiarism triage exceeds configured review thresholds. */
const shouldFlagPlagiarismTriage = (triage: PoemPlagiarismTriageResponse) =>
  triage.plagiarismLikelihood >=
    POEM_DETECTION_THRESHOLDS.plagiarismGeminiLikelihood &&
  triage.confidence >= POEM_DETECTION_THRESHOLDS.plagiarismGeminiConfidence

/** Returns whether AI-authorship triage exceeds configured review thresholds. */
const shouldFlagAIDetection = (triage: PoemAIDetectionResponse) =>
  triage.aiLikelihood >= POEM_DETECTION_THRESHOLDS.aiGeminiLikelihood &&
  triage.confidence >= POEM_DETECTION_THRESHOLDS.aiGeminiConfidence

/**
 * Runs the full moderation validation pipeline for a poem and updates its approval status.
 * @param poem The poem row to validate.
 * @returns Resolves when validation and persistence complete, or immediately when skipped.
 * @throws {Error} Propagates database/model errors from report creation or poem updates.
 */
export const runPoemValidationPipeline = async (poem: Poem, userId: string) => {
  const startedAt = Date.now()
  logger.info(
    `Starting poem validation pipeline poemId=${poem.id} isPublic=${poem.isPublic} approvalStatus=${poem.approvalStatus} isAIAssisted=${poem.isAIAssisted}`
  )

  const isPendingOrUnchecked =
    poem.approvalStatus === PoemApprovalStatus.PENDING ||
    poem.approvalStatus === PoemApprovalStatus.UNCHECKED

  if (
    !poem.isPublic ||
    !isPendingOrUnchecked ||
    !config.ENABLE_GEMINI_POEM_VALIDATION
  ) {
    // Don't run the validation pipeline if the poem is private, has already been finalized, or gemini validation is disabled.
    logger.info(
      `Skipping poem validation pipeline poemId=${poem.id} reason=${!poem.isPublic ? 'not_public' : 'already_finalized'}`
    )
    return poem
  }

  let createdReport = null

  // Run external plagiarism check with Gemini.
  const plagiarismTriage = await triagePoemPlagiarismWithAI(poem.body)
  if (plagiarismTriage && shouldFlagPlagiarismTriage(plagiarismTriage)) {
    logger.info(
      `Poem flagged for plagiarism auto-report poemId=${poem.id} likelihood=${plagiarismTriage.plagiarismLikelihood.toFixed(3)} confidence=${plagiarismTriage.confidence.toFixed(3)}`
    )
    createdReport = await createAutoReport({
      poemId: poem.id,
      reasonType: ReasonType.PLAGIARISM,
      reason: buildPlagiarismAutoReportReason(plagiarismTriage),
    })
  } else {
    logger.info(`Poem passed plagiarism triage poemId=${poem.id}`)
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
    logger.info(
      `Poem flagged for AI auto-report poemId=${poem.id} likelihood=${aiDetection.aiLikelihood.toFixed(3)} confidence=${aiDetection.confidence.toFixed(3)}`
    )
    createdReport = await createAutoReport({
      poemId: poem.id,
      reasonType: ReasonType.AI,
      reason: buildAIAutoReportReason(aiDetection),
    })
  } else if (aiDetection) {
    logger.info(`Poem passed AI-authorship triage poemId=${poem.id}`)
  }

  // Update the poem with the new approval status and likelihood scoring.
  const finalApprovalStatus = createdReport
    ? PoemApprovalStatus.ADMIN_REVIEW
    : PoemApprovalStatus.APPROVED

  await prisma.poem.update({
    where: { id: poem.id },
    data: {
      approvalStatus: finalApprovalStatus,
      aiLikelihoodScore: aiDetection?.aiLikelihood,
      plagiarismLikelihoodScore: plagiarismTriage?.plagiarismLikelihood,
    },
    include: getPoemInclude(),
  })

  logger.info(
    `Completed poem validation pipeline poemId=${poem.id} finalApprovalStatus=${finalApprovalStatus} reportId=${createdReport?.id ?? 'none'} aiLikelihood=${aiDetection?.aiLikelihood?.toFixed(3) ?? 'n/a'} plagiarismLikelihood=${plagiarismTriage?.plagiarismLikelihood?.toFixed(3) ?? 'n/a'} durationMs=${Date.now() - startedAt}`
  )
}
