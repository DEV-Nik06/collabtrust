import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../db.js';

export const dashboardRouter = Router();

// TC-DASH-01, TC-DASH-02, TC-DASH-03, TC-DASH-04: Role-Tailored Dashboards & Empty States
dashboardRouter.get('/dashboard', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub;
    const isBrand = req.user!.role === 'brand';

    if (isBrand) {
      // TC-DASH-01: Brand Dashboard Rendering
      const [campaigns, collaborations] = await Promise.all([
        prisma.campaign.findMany({
          where: { brandId: userId },
          include: {
            applications: {
              where: { status: 'pending' },
              include: { creatorProfile: true },
              orderBy: { createdAt: 'desc' },
            },
            matches: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.collaboration.findMany({
          where: {
            brandId: userId,
            status: { in: ['invited', 'accepted', 'in_progress'] },
          },
          include: {
            creatorProfile: true,
            campaign: { select: { title: true } },
          },
        }),
      ]);

      const activeCampaigns = campaigns.filter((c) => c.status === 'active');
      const totalPendingApps = campaigns.reduce((acc, c) => acc + c.applications.length, 0);

      const pendingApplications = campaigns.flatMap((c) =>
        c.applications.map((app) => ({
          id: app.id,
          campaignId: c.id,
          campaignTitle: c.title,
          creatorProfileId: app.creatorProfileId,
          displayName: app.creatorProfile.displayName,
          niche: app.creatorProfile.niche,
          pitchNote: app.pitchNote,
          status: app.status,
          createdAt: app.createdAt.toISOString(),
        }))
      );

      // TC-DASH-04: Empty state onboarding indicators
      const isEmpty = campaigns.length === 0;

      res.status(200).json({
        role: 'brand',
        metrics: {
          totalCampaigns: campaigns.length,
          activeCampaignsCount: activeCampaigns.length,
          pendingApplicationsCount: totalPendingApps,
          activeCollaborationsCount: collaborations.length,
        },
        activeCampaigns,
        pendingApplications,
        pendingApplicationsCount: totalPendingApps,
        activeCollaborations: collaborations,
        emptyState: isEmpty,
        onboardingAction: isEmpty ? 'Create your first campaign or use AI brief structuring.' : null,
      });
    } else {
      // TC-DASH-02: Creator Dashboard Rendering
      const creatorProfile = await prisma.creatorProfile.findUnique({
        where: { userId },
        include: {
          applications: {
            include: { campaign: true },
            orderBy: { createdAt: 'desc' },
          },
          matches: {
            include: { campaign: true },
            orderBy: { score: 'desc' },
          },
          collaborations: {
            where: { status: { in: ['invited', 'accepted', 'in_progress'] } },
            include: { campaign: true },
          },
        },
      });

      const isEmpty =
        !creatorProfile ||
        (creatorProfile.applications.length === 0 && creatorProfile.collaborations.length === 0);

      res.status(200).json({
        role: 'creator',
        metrics: {
          matchedOpportunitiesCount: creatorProfile?.matches.length || 0,
          applicationsCount: creatorProfile?.applications.length || 0,
          activeCollaborationsCount: creatorProfile?.collaborations.length || 0,
        },
        matchedOpportunities: creatorProfile?.matches || [],
        applications: creatorProfile?.applications || [],
        activeCollaborations: creatorProfile?.collaborations || [],
        emptyState: isEmpty,
        onboardingAction: isEmpty ? 'Complete your creator profile and browse active campaign opportunities.' : null,
      });
    }
  } catch (err) {
    next(err);
  }
});
