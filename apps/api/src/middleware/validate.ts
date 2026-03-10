import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'
import { z } from 'zod'

import { badRequest } from '../lib/http-errors'

/**
 * Returns middleware that validates request input with a provided Zod schema.
 * @param schema Zod schema intended to validate request data.
 * @returns Express middleware for request validation.
 */
export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body as unknown,
      params: req.params,
      query: req.query,
    })

    if (!result.success) {
      return next(badRequest('Validation error', z.flattenError(result.error)))
    }

    next()
  }
