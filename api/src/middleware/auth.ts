import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

// the one true JWT guard
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid token' });
    return;
  }
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof payload === 'object' && 'userId' in payload) {
      req.userId = (payload as any).userId;
      next();
    } else {
      throw new Error('Invalid token payload');
    }
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// alias for readability
export const requireAuth = authMiddleware;
