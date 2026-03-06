import { Router } from 'express'

import poemRoutes from './poemRoutes'
import userRoutes from './userRoutes'

const router = Router()
router.use('/users', userRoutes)
router.use('/poems', poemRoutes)

export default router
