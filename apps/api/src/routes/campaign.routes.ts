import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest, requireRole } from '../middleware/auth.middleware.js';
import { AiDraftBriefInputSchema, CreateCampaignSchema, UpdateCampaignSchema } from '@collabtrust/shared';

export const campaignRouter = Router();

campaignRouter.post(
  '/campaigns/ai-draft',
  authenticate,
  requireRole('brand'),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const input = AiDraftBriefInputSchema.parse(req.body);
      // In core loop, connects to LLM client. Scaffolding returns structured mock brief conforming to schema.
      res.status(200).json({
        structuredBrief: {
          title: 'Product Review & Engagement Campaign',
          goals: 'Drive trial and brand awareness through genuine creator reviews',
          targetAudience: 'Eco-conscious lifestyle enthusiasts aged 18-35',
          deliverables: '1 Instagram Reel (30-60s) + 2 Stories with link',
          timeline: '30 days from product arrival',
          budget: '$500 total budget',
          requirements: 'Creator must feature clean usage and transparent disclosure',
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

campaignRouter.post(
  '/campaigns',
  authenticate,
  requireRole('brand'),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const input = CreateCampaignSchema.parse(req.body);
      const campaignId = `camp_${Date.now()}`;
      res.status(201).json({
        id: campaignId,
        brandId: req.user?.sub,
        ...input,
        status: 'draft',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

campaignRouter.post(
  '/campaigns/:id/publish',
  authenticate,
  requireRole('brand'),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        id: req.params.id,
        status: 'active',
        publishedAt: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

campaignRouter.post(
  '/campaigns/:id/close',
  authenticate,
  requireRole('brand'),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        id: req.params.id,
        status: 'closed',
        closedAt: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

campaignRouter.get('/campaigns', authenticate, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    res.status(200).json({
      campaigns: [
        {
          id: 'camp_001',
          title: 'Green Tea Facial Moisturizer Product Review',
          category: (category as string) || 'Beauty & Wellness',
          deliverables: '1 Reel + 2 Stories',
          budget: '$500',
          status: 'active',
        },
      ],
    });
  } catch (err) {
    next(err);
  }
});

campaignRouter.get('/campaigns/:id', authenticate, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      id: req.params.id,
      title: 'Green Tea Facial Moisturizer Product Review',
      category: 'Beauty & Wellness',
      goals: 'Drive trial and awareness',
      targetAudience: 'Eco-conscious skincare enthusiasts',
      deliverables: '1 Instagram Reel + 2 Stories',
      timeline: '30 days',
      budget: '$500',
      requirements: 'Genuine review after 7-day usage',
      status: 'active',
    });
  } catch (err) {
    next(err);
  }
});
