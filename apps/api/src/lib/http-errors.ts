/** Error with an HTTP status and optional details payload. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
    public displayMessage?: string
  ) {
    super(message)
  }
}

/** Creates a 400 Bad Request error. */
export const badRequest = (
  msg: string,
  details?: unknown,
  displayMessage?: string
) => new HttpError(400, msg, details, displayMessage)

/** Creates a 401 Unauthorized error. */
export const unauthorized = (
  msg = 'Unauthorized',
  displayMessage?: string
) => new HttpError(401, msg, undefined, displayMessage)

/** Creates a 403 Forbidden error. */
export const forbidden = (
  msg = 'Forbidden',
  displayMessage?: string
) => new HttpError(403, msg, undefined, displayMessage)

/** Creates a 404 Not Found error. */
export const notFound = (msg = 'Not Found', displayMessage?: string) =>
  new HttpError(404, msg, undefined, displayMessage)

/** Creates a 409 Conflict error. */
export const conflict = (
  msg = 'Conflict',
  details?: unknown,
  displayMessage?: string
) => new HttpError(409, msg, details, displayMessage)
