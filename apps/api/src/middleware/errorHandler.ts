
import type { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';
import { HttpError } from '../lib/httpErrors';

/**
 * Express error middleware that maps `HttpError` instances to structured
 * client responses and falls back to a generic 500 for unknown errors.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof HttpError) {
    logger.error(
      `Sending HttpError with status ${err.status} and details`,
      err.details,
    );
    return res.status(err.status).json({
      message: err.message,
      details: err.details ?? undefined,
    });
  }

  logger.error('Unhandled error', err);
  res.status(500).json({ message: 'Internal Server Error' });
}
