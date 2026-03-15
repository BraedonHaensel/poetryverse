import { Router } from 'express'

import {
  createPoem,
  generateAIPoem,
  interpretPoem,
  likePoem,
  unlikePoem,
} from '../controllers/poem-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  CreatePoemRequestSchema,
  LikePoemRequestSchema,
  PoemAIRequestSchema,
  PoemInterpretRequestSchema,
  UnlikePoemRequestSchema,
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

/** PUT /api/poems/like */
router.put(
  '/like',
  requireAuth,
  validate(LikePoemRequestSchema),
  asyncHandler(likePoem)
)

/** DELETE /api/poems/like */
router.delete(
  '/like',
  requireAuth,
  validate(UnlikePoemRequestSchema),
  asyncHandler(unlikePoem)
)

export default router
