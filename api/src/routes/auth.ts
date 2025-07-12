import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const db = new PrismaClient()

// POST /api/auth/signup
router.post(
  '/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, displayName } = req.body
      const hash = await bcrypt.hash(password, 10)
      const user = await db.user.create({
        data: { email, password: hash, displayName },
        select: { id: true, email: true, displayName: true, avatarUrl: true }
      })
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '7d'
      })
      res.status(201).json({ token, user })   // <-- no return
    } catch (err) {
      next(err)
    }
  }
)

// POST /api/auth/login
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body
      const user = await db.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          password: true
        }
      })
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' })
        return
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        res.status(401).json({ message: 'Invalid credentials' })
        return
      }
      // strip off the hashed password
      const { password: _, ...safeUser } = user
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '7d'
      })
      res.json({ token, user: safeUser })      // <-- no return
    } catch (err) {
      next(err)
    }
  }
)

// GET /api/auth/me
router.get(
  '/me',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await db.user.findUnique({
        where: { id: req.userId! },
        select: { id: true, email: true, displayName: true, avatarUrl: true }
      })
      res.json(user)                          // <-- no return
    } catch (err) {
      next(err)
    }
  }
)

export default router
