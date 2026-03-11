import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'
import { z } from 'zod'

import { badRequest } from '../lib/http-errors'

/**
 * Creates request validation middleware from a Zod schema.
 * @param schema Zod schema that validates `{ body, params, query }`.
 * @returns Express middleware that forwards a 400 error when validation fails.
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
