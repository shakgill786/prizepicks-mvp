import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router({ mergeParams: true });
const db = new PrismaClient();

// Submit a pick
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contestId = Number(req.params.contestId);
      const { userId, choice } = req.body;
      const pick = await db.pick.create({
        data: { contestId, userId, choice },
      });
      res.status(201).json(pick);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
