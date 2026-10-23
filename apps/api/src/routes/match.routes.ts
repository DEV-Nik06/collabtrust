import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest, requireRole } from '../middleware/auth.middleware.js';
import { MANDATORY_TRUST_DISCLAIMER } from '@collabtrust/shared';

export const matchRouter = Router();

matchRouter.get(
  '/campaigns/:id/matches',
  authenticate,
  requireRole('brand'),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        campaignId: req.params.id,
        matches: [
          {
            creator: {
              id: 'creator_001',
              displayName: 'Maya Torres',
              niche: 'Sustainable Living',
              audienceSize: 8500,
            },
            score: 0.88,
            explanation:
              'High audience alignment in clean skincare; consistent engagement in product review reel format matches your deliverables.',
            factors: {
              nicheOverlap: 0.9,
              contentStyleFit: 0.85,
            },
          },
        ],
      });
    } catch (err) {
      next(err);
    }
  }
);

matchRouter.post(
  '/matches/refresh',
  authenticate,
  requireRole('brand'),
  (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ message: 'Matches refreshed successfully' });
    } catch (err) {
      next(err);
    }
  }
);

matchRouter.get(
  '/creators/:id/trust-signals',
  authenticate,
  requireRole('brand'),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        creatorId: req.params.id,
        disclaimer: MANDATORY_TRUST_DISCLAIMER,
        signals: [
          {
            signalType: 'profile_completeness',
            signalValue: 'Profile complete with verified social channels and bio',
            severity: 'info',
          },
          {
            signalType: 'engagement_consistency',
            signalValue: 'Self-reported engagement figures are internally consistent with stated audience size',
            severity: 'info',
          },
          {
            signalType: 'growth_pattern',
            signalValue: 'Self-reported follower history shows steady progression; metrics are creator-reported',
            severity: 'info',
          },
        ],
        generatedAt: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

matchRouter.get(
  '/creators/:id/insights',
  authenticate,
  requireRole('brand'),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        creatorId: req.params.id,
        summary: 'Micro-creator focused on zero-waste lifestyle and ethical beauty with high community trust.',
        contentHighlights: ['Aesthetic short-form reels', 'Honest 7-day product trial logs'],
        audienceFitNotes: 'Audience skews heavily towards eco-conscious skincare shoppers aged 20-34.',
      });
    } catch (err) {
      next(err);
    }
  }
);
