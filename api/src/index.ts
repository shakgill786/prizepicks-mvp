// src/index.ts
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth'
import sportsRouter from './routes/sports'
import templatesRouter from './routes/templates'
import contestsRouter from './routes/contests'
import picksRouter from './routes/picks'
import leaderboardRouter from './routes/leaderboard'
import usersRouter from './routes/users'
import cron from 'node-cron'
import { runScoring } from './jobs/scoring'

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',      // allow your React app origin
  credentials: true,                    // enable Access-Control-Allow-Credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/sports', sportsRouter)
app.use('/api/templates', templatesRouter)
app.use('/api/contests', contestsRouter)
app.use('/api/contests/:contestId/picks', picksRouter)
app.use('/api/contests/:contestId/leaderboard', leaderboardRouter)
app.use('/api/users', usersRouter)

app.get('/', (_req: Request, res: Response) => {
  res.send('API is live')
})

// global error handler
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err)
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
)

cron.schedule('0 * * * *', () => {
  console.log('🕑 Running scoring job')
  runScoring().catch(console.error)
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
