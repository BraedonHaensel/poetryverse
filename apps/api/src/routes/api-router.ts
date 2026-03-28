import { Router } from 'express'

import poemRoutes from './poem-routes'
import poemTagRoutes from './poem-tag-routes'
import poemTypeRoutes from './poem-type-routes'
import reportRoutes from './report-routes'
import userRoutes from './user-routes'

const router = Router()
router.use('/users', userRoutes)
router.use('/poems', poemRoutes)
router.use('/poem-types', poemTypeRoutes)
router.use('/poem-tags', poemTagRoutes)
router.use('/reports', reportRoutes)

export default router
