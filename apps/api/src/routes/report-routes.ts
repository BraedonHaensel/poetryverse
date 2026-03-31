import { RoleEnum } from '@prisma/client'
import { Router } from 'express'

import { getReports } from '../controllers/report-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth, requireRole } from '../middleware/auth'

const router = Router()

/** GET /api/reports */
router.get(
  '/',
  requireAuth,
  requireRole(RoleEnum.ADMIN),
  asyncHandler(getReports)
)

router.get(
  '/:id',
  requireAuth,
  requireRole(RoleEnum.ADMIN),
  asyncHandler(getReportById)
)

router.patch(
  '/:id',
  requireAuth,
  requireRole(RoleEnum.ADMIN),
  asyncHandler(updateReport)
)

export default router
