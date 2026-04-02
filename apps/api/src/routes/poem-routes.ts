import { Router } from 'express'

import {
  createPoem,
  generateAIPoem,
  getPoemById,
  getPoems,
  interpretPoem,
  likePoem,
  reportPoem,
  unlikePoem,
} from '../controllers/poem-controller'
import { asyncHandler } from '../lib/async-handler'
import { optionalAuth, requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  CreatePoemRequestSchema,
  GetPoemByIdRequestSchema,
  GetPoemsRequestSchema,
  LikePoemRequestSchema,
  PoemAIRequestSchema,
  PoemInterpretRequestSchema,
  ReportPoemRequestSchema,
  UnlikePoemRequestSchema,
} from '../schemas/poem-schemas'

const router = Router()

/** GET /api/poems
 * 
 * Query params:
 * - authorId (optional): string - filter returned poems by authorId
 */
/** TODO: Make this guest-accessible once !49 is merged */
router.get('/', requireAuth, validate(GetPoemsRequestSchema), asyncHandler(getPoems))

/** GET /api/poems/{id} */
router.get('/:id', optionalAuth, validate(GetPoemByIdRequestSchema), asyncHandler(getPoemById))

//TODO: update schemas and functions called here
/** PATCH /api/poems/{id} */
router.patch('/:id', optionalAuth, validate(GetPoemByIdRequestSchema), asyncHandler(getPoemById))

/** DELETE /api/poems/{id} */
router.delete('/:id', optionalAuth, validate(GetPoemByIdRequestSchema), asyncHandler(getPoemById))

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
