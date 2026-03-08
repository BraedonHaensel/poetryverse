import { Router } from 'express'

import { generateAIPoem } from '../controllers/poem-controller'
import { asyncHandler } from '../lib/async-handler'
import { requireAuth } from '../middleware/auth'

const router = Router()

/**
 * Route serving AI generated poem form
 * @name post/api/poems/generate
 * @function
 * @memberof module:routes/poemRoutes
 * @inner
 * @param {PoemAIRequest} req.body - Request body containing poem type and prompt
 * @param {Response} res - Express response object
 * @returns {PoemAIResponse} JSON response containing generated poem data
 */
router.post('/generate', requireAuth, asyncHandler(generateAIPoem))

export default router
