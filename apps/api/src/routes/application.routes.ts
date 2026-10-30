import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest, requireRole } from '../middleware/auth.middleware.js';
import { ApplyCampaignSchema, ApplicationDecisionSchema } from '@collabtrust/shared';
import { AppError } from '../middleware/error.middleware.js';
import { prisma } from '../db.js';

export const applicationRouter = Router();

// TC-COLLAB-01, TC-COLLAB-02, TC-CAMP-13: Creator Submits Application with pitchNote
applicationRouter.post(
  '/campaigns/:id/apply',
  authenticate,
  requireRole('creator'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const input = ApplyCampaignSchema.parse(req.body);
      const userId = req.user!.sub;

      const creatorProfile = await prisma.creatorProfile.findUnique({
        where: { userId },
      });

      if (!creatorProfile) {
        throw new AppError(400, 'BAD_REQUEST', 'Please complete your creator profile before applying');
      }

      const campaign = await prisma.campaign.findUnique({
        where: { id: req.params.id },
      });

      if (!campaign) {
        throw new AppError(404, 'NOT_FOUND', 'Campaign not found');
      }

      // TC-CAMP-13: Applications to non-active campaigns must be rejected
      if (campaign.status !== 'active') {
        throw new AppError(400, 'BAD_REQUEST', `Cannot apply to campaign with status '${campaign.status}'. Only active campaigns accept applications.`);
      }

      // TC-COLLAB-02: Prevent duplicate applications
      const existingApplication = await prisma.application.findUnique({
        where: {
          campaignId_creatorProfileId: {
            campaignId: campaign.id,
            creatorProfileId: creatorProfile.id,
          },
        },
      });

      if (existingApplication) {
        throw new AppError(409, 'CONFLICT', 'You have already submitted an application for this campaign');
      }

      const application = await prisma.application.create({
        data: {
          campaignId: campaign.id,
          creatorProfileId: creatorProfile.id,
          pitchNote: input.pitchNote ?? null,
          status: 'pending',
        },
        include: {
          creatorProfile: true,
        },
      });

      res.status(201).json(application);
    } catch (err) {
      next(err);
    }
  }
);

// TC-COLLAB-08: Brand Lists Campaign Applications
applicationRouter.get(
  '/campaigns/:id/applications',
  authenticate,
  requireRole('brand'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: req.params.id },
      });

      if (!campaign) {
        throw new AppError(404, 'NOT_FOUND', 'Campaign not found');
      }

      if (campaign.brandId !== req.user!.sub) {
        throw new AppError(403, 'FORBIDDEN', 'Only the campaign owner can review applications');
      }

      const applications = await prisma.application.findMany({
        where: { campaignId: campaign.id },
        include: {
          creatorProfile: {
            include: {
              trustSignals: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Attach match score / explanation if available
      const formatted = await Promise.all(
        applications.map(async (app) => {
          const match = await prisma.match.findUnique({
            where: {
              campaignId_creatorProfileId: {
                campaignId: campaign.id,
                creatorProfileId: app.creatorProfileId,
              },
            },
          });

          return {
            id: app.id,
            campaignId: app.campaignId,
            creatorProfileId: app.creatorProfileId,
            displayName: app.creatorProfile.displayName,
            niche: app.creatorProfile.niche,
            pitchNote: app.pitchNote,
            status: app.status,
            createdAt: app.createdAt.toISOString(),
            matchScore: match?.score ?? null,
            matchExplanation: match?.explanation ?? null,
          };
        })
      );

      res.status(200).json({
        campaignId: campaign.id,
        applications: formatted,
      });
    } catch (err) {
      next(err);
    }
  }
);

// TC-COLLAB-03, TC-COLLAB-09: Brand Accepts or Declines Application
applicationRouter.post(
  '/applications/:id/decision',
  authenticate,
  requireRole('brand'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { decision } = ApplicationDecisionSchema.parse(req.body);

      const application = await prisma.application.findUnique({
        where: { id: req.params.id },
        include: { campaign: true },
      });

      if (!application) {
        throw new AppError(404, 'NOT_FOUND', 'Application not found');
      }

      if (application.campaign.brandId !== req.user!.sub) {
        throw new AppError(403, 'FORBIDDEN', 'Only the campaign owner can decide on applications');
      }

      if (decision === 'accepted') {
        // TC-COLLAB-03: Accept application and initialize collaboration with status 'invited'
        const [updatedApp, collaboration] = await prisma.$transaction([
          prisma.application.update({
            where: { id: application.id },
            data: { status: 'accepted' },
          }),
          prisma.collaboration.create({
            data: {
              campaignId: application.campaignId,
              brandId: req.user!.sub,
              creatorProfileId: application.creatorProfileId,
              applicationId: application.id,
              status: 'invited',
            },
          }),
        ]);

        return res.status(200).json({
          applicationId: updatedApp.id,
          status: 'accepted',
          collaboration,
        });
      } else {
        // TC-COLLAB-09: Decline application without creating collaboration
        const updatedApp = await prisma.application.update({
          where: { id: application.id },
          data: { status: 'declined' },
        });

        return res.status(200).json({
          applicationId: updatedApp.id,
          status: 'declined',
          collaboration: null,
        });
      }
    } catch (err) {
      next(err);
    }
  }
);
