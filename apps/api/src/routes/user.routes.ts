import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { BrandProfileSchema, CreatorProfileSchema } from '@collabtrust/shared';

export const userRouter = Router();

userRouter.get('/users/me/profile', authenticate, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const isBrand = req.user?.role === 'brand';
    res.status(200).json({
      profile: isBrand
        ? {
            companyName: 'Glow Skincare Co',
            category: 'Beauty & Wellness',
            description: 'Organic skincare for sensitive skin',
            budgetRange: '$500-$1500',
            goals: 'Partner with authentic micro-creators',
            profileComplete: true,
          }
        : {
            displayName: 'Maya Torres',
            niche: 'Sustainable Living',
            platforms: [{ name: 'Instagram', handle: '@mayagreen', followers: 8500 }],
            audienceSize: 8500,
            contentStyle: 'Educational reels',
            collaborationPrefs: 'Paid video posts',
            profileComplete: true,
          },
    });
  } catch (err) {
    next(err);
  }
});

userRouter.put('/users/me/profile', authenticate, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role === 'brand') {
      const validated = BrandProfileSchema.parse(req.body);
      res.status(200).json({ ...validated, profileComplete: true });
    } else {
      const validated = CreatorProfileSchema.parse(req.body);
      res.status(200).json({ ...validated, profileComplete: true });
    }
  } catch (err) {
    next(err);
  }
});

userRouter.get('/creators/:id', authenticate, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      id: req.params.id,
      displayName: 'Maya Torres',
      niche: 'Sustainable Living',
      platforms: [{ name: 'Instagram', handle: '@mayagreen', followers: 8500 }],
      audienceSize: 8500,
      contentStyle: 'Aesthetic reels and reviews',
      bio: 'Eco-conscious living tips and daily habits',
    });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/brands/:id', authenticate, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      id: req.params.id,
      companyName: 'Glow Skincare Co',
      category: 'Beauty & Wellness',
      description: 'Clean organic skincare for sensitive skin',
      completedCampaigns: 4,
      accountAgeMonths: 6,
    });
  } catch (err) {
    next(err);
  }
});
