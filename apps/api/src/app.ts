import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import config from './lib/config'
import { getUploadDirectoryPath } from './lib/utils'
import { errorHandler } from './middleware/error-handler'
import apiRouter from './routes/api-router'

const app = express()

// Middleware
app.use(cookieParser())
app.use(cors({ origin: config.NEXT_PUBLIC_FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use('/images', express.static(getUploadDirectoryPath()))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api', apiRouter)

// Error handler
app.use(errorHandler)

export default app
