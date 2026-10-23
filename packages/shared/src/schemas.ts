import { z } from 'zod';
import {
  USER_ROLES,
  CAMPAIGN_STATUSES,
  APPLICATION_STATUSES,
  COLLABORATION_STATUSES,
  TRUST_SIGNAL_SEVERITIES,
} from './constants.js';

// --- Authentication Schemas ---

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol'),
  role: z.enum(USER_ROLES, {
    errorMap: () => ({ message: "Role must be either 'brand' or 'creator'" }),
  }),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol'),
});

// --- Profile Schemas ---

export const BrandProfileSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  budgetRange: z.string().optional(),
  goals: z.string().optional(),
});

export const PlatformHandleSchema = z.object({
  name: z.string().min(1, 'Platform name is required'),
  handle: z.string().min(1, 'Platform handle is required'),
  followers: z.number().int().nonnegative().optional(),
});

export const CreatorProfileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  niche: z.string().min(1, 'Niche is required'),
  platforms: z.array(PlatformHandleSchema).min(1, 'At least one platform is required'),
  audienceSize: z.number().int().nonnegative().optional(),
  contentStyle: z.string().optional(),
  collaborationPrefs: z.string().optional(),
  bio: z.string().optional(),
});

// --- Campaign Schemas ---

export const AiDraftBriefInputSchema = z.object({
  rawInput: z.string().min(10, 'Campaign idea description must be at least 10 characters'),
});

export const StructuredBriefSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  goals: z.string().min(1, 'Goals are required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  deliverables: z.string().min(1, 'Deliverables are required'),
  timeline: z.string().min(1, 'Timeline is required'),
  budget: z.string().min(1, 'Budget is required'),
  requirements: z.string().min(1, 'Requirements are required'),
});

export const CreateCampaignSchema = z.object({
  title: z.string().min(1, 'Campaign title is required'),
  category: z.string().min(1, 'Category is required'),
  rawInput: z.string().optional(),
  goals: z.string().min(1, 'Goals are required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  deliverables: z.string().min(1, 'Deliverables are required'),
  timeline: z.string().min(1, 'Timeline is required'),
  budget: z.string().min(1, 'Budget is required'),
  requirements: z.string().min(1, 'Requirements are required'),
  aiStructured: z.boolean().default(false),
});

export const UpdateCampaignSchema = CreateCampaignSchema.partial();

// --- Application & Collaboration Schemas ---

export const ApplyCampaignSchema = z.object({
  pitchNote: z.string().max(1000, 'Pitch note must not exceed 1000 characters').optional(),
});

export const ApplicationDecisionSchema = z.object({
  decision: z.enum(['accepted', 'declined']),
});

export const UpdateCollaborationStatusSchema = z.object({
  status: z.enum(COLLABORATION_STATUSES),
});

export const CreateMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty'),
});

// --- Trust Signal & AI Output Schemas ---

export const TrustSignalSchema = z.object({
  signalType: z.string(),
  signalValue: z.string(),
  severity: z.enum(TRUST_SIGNAL_SEVERITIES),
  metadata: z.record(z.any()).optional(),
});

export const MatchFactorSchema = z.object({
  nicheOverlap: z.number().min(0).max(1),
  contentStyleFit: z.number().min(0).max(1).optional(),
  audienceAlignment: z.number().min(0).max(1).optional(),
});

export const MatchResultItemSchema = z.object({
  creatorProfileId: z.string().uuid(),
  score: z.number().min(0).max(1),
  explanation: z.string().min(1),
  factors: MatchFactorSchema.optional(),
});
