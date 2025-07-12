import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const db = new PrismaClient()

/**
 * requireAdmin:
 *   1) validates JWT & sets req.userId
 *   2) loads the full User record so we can check isAdmin
 */
async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // first ensure JWT is valid and userId is set
  await authMiddleware(req, res, async () => {
    // then fetch the user record
    const u = await db.user.findUnique({
      where: { id: req.userId! },
    })
    if (!u || !u.isAdmin) {
      return res.status(403).json({ message: 'Forbidden: admins only' })
    }
    next()
  })
}

// --- public: list all contests ---
router.get(
  '/',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const contests = await db.contest.findMany({
        include: { sport: true, template: true },
      })
      const result = contests.map((c) => ({
        id: c.id,
        sport: c.sport.slug,
        type: c.contestType,
        description: c.template.description,
      }))
      res.json(result)
    } catch (err) {
      next(err)
    }
  }
)

// --- admin only: create a new contest ---
router.post(
  '/',
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sportId, templateId, contestType, startAt, endAt } = req.body
      const contest = await db.contest.create({
        data: {
          sportId,
          templateId,
          contestType,
          startAt: new Date(startAt),
          endAt:   new Date(endAt),
        },
      })
      res.status(201).json(contest)
    } catch (err) {
      next(err)
    }
  }
)

export default router
