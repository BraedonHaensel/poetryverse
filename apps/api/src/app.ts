import cors from 'cors'
import express from 'express'

import { errorHandler } from './middleware/errorHandler'
import apiRouter from './routes/apiRouter'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api', apiRouter)

// Error handler
app.use(errorHandler)

export default app
