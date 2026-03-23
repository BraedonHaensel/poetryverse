import { prisma } from '@seng513/database'
import type { NextFunction, Request, Response } from 'express'

import { notFound } from '../lib/http-errors'
import { logger } from '../lib/logger'
import type { AuthRequest } from '../middleware/auth'
import {
  getUserFollowersRequest,
  getUserFollowingRequest,
  getUserRequest,
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

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const { id: targetUserId } = req.params as getUserRequest
  logger.info(
    `Fetching user by id targetUserId=${targetUserId} viewerUserId=${req.auth.userId}`
  )

  const user = await getAndValidateUser(req.auth.userId, targetUserId)

  logger.info(`Fetched user by id targetUserId=${targetUserId}`)
  return res.status(200).json({ data: user })
}

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

export const getUserFollowers = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const requesterUserId = req.auth.userId
  const { id: userId } = req.params as getUserFollowersRequest

  const followers = await getFollowersForUser(userId, requesterUserId)

  return res.status(200).json({ data: followers })
}

export const getUserFollowing = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const requesterUserId = req.auth.userId
  const { id: userId } = req.params as getUserFollowingRequest

  const followingUsers = await getFollowingForUser(userId, requesterUserId)

  return res.status(200).json({ data: followingUsers })
}

export const getMyFollowers = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.auth.userId

  const followers = await getFollowersForUser(userId, userId)

  return res.status(200).json({ data: followers })
}

export const getMyFollowing = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.auth.userId

  const followingUsers = await getFollowingForUser(userId, userId)

  return res.status(200).json({ data: followingUsers })
}

const getFollowersForUser = async (userId: string, requesterUserId: string) => {
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

const getFollowingForUser = async (
  targetUserId: string,
  requesterUserId: string
) => {
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
  if (targetUserId === requesterUserId) {
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

const addRequesterFollowState = async (
  users: {
    id: string
    username: string | null
    image: string | null
    _count: {
      authoredPoems: number
      followers: number
      following: number
    }
  }[],
  requesterUserId: string
) => {
  if (users.length === 0) {
    return []
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

const getAndValidateUser = async (
  currentUserId: string,
  targetUserId: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: SELECT_USER_STATEMENT,
  })

  if (!user) {
    throw notFound('Invalid user ID.')
  }

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
    select: { followerId: true },
  })

  return {
    ...user,
    isFollowingUser: !!follow,
  }
}
