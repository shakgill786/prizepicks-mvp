import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const db = new PrismaClient();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = await db.propTemplate.findMany();
    res.json(templates);
  } catch (err) {
    next(err);
  }
});

export default router;
