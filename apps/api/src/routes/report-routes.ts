import { Router } from 'express'

import { getReports } from '../controllers/report-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth'

const router = Router()

/** GET /api/reports */
// TODO: Make this admin only
router.get('/', requireAuth, asyncHandler(getReports))

export default router
