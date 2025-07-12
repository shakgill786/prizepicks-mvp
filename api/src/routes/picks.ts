import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router({ mergeParams: true })
const db = new PrismaClient()

// Submit a pick (only for logged-in)
router.post(
  '/',
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const contestId = Number(req.params.contestId)
      const { choice } = req.body
      const pick = await db.pick.create({
        data: {
          contestId,
          userId: req.userId!,
          choice,
        },
      })
      res.status(201).json(pick)
    } catch (err) {
      next(err)
    }
  }
)

export default router
