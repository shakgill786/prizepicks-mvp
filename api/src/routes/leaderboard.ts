import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router({ mergeParams: true });
const db = new PrismaClient();

// Get picks for a contest, sorted by score desc
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contestId = Number(req.params.contestId);
      const picks = await db.pick.findMany({
        where: { contestId },
        orderBy: { score: 'desc' },
      });
      res.json(picks);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
