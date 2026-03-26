import { RoleEnum } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'
import { getToken } from 'next-auth/jwt'

import config from '../lib/config'
import { prisma } from '../lib/db'
import { unauthorized } from '../lib/http-errors'

export type AuthRequest = Request & { auth: { userId: string } }

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
    const token = await getToken({
      req: req,
      secret: config.NEXT_AUTH_SECRET, // must match NextAuth secret
      secureCookie: config.nodeEnv === 'production',
    })

    if (!token || typeof token.id !== 'string') {
      return next(unauthorized())
    }

    ;(req as AuthRequest).auth = { userId: token.id }
    return next()
  } catch {
    return next(unauthorized())
  }
}

export const requireRole =
  (req: AuthRequest, _res: Response, next: NextFunction) =>
  async (role: RoleEnum) => {
    const requestingUser = await prisma.user.findUnique({
      where: { id: req.auth.userId },
      select: { role: true },
    })

    if (requestingUser?.role === role) {
      next()
    }

    throw unauthorized()
  }
