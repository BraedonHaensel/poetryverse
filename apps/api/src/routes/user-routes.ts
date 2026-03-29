import { RoleEnum } from '@prisma/client'
import { Router } from 'express'

import {
  followUser,
  getMyFollowers,
  getMyFollowing,
  getMyUserInfo,
  getUserById,
  getUserFollowers,
  getUserFollowing,
  getUsers,
  unfollowUser,
} from '../controllers/user-controller'
import { asyncHandler } from '../lib/async-handler'
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  followUserSchema,
  getUserFollowersSchema,
  getUserFollowingSchema,
  getUserSchema,
  unfollowUserSchema,
} from '../schemas/user-schemas'

const router = Router()

/** GET /api/users */
router.get(
  '/',
  requireAuth,
  requireRole(RoleEnum.ADMIN),
  asyncHandler(getUsers)
)

/** GET /api/users/me */
router.get('/me', requireAuth, asyncHandler(getMyUserInfo))

/** GET /api/users/me/followers */
router.get('/me/followers', requireAuth, asyncHandler(getMyFollowers))

/** GET /api/users/me/following */
router.get('/me/following', requireAuth, asyncHandler(getMyFollowing))

/** GET /api/users/followers/{id} */
router.get(
  '/:id/followers',
  optionalAuth,
  validate(getUserFollowersSchema),
  asyncHandler(getUserFollowers)
)

/** GET /api/users/following/{id} */
router.get(
  '/:id/following',
  optionalAuth,
  validate(getUserFollowingSchema),
  asyncHandler(getUserFollowing)
)

/** Get /api/users/{id} */
router.get(
  '/:id',
  optionalAuth,
  validate(getUserSchema),
  asyncHandler(getUserById)
)

router.put(
  '/me/following/:id',
  requireAuth,
  validate(followUserSchema),
  asyncHandler(followUser)
)

router.delete(
  '/me/following/:id',
  requireAuth,
  validate(unfollowUserSchema),
  asyncHandler(unfollowUser)
)

export default router
