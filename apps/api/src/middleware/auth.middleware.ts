import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtTokenPayload, UserRole } from '@collabtrust/shared';
import { AppError } from './error.middleware.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtTokenPayload;
}

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.collabtrust_access_token) {
    token = req.cookies.collabtrust_access_token;
  }

  if (!token) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Authentication token required'));
  }

  const secret = process.env.JWT_SECRET || 'changeme_in_production_256bit_secret';

  try {
    const payload = jwt.verify(token, secret) as JwtTokenPayload;
    req.user = payload;
    next();
  } catch (err) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Invalid or expired authentication token'));
  }
}

export function requireRole(allowedRole: UserRole) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
    }

    if (req.user.role !== allowedRole) {
      return next(
        new AppError(403, 'FORBIDDEN', `Forbidden: action requires '${allowedRole}' role, current is '${req.user.role}'`)
      );
    }

    next();
  };
}
