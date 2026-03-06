import type { NextFunction, Request, Response } from 'express';

/**
 * Placeholder authentication guard.
 * TODO: Replace this with real session/token verification.
 */
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
    // TODO: Set up auth middleware here
    next()
}
