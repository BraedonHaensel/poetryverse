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

/** POST /api/poems */
router.post(
  '/',
  requireAuth,
  validate(CreatePoemRequestSchema),
  asyncHandler(createPoem)
)

/** POST /api/poems/generate */
router.post(
  '/generate',
  requireAuth,
  validate(PoemAIRequestSchema),
  asyncHandler(generateAIPoem)
)

/** POST /api/poems/interpret */
router.post(
  '/interpret',
  requireAuth,
  validate(PoemInterpretRequestSchema),
  asyncHandler(interpretPoem)
)

export default router
