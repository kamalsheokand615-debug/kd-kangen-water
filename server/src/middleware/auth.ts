import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface AuthRequest extends Request {
  user?: { id: number; email: string; role: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = typeof req.cookies?.token === 'string' ? req.cookies.token : undefined;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decodedPayload = jwt.verify(token, config.jwt.secret) as unknown;
    if (typeof decodedPayload !== 'object' || decodedPayload === null) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const decoded = decodedPayload as { id: number; email: string; role: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = typeof req.cookies?.token === 'string' ? req.cookies.token : undefined;
  if (token) {
    try {
      const decodedPayload = jwt.verify(token, config.jwt.secret) as unknown;
      if (typeof decodedPayload === 'object' && decodedPayload !== null) {
        req.user = decodedPayload as { id: number; email: string; role: string };
      }
    } catch {
      // Ignore invalid token
    }
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}