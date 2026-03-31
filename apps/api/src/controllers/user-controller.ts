import type { Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import type { NextFunction, Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'

import { prisma } from '../lib/db'
import { badRequest, notFound } from '../lib/http-errors'
import { logger } from '../lib/logger'
import { getImageExtension, getUploadDirectoryPath } from '../lib/utils'
import type { AuthRequest, OptionalAuthRequest } from '../middleware/auth'
import {
  followUserRequest,
  getUserFollowersRequest,
  getUserFollowingRequest,
  getUserRequest,
  unfollowUserRequest,
} from '../schemas/user-schemas'

const IMAGES_PATH_PREFIX = '/images'

// Standardized prisma select statement for getting a user.
const SELECT_USER_STATEMENT = {
  id: true,
  username: true,
  image: true,
  _count: {
    select: {
      authoredPoems: true,
      followers: true,
      following: true,
    },
  },
} satisfies Prisma.UserSelect

type SelectedUser = Prisma.UserGetPayload<{
  select: typeof SELECT_USER_STATEMENT
}>

type UserWithFollowState = SelectedUser & {
  isFollowingUser: boolean
}

/**
 * Retrieves all users from the database and returns them as JSON.
 * @param _req Incoming Express request.
 * @param res Express response used to return users.
 * @param _next Next middleware function (unused).
 * @returns Promise that resolves after sending the users response.
 */
export const getUsers = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.info('Fetching all users')

  const users = await prisma.user.findMany()

  logger.info(`Fetched all users count=${users.length}`)
  return res.status(200).json(users)
}

/**
 * Retrieves a user profile by target user ID and includes whether requester follows them.
 * @param req Authenticated Express request with validated route params.
 * @param res Express response object.
 * @param _next Next middleware function (unused).
 * @returns A 200 response containing the user profile payload.
 * @throws {HttpError} 404 if the target user does not exist.
 */
export const getUserById = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const authReq = req as OptionalAuthRequest
  const requesterUserId = authReq.auth?.userId
  const { id: targetUserId } = req.params as getUserRequest
  logger.info(
    `Fetching user by id targetUserId=${targetUserId} viewerUserId=${requesterUserId ?? 'guest'}`
  )

  const user = await getAndValidateUser(targetUserId, requesterUserId)

  logger.info(`Fetched user by id targetUserId=${targetUserId}`)
  return res.status(200).json({ data: user })
}

/**
 * Retrieves the authenticated user's profile details.
 * @param req Authenticated Express request.
 * @param res Express response object.
 * @param _next Next middleware function (unused).
 * @returns A 200 response containing the authenticated user's profile.
 * @throws {HttpError} 404 if the authenticated user no longer exists.
 */
export const getMyUserInfo = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.auth.userId
  logger.info(`Fetching current user profile userId=${userId}`)

  // Not using SELECT_USER_STATEMENT here, as this endpoint can expose more information about the user.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          authoredPoems: true,
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    logger.warn(`Current user profile not found userId=${userId}`)
    throw notFound('Invalid user ID.')
  }

  logger.info(`Fetched current user profile userId=${userId}`)
  return res.status(200).json({ data: user })
}

/**
 * Retrieves followers for a target user and annotates each result with requester follow state.
 * @param req Authenticated Express request with validated route params.
 * @param res Express response object.
 * @param _next Next middleware function (unused).
 * @returns A 200 response containing users who follow the target user.
 */
export const getUserFollowers = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requesterUserId = (req as OptionalAuthRequest).auth?.userId
  const { id: targetUserId } = req.params as getUserFollowersRequest

  await validateUserExists(targetUserId)

  const followers = await getFollowersForUser(targetUserId, requesterUserId)

  return res.status(200).json({ data: followers })
}

/**
 * Retrieves users followed by a target user and annotates each with requester follow state.
 * @param req Authenticated Express request with validated route params.
 * @param res Express response object.
 * @param _next Next middleware function (unused).
 * @returns A 200 response containing users followed by the target user.
 */
export const getUserFollowing = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requesterUserId = (req as OptionalAuthRequest).auth?.userId
  const { id: targetUserId } = req.params as getUserFollowingRequest

  await validateUserExists(targetUserId)

  const followingUsers = await getFollowingForUser(
    targetUserId,
    requesterUserId
  )

  return res.status(200).json({ data: followingUsers })
}

/**
 * Retrieves followers for the authenticated user and annotates follow state.
 * @param req Authenticated Express request.
 * @param res Express response object.
 * @param _next Next middleware function (unused).
 * @returns A 200 response containing users who follow the authenticated user.
 */
export const getMyFollowers = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.auth.userId

  const followers = await getFollowersForUser(userId, userId)

  return res.status(200).json({ data: followers })
}

/**
 * Retrieves users followed by the authenticated user and annotates follow state.
 * @param req Authenticated Express request.
 * @param res Express response object.
 * @param _next Next middleware function (unused).
 * @returns A 200 response containing users followed by the authenticated user.
 */
export const getMyFollowing = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.auth.userId

  const followingUsers = await getFollowingForUser(userId, userId)

  return res.status(200).json({ data: followingUsers })
}

/**
 * Follows a target user for the authenticated requester.
 * @param req Authenticated Express request with validated route params.
 * @param res Express response object.
 * @param _next Next middleware function (unused).
 * @returns A 200 response containing the follow record.
 * @throws {HttpError} 400 if the requester tries to follow themselves.
 * @throws {HttpError} 404 if the target user does not exist.
 */
export const followUser = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const requesterUserId = req.auth.userId
  const { id: targetUserId } = req.params as followUserRequest
  logger.info(
    `Following user requesterUserId=${requesterUserId} targetUserId=${targetUserId}`
  )

  if (requesterUserId === targetUserId) {
    logger.warn(
      `Invalid follow attempt requesterUserId=${requesterUserId} targetUserId=${targetUserId} reason=self-follow`
    )
    throw badRequest('You cannot follow yourself.')
  }

  await validateUserExists(targetUserId)

  const follow = await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: requesterUserId,
        followingId: targetUserId,
      },
    },
    update: {},
    create: {
      followerId: requesterUserId,
      followingId: targetUserId,
    },
  })

  logger.info(
    `Followed user requesterUserId=${requesterUserId} targetUserId=${targetUserId}`
  )

  return res.status(200).json({ data: follow })
}

/**
 * Unfollows a target user for the authenticated requester.
 * @param req Authenticated Express request with validated route params.
 * @param res Express response object.
 * @param _next Next middleware function (unused).
 * @returns A 204 response with no body.
 * @throws {HttpError} 400 if the requester tries to unfollow themselves.
 * @throws {HttpError} 404 if the target user does not exist.
 */
export const unfollowUser = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const requesterUserId = req.auth.userId
  const { id: targetUserId } = req.params as unfollowUserRequest
  logger.info(
    `Unfollowing user requesterUserId=${requesterUserId} targetUserId=${targetUserId}`
  )

  if (requesterUserId === targetUserId) {
    logger.warn(
      `Invalid unfollow attempt requesterUserId=${requesterUserId} targetUserId=${targetUserId} reason=self-unfollow`
    )
    throw badRequest('You cannot unfollow yourself.')
  }

  await validateUserExists(targetUserId)

  await prisma.follow.deleteMany({
    where: {
      followerId: requesterUserId,
      followingId: targetUserId,
    },
  })

  logger.info(
    `Unfollowed user requesterUserId=${requesterUserId} targetUserId=${targetUserId}`
  )

  return res.status(204).send()
}

/**
 * Updates the authenticated user's profile picture.
 * @param req Authenticated Express request with multipart `image` file already parsed/validated by middleware.
 * @param res Express response object.
 * @param _next Next middleware function (unused).
 * @returns A 200 response containing the persisted public image URL.
 * @throws {HttpError} 404 if the authenticated user no longer exists.
 */
export const updateMyProfilePicture = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.auth.userId
  const file = (req as Request & { file: Express.Multer.File }).file

  const existingUser = await getAndValidateUser(userId)

  const extension = getImageExtension(file.mimetype)
  const fileName = `${userId}-${randomUUID()}.${extension}`
  const uploadDirectoryPath = getUploadDirectoryPath()
  const imageFilePath = path.join(uploadDirectoryPath, fileName)

  // Make upload directory if it doesnt exist and upload new profile picture.
  await fs.mkdir(uploadDirectoryPath, { recursive: true })
  await fs.writeFile(imageFilePath, file.buffer)

  // Update DB with new image url.
  const imageUrl = `${IMAGES_PATH_PREFIX}/${fileName}`

  await prisma.user.update({
    where: { id: userId },
    data: {
      image: imageUrl,
    },
  })

  // Cleanup old profile picture if it exists.
  const oldImageUrl = existingUser.image
  if (oldImageUrl?.startsWith(IMAGES_PATH_PREFIX)) {
    const oldImageFileName = path.basename(oldImageUrl)
    const oldImageFilePath = path.join(uploadDirectoryPath, oldImageFileName)

    if (oldImageFilePath !== imageFilePath) {
      await fs.unlink(oldImageFilePath).catch(() => {
        logger.warn(
          `Could not delete previous profile image userId=${userId} imagePath=${oldImageFilePath}`
        )
      })
    }
  }

  logger.info(`Updated profile image userId=${userId} imageUrl=${imageUrl}`)
  return res.status(200).json({
    data: {
      image: imageUrl,
    },
  })
}

/**
 * Fetches follower users for a target user and appends requester follow state in batch.
 * @param userId Target user ID.
 * @param requesterUserId Authenticated requester user ID.
 * @returns List of follower users with `isFollowingUser` flag.
 */
const getFollowersForUser = async (
  userId: string,
  requesterUserId?: string
): Promise<UserWithFollowState[]> => {
  logger.info(`Fetching followers userId=${userId}`)
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    select: {
      follower: {
        select: SELECT_USER_STATEMENT,
      },
    },
  })

  logger.info(`Fetched followers userId=${userId} count=${followers.length}`)
  return addRequesterFollowState(
    followers.map(({ follower }) => follower),
    requesterUserId
  )
}

/**
 * Fetches users followed by a target user and appends requester follow state in batch.
 * @param targetUserId Target user ID whose following list is requested.
 * @param requesterUserId Authenticated requester user ID.
 * @returns List of followed users with `isFollowingUser` flag.
 */
const getFollowingForUser = async (
  targetUserId: string,
  requesterUserId?: string
): Promise<UserWithFollowState[]> => {
  logger.info(`Fetching following users userId=${targetUserId}`)
  const followingUsers = await prisma.follow.findMany({
    where: { followerId: targetUserId },
    select: {
      following: {
        select: SELECT_USER_STATEMENT,
      },
    },
  })

  logger.info(
    `Fetched following users userId=${targetUserId} count=${followingUsers.length}`
  )

  // If the target user is the requesting user, they are already following every user.
  if (requesterUserId && targetUserId === requesterUserId) {
    return followingUsers.map(({ following }) => ({
      ...following,
      isFollowingUser: true,
    }))
  }

  return addRequesterFollowState(
    followingUsers.map(({ following }) => following),
    requesterUserId
  )
}

/**
 * Adds whether the requester follows each user using one batched follow query.
 * @param users Users to annotate.
 * @param requesterUserId Authenticated requester user ID.
 * @returns User list enriched with `isFollowingUser`.
 */
const addRequesterFollowState = async (
  users: SelectedUser[],
  requesterUserId?: string
): Promise<UserWithFollowState[]> => {
  if (users.length === 0) {
    return []
  }

  // User is a guest, so not following any users.
  if (!requesterUserId) {
    return users.map((user) => ({
      ...user,
      isFollowingUser: false,
    }))
  }

  const followedUsers = await prisma.follow.findMany({
    where: {
      followerId: requesterUserId,
      followingId: {
        in: users.map((user) => user.id),
      },
    },
    select: {
      followingId: true,
    },
  })

  const followedUserIdSet = new Set(
    followedUsers.map((follow) => follow.followingId)
  )

  return users.map((user) => ({
    ...user,
    isFollowingUser: followedUserIdSet.has(user.id),
  }))
}

/**
 * Validates that a target user exists.
 * @param userId Target user ID.
 * @throws {HttpError} 404 if the target user does not exist.
 */
const validateUserExists = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })

  if (!user) {
    logger.warn(`Target user not found userId=${userId}`)
    throw notFound('Invalid user ID.')
  }
}

/**
 * Fetches and validates target user data and requester follow relationship.
 * @param requesterUserId Authenticated requester user ID.
 * @param targetUserId Target user ID.
 * @returns Target user data with `isFollowingUser`.
 * @throws {HttpError} 404 if the target user does not exist.
 */
const getAndValidateUser = async (
  targetUserId: string,
  requesterUserId?: string
): Promise<UserWithFollowState> => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: SELECT_USER_STATEMENT,
  })

  if (!user) {
    throw notFound('Invalid user ID.')
  }

  const follow = requesterUserId
    ? await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: requesterUserId,
            followingId: targetUserId,
          },
        },
        select: { followerId: true },
      })
    : null

  return {
    ...user,
    isFollowingUser: !!follow,
  }
}
