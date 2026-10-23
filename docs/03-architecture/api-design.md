# CollabTrust — REST API Design

> **Status:** Draft (Proposed)  
> **Phase:** Phase 4 — Architecture  
> **Depends on:** [`system-architecture.md`](./system-architecture.md), [`database-design.md`](./database-design.md), [`functional-requirements.md`](../02-requirements/functional-requirements.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview & Protocol Standards

The CollabTrust backend exposes an HTTP REST API under base path `/api/v1`. All request payloads and response bodies use `application/json` with standard UTF-8 encoding.

### Core Design Rules
* **Authentication:** Authenticated endpoints require a valid short-lived Bearer token in the `Authorization: Bearer <token>` header (15-minute TTL per `NFR-010`, `ADR-003`). User sessions are maintained via a long-lived 7-day refresh token transmitted as an `httpOnly`, `Secure` (in production), `SameSite=Lax` cookie (`collabtrust_refresh_token`) scoped strictly to `/api/v1/auth`.
* **Safe Local Development:** When running locally (`NODE_ENV=development`) over plain HTTP (`http://localhost`), the `Secure` flag on authentication cookies is disabled (`secure: false`) to avoid browser cookie rejection during local development and testing, while retaining `httpOnly` and `SameSite=Lax` protections. In production, `secure: true` is strictly enforced.
* **CSRF Protection:** State-changing requests (`POST`, `PUT`, `DELETE`) rely on strict JSON content-type enforcement (`Content-Type: application/json`), CORS origin locking (`CORS_ORIGIN`), and `SameSite=Lax` cookie boundaries.
* **Role-Based Access Control:** Routes enforce role permissions (`brand`, `creator`, or authenticated user).
* **AI Invocation Endpoints:** AI actions are executed via synchronous or polled POST endpoints, returning structured JSON adhering to strict Zod/TypeScript schemas.
* **Idempotency & Status Codes:** Standard HTTP status codes are strictly respected (200, 201, 400, 401, 403, 404, 409, 500).

---

## 2. Standard Error Response Schema

All error responses return a uniform JSON format (canonical envelope, per NFR-017):

```json
{
  "code": "BAD_REQUEST",
  "message": "Human-readable description of error condition",
  "requestId": "req_01HZX3...",
  "details": [
    {
      "field": "budgetRange",
      "issue": "Budget range must be specified"
    }
  ]
}
```

* `code`: stable machine-readable error code (SCREAMING_SNAKE_CASE).
* `message`: human-readable description; safe to show to end users.
* `requestId`: correlation ID, also returned in the `X-Request-Id` response header; required on every error response (NFR-017).
* `details` *(optional)*: field-level validation information, present for 400-class validation errors.

---

## 3. API Endpoint Catalog

### 3.1 Authentication & User Management

#### `POST /api/v1/auth/register`
* **Access:** Public
* **Purpose:** Create a new user account.
* **Request:**
  ```json
  {
    "email": "priya@example.com",
    "password": "SecurePassword123!",
    "role": "brand" // "brand" | "creator"
  }
  ```
* **Response (201 Created):**
  Sets `collabtrust_refresh_token` in an `httpOnly`, `Secure` (in production), `SameSite=Lax` cookie (`Path=/api/v1/auth; Max-Age=604800` [7 days]).
  ```json
  {
    "user": {
      "id": "uuid-v4",
      "email": "priya@example.com",
      "role": "brand",
      "createdAt": "2026-10-12T10:00:00Z"
    },
    "token": "jwt.access.token"
  }
  ```

#### `POST /api/v1/auth/login`
* **Access:** Public
* **Purpose:** Authenticate and obtain session tokens.
* **Request:**
  ```json
  {
    "email": "priya@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response (200 OK):**
  Sets `collabtrust_refresh_token` in an `httpOnly`, `Secure` (in production), `SameSite=Lax` cookie (`Path=/api/v1/auth; Max-Age=604800` [7 days]).
  ```json
  {
    "user": {
      "id": "uuid-v4",
      "email": "priya@example.com",
      "role": "brand"
    },
    "token": "jwt.access.token"
  }
  ```

#### `POST /api/v1/auth/refresh`
* **Access:** Public (requires valid refresh cookie or optional `Authorization: Bearer <refreshToken>` header for automated integration tests)
* **Purpose:** Exchange a valid 7-day refresh token for a fresh 15-minute access token. Performs refresh token rotation (issues a new refresh token cookie) and checks user active status and `tokenVersion`.
* **Request:** In browsers, the refresh token is automatically sent via the `collabtrust_refresh_token` cookie. Empty JSON body `{}` or optional `{"refreshToken": "token_string"}` for headless testing.
* **Response (200 OK):**
  Rotates `collabtrust_refresh_token` cookie with fresh 7-day expiration.
  ```json
  {
    "token": "new.jwt.access.token"
  }
  ```
* **Errors:**
  * `401 Unauthorized`: Missing, expired, malformed, or revoked refresh token, or tokenVersion mismatch indicating credentials have changed.

#### `POST /api/v1/auth/logout`
* **Access:** Authenticated
* **Purpose:** Invalidate session tokens.
* **Action:** Increments `tokenVersion` on the User record in PostgreSQL (instantly invalidating outstanding access tokens on sensitive routes per ADR-003) and clears the `collabtrust_refresh_token` cookie (`Max-Age=0`).
* **Response (200 OK):** `{"message": "Logged out successfully"}`

#### `POST /api/v1/auth/forgot-password`
* **Access:** Public
* **Purpose:** Initiate password recovery token.
* **Request:** `{"email": "priya@example.com"}`
* **Response (200 OK):** `{"message": "If the account exists, a reset link was sent"}`

#### `POST /api/v1/auth/reset-password`
* **Access:** Public
* **Purpose:** Update password using token.
* **Request:** `{"token": "reset-token", "newPassword": "NewSecurePassword123!"}`
* **Response (200 OK):** `{"message": "Password updated successfully"}`

---

### 3.2 Profiles

#### `GET /api/v1/users/me/profile`
* **Access:** Authenticated
* **Purpose:** Retrieve the active user's role-specific profile (BrandProfile or CreatorProfile).
* **Response (200 OK):** Returns profile object.

#### `PUT /api/v1/users/me/profile`
* **Access:** Authenticated
* **Purpose:** Create or update current user's profile.
* **Request (Brand):**
  ```json
  {
    "companyName": "Glow Skincare Co",
    "category": "Beauty & Wellness",
    "description": "Clean organic skincare for sensitive skin",
    "budgetRange": "$500-$1500",
    "goals": "Build awareness with micro-creators"
  }
  ```
* **Request (Creator):**
  ```json
  {
    "displayName": "Maya Torres",
    "niche": "Sustainable Living",
    "platforms": [{"name": "Instagram", "handle": "@mayagreen", "followers": 8500}],
    "contentStyle": "Educational reels and aesthetic carousels",
    "collaborationPrefs": "Gifted collaborations and paid video posts",
    "bio": "Sharing eco-conscious living tips and daily habits"
  }
  ```
* **Response (200 OK):** Returns updated profile with `profileComplete` boolean.

#### `GET /api/v1/creators/:id`
* **Access:** Authenticated (Brand role)
* **Purpose:** View public creator profile details and self-reported metrics.

#### `GET /api/v1/brands/:id`
* **Access:** Authenticated (Creator role)
* **Purpose:** View public brand profile and trust indicators.

---

### 3.3 Campaigns & AI Brief Structuring

#### `POST /api/v1/campaigns/ai-draft`
* **Access:** Authenticated (Brand role)
* **Purpose:** Invoke Campaign Brief Agent to structure free-text campaign idea.
* **Request:**
  ```json
  {
    "rawInput": "Looking for 3-5 skincare creators to review our new organic green tea facial moisturizer. Needs 1 Instagram Reel and 2 stories showing honest unboxing and 7-day usage. Budget $500 total, launch next month."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "structuredBrief": {
      "title": "Green Tea Facial Moisturizer Product Review",
      "goals": "Drive awareness and trial through authentic 7-day review videos",
      "targetAudience": "Eco-conscious skincare enthusiasts aged 18-35",
      "deliverables": "1 Instagram Reel (30-60s) + 2 Instagram Stories with product link",
      "timeline": "30 days (delivery by next month)",
      "budget": "$500 total budget",
      "requirements": "Creator must have genuine engagement in clean beauty/skincare"
    }
  }
  ```
  The brief always contains all seven fields: `title`, `goals`, `targetAudience`, `deliverables`, `timeline`, `budget`, `requirements` (FR-021, AC-011.2).
* **Fallback (200 OK):** if the agent times out or returns unparseable output, respond `{"fallback": true, "structuredBrief": null}` so the client renders the manual form with an error notice (AC-011.3). The endpoint never returns 5xx for agent failures.

#### `POST /api/v1/campaigns`
* **Access:** Authenticated (Brand role)
* **Purpose:** Persist campaign draft.
* **Request:** Body containing structured brief attributes.
* **Response (201 Created):** Returns Campaign object with status `draft`.

#### `PUT /api/v1/campaigns/:id`
* **Access:** Authenticated (Brand owner)
* **Purpose:** Edit campaign brief fields.

#### `POST /api/v1/campaigns/:id/publish`
* **Access:** Authenticated (Brand owner)
* **Purpose:** Publish campaign (`draft` -> `active`), trigger matching engine.
* **Response (200 OK):** Returns Campaign object with status `active`.

#### `GET /api/v1/campaigns`
* **Access:** Authenticated (Creator / Brand)
* **Purpose:** Query active campaigns (Creators) or user's campaigns (Brands). Supports query params `?category=&budget=&page=&limit=`. `category` filters the denormalized `Campaign.category` column (copied from the brand profile at publish; see [`database-design.md` §3.4](./database-design.md)).

#### `POST /api/v1/campaigns/:id/close`
* **Access:** Authenticated (Brand owner)
* **Purpose:** Close an active campaign (`active` -> `closed`), disabling further creator applications (FR-030, AC-016.1).
* **Response (200 OK):** Returns Campaign object with status `closed`.
* **Errors:** 403 for non-owners; 409 if the campaign is not `active`.

#### `DELETE /api/v1/users/me`
* **Access:** Authenticated
* **Purpose:** Permanently delete the authenticated user's account and associated personal data (NFR-064). Profile, campaigns, applications, collaborations, and messages are removed or anonymized per the retention rules in [`security-design.md`](./security-design.md).
* **Response (200 OK):** `{"message": "Account deleted"}`; all of the user's tokens are revoked immediately.

#### `GET /api/v1/campaigns/:id`
* **Access:** Authenticated
* **Purpose:** Fetch detailed campaign brief.

---

### 3.4 Creator Matching & Trust Signals

#### `GET /api/v1/campaigns/:id/matches`
* **Access:** Authenticated (Brand owner)
* **Purpose:** Retrieve AI-matched creators for an active campaign.
* **Response (200 OK):**
  ```json
  {
    "campaignId": "uuid-v4",
    "matches": [
      {
        "creator": {
          "id": "creator-uuid",
          "displayName": "Maya Torres",
          "niche": "Sustainable Living",
          "audienceSize": 8500
        },
        "score": 0.88,
        "explanation": "High audience alignment in clean/organic lifestyle; strong engagement consistency in product review content format.",
        "factors": {
          "nicheOverlap": 0.9,
          "contentStyleFit": 0.85
        }
      }
    ]
  }
  ```

#### `POST /api/v1/matches/refresh`
* **Access:** Authenticated (Brand owner)
* **Purpose:** Explicitly re-run the Creator Matching Agent for a campaign, bypassing the match cache (FR-047). Invoked by the "Refresh Matches" action in the brand match console (see [`workflow-specifications.md` Workflow 2](../04-ai/workflow-specifications.md)).
* **Response (200 OK):** Returns the refreshed match set.

#### `GET /api/v1/creators/:id/trust-signals`
* **Access:** Authenticated (Brand role)
* **Purpose:** Retrieve Trust Analysis Agent evaluation report. All signals are derived solely from the creator's self-reported profile data — the MVP has no third-party platform integration — and each signal is labeled with its observational category per the `signalType` enum in [`database-design.md` §3.9](./database-design.md).
* **Response (200 OK):**
  ```json
  {
    "creatorId": "creator-uuid",
    "disclaimer": "Informational observations only. CollabTrust surfaces signals and evidence, not fraud guarantees or definitive authenticity verdicts.",
    "signals": [
      {
        "signalType": "profile_completeness",
        "signalValue": "Profile complete with verified social channels and bio",
        "severity": "info"
      },
      {
        "signalType": "engagement_consistency",
        "signalValue": "Self-reported engagement figures are internally consistent with the stated audience size",
        "severity": "info"
      },
      {
        "signalType": "growth_pattern",
        "signalValue": "Self-reported follower history shows steady progression; figures are creator-reported, not platform-verified",
        "severity": "info"
      }
    ],
    "generatedAt": "2026-10-12T10:30:00Z"
  }
  ```

#### `GET /api/v1/creators/:id/insights`
* **Access:** Authenticated (Brand role)
* **Purpose:** Retrieve Profile Insight Agent summary.

---

### 3.5 Applications & Collaboration Workflow

#### `POST /api/v1/campaigns/:id/apply`
* **Access:** Authenticated (Creator role)
* **Purpose:** Submit application to an active campaign.
* **Request:** `{"pitchNote": "I love green tea skincare! Would love to feature your moisturizer."}`
* **Response (201 Created):** Returns Application object with status `pending`.

#### `GET /api/v1/campaigns/:id/applications`
* **Access:** Authenticated (Brand owner)
* **Purpose:** List all creator applications for a campaign.

#### `POST /api/v1/applications/:id/decision`
* **Access:** Authenticated (Brand owner)
* **Purpose:** Accept or decline application.
* **Request:** `{"decision": "accepted"}` // "accepted" | "declined"
* **Response (200 OK):** Transitions application and returns created `Collaboration` record if accepted.

#### `GET /api/v1/collaborations/:id`
* **Access:** Authenticated (Participant brand or creator)
* **Purpose:** Fetch collaboration status, milestone dates, and details.

#### `PUT /api/v1/collaborations/:id/status`
* **Access:** Authenticated (Participant)
* **Purpose:** Drive the collaboration lifecycle. Allowed transitions and who may trigger them:
  * `invited` -> `accepted`: **creator only** — the creator's explicit acknowledgement of the brand's invitation (FR-064, AC-041.4).
  * `accepted` -> `in_progress`: **either participant**, once collaboration work begins (FR-065).
  * `in_progress` -> `completed`: **either participant requests completion** via deliverable marking (FR-067); the transition is finalized on the counterpart's confirmation or brand finalization (FR-068, AC-044.1/AC-044.2). A completion request alone leaves status at `in_progress` and posts a confirmation notice to the thread.
  * All other transitions return 409 Conflict; wrong-role attempts return 403.

#### `GET /api/v1/collaborations/:id/messages`
* **Access:** Authenticated (Participant)
* **Purpose:** List chronological messages in collaboration thread.

#### `POST /api/v1/collaborations/:id/messages`
* **Access:** Authenticated (Participant)
* **Purpose:** Post message to collaboration thread.
* **Request:** `{"content": "Draft video uploaded to Google Drive for review."}`

---

## 4. Related Documents

| Document | Purpose |
|---|---|
| [`system-architecture.md`](./system-architecture.md) | Component architecture and data flow |
| [`database-design.md`](./database-design.md) | Database schema entities and constraints |
| [`security-design.md`](./security-design.md) | Authentication and authorization controls |
| [`docs/02-requirements/functional-requirements.md`](../02-requirements/functional-requirements.md) | Functional requirements matrix |
