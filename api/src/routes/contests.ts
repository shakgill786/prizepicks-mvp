import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const db = new PrismaClient();

// List contests
router.get(
  '/',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const contests = await db.contest.findMany({
        include: { sport: true, template: true },
      });
      const result = contests.map((c: any) => ({
        id: c.id,
        sport: c.sport.slug,
        type: c.contestType,
        description: c.template.description,
      }));
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// Create a new contest
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sportId, templateId, contestType, startAt, endAt } = req.body;
      const contest = await db.contest.create({
        data: {
          sportId,
          templateId,
          contestType,
          startAt: new Date(startAt),
          endAt: new Date(endAt),
        },
      });
      res.status(201).json(contest);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
