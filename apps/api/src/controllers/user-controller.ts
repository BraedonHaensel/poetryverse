import { prisma } from '@seng513/database'
import type { NextFunction, Request, Response } from 'express'

import { notFound } from '../lib/http-errors'
import { AuthRequest } from '../middleware/auth'
import { getUserRequest } from '../schemas/user-schemas'

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
  const users = await prisma.user.findMany()
  return res.status(200).json(users)
}

export const getUserById = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params as getUserRequest

  const user = await getAndValidateUser((req as AuthRequest).auth.userId, id)

  return res.status(200).json({ data: user })
}

const getAndValidateUser = async (
  currentUserId: string,
  targetUserId: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
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
