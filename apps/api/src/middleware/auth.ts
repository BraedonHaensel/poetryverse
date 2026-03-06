import type { NextFunction, Request, Response } from 'express'

/**
 * Placeholder authentication guard.
 * TODO: Replace this with real session/token verification.
 * @param req Incoming Express request.
 * @param _res Express response object (currently unused).
 * @param next Next middleware function.
 * @returns Calls `next` to continue request processing.
 */
export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // TODO: Set up auth middleware here
  next()
}
