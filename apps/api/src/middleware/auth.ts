import { RoleEnum } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'
import { getToken } from 'next-auth/jwt'

import config from '../lib/config'
import { prisma } from '../lib/db'
import { unauthorized } from '../lib/http-errors'
import { logger } from '../lib/logger'

interface AuthContext {
  userId: string
  role: RoleEnum
}

export type AuthRequest = Request & { auth: AuthContext }
export type OptionalAuthRequest = Request & { auth?: AuthContext }

/** Gets the userId from the token. */
const getTokenUserId = async (req: Request) => {
  const token = await getToken({
    req: req,
    secret: config.NEXT_AUTH_SECRET, // must match NextAuth secret
    secureCookie: config.nodeEnv === 'production',
  })

  if (!token || typeof token.id !== 'string') {
    return null
  }

  return token.id
}

/** Uses RoleEnum value to get corresponding role level. */
const getRoleLevel = (role: RoleEnum) => {
  switch (role) {
    case RoleEnum.SUPER_ADMIN:
      return 3
    case RoleEnum.ADMIN:
      return 2
    case RoleEnum.USER:
      return 1
    default:
      return 0
  }
}

/** Gets role information for a user ID, or null if the user does not exist. */
const getUserAuthContext = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  })

  if (!user) {
    return null
  }

  return { userId: user.id, role: user.role }
}

/**
 * Verifies the NextAuth token and attaches `auth.userId` to the request.
 * @param req Incoming Express request.
 * @param _res Express response object (unused).
 * @param next Express next callback.
 * @returns Calls `next` with `unauthorized()` on auth failure; otherwise continues.
 */
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userId = await getTokenUserId(req)

    if (!userId) {
      throw unauthorized()
    }

    // Check that auth and database state are synced.
    const authContext = await getUserAuthContext(userId)
    if (!authContext) {
      throw unauthorized()
    }

    ;(req as AuthRequest).auth = authContext
    return next()
  } catch {
    throw unauthorized()
  }
}

/**
 * Attaches `auth.userId` when a valid token is present, but allows guests through.
 * @param req Incoming Express request.
 * @param _res Express response object (unused).
 * @param next Express next callback.
 * @returns Always continues to next middleware.
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userId = await getTokenUserId(req)

    if (userId) {
      const authContext = await getUserAuthContext(userId)
      if (authContext) {
        ;(req as OptionalAuthRequest).auth = authContext
      }
    }
  } catch {
    // Ignore token parsing issues for guest-accessible routes.
  }

  return next()
}

/**
 * Verifies that the authenticated user has at least the required role.
 * @param role Minimum role required for access.
 * @returns Express middleware that allows or rejects the request.
 */
export const requireRole = (role: RoleEnum) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const auth = (req as AuthRequest).auth
    const userId = auth?.userId
    const requesterRole = auth?.role

    if (!userId || !requesterRole) {
      throw unauthorized()
    }

    const requestingUserRoleLevel = getRoleLevel(requesterRole)
    const targetRoleLevel = getRoleLevel(role)

    if (requestingUserRoleLevel >= targetRoleLevel) {
      return next()
    }

    logger.error(
      `User userId=${userId} does not have the required role: ${role}. Sending 401 Unauthorized.`
    )
    throw unauthorized()
  }
}
