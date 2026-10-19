# CollabTrust — REST API Design

> **Status:** Draft (Proposed)  
> **Phase:** Phase C — Architecture  
> **Depends on:** [`system-architecture.md`](./system-architecture.md), [`database-design.md`](./database-design.md), [`functional-requirements.md`](../02-requirements/functional-requirements.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview & Protocol Standards

The CollabTrust backend exposes an HTTP REST API under base path `/api/v1`. All request payloads and response bodies use `application/json` with standard UTF-8 encoding.

### Core Design Rules
* **Authentication:** Authenticated endpoints require a valid Bearer token in the `Authorization: Bearer <token>` header or an authenticated secure session cookie (see ADR-003).
* **Role-Based Access Control:** Routes enforce role permissions (`brand`, `creator`, or authenticated user).
* **AI Invocation Endpoints:** AI actions are executed via synchronous or polled POST endpoints, returning structured JSON adhering to strict Zod/TypeScript schemas.
* **Idempotency & Status Codes:** Standard HTTP status codes are strictly respected (200, 201, 400, 401, 403, 404, 409, 500).

---

## 2. Standard Error Response Schema

All error responses return a uniform JSON format:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Human-readable description of error condition",
    "details": [
      {
        "field": "budgetRange",
        "issue": "Budget range must be specified"
      }
    ]
  }
}
```

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
  ```json
  {
    "user": {
      "id": "uuid-v4",
      "email": "priya@example.com",
      "role": "brand",
      "createdAt": "2026-10-12T10:00:00Z"
    },
    "token": "jwt.signed.token"
  }
  ```

#### `POST /api/v1/auth/login`
* **Access:** Public
* **Purpose:** Authenticate and obtain session token.
* **Request:**
  ```json
  {
    "email": "priya@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "user": {
      "id": "uuid-v4",
      "email": "priya@example.com",
      "role": "brand"
    },
    "token": "jwt.signed.token"
  }
  ```

#### `POST /api/v1/auth/logout`
* **Access:** Authenticated
* **Purpose:** Invalidate session token.
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
* **Purpose:** Query active campaigns (Creators) or user's campaigns (Brands). Supports query params `?category=&budget=&page=&limit=`.

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

#### `GET /api/v1/creators/:id/trust-signals`
* **Access:** Authenticated (Brand role)
* **Purpose:** Retrieve Trust Analysis Agent evaluation report.
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
        "signalValue": "Consistent ratio of comments to likes over recent posts",
        "severity": "info"
      },
      {
        "signalType": "growth_pattern",
        "signalValue": "Steady linear follower progression without suspicious spikes",
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
* **Purpose:** Transition collaboration lifecycle (`in_progress`, `completed`).

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
