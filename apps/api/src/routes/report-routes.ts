import { RoleEnum } from '@prisma/client'
import { Router } from 'express'

import {
  getReportById,
  getReports,
  resolveReport,
} from '../controllers/report-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth, requireRole } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { resolveReportRequestSchema } from '../schemas/report-schemas'

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
  validate(resolveReportRequestSchema),
  asyncHandler(resolveReport)
)

export default router
