import {
  PoemApprovalStatus,
  Prisma,
  ReasonType,
  RoleEnum,
} from '@prisma/client'
import type { Request, Response } from 'express'

import { generateGeminiJSONResponse } from '../lib/ai'
import config from '../lib/config'
import { prisma } from '../lib/db'
import {
  badRequest,
  conflict,
  HttpError,
  notFound,
  unauthorized,
} from '../lib/http-errors'
import { logger } from '../lib/logger'
import {
  detectInternalPlagiarism,
  POEM_DETECTION_THRESHOLDS,
  runPoemValidationPipeline,
} from '../lib/poem-validation-service'
import { getErrorStatus } from '../lib/utils'
import { mapCreatePoemRequestToPrismaInput } from '../mappers/poem-mapper'
import {
  type AuthRequest,
  hasRole,
  type OptionalAuthRequest,
} from '../middleware/auth'
import {
  PoemAIResponseSchema,
  PoemInterpretResponseSchema,
} from '../schemas/gemini-response-schemas'
import {
  CreatePoemRequest,
  DeletePoemRequest,
  GetPoemByIdRequest,
  GetPoemsRequest,
  LikePoemRequest,
  PoemAIRequest,
  PoemInterpretRequest,
  ReportPoemRequest,
  UnlikePoemRequest,
  UpdatePoemBodyRequest,
  UpdatePoemParamRequest,
} from '../schemas/poem-schemas'
import { validateUserExists } from './user-controller'

// Include statement for fetching poems from the database with Prisma.
export const POEM_INCLUDE_STATEMENT = {
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
  author: {
    select: {
      username: true,
    },
  },
  _count: {
    select: {
      likes: true,
    },
  },
} satisfies Prisma.PoemInclude

const PUBLIC_APPROVED_POEM_FILTER = {
  isPublic: true,
  approvalStatus: PoemApprovalStatus.APPROVED,
} as const

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
        include: POEM_INCLUDE_STATEMENT,
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
          ...PUBLIC_APPROVED_POEM_FILTER,
        },
        include: POEM_INCLUDE_STATEMENT,
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
    const poems = await getPublicPoems()
    logger.info(`Fetched all public poems count=${poems.length}`)
    return res.status(200).json(poems)
  }
}

/**
 * Retrieves public poems with from the database, excluding the requester's poems.
 * @param _req Incoming Express request.
 * @param res Express response used to return poems.
 * @returns A 200 response containing the list of poems.
 */
export const getPoemsFeed = async (req: Request, res: Response) => {
  const authReq = req as OptionalAuthRequest
  const requesterUserId = authReq.auth?.userId

  logger.info(`Fetching poems feed for userId=${requesterUserId ?? 'guest'}`)
  const poems = await getPublicPoems(requesterUserId)
  const shuffledPoems = poems.sort(() => Math.random() - 0.5)
  logger.info(`Fetched poems feed count=${shuffledPoems.length}`)
  return res.status(200).json(shuffledPoems)
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
  const canAccessPublicPoem =
    poemData.isPublic && poemData.approvalStatus === PoemApprovalStatus.APPROVED

  if (canAccessPublicPoem || poemData.authorId === requesterUserId) {
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

  const existingPoem = await validateAndReturnPoem(poemId)

  if (existingPoem.authorId !== requesterUserId) {
    throw unauthorized('You do not have permission to update this poem.')
  }

  logger.info(
    `Updating poem poemId=${poemId} for userId=${requesterUserId} with isPublic=${isPublic}`
  )

  // Update approval status to PENDING if the poem has to be validated with Gemini.
  const existingApprovalStatus = existingPoem.approvalStatus
  const shouldRunValidationPipeline =
    config.ENABLE_GEMINI_POEM_VALIDATION &&
    isPublic &&
    existingApprovalStatus === PoemApprovalStatus.UNCHECKED

  const updatedPoem = await prisma.poem.update({
    where: { id: poemId },
    data: {
      isPublic,
      approvalStatus: shouldRunValidationPipeline
        ? PoemApprovalStatus.PENDING
        : existingApprovalStatus,
    },
    include: POEM_INCLUDE_STATEMENT,
  })
  logger.info(
    `Updated poem poemId=${poemId} for userId=${requesterUserId} with isPublic=${isPublic}`
  )

  if (shouldRunValidationPipeline) {
    // Validate public poems in the background after returning a pending response.
    void runPoemValidationPipeline(updatedPoem).catch((err: unknown) => {
      logger.error(
        `Background poem validation failed for poemId=${updatedPoem.id} userId=${req.auth.userId}: ${String(err)}`
      )
    })
  }

  return res.status(200).json(updatedPoem)
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

  const isPublicPoem = poemData.publicVisibility

  const internalPlagiarismResult = await detectInternalPlagiarism(poemData.poem)

  if (internalPlagiarismResult) {
    logger.info(
      `Internal plagiarism check for userId=${req.auth.userId} bestMatchPoemId=${internalPlagiarismResult.poemId} similarity=${internalPlagiarismResult.similarity.toFixed(3)}`
    )
    if (
      internalPlagiarismResult.similarity >=
      POEM_DETECTION_THRESHOLDS.internalPlagiarism
    ) {
      logger.warn(
        `Blocked poem creation for userId=${req.auth.userId} due to plagiarism risk matchedPoemId=${internalPlagiarismResult.poemId} similarity=${internalPlagiarismResult.similarity.toFixed(3)}`
      )
      throw conflict(
        'Poem failed plagiarism check.',
        {
          similarity: internalPlagiarismResult.similarity,
          threshold: POEM_DETECTION_THRESHOLDS.internalPlagiarism,
          matchedPoemId: internalPlagiarismResult.poemId,
          matchedPoemTitle: internalPlagiarismResult.title,
        },
        'This poem appears too similar to an existing poem. Please revise and try again.'
      )
    }
  }

  // Internal plagiarism check passed, create the poem.
  // - Initial approval status is APPROVED if the validation pipeline is disabled.
  // - Otherwise, it depends on the poem's visibility (Public poems will run through the pipeline, so they are PENDING).
  const initialApprovalStatus = !config.ENABLE_GEMINI_POEM_VALIDATION
    ? PoemApprovalStatus.APPROVED
    : isPublicPoem
      ? PoemApprovalStatus.PENDING
      : PoemApprovalStatus.UNCHECKED

  const createdPoem = await prisma.poem.create({
    data: mapCreatePoemRequestToPrismaInput({
      authorId: req.auth.userId,
      data: poemData,
      tagIds: existingTags.map((tag) => tag.id),
      approvalStatus: initialApprovalStatus,
    }),
    include: POEM_INCLUDE_STATEMENT,
  })

  logger.info(
    `Created poem id=${createdPoem.id} userId=${req.auth.userId} typeId=${createdPoem.typeId} tagCount=${createdPoem.poemTags.length}`
  )

  // Validate public poems in the background after returning a pending response.
  void runPoemValidationPipeline(createdPoem).catch((err: unknown) => {
    logger.error(
      `Background poem validation failed for poemId=${createdPoem.id} userId=${req.auth.userId}: ${String(err)}`
    )
  })

  // Return the created poem.
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

  const existingPoem = await validateAndReturnPoem(poemId)

  if (reasonType === ReasonType.AI && existingPoem.isAIAssisted) {
    // No need to report poem for AI that's already tagged as AI assisted.
    logger.info(
      `Skipped AI report for poemId=${poemId} by userId=${req.auth.userId} because poem is already tagged as AI assisted`
    )
    throw conflict('Poem is already tagged as AI assisted.')
  }

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
export const validateAndReturnPoem = async (poemId: string) => {
  const poem = await prisma.poem.findUnique({
    where: { id: poemId },
    include: POEM_INCLUDE_STATEMENT,
  })

  if (!poem) {
    logger.warn(`Poem not found: poemId=${poemId}`)
    throw notFound('Invalid poem ID')
  }
  return poem
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
        ...PUBLIC_APPROVED_POEM_FILTER,
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
        ...PUBLIC_APPROVED_POEM_FILTER,
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
    where: PUBLIC_APPROVED_POEM_FILTER,
  })
  if (count === 0) {
    return null
  }
  const randIndex = Math.floor(Math.random() * count)

  const randPoem = await prisma.poem.findFirst({
    skip: randIndex,
    take: 1,
    where: PUBLIC_APPROVED_POEM_FILTER,
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

/**
 * Helper function to get public poems, with optional exclusion of a user's own poems.
 * @param excludeUserId Optional user ID to exclude poems from.
 * @returns List of public poems, optionally excluding the specified user's poems.
 */
const getPublicPoems = async (excludeUserId?: string) => {
  const constructedWhere: Prisma.PoemWhereInput = {
    ...PUBLIC_APPROVED_POEM_FILTER,
  }
  if (excludeUserId) {
    constructedWhere.authorId = { not: excludeUserId }
  }
  return await prisma.poem.findMany({
    where: constructedWhere,
    include: POEM_INCLUDE_STATEMENT,
  })
}
