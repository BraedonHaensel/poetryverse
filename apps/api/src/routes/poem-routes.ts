import { Router } from 'express'

import {
  createPoem,
  generateAIPoem,
  interpretPoem,
} from '../controllers/poem-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { PoemInterpretRequestSchema } from '../schemas/poem-schemas'
import {
  CreatePoemRequestSchema,
  PoemAIRequestSchema,
} from '../schemas/poem-schemas'

const router = Router()

router.post(
  '/',
  requireAuth,
  validate(CreatePoemRequestSchema),
  asyncHandler(createPoem)
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

/**
 * Route serving AI Interpretation poem form
 * @name post/api/poems/interpret
 * @function
 * @memberof module:routes/poemRoutes
 * @inner
 * @param {PoemInterpretRequest} req.body - Request body containing poem title, type, poem body, and prompt
 * @param {Response} res - Express response object
 * @returns {PoemInterpretResponse} JSON response containing generated poem data
 */
router.post(
  '/interpret',
  requireAuth,
  validate(PoemInterpretRequestSchema),
  asyncHandler(interpretPoem)
)

export default router
