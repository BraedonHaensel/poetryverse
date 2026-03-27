import { Router } from 'express'

import {
  getPoems,
  createPoem,
  generateAIPoem,
  interpretPoem,
  likePoem,
  reportPoem,
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
  ReportPoemRequestSchema,
  UnlikePoemRequestSchema,
} from '../schemas/poem-schemas'

const router = Router()

/** GET /api/poems */
router.get('/', requireAuth, asyncHandler(getPoems))

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

/** POST /api/poems/report */
router.post(
  '/report',
  requireAuth,
  validate(ReportPoemRequestSchema),
  asyncHandler(reportPoem)
)

export default router
