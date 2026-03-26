import { Router } from 'express'

import { getPoemTags } from '../controllers/tag-controller'
import { asyncHandler } from '../lib/async-handler'

const router = Router()

/** GET /api/tags */
router.get('/', asyncHandler(getPoemTags))

export default router
