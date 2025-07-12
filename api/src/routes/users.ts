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
  authMiddleware, // ensures req.userId is set from the JWT
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestedUserId = Number(req.params.userId)

      // Prevent users from fetching other users' picks
      if (req.userId !== requestedUserId) {
        res.status(403).json({ message: 'Forbidden' })
        return
      }

      // Fetch picks, including contest → sport & template data
      const picks = await db.pick.findMany({
        where: { userId: requestedUserId },
        include: {
          contest: {
            include: {
              sport: true,
              template: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      // Shape the response
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

export default router
