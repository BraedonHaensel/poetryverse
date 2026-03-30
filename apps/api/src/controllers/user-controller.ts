import type { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import { prisma } from '../lib/db'
import { notFound } from '../lib/http-errors'
import { logger } from '../lib/logger'
import type { AuthRequest, OptionalAuthRequest } from '../middleware/auth'
import {
  getUserFollowersRequest,
  getUserFollowingRequest,
  getUserRequest,
  updateUserInfoRequest,
} from '../schemas/user-schemas'

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

export const updateMyUserInfo = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.auth.userId
  const updateData = req.body as updateUserInfoRequest

  const updatedInfo = await prisma.user.update({
    where: { id: userId },
    data: {
      ...updateData,
    },
  })

  return res.status(200).json({ data: updatedInfo })
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
