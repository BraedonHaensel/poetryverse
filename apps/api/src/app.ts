import express from 'express'
import cors from 'cors'
import apiRouter from './routes/apiRouter'
import { errorHandler } from './middleware/errorHandler'

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
