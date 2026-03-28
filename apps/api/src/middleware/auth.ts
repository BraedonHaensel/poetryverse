import { RoleEnum } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'
import { getToken } from 'next-auth/jwt'

import config from '../lib/config'
import { prisma } from '../lib/db'
import { HttpError, unauthorized } from '../lib/http-errors'
import { logger } from '../lib/logger'

export type AuthRequest = Request & { auth: { userId: string } }
export type OptionalAuthRequest = Request & { auth?: { userId: string } }

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
      return next(unauthorized())
    }

    ;(req as AuthRequest).auth = { userId }
    return next()
  } catch {
    return next(unauthorized())
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
      ;(req as OptionalAuthRequest).auth = { userId }
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
  return async (req: Request, _res: Response, next: NextFunction) => {
    const userId = (req as AuthRequest).auth.userId

    if (!userId) {
      throw unauthorized()
    }

    const requestingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!requestingUser) {
      throw new HttpError(500, 'User information not available.')
    }

    const requestingUserRoleLevel = getRoleLevel(requestingUser.role)
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
