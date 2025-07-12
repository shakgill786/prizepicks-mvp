// api/src/routes/users.ts
import express, { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = express.Router()
const db = new PrismaClient()

/**
 * GET /api/users/:userId/picks
 * Returns the authenticated user’s picks.
 */
router.get(
  '/:userId/picks',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestedUserId = Number(req.params.userId)
      if (req.userId !== requestedUserId) {
        res.status(403).json({ message: 'Forbidden' })
        return
      }

      const picks = await db.pick.findMany({
        where: { userId: requestedUserId },
        include: {
          contest: {
            include: { sport: true, template: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      const result = picks.map((p) => ({
        id: p.id,
        contestId: p.contestId,
        choice: p.choice,
        createdAt: p.createdAt,
        sport: p.contest.sport.slug,
        type: p.contest.contestType,
        description: p.contest.template.description,
      }))

      res.json(result)
    } catch (err) {
      next(err)
    }
  }
)

/**
 * PATCH /api/users/:userId
 * Update the authenticated user’s profile.
 */
router.patch(
  '/:userId',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestedUserId = Number(req.params.userId)
      if (req.userId !== requestedUserId) {
        res.status(403).json({ message: 'Forbidden' })
        return
      }

      const { displayName, avatarUrl } = req.body as {
        displayName?: string
        avatarUrl?: string
      }

      const updated = await db.user.update({
        where: { id: requestedUserId },
        data: { displayName, avatarUrl },
        select: { id: true, email: true, displayName: true, avatarUrl: true, isAdmin: true },
      })

      res.json(updated)
    } catch (err) {
      next(err)
    }
  }
)

export default router
