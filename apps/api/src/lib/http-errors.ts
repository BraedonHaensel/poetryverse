/**
 * HTTP-aware error type used to pass status codes and optional metadata
 * through the centralized API error handler.
 */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message)
  }
}

/** Creates a 400 Bad Request error. */
export const badRequest = (msg: string, details?: unknown) =>
  new HttpError(400, msg, details)

/** Creates a 401 Unauthorized error. */
export const unauthorized = (msg = 'Unauthorized') => new HttpError(401, msg)

/** Creates a 403 Forbidden error. */
export const forbidden = (msg = 'Forbidden') => new HttpError(403, msg)

/** Creates a 404 Not Found error. */
export const notFound = (msg = 'Not Found') => new HttpError(404, msg)

/** Creates a 409 Conflict error. */
export const conflict = (msg = 'Conflict', details?: unknown) =>
  new HttpError(409, msg, details)
