import { Router } from 'express'

import { getUsers } from '../controllers/user-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth'

const router = Router()

// This is an example endpoint we can refine later, demonstrating the use of middleware
router.get(
  '/',
  requireAuth,
  // validate(getUserSchema) This is an example, we might not have a schema for this GET unless we include an optional filter
  asyncHandler(getUsers)
)

export default router
