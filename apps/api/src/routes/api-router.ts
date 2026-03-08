import { Router } from 'express'

import poemRoutes from './poem-routes'
import userRoutes from './user-routes'

const router = Router()
router.use('/users', userRoutes)
router.use('/poems', poemRoutes)

export default router
