import { Router } from 'express'

import {
  getMyFollowers,
  getMyFollowing,
  getMyUserInfo,
  getUserById,
  getUserFollowers,
  getUserFollowing,
  getUsers,
} from '../controllers/user-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  getUserFollowersSchema,
  getUserFollowingSchema,
  getUserSchema,
} from '../schemas/user-schemas'

const router = Router()

/** GET /api/users */
// TODO: Make this admin only
router.get('/', requireAuth, asyncHandler(getUsers))

/** GET /api/users/me */
router.get('/me', requireAuth, asyncHandler(getMyUserInfo))

/** GET /api/users/me/followers */
router.get('/me/followers', requireAuth, asyncHandler(getMyFollowers))

/** GET /api/users/me/following */
router.get('/me/following', requireAuth, asyncHandler(getMyFollowing))

/** GET /api/users/followers/{id} */
router.get(
  '/:id/followers',
  requireAuth,
  validate(getUserFollowersSchema),
  asyncHandler(getUserFollowers)
)

/** GET /api/users/following/{id} */
router.get(
  '/:id/following',
  requireAuth,
  validate(getUserFollowingSchema),
  asyncHandler(getUserFollowing)
)

/** Get /api/users/{id} */
router.get(
  '/:id',
  requireAuth,
  validate(getUserSchema),
  asyncHandler(getUserById)
)

export default router
