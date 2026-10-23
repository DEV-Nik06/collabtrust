import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest, requireRole } from '../middleware/auth.middleware.js';
import { ApplyCampaignSchema, ApplicationDecisionSchema } from '@collabtrust/shared';

export const applicationRouter = Router();

applicationRouter.post(
  '/campaigns/:id/apply',
  authenticate,
  requireRole('creator'),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const input = ApplyCampaignSchema.parse(req.body);
      res.status(201).json({
        id: `app_${Date.now()}`,
        campaignId: req.params.id,
        creatorProfileId: req.user?.sub,
        pitchNote: input.pitchNote || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

applicationRouter.get(
  '/campaigns/:id/applications',
  authenticate,
  requireRole('brand'),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        campaignId: req.params.id,
        applications: [
          {
            id: 'app_001',
            creatorProfileId: 'creator_001',
            displayName: 'Maya Torres',
            niche: 'Sustainable Living',
            pitchNote: 'I love green tea skincare and would love to feature your moisturizer!',
            matchScore: 0.88,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
        ],
      });
    } catch (err) {
      next(err);
    }
  }
);

applicationRouter.post(
  '/applications/:id/decision',
  authenticate,
  requireRole('brand'),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { decision } = ApplicationDecisionSchema.parse(req.body);
      const isAccepted = decision === 'accepted';
      res.status(200).json({
        applicationId: req.params.id,
        status: decision,
        collaboration: isAccepted
          ? {
              id: `collab_${Date.now()}`,
              status: 'invited',
              createdAt: new Date().toISOString(),
            }
          : null,
      });
    } catch (err) {
      next(err);
    }
  }
);
