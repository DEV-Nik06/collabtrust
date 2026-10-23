import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiErrorEnvelope } from '@collabtrust/shared';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: { field?: string; issue: string }[];

  constructor(statusCode: number, code: string, message: string, details?: { field?: string; issue: string }[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}`;
  res.setHeader('X-Request-Id', requestId);

  if (err instanceof AppError) {
    const envelope: ApiErrorEnvelope = {
      code: err.code,
      message: err.message,
      requestId,
      details: err.details,
    };
    res.status(err.statusCode).json(envelope);
    return;
  }

  if (err instanceof ZodError) {
    const envelope: ApiErrorEnvelope = {
      code: 'BAD_REQUEST',
      message: 'Validation failed on input payload',
      requestId,
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        issue: e.message,
      })),
    };
    res.status(400).json(envelope);
    return;
  }

  // Generic 500 fallback - suppress raw stack traces in production (NFR-017)
  const isDev = process.env.NODE_ENV === 'development';
  const envelope: ApiErrorEnvelope = {
    code: 'INTERNAL_SERVER_ERROR',
    message: isDev ? err.message : 'An unexpected error occurred. Please contact support.',
    requestId,
  };

  res.status(500).json(envelope);
}
