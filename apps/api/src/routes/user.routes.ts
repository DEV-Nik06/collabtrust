import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { BrandProfileSchema, CreatorProfileSchema } from '@collabtrust/shared';
import { AppError } from '../middleware/error.middleware.js';
import { prisma } from '../db.js';

export const userRouter = Router();

userRouter.get('/users/me/profile', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        brandProfile: true,
        creatorProfile: {
          include: {
            trustSignals: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }

    if (user.role === 'brand') {
      res.status(200).json({
        profile: user.brandProfile || {
          companyName: '',
          category: '',
          profileComplete: false,
        },
      });
    } else {
      res.status(200).json({
        profile: user.creatorProfile || {
          displayName: '',
          niche: '',
          platforms: [],
          profileComplete: false,
        },
      });
    }
  } catch (err) {
    next(err);
  }
});

userRouter.put('/users/me/profile', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub;
    const isBrand = req.user!.role === 'brand';

    if (isBrand) {
      const validated = BrandProfileSchema.parse(req.body);
      const profile = await prisma.brandProfile.upsert({
        where: { userId },
        create: {
          userId,
          companyName: validated.companyName,
          category: validated.category,
          description: validated.description ?? null,
          website: validated.website ?? null,
          budgetRange: validated.budgetRange ?? null,
          goals: validated.goals ?? null,
          profileComplete: true,
        },
        update: {
          companyName: validated.companyName,
          category: validated.category,
          description: validated.description ?? null,
          website: validated.website ?? null,
          budgetRange: validated.budgetRange ?? null,
          goals: validated.goals ?? null,
          profileComplete: true,
        },
      });
      res.status(200).json({ profile });
    } else {
      const validated = CreatorProfileSchema.parse(req.body);
      const profile = await prisma.creatorProfile.upsert({
        where: { userId },
        create: {
          userId,
          displayName: validated.displayName,
          niche: validated.niche,
          platforms: validated.platforms,
          audienceSize: validated.audienceSize ?? null,
          contentStyle: validated.contentStyle ?? null,
          collaborationPrefs: validated.collaborationPrefs ?? null,
          bio: validated.bio ?? null,
          profileComplete: true,
        },
        update: {
          displayName: validated.displayName,
          niche: validated.niche,
          platforms: validated.platforms,
          audienceSize: validated.audienceSize ?? null,
          contentStyle: validated.contentStyle ?? null,
          collaborationPrefs: validated.collaborationPrefs ?? null,
          bio: validated.bio ?? null,
          profileComplete: true,
        },
      });
      res.status(200).json({ profile });
    }
  } catch (err) {
    next(err);
  }
});

userRouter.get('/creators/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const creator = await prisma.creatorProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: {
        trustSignals: true,
      },
    });

    if (!creator) {
      throw new AppError(404, 'NOT_FOUND', 'Creator profile not found');
    }

    res.status(200).json(creator);
  } catch (err) {
    next(err);
  }
});

userRouter.get('/brands/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const brand = await prisma.brandProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: {
        user: {
          include: {
            campaigns: {
              where: { status: 'completed' },
              select: { id: true, title: true, status: true },
            },
          },
        },
      },
    });

    if (!brand) {
      throw new AppError(404, 'NOT_FOUND', 'Brand profile not found');
    }

    res.status(200).json({
      ...brand,
      completedCampaigns: brand.user.campaigns.length,
    });
  } catch (err) {
    next(err);
  }
});
