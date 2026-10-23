import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { healthRouter } from './routes/health.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { userRouter } from './routes/user.routes.js';
import { campaignRouter } from './routes/campaign.routes.js';
import { matchRouter } from './routes/match.routes.js';
import { applicationRouter } from './routes/application.routes.js';
import { collaborationRouter } from './routes/collaboration.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

export function createApp(): Express {
  const app = express();

  // Request correlation ID middleware (NFR-017, NFR-023)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    res.setHeader('X-Request-Id', requestId);
    next();
  });

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  // Mount API v1 routes
  app.use('/api/v1', healthRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1', userRouter);
  app.use('/api/v1', campaignRouter);
  app.use('/api/v1', matchRouter);
  app.use('/api/v1', applicationRouter);
  app.use('/api/v1', collaborationRouter);

  // Global error handler
  app.use(errorHandler);

  return app;
}
