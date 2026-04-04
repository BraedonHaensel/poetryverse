import { Prisma, ReasonType, RoleEnum } from '@prisma/client'
import damerauLevenshtein from 'damerau-levenshtein'
import type { Request, Response } from 'express'

import { generateGeminiJSONResponse } from '../lib/ai'
import { prisma } from '../lib/db'
import {
  badRequest,
  conflict,
  HttpError,
  notFound,
  unauthorized,
} from '../lib/http-errors'
import { logger } from '../lib/logger'
import { getErrorStatus } from '../lib/utils'
import {
  mapCreatePoemRequestToPrismaInput,
  normalizePoemBody,
} from '../mappers/poem-mapper'
import {
  type AuthRequest,
  hasRole,
  type OptionalAuthRequest,
} from '../middleware/auth'
import {
  CreatePoemRequest,
  DeletePoemRequest,
  GetPoemByIdRequest,
  GetPoemsRequest,
  LikePoemRequest,
  PoemAIRequest,
  PoemAIResponseSchema,
  PoemInterpretRequest,
  PoemInterpretResponseSchema,
  PoemPlagiarismTriageResponse,
  PoemPlagiarismTriageResponseSchema,
  ReportPoemRequest,
  UnlikePoemRequest,
  UpdatePoemBodyRequest,
  UpdatePoemParamRequest,
} from '../schemas/poem-schemas'
import { validateUserExists } from './user-controller'

const PLAGIARISM_SIMILARITY_THRESHOLD = 0.8
const GEMINI_PLAGIARISM_REPORT_THRESHOLD = 0.7
const GEMINI_PLAGIARISM_REPORT_CONFIDENCE_THRESHOLD = 0.6
const AUTO_REPORT_REASON_MAX_LENGTH = 200

// Include statement for fetching poems from the database with Prisma.
const poemIncludeStatement = {
  type: true,
  poemTags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
}

/**
 * Retrieves poems with from the database and returns them as JSON.
 * @param _req Incoming Express request.
 * @param res Express response used to return poems.
 * @returns A 200 response containing the list of poems.
 * @throws {HttpError} 404 if a user with the specified authorId does not exist.
 */
export const getPoems = async (req: Request, res: Response) => {
  const authReq = req as OptionalAuthRequest
  const requesterUserId = authReq.auth?.userId

  const query = req.query as GetPoemsRequest
  const authorId = query?.authorId

  if (authorId) {
    await validateUserExists(authorId)

    if (requesterUserId && authorId === requesterUserId) {
      // If this user is requesting their own poems, return all of their poems
      logger.info(`Fetching all poems with authorId=${authorId}`)
      const poems = await prisma.poem.findMany({
        where: { authorId },
        include: poemIncludeStatement,
        orderBy: { createdAt: 'desc' },
      })
      logger.info(
        `Fetched all poems with authorId=${authorId}, count=${poems.length}`
      )
      return res.status(200).json(poems)
    } else {
      // Guest or user is requsting someone else's poems, return only public poems
      logger.info(`Fetching all public poems with authorId=${authorId}`)
      const poems = await prisma.poem.findMany({
        where: {
          authorId,
          isPublic: true,
        },
        include: poemIncludeStatement,
        orderBy: { createdAt: 'desc' },
      })
      logger.info(
        `Fetched all public poems with authorId=${authorId}, count=${poems.length}`
      )
      return res.status(200).json(poems)
    }
  } else {
    // If authorId is not provided, return all public poems
    logger.info('Fetching all public poems')
    const poems = await prisma.poem.findMany({
      where: { isPublic: true },
      include: poemIncludeStatement,
    })
    logger.info(`Fetched all public poems count=${poems.length}`)
    return res.status(200).json(poems)
  }
}

/**
 * Retrieves a poem by poem ID with the database and returns it as JSON.
 * @param _req Incoming Express request.
 * @param res Express response used to return the requested poem.
 * @returns A 200 response containing the requested poem.
 * @throws {HttpError} 404 if a poem with the specified ID does not exist or if the requester does not have access to the poem.
 */
export const getPoemById = async (req: Request, res: Response) => {
  const authReq = req as OptionalAuthRequest
  const requesterUserId = authReq.auth?.userId
  const { id: poemId } = req.params as GetPoemByIdRequest

  const poemData = await validateAndReturnPoem(poemId)
  if (poemData.isPublic || poemData.authorId === requesterUserId) {
    logger.info(`Fetched poem by id=${poemId} for userId=${requesterUserId}`)
    return res.status(200).json(poemData)
  } else {
    logger.warn(
      `Unauthorized access attempt for poemId=${poemId} by userId=${requesterUserId}`
    )
    throw notFound('Poem not found')
  }
}

/**
 * Updates a poem's public visibility by poem ID.
 * @param _req Incoming Express request.
 * @param res Express response used to return the updated poem.
 * @returns A 200 response containing the updated poem.
 * @throws {HttpError} 403 if the requester does not have permission to update the poem.
 * @throws {HttpError} 404 if a poem with the specified ID does not exist.
 */
export const updatePoem = async (req: AuthRequest, res: Response) => {
  const requesterUserId = req.auth.userId
  const { id: poemId } = req.params as UpdatePoemParamRequest
  const { isPublic } = req.body as UpdatePoemBodyRequest

  const poemData = await validateAndReturnPoem(poemId)

  if (poemData.authorId === requesterUserId) {
    logger.info(
      `Updating poem poemId=${poemId} for userId=${requesterUserId} with isPublic=${isPublic}`
    )
    const updatedPoem = await prisma.poem.update({
      where: { id: poemId },
      data: { isPublic },
      include: poemIncludeStatement,
    })
    logger.info(
      `Updated poem poemId=${poemId} for userId=${requesterUserId} with isPublic=${isPublic}`
    )
    return res.status(200).json(updatedPoem)
  }
  throw unauthorized('You do not have permission to update this poem.')
}

/**
 * Deletes a poem with the specified ID.
 * @param _req Incoming Express request.
 * @param res Express response object.
 * @returns A 204 response with no body.
 * @throws {HttpError} 403 if the requester does not have permission to delete the poem.
 * @throws {HttpError} 404 if a poem with the specified ID does not exist or if the requester does not have access to the poem.
 */
export const deletePoem = async (req: AuthRequest, res: Response) => {
  const requesterUserId = req.auth.userId
  const { id: poemId } = req.params as DeletePoemRequest

  const poemData = await validateAndReturnPoem(poemId)
  // Check if the requester is the same as the author, or if the requester is an admin or above
  const isAdminOrAbove = hasRole(req.auth.role, RoleEnum.ADMIN)
  if (requesterUserId === poemData.authorId || isAdminOrAbove) {
    logger.info(`Deleting poem poemId=${poemId}`)
    await prisma.poem.deleteMany({
      where: {
        id: poemId,
      },
    })
    return res.status(204).send()
  } else {
    logger.warn(
      `Unauthorized delete attempt for poemId=${poemId} by userId=${requesterUserId}`
    )
    throw unauthorized('You do not have permission to delete this poem.')
  }
}

/**
 * Creates a poem for the authenticated user.
 * @param req Express request with a validated create-poem body.
 * @param res Express response object.
 * @returns A 201 response containing the created poem.
 * @throws {HttpError} 400 if the poem type or any tag ID is invalid.
 */
export const createPoem = async (req: AuthRequest, res: Response) => {
  logger.info(`Creating poem for userId=${req.auth.userId}`)

  const poemData = req.body as CreatePoemRequest

  // Get poem tags and type from db first.
  const [_poemType, existingTags] = await Promise.all([
    validateAndReturnPoemType(poemData.typeId),
    validateAndReturnPoemTags(poemData.tagIds),
  ])

  // Check for plagiarism against existing poems.
  const plagiarismResult = await detectPlagiarism(poemData.poem)
  if (plagiarismResult) {
    logger.info(
      `Plagiarism check for userId=${req.auth.userId} bestMatchPoemId=${plagiarismResult.poemId} similarity=${plagiarismResult.similarity.toFixed(3)}`
    )
  }

  if (
    plagiarismResult &&
    plagiarismResult.similarity >= PLAGIARISM_SIMILARITY_THRESHOLD
  ) {
    logger.warn(
      `Blocked poem creation for userId=${req.auth.userId} due to plagiarism risk matchedPoemId=${plagiarismResult.poemId} similarity=${plagiarismResult.similarity.toFixed(3)}`
    )
    throw conflict(
      'Poem failed plagiarism check.',
      {
        similarity: plagiarismResult.similarity,
        threshold: PLAGIARISM_SIMILARITY_THRESHOLD,
        matchedPoemId: plagiarismResult.poemId,
        matchedPoemTitle: plagiarismResult.title,
      },
      'This poem appears too similar to an existing poem. Please revise and try again.'
    )
  }

  const plagiarismTriage = await triagePlagiarismWithGemini(poemData.poem)

  if (plagiarismTriage) {
    logger.info(
      `Gemini plagiarism triage for userId=${req.auth.userId} likelihood=${plagiarismTriage.plagiarismLikelihood.toFixed(3)} confidence=${plagiarismTriage.confidence.toFixed(3)} recommendation=${plagiarismTriage.reviewRecommendation}`
    )
  }

  // Create the poem.
  const createdPoem = await prisma.poem.create({
    data: mapCreatePoemRequestToPrismaInput({
      authorId: req.auth.userId,
      data: poemData,
      tagIds: existingTags.map((tag) => tag.id),
    }),
    include: poemIncludeStatement,
  })

  logger.info(
    `Created poem id=${createdPoem.id} userId=${req.auth.userId} typeId=${createdPoem.typeId} tagCount=${createdPoem.poemTags.length}`
  )

  if (plagiarismTriage && shouldAutoCreatePlagiarismReport(plagiarismTriage)) {
    const reportReason = plagiarismTriage.reason
      .slice(0, AUTO_REPORT_REASON_MAX_LENGTH)
      .trim()

    const sourceSummary = plagiarismTriage.possibleSources
      .slice(0, 3)
      .map(
        (source) =>
          `${source.title} (${source.url}) similarity=${source.similarityEstimate.toFixed(2)}`
      )
      .join(' | ')

    const adminNote = [
      `Auto-generated from Gemini plagiarism triage.`,
      `likelihood=${plagiarismTriage.plagiarismLikelihood.toFixed(3)} confidence=${plagiarismTriage.confidence.toFixed(3)} recommendation=${plagiarismTriage.reviewRecommendation}`,
      plagiarismTriage.notesForAdmin,
      sourceSummary ? `possibleSources=${sourceSummary}` : undefined,
    ]
      .filter(Boolean)
      .join('\n')

    const createdReport = await prisma.report.create({
      data: {
        reporterUserId: null,
        poemId: createdPoem.id,
        reasonType: ReasonType.PLAGIARISM,
        reason:
          reportReason || 'Potential plagiarism flagged by automated triage.',
        adminNote,
      },
    })

    logger.warn(
      `Auto-created plagiarism reportId=${createdReport.id} for poemId=${createdPoem.id} likelihood=${plagiarismTriage.plagiarismLikelihood.toFixed(3)}`
    )
  }

  // Return the created poem
  return res.status(201).json({ data: createdPoem })
}

/**
 * Generates a poem from the validated request body.
 * @param req Express request with `type` and `prompt` in `req.body`.
 * @param res Express response object.
 * @returns 200 with `{ data: { title, poem } }`.
 * @throws {HttpError} 429 if the Gemini API is rate limited.
 * @throws {HttpError} 500 if the generation fails.
 */
export const generateAIPoem = async (req: AuthRequest, res: Response) => {
  const { typeId, prompt } = req.body as PoemAIRequest
  logger.info(
    `Generating AI poem for userId=${req.auth.userId} typeId=${typeId} promptLength=${prompt.length}`
  )

  const type = await validateAndReturnPoemType(typeId)
  const startedAt = Date.now()
  const geminiPrompt = `Generate a unique ${type.name} poem and title based off the following prompt: \n${prompt}. \n Add new line characters (\n) to show line breaks.`

  try {
    const responseJSON = await generateGeminiJSONResponse(
      geminiPrompt,
      PoemAIResponseSchema
    )
    logger.info(
      `Generated AI poem for userId=${req.auth.userId} typeId=${typeId} durationMs=${Date.now() - startedAt}`
    )

    return res.status(200).json({ data: responseJSON })
  } catch (err: unknown) {
    const status = getErrorStatus(err)

    if (status === 429) {
      logger.warn(
        `AI poem generation rate limited for userId=${req.auth.userId} typeId=${typeId}`
      )
      throw new HttpError(
        429,
        'Rate limit exceeded.',
        err,
        'AI usage limit exceeded. Please try again in a moment.'
      )
    }

    throw new HttpError(
      500,
      'Poem failed to generate.',
      err,
      'We could not generate your poem right now. Please try again.'
    )
  }
}

/**
 * Controller handling interpretation of poems.
 * Sends type of poem, title, poem, and the prompt to handler and returns an interpretation.
 * @param req - Express request containing generation request input.
 * @param res - Express response object containing generation response title and poem.
 * @returns responseJson - JSON response containing the generated poem.
 * @throws {HttpError} 429 if Gemini rate limits the request.
 * @throws {HttpError} 500 if interpretation fails.
 */
export const interpretPoem = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { prompt, poemId } = req.body as PoemInterpretRequest
    logger.info(
      `Generating interpretation for userId=${req.auth.userId} poemId=${poemId} promptLength=${prompt.length}`
    )

    const poem = await validateAndReturnPoem(poemId)
    const startedAt = Date.now()

    const geminiPrompt = `Provide a short interpretation of the following poem. Only include the interpretation in your response. 
                          Poem type: ${poem.type.name}. Poem title: ${poem.title}. Poem: ${poem.body}. User interpretation prompt: ${prompt}.`

    const responseJSON = await generateGeminiJSONResponse(
      geminiPrompt,
      PoemInterpretResponseSchema
    )
    logger.info(
      `Generated interpretation for userId=${req.auth.userId} poemId=${poemId} durationMs=${Date.now() - startedAt}`
    )

    return res.status(200).json({ data: responseJSON })
  } catch (err: unknown) {
    const status = getErrorStatus(err)

    if (status === 429) {
      logger.warn(
        `Poem interpretation rate limited for userId=${req.auth.userId}`
      )
      throw new HttpError(
        429,
        'Rate limit exceeded.',
        err,
        'AI usage limit exceeded. Please try again in a moment.'
      )
    }

    throw new HttpError(
      500,
      'Poem failed to generate.',
      err,
      'We could not interpret this poem right now. Please try again.'
    )
  }
}

/**
 * Likes a poem for the authenticated user.
 * @param req Express request with a validated poem ID.
 * @param res Express response object.
 * @returns A 200 response confirming the liked state and current like count.
 * @throws {HttpError} 404 if the poem does not exist.
 */
export const likePoem = async (req: AuthRequest, res: Response) => {
  const { poemId } = req.body as LikePoemRequest

  logger.info(`Liking poem for userId=${req.auth.userId} poemId=${poemId}`)

  await validateAndReturnPoem(poemId)

  await prisma.poemLike.upsert({
    where: {
      poemId_userId: {
        poemId,
        userId: req.auth.userId,
      },
    },
    update: {},
    create: {
      poemId,
      userId: req.auth.userId,
    },
  })

  const likesCount = await prisma.poemLike.count({
    where: { poemId },
  })

  logger.info(
    `Liked poem for userId=${req.auth.userId} poemId=${poemId} likesCount=${likesCount}`
  )

  return res.status(200).json({
    data: {
      poemId,
      liked: true,
      likesCount,
    },
  })
}

/**
 * Unlikes a poem for the authenticated user.
 * @param req Express request with a validated poem ID.
 * @param res Express response object.
 * @returns A 200 response confirming the unliked state and current like count.
 * @throws {HttpError} 404 if the poem does not exist.
 */
export const unlikePoem = async (req: AuthRequest, res: Response) => {
  const { poemId } = req.body as UnlikePoemRequest

  logger.info(`Unliking poem for userId=${req.auth.userId} poemId=${poemId}`)

  await validateAndReturnPoem(poemId)

  await prisma.poemLike.deleteMany({
    where: {
      poemId,
      userId: req.auth.userId,
    },
  })

  const likesCount = await prisma.poemLike.count({
    where: { poemId },
  })

  logger.info(
    `Unliked poem for userId=${req.auth.userId} poemId=${poemId} likesCount=${likesCount}`
  )

  return res.status(200).json({
    data: {
      poemId,
      liked: false,
      likesCount,
    },
  })
}

/**
 * Reports a poem for the authenticated user.
 * @param req Express request with a validated poem ID, report reason, and report reason type.
 * @param res Express response object.
 * @returns A 200 response confirming the report has been created.
 * @throws {HttpError} 404 if the poem does not exist.
 * @throws {HttpError} 400 if this user has already reported this poem.
 */
export const reportPoem = async (req: AuthRequest, res: Response) => {
  const { poemId, reasonType, reason } = req.body as ReportPoemRequest

  logger.info(
    `Reporting poem for userId=${req.auth.userId} poemId=${poemId} reasonType=${reasonType}`
  )

  await validateAndReturnPoem(poemId)

  try {
    // Create the report
    const createdReport = await prisma.report.create({
      data: {
        poemId,
        reporterUserId: req.auth.userId,
        reasonType,
        reason,
      },
    })

    logger.info(
      `Reported poem for userId=${req.auth.userId} poemId=${poemId} reportId=${createdReport.id}`
    )

    return res.status(201).json({
      data: {
        poemId,
        createdReport,
      },
    })
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new HttpError(400, 'You have already reported this poem.')
      }
    }
    throw err
  }
}

/** Validates the typeId against poem types in the database. */
const validateAndReturnPoemType = async (typeId: string) => {
  const poemType = await prisma.poemType.findUnique({
    where: { id: typeId },
  })
  if (!poemType) {
    logger.warn(`Invalid poem type: typeId=${typeId}`)
    throw badRequest('Invalid poem type.')
  }
  return poemType
}

/** Validates tagIds against poem tags in the database. */
const validateAndReturnPoemTags = async (tagIds: string[]) => {
  // Get tags from database.
  const uniqueTagIds = [...new Set(tagIds)]
  const existingTags = await prisma.tag.findMany({
    where: { id: { in: uniqueTagIds } },
  })

  // Check for any invalid tags.
  if (existingTags.length !== uniqueTagIds.length) {
    const foundTagIds = new Set(existingTags.map((tag) => tag.id))
    const missingTagIds = uniqueTagIds.filter((id) => !foundTagIds.has(id))
    logger.warn(`Invalid poem tags: missingTagIds=${missingTagIds.join(',')}`)
    throw badRequest('One or more tags are invalid.', { missingTagIds })
  }
  return existingTags
}

/** Validates poemId against poems in the database. */
const validateAndReturnPoem = async (poemId: string) => {
  const poem = await prisma.poem.findUnique({
    where: { id: poemId },
    include: poemIncludeStatement,
  })

  if (!poem) {
    logger.warn(`Poem not found: poemId=${poemId}`)
    throw notFound('Invalid poem ID')
  }
  return poem
}

/** Finds the most similar existing poem using Damerau-Levenshtein similarity. */
const detectPlagiarism = async (poemBody: string) => {
  const normalizedBody = normalizePoemBody(poemBody)

  const existingPoems = await prisma.poem.findMany({
    select: {
      id: true,
      title: true,
      normalizedBody: true,
    },
  })

  if (existingPoems.length === 0) {
    return null
  }

  let bestMatch: {
    poemId: string
    title: string
    similarity: number
  } | null = null

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

const shouldAutoCreatePlagiarismReport = (
  triage: PoemPlagiarismTriageResponse
) =>
  triage.plagiarismLikelihood >= GEMINI_PLAGIARISM_REPORT_THRESHOLD &&
  triage.confidence >= GEMINI_PLAGIARISM_REPORT_CONFIDENCE_THRESHOLD

const triagePlagiarismWithGemini = async (poemBody: string) => {
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
- Use "review" when there is moderate concern or uncertainty.
- Use "high_priority_review" when there are strong signs of copied language or likely matching sources.
- Do not claim certainty unless there is strong evidence.
- Prefer conservative triage: when unsure, recommend review rather than accusation.
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

/** Retrieves daily poem from database by validating greatest like count over the past 24 hours.*/
async function getPoemOfDay() {
  //Retrieve the timestamp of the previous 24 hours.
  const DAY_MS = 24 * 60 * 60 * 1000
  const now = new Date()
  const lastDayTimestamp = new Date(now.getTime() - DAY_MS)

  //Retrieve the poemId from public poems with the greatest number of likes in the past 24 hours.
  const topLikedPoem = await prisma.poemLike.groupBy({
    by: ['poemId'],
    where: {
      createdAt: {
        gte: lastDayTimestamp,
      },
      poem: {
        isPublic: true,
      },
    },
    _count: {
      poemId: true,
    },
    _max: {
      createdAt: true,
    },
    orderBy: [{ _count: { poemId: 'desc' } }, { _max: { createdAt: 'desc' } }],
    take: 1,
  })

  //Fetch the poem using the poemId with the greatest number of likes in the past 24 hours. Ensure the author, number of likes, and tags are included.
  if (topLikedPoem.length > 0) {
    const poem = await prisma.poem.findFirst({
      where: {
        id: topLikedPoem[0].poemId,
        isPublic: true,
      },
      include: {
        author: true,
        likes: true,
        poemTags: {
          include: { tag: true },
        },
      },
    })
    if (poem) {
      return poem
    }
  }

  // If each poem does not have a like. Then fetch a random poem from the poems database
  const count = await prisma.poem.count({
    where: { isPublic: true },
  })
  if (count === 0) {
    return null
  }
  const randIndex = Math.floor(Math.random() * count)

  const randPoem = await prisma.poem.findFirst({
    skip: randIndex,
    take: 1,
    where: { isPublic: true },
    include: {
      author: true,
      likes: true,
      poemTags: { include: { tag: true } },
    },
  })
  return randPoem
}

/**
 * Determine poem of the day from poetryverse database.
 * @param req Express request.
 * @param res Express response.
 * @returns A 200 response with the poem of the day information.
 * @throws {HttpError} 404 if the poem does not exist.
 */
export const getDailyPoem = async (req: Request, res: Response) => {
  logger.info('Fetch new poem of the day.')
  const poem = await getPoemOfDay()
  if (!poem) {
    logger.warn('Poem of the day failed to retrieve')
    throw new HttpError(
      404,
      'No poems found',
      null,
      'There are no poems available right now.'
    )
  }

  logger.info(`Poem of the day: ${poem.id}`)

  return res.status(200).json({ data: poem })
}
