import { Router } from 'express'

import {
  createPoem,
  deletePoem,
  generateAIPoem,
  getDailyPoem,
  getPoemById,
  getPoems,
  getPoemsFeed,
  interpretPoem,
  likePoem,
  reportPoem,
  unlikePoem,
  updatePoem,
} from '../controllers/poem-controller'
import { asyncHandler } from '../lib/async-handler'
import { optionalAuth, requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  CreatePoemRequestSchema,
  DeletePoemSchema,
  GetPoemByIdRequestSchema,
  GetPoemsRequestSchema,
  LikePoemRequestSchema,
  PoemAIRequestSchema,
  PoemInterpretRequestSchema,
  ReportPoemRequestSchema,
  UnlikePoemRequestSchema,
  UpdatePoemParamSchema,
} from '../schemas/poem-schemas'

const router = Router()

/** GET /api/poems
 *
 * Query params:
 * - authorId (optional): string - filter returned poems by authorId
 */
router.get(
  '/',
  optionalAuth,
  validate(GetPoemsRequestSchema),
  asyncHandler(getPoems)
)

/** POST /api/poems */
router.post(
  '/',
  requireAuth,
  validate(CreatePoemRequestSchema),
  asyncHandler(createPoem)
)

/** GET /api/poems/feed */
router.get('/feed', optionalAuth, asyncHandler(getPoemsFeed))

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

/** GET /api/poems/daily-poem */
router.get('/daily-poem', optionalAuth, asyncHandler(getDailyPoem))

/** POST /api/poems/report */
router.post(
  '/report',
  requireAuth,
  validate(ReportPoemRequestSchema),
  asyncHandler(reportPoem)
)

// Note: Express routes are matched in order, so these should be after more specific routes like /feed and /generate
/** GET /api/poems/{id} */
router.get(
  '/:id',
  optionalAuth,
  validate(GetPoemByIdRequestSchema),
  asyncHandler(getPoemById)
)

/** PATCH /api/poems/{id} */
router.patch(
  '/:id',
  requireAuth,
  validate(UpdatePoemParamSchema),
  asyncHandler(updatePoem)
)

/** DELETE /api/poems/{id} */
router.delete(
  '/:id',
  requireAuth,
  validate(DeletePoemSchema),
  asyncHandler(deletePoem)
)

export default router
