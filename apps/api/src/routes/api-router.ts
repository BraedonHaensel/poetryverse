import { Router } from 'express'

import poemRoutes from './poem-routes'
import reportRoutes from './report-routes'
import tagRoutes from './tag-routes'
import typeRoutes from './type-routes'
import userRoutes from './user-routes'

const router = Router()
router.use('/users', userRoutes)
router.use('/poems', poemRoutes)
router.use('/types', typeRoutes)
router.use('/tags', tagRoutes)
router.use('/reports', reportRoutes)

export default router
