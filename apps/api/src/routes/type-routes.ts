import { Router } from 'express'

import { getPoemTypes } from '../controllers/type-controller'
import { asyncHandler } from '../lib/async-handler'

const router = Router()

/** GET /api/types */
router.get('/', asyncHandler(getPoemTypes))

export default router
