import type { NextFunction, Request, Response } from 'express'

/**
 * Wraps an async route handler and forwards rejections to `next`.
 * @param fn Async Express handler.
 * @returns Express middleware that routes thrown errors to error handling middleware.
 */
export const asyncHandler =
  <TReq extends Request = Request>(
    fn: (req: TReq, res: Response, next: NextFunction) => Promise<unknown>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as TReq, res, next)).catch(next)
  }
