import { Router } from 'express'

import { getUserById, getUsers } from '../controllers/user-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { getUserSchema } from '../schemas/user-schemas'

const router = Router()

/** GET /api/users */
router.get('/', requireAuth, asyncHandler(getUsers))

/** Get /api/users/{id} */
router.get(
  '/:id',
  requireAuth,
  validate(getUserSchema),
  asyncHandler(getUserById)
)

export default router
