import express, { Request, Response } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import sportsRouter from './routes/sports';
import templatesRouter from './routes/templates';
import contestsRouter from './routes/contests';
import picksRouter from './routes/picks';
import leaderboardRouter from './routes/leaderboard';
import { runScoring } from './jobs/scoring';

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/sports', sportsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/contests', contestsRouter);
app.use('/api/contests/:contestId/picks', picksRouter);
app.use('/api/contests/:contestId/leaderboard', leaderboardRouter);

app.get('/', (_req: Request, res: Response) => {
  res.send('API is live');
});

// Cron: run scoring every hour at minute 0
cron.schedule('0 * * * *', () => {
  console.log('🕑 Running scoring job');
  runScoring().catch(console.error);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
