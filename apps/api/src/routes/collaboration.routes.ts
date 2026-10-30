import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { UpdateCollaborationStatusSchema, CreateMessageSchema } from '@collabtrust/shared';
import { AppError } from '../middleware/error.middleware.js';
import { prisma } from '../db.js';

export const collaborationRouter = Router();

// TC-COLLAB-07, TC-COLLAB-11: Collaboration Lifecycle State Visibility & Role Protection
collaborationRouter.get('/collaborations/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const collaboration = await prisma.collaboration.findUnique({
      where: { id: req.params.id },
      include: {
        campaign: true,
        brand: {
          include: { brandProfile: true },
        },
        creatorProfile: {
          include: { user: true },
        },
      },
    });

    if (!collaboration) {
      throw new AppError(404, 'NOT_FOUND', 'Collaboration not found');
    }

    const userId = req.user!.sub;
    const isBrandParticipant = collaboration.brandId === userId;
    const isCreatorParticipant = collaboration.creatorProfile.userId === userId;

    if (!isBrandParticipant && !isCreatorParticipant) {
      throw new AppError(403, 'FORBIDDEN', 'Access denied: you are not a participant in this collaboration');
    }

    res.status(200).json({
      id: collaboration.id,
      campaignId: collaboration.campaignId,
      campaignTitle: collaboration.campaign.title,
      brandName: collaboration.brand.brandProfile?.companyName || 'Brand Partner',
      creatorName: collaboration.creatorProfile.displayName,
      status: collaboration.status,
      createdAt: collaboration.createdAt.toISOString(),
      updatedAt: collaboration.updatedAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// TC-COLLAB-05, TC-COLLAB-06, TC-COLLAB-07, TC-COLLAB-10, TC-COLLAB-12: Collaboration Status Transitions
collaborationRouter.put(
  '/collaborations/:id/status',
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const collaboration = await prisma.collaboration.findUnique({
        where: { id: req.params.id },
        include: {
          creatorProfile: true,
        },
      });

      if (!collaboration) {
        throw new AppError(404, 'NOT_FOUND', 'Collaboration not found');
      }

      const userId = req.user!.sub;
      const isBrandParticipant = collaboration.brandId === userId;
      const isCreatorParticipant = collaboration.creatorProfile.userId === userId;

      // TC-COLLAB-07: Non-participant rejection
      if (!isBrandParticipant && !isCreatorParticipant) {
        throw new AppError(403, 'FORBIDDEN', 'Access denied: unauthorized collaboration modification');
      }

      // Support deliverable delivery flag without status change (TC-COLLAB-12)
      if (req.body.deliverableDelivered === true) {
        // Record deliverable notice in message thread
        await prisma.message.create({
          data: {
            collaborationId: collaboration.id,
            senderId: userId,
            content: 'Deliverable submitted for brand review: Product Reel URL & metrics snapshot attached.',
          },
        });

        return res.status(200).json({
          id: collaboration.id,
          status: collaboration.status,
          deliverableNotice: 'Deliverable marked as delivered; awaiting brand confirmation.',
        });
      }

      const { status } = UpdateCollaborationStatusSchema.parse(req.body);

      // TC-COLLAB-06: Unconfirmed collaboration cannot be activated directly to in_progress
      if (collaboration.status === 'invited' && status === 'in_progress') {
        throw new AppError(
          409,
          'CONFLICT',
          'Cannot activate collaboration before creator acknowledgement; status remains invited'
        );
      }

      // TC-COLLAB-10: Creator confirmation transitions invited -> accepted
      if (collaboration.status === 'invited' && status === 'accepted') {
        if (!isCreatorParticipant) {
          throw new AppError(403, 'FORBIDDEN', 'Only the creator can accept an invitation to collaborate');
        }
      }

      const updated = await prisma.collaboration.update({
        where: { id: collaboration.id },
        data: {
          status,
          updatedAt: new Date(),
        },
      });

      res.status(200).json({
        id: updated.id,
        status: updated.status,
        updatedAt: updated.updatedAt.toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

// TC-COLLAB-04: Message Thread Exchange (GET & POST)
collaborationRouter.get(
  '/collaborations/:id/messages',
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const collaboration = await prisma.collaboration.findUnique({
        where: { id: req.params.id },
        include: { creatorProfile: true },
      });

      if (!collaboration) {
        throw new AppError(404, 'NOT_FOUND', 'Collaboration not found');
      }

      const userId = req.user!.sub;
      if (collaboration.brandId !== userId && collaboration.creatorProfile.userId !== userId) {
        throw new AppError(403, 'FORBIDDEN', 'Access denied to collaboration messages');
      }

      const messages = await prisma.message.findMany({
        where: { collaborationId: collaboration.id },
        include: {
          sender: {
            select: {
              id: true,
              role: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      const formatted = messages.map((m) => ({
        id: m.id,
        collaborationId: m.collaborationId,
        senderId: m.senderId,
        senderRole: m.sender.role,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      }));

      res.status(200).json({
        collaborationId: collaboration.id,
        messages: formatted,
      });
    } catch (err) {
      next(err);
    }
  }
);

collaborationRouter.post(
  '/collaborations/:id/messages',
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const input = CreateMessageSchema.parse(req.body);
      const collaboration = await prisma.collaboration.findUnique({
        where: { id: req.params.id },
        include: { creatorProfile: true },
      });

      if (!collaboration) {
        throw new AppError(404, 'NOT_FOUND', 'Collaboration not found');
      }

      const userId = req.user!.sub;
      if (collaboration.brandId !== userId && collaboration.creatorProfile.userId !== userId) {
        throw new AppError(403, 'FORBIDDEN', 'Access denied to post messages');
      }

      const message = await prisma.message.create({
        data: {
          collaborationId: collaboration.id,
          senderId: userId,
          content: input.content,
        },
        include: {
          sender: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      });

      res.status(201).json({
        id: message.id,
        collaborationId: message.collaborationId,
        senderId: message.senderId,
        senderRole: message.sender.role,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);
