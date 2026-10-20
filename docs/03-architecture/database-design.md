# CollabTrust — Database Design

> **Status:** Draft (Proposed)
> **Phase:** Phase 4 — Architecture
> **Depends on:** [`system-architecture.md`](./system-architecture.md), [`feature-requirements.md`](../01-product/feature-requirements.md)
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)

> [!WARNING]
> This schema is a **design proposal**. It will be implemented via Prisma migrations when development begins. Field types, constraints, and relationships may change during implementation.

---

## 1. Overview

CollabTrust uses a single **PostgreSQL** database accessed via **Prisma ORM**. The schema supports the core marketplace loop: user accounts, brand/creator profiles, campaigns, matches, applications, collaborations, and messages.

---

## 2. Entity Relationship Summary

```
User (1) ──── (0..1) BrandProfile
User (1) ──── (0..1) CreatorProfile
User (1) ──── (0..*) Campaign          [brand creates campaigns]
Campaign (1) ──── (0..*) Match          [AI-generated matches]
Campaign (1) ──── (0..*) Application    [creator applies]
Match (1) ──── (1) CreatorProfile       [matched creator]
Application (1) ──── (1) CreatorProfile [applicant]
Application (1) ──── (0..1) Collaboration [if accepted]
Collaboration (1) ──── (0..*) Message   [communication thread]
CreatorProfile (1) ──── (0..*) TrustSignal [AI-generated trust data]
User (1) ──── (0..*) PasswordResetToken [password recovery]
```

---

## 3. Entity Definitions

### 3.1 User

The base account entity. Supports both brand and creator roles.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK, auto-generated | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login credential |
| passwordHash | VARCHAR(255) | NOT NULL | bcrypt hash |
| role | ENUM('brand', 'creator') | NOT NULL | Determines profile type and UI |
| tokenVersion | INTEGER | NOT NULL, DEFAULT 0 | Incremented on logout/password change to revoke outstanding access tokens (ADR-003 amendment) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT now() | |
| updatedAt | TIMESTAMP | NOT NULL, auto-updated | |

**Indexes:** email (unique).

**Feature trace:** FEAT-001, FEAT-002.

### 3.2 BrandProfile

Extended profile for brand users.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK, auto-generated | |
| userId | UUID | FK → User.id, UNIQUE | One profile per user |
| companyName | VARCHAR(255) | NOT NULL | |
| category | VARCHAR(100) | NOT NULL | Industry/product category |
| description | TEXT | | Company description |
| website | VARCHAR(500) | | |
| budgetRange | VARCHAR(100) | | e.g., "$500-$2000" |
| goals | TEXT | | Collaboration goals |
| profileComplete | BOOLEAN | DEFAULT false | Computed or tracked |
| createdAt | TIMESTAMP | NOT NULL | |
| updatedAt | TIMESTAMP | NOT NULL | |

**Feature trace:** FEAT-003, FEAT-031.

### 3.3 CreatorProfile

Extended profile for creator users.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK, auto-generated | |
| userId | UUID | FK → User.id, UNIQUE | One profile per user |
| displayName | VARCHAR(255) | NOT NULL | |
| niche | VARCHAR(100) | NOT NULL | Content category |
| platforms | JSON | NOT NULL | Array of platforms + handles |
| audienceSize | INTEGER | | Self-reported |
| contentStyle | TEXT | | Description of content style |
| collaborationPrefs | TEXT | | What they're looking for |
| bio | TEXT | | |
| profileComplete | BOOLEAN | DEFAULT false | |
| createdAt | TIMESTAMP | NOT NULL | |
| updatedAt | TIMESTAMP | NOT NULL | |

**Feature trace:** FEAT-004.

### 3.4 Campaign

A brand's campaign brief (AI-structured or manually created).

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| brandId | UUID | FK → User.id, NOT NULL | The brand that created this campaign |
| title | VARCHAR(255) | NOT NULL | |
| category | VARCHAR(100) | NOT NULL | Industry/product category, copied from the brand's profile at publish time; powers feed filters (FR-032, AC-017.1) |
| rawInput | TEXT | | Original free-text input |
| goals | TEXT | | Structured by Campaign Brief Agent |
| targetAudience | TEXT | | |
| deliverables | TEXT | | |
| timeline | VARCHAR(255) | | |
| budget | VARCHAR(100) | | |
| requirements | TEXT | | |
| status | ENUM('draft','active','closed','completed') | NOT NULL, DEFAULT 'draft' | |
| aiStructured | BOOLEAN | DEFAULT false | Whether Brief Agent was used |
| createdAt | TIMESTAMP | NOT NULL | |
| updatedAt | TIMESTAMP | NOT NULL | |

**Feature trace:** FEAT-010 through FEAT-016.

### 3.5 Match

AI-generated creator-campaign match with explanation.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| campaignId | UUID | FK → Campaign.id, NOT NULL | |
| creatorProfileId | UUID | FK → CreatorProfile.id, NOT NULL | |
| score | FLOAT | | Match relevance score (0-1) |
| explanation | TEXT | NOT NULL | Human-readable match explanation |
| factors | JSON | | Structured match factors |
| criteriaHash | VARCHAR(64) | NOT NULL | Hash of the campaign criteria used to generate this match; enables the FR-047 / AC-020.5 cache (reuse cached match while hash matches current criteria) |
| createdAt | TIMESTAMP | NOT NULL | |

**Unique constraint:** (campaignId, creatorProfileId) — one match per creator per campaign.

**Cache semantics (FR-047):** before invoking the Creator Matching Agent for a campaign, the service compares the current campaign criteria hash against stored `criteriaHash` values. If a complete cached match set exists with matching hashes, it is returned without an LLM call. Changing any brief field changes the hash and invalidates the cache.

**Feature trace:** FEAT-020, FEAT-021.

### 3.6 Application

A creator's application to a campaign.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| campaignId | UUID | FK → Campaign.id, NOT NULL | |
| creatorProfileId | UUID | FK → CreatorProfile.id, NOT NULL | |
| message | TEXT | | Optional application message |
| status | ENUM('pending','accepted','declined') | NOT NULL, DEFAULT 'pending' | |
| createdAt | TIMESTAMP | NOT NULL | |
| updatedAt | TIMESTAMP | NOT NULL | |

**Unique constraint:** (campaignId, creatorProfileId).

**Feature trace:** FEAT-040, FEAT-041.

### 3.7 Collaboration

An active collaboration between a brand and creator for a specific campaign.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| campaignId | UUID | FK → Campaign.id, NOT NULL | |
| brandId | UUID | FK → User.id, NOT NULL | |
| creatorProfileId | UUID | FK → CreatorProfile.id, NOT NULL | |
| applicationId | UUID | FK → Application.id | Link to originating application |
| status | ENUM('invited','accepted','in_progress','completed') | NOT NULL, DEFAULT 'invited' | |
| createdAt | TIMESTAMP | NOT NULL | |
| updatedAt | TIMESTAMP | NOT NULL | |

**Feature trace:** FEAT-042, FEAT-044.

### 3.8 Message

Messages within a collaboration thread.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| collaborationId | UUID | FK → Collaboration.id, NOT NULL | |
| senderId | UUID | FK → User.id, NOT NULL | |
| content | TEXT | NOT NULL | |
| createdAt | TIMESTAMP | NOT NULL | |

**Feature trace:** FEAT-043.

### 3.9 TrustSignal

AI-generated trust analysis data for a creator profile.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| creatorProfileId | UUID | FK → CreatorProfile.id, NOT NULL | |
| signalType | VARCHAR(100) | NOT NULL | e.g., 'engagement_quality', 'growth_pattern', 'profile_completeness' |
| signalValue | TEXT | NOT NULL | Observation text |
| severity | ENUM('info','note','anomaly') | NOT NULL, DEFAULT 'info' | |
| metadata | JSON | | Additional structured data |
| generatedAt | TIMESTAMP | NOT NULL | |

> [!IMPORTANT]
> Trust signals are **observations, not verdicts**. The `severity` field indicates informational signals vs. potential anomalies — it does NOT indicate fraud or deception. See [product-vision.md §6, Principle 3](../01-product/product-vision.md#6-core-product-principles).

**Feature trace:** FEAT-030.

### 3.10 PasswordResetToken

Single-use tokens for the self-service password reset flow (FEAT-005, FR-007 / FR-008).

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| userId | UUID | FK → User.id, NOT NULL | Account requesting the reset |
| tokenHash | VARCHAR(255) | UNIQUE, NOT NULL | Hash of the emailed token; raw token never stored |
| expiresAt | TIMESTAMP | NOT NULL | Issued time + 60 minutes (FR-008) |
| usedAt | TIMESTAMP | | Set on successful password update; a used token can never be replayed |
| createdAt | TIMESTAMP | NOT NULL | |

**Lifecycle:** issuing a new reset token invalidates any outstanding token for the same user. Successful password update sets `usedAt` and immediately revokes the user's existing sessions/tokens per ADR-003 (revocation on credential change).

**Feature trace:** FEAT-005.

---

## 4. Relationships Summary

| Relationship | Type | Constraint |
|---|---|---|
| User → BrandProfile | One-to-one (optional) | Only if role = 'brand' |
| User → CreatorProfile | One-to-one (optional) | Only if role = 'creator' |
| User (brand) → Campaign | One-to-many | Brand creates campaigns |
| Campaign → Match | One-to-many | AI generates matches |
| Campaign → Application | One-to-many | Creators apply |
| Application → Collaboration | One-to-one (optional) | If accepted |
| Collaboration → Message | One-to-many | Communication thread |
| CreatorProfile → TrustSignal | One-to-many | AI generates signals |

---

## 5. Indexing Strategy (Proposed)

| Table | Index | Reason |
|---|---|---|
| User | email (unique) | Login lookups |
| User | role | Role-based access queries |
| Campaign | brandId | List brand's campaigns |
| Campaign | status | Filter active campaigns |
| Campaign | category | Feed filtering by category (FR-032, AC-017.1) |
| CreatorProfile | niche | Creator search/filtering by niche (FR-045, NFR-042) |
| Match | campaignId | List matches for a campaign |
| Application | campaignId | List applications for a campaign |
| Application | creatorProfileId | List creator's applications |
| Collaboration | campaignId | Campaign's collaborations |
| Collaboration | creatorProfileId | Creator's collaborations |
| TrustSignal | creatorProfileId | Trust signals for a creator |

---

## 6. Seed Data Considerations

For MVP testing and hackathon demo, seed data may include:
- Sample brand accounts and profiles.
- Sample creator accounts and profiles (across multiple niches).
- Sample campaigns in various statuses.
- Pre-computed match results with explanations.

Seed data strategy should be defined during implementation. No seed data exists yet.

---

## 7. Open Questions

| # | Question | Impact |
|---|---|---|
| 1 | Should `platforms` on CreatorProfile be a JSON array or a separate table? | Schema normalization |
| 2 | Should match explanations be stored as text or structured JSON? | Display flexibility |
| 3 | How should trust signals be refreshed — on demand or periodically? | Performance and cost |
| 4 | Is a separate `ProfileInsight` table needed, or are insights generated on-the-fly? | Storage vs. compute |
| 5 | Should campaign fields (goals, deliverables, etc.) be individual columns or a JSON blob? | Query flexibility |

---

## 8. Related Documents

| Document | Purpose |
|---|---|
| [`system-architecture.md`](./system-architecture.md) | Overall system architecture |
| [`api-design.md`](./api-design.md) | API endpoints that read/write this data |
| [`security-design.md`](./security-design.md) | Data protection and access controls |
| [`docs/01-product/feature-requirements.md`](../01-product/feature-requirements.md) | Features these entities support |
| [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) | Master handoff document |
