/**
 * Core product constants, status enums, and safety guardrail definitions.
 * Source of truth: docs/04-ai/safety-guardrails.md, docs/03-architecture/database-design.md
 */

export const USER_ROLES = ['brand', 'creator'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const CAMPAIGN_STATUSES = ['draft', 'active', 'closed', 'completed'] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const APPLICATION_STATUSES = ['pending', 'accepted', 'declined'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const COLLABORATION_STATUSES = ['invited', 'accepted', 'in_progress', 'completed'] as const;
export type CollaborationStatus = (typeof COLLABORATION_STATUSES)[number];

export const TRUST_SIGNAL_SEVERITIES = ['info', 'note', 'anomaly'] as const;
export type TrustSignalSeverity = (typeof TRUST_SIGNAL_SEVERITIES)[number];

/**
 * Mandatory copy disclaimer for all trust analysis cards and API responses.
 * Verbatim text defined canonically in docs/04-ai/safety-guardrails.md §2.
 */
export const MANDATORY_TRUST_DISCLAIMER =
  'Informational observations only. CollabTrust surfaces signals and evidence, not fraud guarantees or definitive authenticity verdicts.';

/**
 * Prohibited terminology list defined in docs/04-ai/safety-guardrails.md §2.
 * AI agents and backend services are forbidden from outputting these phrases.
 */
export const PROHIBITED_TERMINOLOGY = [
  'fake account',
  'fake followers',
  'guaranteed fraud',
  'proven fraud',
  'fraud detected',
  'verified non-fraudulent',
  'guaranteed authentic',
  'certified authentic',
  'authentic certified',
  '100% authentic',
  'certified genuine',
] as const;
