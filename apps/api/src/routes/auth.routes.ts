import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  JwtTokenPayload,
} from '@collabtrust/shared';
import { AppError } from '../middleware/error.middleware.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../db.js';

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
    const normalizedEmail = input.email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new AppError(409, 'CONFLICT', 'Email address is already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const userRole = input.role as Role;

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: userRole,
        tokenVersion: 0,
        ...(userRole === Role.brand
          ? {
              brandProfile: {
                create: {
                  companyName: '',
                  category: '',
                  profileComplete: false,
                },
              },
            }
          : {
              creatorProfile: {
                create: {
                  displayName: '',
                  niche: '',
                  platforms: [],
                  profileComplete: false,
                },
              },
            }),
      },
      include: {
        brandProfile: true,
        creatorProfile: true,
      },
    });

    const tokenPayload: JwtTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const secret = getJwtSecret();
    const accessToken = jwt.sign(tokenPayload, secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: user.id, tokenVersion: user.tokenVersion }, secret, {
      expiresIn: '7d',
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
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
    const normalizedEmail = input.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        brandProfile: true,
        creatorProfile: true,
      },
    });

    if (!user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
    }

    const secret = getJwtSecret();
    const tokenPayload: JwtTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = jwt.sign(tokenPayload, secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: user.id, tokenVersion: user.tokenVersion }, secret, {
      expiresIn: '7d',
    });

    setRefreshTokenCookie(res, refreshToken);

    const profileComplete =
      user.role === 'brand'
        ? !!user.brandProfile?.profileComplete
        : !!user.creatorProfile?.profileComplete;

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileComplete,
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
    let decoded: { sub: string; tokenVersion: number };
    try {
      decoded = jwt.verify(token, secret) as { sub: string; tokenVersion: number };
    } catch {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      clearRefreshTokenCookie(res);
      throw new AppError(401, 'UNAUTHORIZED', 'Revoked or invalid refresh token');
    }

    const tokenPayload: JwtTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const newAccessToken = jwt.sign(tokenPayload, secret, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ sub: user.id, tokenVersion: user.tokenVersion }, secret, {
      expiresIn: '7d',
    });

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      token: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/logout', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.sub) {
      await prisma.user.update({
        where: { id: req.user.sub },
        data: { tokenVersion: { increment: 1 } },
      });
    }
    clearRefreshTokenCookie(res);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = ForgotPasswordSchema.parse(req.body);
    const normalizedEmail = input.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      if (process.env.NODE_ENV !== 'production') {
        res.setHeader('X-Debug-Reset-Token', rawToken);
      }
    }

    res.status(200).json({ message: 'If the account exists, a reset link was sent' });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = ResetPasswordSchema.parse(req.body);
    const tokenHash = crypto.createHash('sha256').update(input.token).digest('hex');

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      throw new AppError(400, 'BAD_REQUEST', 'Invalid, expired, or already used reset token');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: {
          passwordHash,
          tokenVersion: { increment: 1 },
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});
