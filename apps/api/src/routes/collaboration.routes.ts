import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { UpdateCollaborationStatusSchema, CreateMessageSchema } from '@collabtrust/shared';

export const collaborationRouter = Router();

collaborationRouter.get('/collaborations/:id', authenticate, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      id: req.params.id,
      campaignTitle: 'Green Tea Facial Moisturizer Product Review',
      brandName: 'Glow Skincare Co',
      creatorName: 'Maya Torres',
      status: 'accepted',
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

collaborationRouter.put(
  '/collaborations/:id/status',
  authenticate,
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { status } = UpdateCollaborationStatusSchema.parse(req.body);
      res.status(200).json({
        id: req.params.id,
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);

collaborationRouter.get(
  '/collaborations/:id/messages',
  authenticate,
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        collaborationId: req.params.id,
        messages: [
          {
            id: 'msg_001',
            senderRole: 'creator',
            content: 'Received the moisturizer! Will start testing tomorrow.',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'msg_002',
            senderRole: 'brand',
            content: 'Wonderful, let us know if you need anything!',
            createdAt: new Date().toISOString(),
          },
        ],
      });
    } catch (err) {
      next(err);
    }
  }
);

collaborationRouter.post(
  '/collaborations/:id/messages',
  authenticate,
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const input = CreateMessageSchema.parse(req.body);
      res.status(201).json({
        id: `msg_${Date.now()}`,
        collaborationId: req.params.id,
        senderId: req.user?.sub,
        content: input.content,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
);
