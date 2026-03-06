import type { NextFunction, Request, Response } from 'express';

/**
 * Wraps an async Express handler and forwards rejected promises to `next`.
 * This keeps thrown/awaited errors inside the central error middleware flow.
 * @param fn Async Express route handler.
 * @returns Express middleware that forwards rejected promises to `next`.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
