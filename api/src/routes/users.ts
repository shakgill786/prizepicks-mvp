// api/src/routes/users.ts

import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const db = new PrismaClient();

/**
 * GET /api/users/:userId/picks
 * Returns all picks for a given user, joined with contest info.
 */
router.get(
  '/:userId/picks',
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId, 10);
    console.log(`🔍 Fetching picks for user ${userId}`);

    try {
      const picks = await db.pick.findMany({
        where: { userId },
        include: {
          contest: {
            include: {
              sport: true,
              template: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      });

      const result = picks.map((p) => ({
        id: p.id,
        contestId: p.contestId,
        choice: p.choice,
        createdAt: p.createdAt,
        sport: p.contest.sport.slug,
        type: p.contest.contestType,
        description: p.contest.template.description,
      }));

      console.log(`🗄️  /api/users/${userId}/picks →`, result);
      res.json(result);
    } catch (err) {
      console.error(`❌ Error fetching picks for user ${userId}:`, err);
      next(err);
    }
  }
);

export default router;
