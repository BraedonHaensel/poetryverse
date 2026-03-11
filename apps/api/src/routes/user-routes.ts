import { Router } from 'express'

import { getUsers } from '../controllers/user-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth'

const router = Router()

/** GET /api/users */
router.get(
  '/',
  requireAuth,
  asyncHandler(getUsers)
)

export default router
