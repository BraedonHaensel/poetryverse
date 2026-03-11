import type { NextFunction, Request, Response } from 'express'
import { getToken } from 'next-auth/jwt'

import config from '../lib/config'
import { unauthorized } from '../lib/http-errors'

export type AuthRequest = Request & { auth: { userId: string } }

/**
 * Authentication guard.
 * @param req Incoming Express request.
 * @param _res Express response object (currently unused).
 * @param next Next middleware function.
 * @returns Calls `next` to continue request processing.
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
