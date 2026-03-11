import type { NextFunction, Request, Response } from 'express'

import { HttpError } from '../lib/http-errors'
import { logger } from '../lib/logger'

/**
 * Central API error middleware.
 * @param err Error passed from routes or middleware.
 * @param _req Incoming Express request (unused).
 * @param res Express response object.
 * @param _next Express next callback (unused).
 * @returns Sends a structured HTTP error response.
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
