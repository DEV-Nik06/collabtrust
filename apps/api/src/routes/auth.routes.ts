import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterSchema, LoginSchema, RefreshTokenSchema, ForgotPasswordSchema, ResetPasswordSchema, JwtTokenPayload } from '@collabtrust/shared';
import { AppError } from '../middleware/error.middleware.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const authRouter = Router();

function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'changeme_in_production_256bit_secret';
}

function setRefreshTokenCookie(res: Response, token: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('collabtrust_refresh_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function clearRefreshTokenCookie(res: Response): void {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('collabtrust_refresh_token', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: 0,
  });
}

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = RegisterSchema.parse(req.body);
    // Note: DB service persistence will connect with Prisma in core loop step.
    const mockUserId = `usr_${Date.now()}`;
    const tokenPayload: JwtTokenPayload = {
      sub: mockUserId,
      email: input.email,
      role: input.role,
      tokenVersion: 0,
    };

    const secret = getJwtSecret();
    const accessToken = jwt.sign(tokenPayload, secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: mockUserId, tokenVersion: 0 }, secret, { expiresIn: '7d' });

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      user: {
        id: mockUserId,
        email: input.email,
        role: input.role,
        createdAt: new Date().toISOString(),
      },
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = LoginSchema.parse(req.body);
    const mockUserId = `usr_${Date.now()}`;
    const secret = getJwtSecret();

    // Default mock role for scaffolding validation
    const role = input.email.includes('creator') ? 'creator' : 'brand';
    const tokenPayload: JwtTokenPayload = {
      sub: mockUserId,
      email: input.email,
      role,
      tokenVersion: 0,
    };

    const accessToken = jwt.sign(tokenPayload, secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: mockUserId, tokenVersion: 0 }, secret, { expiresIn: '7d' });

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      user: {
        id: mockUserId,
        email: input.email,
        role,
      },
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.collabtrust_refresh_token;
    if (!token && req.body?.refreshToken) {
      token = req.body.refreshToken;
    }

    if (!token) {
      throw new AppError(401, 'UNAUTHORIZED', 'Refresh token required');
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as { sub: string; tokenVersion: number };

    // Rotate refresh token
    const newAccessToken = jwt.sign(
      { sub: decoded.sub, email: 'user@example.com', role: 'brand', tokenVersion: decoded.tokenVersion },
      secret,
      { expiresIn: '15m' }
    );
    const newRefreshToken = jwt.sign({ sub: decoded.sub, tokenVersion: decoded.tokenVersion }, secret, {
      expiresIn: '7d',
    });

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      token: newAccessToken,
    });
  } catch (err) {
    next(new AppError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token'));
  }
});

authRouter.post('/logout', authenticate, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    clearRefreshTokenCookie(res);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    ForgotPasswordSchema.parse(req.body);
    res.status(200).json({ message: 'If the account exists, a reset link was sent' });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    ResetPasswordSchema.parse(req.body);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});
