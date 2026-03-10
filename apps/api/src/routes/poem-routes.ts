import { Router } from 'express'

import { generateAIPoem } from '../controllers/poem-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  CreatePoemRequestSchema,
  PoemAIRequestSchema,
} from '../schemas/poem-schemas'

const router = Router()

router.post(
  '/',
  requireAuth,
  validate(CreatePoemRequestSchema)
  // asyncHandler(createPoem)
)

/**
 * Route for AI poem generation.
 * Request body is validated by `PoemAIRequestSchema` before controller logic.
 * @name post/api/poems/generate
 * @returns 200 with `{ data: { title, poem } }`.
 */
router.post(
  '/generate',
  requireAuth,
  validate(PoemAIRequestSchema),
  asyncHandler(generateAIPoem)
)

export default router
