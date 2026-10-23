import { z } from 'zod';
import {
  RegisterSchema,
  LoginSchema,
  BrandProfileSchema,
  CreatorProfileSchema,
  StructuredBriefSchema,
  CreateCampaignSchema,
  ApplyCampaignSchema,
  TrustSignalSchema,
  MatchResultItemSchema,
} from './schemas.js';
import { UserRole, CampaignStatus, ApplicationStatus, CollaborationStatus, TrustSignalSeverity } from './constants.js';

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type BrandProfileInput = z.infer<typeof BrandProfileSchema>;
export type CreatorProfileInput = z.infer<typeof CreatorProfileSchema>;
export type StructuredBrief = z.infer<typeof StructuredBriefSchema>;
export type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>;
export type ApplyCampaignInput = z.infer<typeof ApplyCampaignSchema>;
export type TrustSignal = z.infer<typeof TrustSignalSchema>;
export type MatchResultItem = z.infer<typeof MatchResultItemSchema>;

export interface JwtTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export interface ApiErrorDetail {
  field?: string;
  issue: string;
}

export interface ApiErrorEnvelope {
  code: string;
  message: string;
  requestId: string;
  details?: ApiErrorDetail[];
}

export interface UserSummary {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  user: UserSummary;
  token: string;
}
