import { Router } from 'express'

import { getPoemTypes } from '../controllers/poem-type-controller'
import { asyncHandler } from '../lib/async-handler'

const router = Router()

/** GET /api/poem-types */
router.get('/', asyncHandler(getPoemTypes))

export default router
