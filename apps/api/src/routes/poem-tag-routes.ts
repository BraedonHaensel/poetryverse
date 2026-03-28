import { Router } from 'express'

import { getPoemTags } from '../controllers/poem-tag-controller'
import { asyncHandler } from '../lib/async-handler'

const router = Router()

/** GET /api/poem-tags */
router.get('/', asyncHandler(getPoemTags))

export default router
