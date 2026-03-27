import { Router } from 'express'

import poemRoutes from './poem-routes'
import poemTypeRoutes from './poem-type-routes'
import reportRoutes from './report-routes'
import tagRoutes from './tag-routes'
import userRoutes from './user-routes'

const router = Router()
router.use('/users', userRoutes)
router.use('/poems', poemRoutes)
router.use('/poem-types', poemTypeRoutes)
router.use('/tags', tagRoutes)
router.use('/reports', reportRoutes)

export default router
