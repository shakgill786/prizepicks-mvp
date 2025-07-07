import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const db = new PrismaClient();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const sports = await db.sport.findMany();
    res.json(sports);
  } catch (err) {
    next(err);
  }
});

export default router;
