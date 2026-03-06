import type { NextFunction, Request, Response } from 'express'
import { logger } from '../lib/logger'
import { HttpError } from '../lib/httpErrors'

/**
 * Express error middleware that maps `HttpError` instances to structured
 * client responses and falls back to a generic 500 for unknown errors.
 * @param err Error passed from route handlers or middleware.
 * @param _req Incoming Express request.
 * @param res Express response used to send the error payload.
 * @param _next Next middleware function (unused in this handler).
 * @returns Sends an HTTP error response.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    logger.error(
      `Sending HttpError with status ${err.status} and details`,
      err.details
    )
    return res.status(err.status).json({
      message: err.message,
      details: err.details ?? undefined,
    })
  }

  logger.error('Unhandled error', err)
  res.status(500).json({ message: 'Internal Server Error' })
}
