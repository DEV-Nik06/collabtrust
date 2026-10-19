# CollabTrust — Acceptance Criteria Matrix

> **Status:** Draft  
> **Phase:** Phase B — Engineering Requirements  
> **Depends on:** [`feature-requirements.md`](../01-product/feature-requirements.md), [`functional-requirements.md`](./functional-requirements.md), [`user-stories.md`](./user-stories.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview & Methodology

This document consolidates the complete index of **80 canonical Acceptance Criteria** across all functional areas of the CollabTrust platform. Each criterion represents a testable, unambiguous condition of satisfaction mapped directly to its Feature ID (`FEAT-XXX`), Functional Requirement (`FR-XXX`), User Story (`US-XXX`), and verified test method.

### Test Method Categories
* **Unit:** Automated unit tests covering isolated functions, models, and utility handlers.
* **Integration:** Automated API endpoint tests using Supertest/HTTP clients with a test database.
* **E2E:** End-to-end browser workflows using Playwright.
* **AI Evaluation:** Deterministic schema and heuristic validation testing structured LLM outputs against test benchmarks.
* **Manual UX:** Human verification of accessibility, copy disclaimers, and UI responsive styling.

---

## 2. Acceptance Criteria by Feature Domain

### 2.1 Authentication & User Management (FEAT-001 – FEAT-005)

| AC ID | Specification ("Given / When / Then") | Traceability | Test Method | Environment Dependencies |
|---|---|---|:---:|---|
| **AC-001.1** | Given an unregistered valid email and strong password, when submitted with role `brand` or `creator`, then an account is created and 201 Created is returned. | FEAT-001<br>FR-001<br>US-001 | Integration | PostgreSQL test container |
| **AC-001.2** | Given registration data missing an explicit role, when submitted, then the request is rejected with 400 Bad Request and validation error. | FEAT-001<br>FR-001<br>US-001 | Unit / Integration | None |
| **AC-001.3** | Given an existing registered email, when registration is attempted, then the request fails with 409 Conflict. | FEAT-001<br>FR-001<br>US-001 | Integration | PostgreSQL test container |
| **AC-001.4** | Given a password shorter than 8 characters or lacking required complexity, when submitted, then registration fails with 400 Bad Request. | FEAT-001<br>FR-002<br>US-001 | Unit | None |
| **AC-002.1** | Given valid registered credentials, when login is requested, then an authenticated session token is issued and 200 OK returned. | FEAT-002<br>FR-003<br>US-039 | Integration | PostgreSQL test container |
| **AC-002.2** | Given incorrect password or non-existent email, when login is requested, then the system returns generic 401 Unauthorized without leaking email existence. | FEAT-002<br>FR-004<br>US-040 | Integration | None |
| **AC-002.3** | Given an active authenticated session, when page is reloaded, then the session remains valid until explicit logout or token expiration. | FEAT-002<br>FR-003<br>US-039 | E2E | Browser + API server |
| **AC-002.4** | Given an active session, when logout is requested, then the session token is invalidated and subsequent requests return 401. | FEAT-002<br>FR-005<br>US-041 | Integration / E2E | Browser + API server |
| **AC-002.5** | Given an unauthenticated request to protected endpoints, then 401 Unauthorized is returned. | FEAT-002<br>FR-006<br>US-043 | Integration | None |
| **AC-002.6** | Given an authenticated creator attempting to access brand-only management endpoints, then 403 Forbidden is returned. | FEAT-002<br>FR-006<br>US-043 | Integration | None |
| **AC-005.1** | Given a registered email address, when password reset is requested, then a reset token is generated and dispatched via email handler. | FEAT-005<br>FR-007<br>US-042 | Integration | Mock mailer stub |
| **AC-005.2** | Given an expired reset token (>60 min), when password update is submitted, then the request is rejected with 400 Bad Request. | FEAT-005<br>FR-008<br>US-042 | Unit / Integration | None |
| **AC-005.3** | Given a valid reset token, when new password is submitted, then the password hash is updated and the token is invalidated immediately. | FEAT-005<br>FR-008<br>US-042 | Integration | PostgreSQL test container |

---

### 2.2 Profile Management (FEAT-003, FEAT-004)

| AC ID | Specification ("Given / When / Then") | Traceability | Test Method | Environment Dependencies |
|---|---|---|:---:|---|
| **AC-003.1** | Given a new brand user, when profile form with company name, category, and budget is submitted, then a BrandProfile record is persisted. | FEAT-003<br>FR-010<br>US-002 | Integration | PostgreSQL test container |
| **AC-003.2** | Given an existing brand profile, when updated fields are submitted by the owner, then the record is updated and updatedAt timestamp refreshed. | FEAT-003<br>FR-011<br>US-003 | Integration | PostgreSQL test container |
| **AC-003.3** | Given an authenticated creator, when viewing a brand's public profile, then company details and completed collaboration counts are rendered. | FEAT-003<br>FR-012<br>US-029 | Integration / E2E | Browser + API server |
| **AC-004.1** | Given a new creator user, when submitting display name, niche, connected platforms, and estimated audience, then CreatorProfile is created. | FEAT-004<br>FR-013<br>US-022 | Integration | PostgreSQL test container |
| **AC-004.2** | Given an existing creator profile, when updated attributes are submitted by the owner, then the record is persisted. | FEAT-004<br>FR-014<br>US-023 | Integration | PostgreSQL test container |
| **AC-004.3** | Given an authenticated brand user, when viewing a creator profile, then niche, platforms, self-reported metrics, and bio are visible. | FEAT-004<br>FR-016<br>US-013 | Integration / E2E | Browser + API server |
| **AC-004.4** | Given a creator profile with missing optional fields, when viewed by the creator, then a completeness score and tip checklist are displayed. | FEAT-004<br>FR-015<br>US-024 | Unit / E2E | Browser |

---

### 2.3 Campaign Lifecycle & Structuring (FEAT-010 – FEAT-017)

| AC ID | Specification ("Given / When / Then") | Traceability | Test Method | Environment Dependencies |
|---|---|---|:---:|---|
| **AC-010.1** | Given an authenticated brand user, when free-text campaign idea is entered, then the input is accepted and a loading indicator displayed. | FEAT-010<br>FR-020<br>US-004 | E2E | Browser |
| **AC-010.2** | Given raw campaign text, when submitted to the Campaign Brief Agent, then structured JSON is returned containing title, goals, target audience, deliverables, and budget. | FEAT-011<br>FR-021<br>US-005 | AI Evaluation | Mock/Live LLM adapter |
| **AC-010.3** | Given LLM timeout or structured parse error, when brief agent fails, then the system falls back to a clean manual input form with error notice. | FEAT-011<br>FR-023<br>US-006 | Integration / E2E | Error injection fixture |
| **AC-011.1** | Given a generated campaign brief, when presented to the brand, then all fields are editable in the UI before saving or publishing. | FEAT-012<br>FR-024<br>US-007 | E2E | Browser |
| **AC-012.1** | Given an edited brief draft, when saved, then a Campaign record with status `draft` is persisted. | FEAT-012<br>FR-025<br>US-007 | Integration | PostgreSQL test container |
| **AC-013.1** | Given a draft campaign, when the brand clicks Publish, then the status transitions to `active` and Creator Matching Agent is triggered. | FEAT-013<br>FR-026<br>US-008 | Integration / E2E | PostgreSQL test container |
| **AC-013.2** | Given a campaign publication request, when user is not the owning brand, then 403 Forbidden is returned. | FEAT-013<br>FR-026<br>US-008 | Integration | None |
| **AC-014.1** | Given published active campaigns, when a creator browses the marketplace feed, then all active campaigns are displayed with title, brand, category, and budget. | FEAT-014<br>FR-028<br>US-025 | Integration / E2E | Seed DB fixtures |
| **AC-015.1** | Given an active campaign, when a creator selects it, then the full brief detail page is rendered including requirements and deliverables. | FEAT-015<br>FR-029<br>US-027 | Integration / E2E | Browser |
| **AC-016.1** | Given an active campaign, when the owning brand marks it closed, then status changes to `closed` and creator applications are disabled. | FEAT-016<br>FR-030<br>US-020 | Integration | PostgreSQL test container |
| **AC-017.1** | Given multiple active campaigns, when a creator filters by category or budget range, then only matching campaigns are rendered in the feed. | FEAT-017<br>FR-032<br>US-026 | Unit / E2E | Browser |

---

### 2.4 Creator Discovery & Matching (FEAT-020 – FEAT-023)

| AC ID | Specification ("Given / When / Then") | Traceability | Test Method | Environment Dependencies |
|---|---|---|:---:|---|
| **AC-020.1** | Given an active campaign, when matching agent runs, then candidates are returned with relevance score and persistent Match records created. | FEAT-020<br>FR-040<br>US-009 | AI Evaluation / Int | Mock LLM adapter + DB |
| **AC-020.2** | Given a match record, when rendered in the brand console, then an explicit human-readable explanation string detailing fit factors is visible. | FEAT-021<br>FR-041<br>US-010 | Unit / E2E | Browser |
| **AC-020.3** | Given a campaign with zero matching creator profiles, when matching completes, then a clean "No matching creators found" message is displayed without errors. | FEAT-020<br>FR-043<br>US-011 | Integration / E2E | Empty DB test |
| **AC-020.4** | Given match completion, when inspected, then zero automated emails or invitations were dispatched to matched creators. | FEAT-020<br>FR-048<br>US-047 | Integration | Mailer spy fixture |
| **AC-021.1** | Given a creator viewing a campaign, when a pre-computed match exists for that creator, then a personalized fit indicator is displayed. | FEAT-021<br>FR-044<br>US-028 | Integration / E2E | Browser |
| **AC-022.1** | Given an authenticated brand, when searching creators manually, then profiles filtered by niche and platform are returned. | FEAT-022<br>FR-045<br>US-015 | Integration | Seed DB fixtures |
| **AC-023.1** | Given a creator profile, when Profile Insight Agent is invoked, then a concise audience and content alignment summary is rendered. | FEAT-023<br>FR-046<br>US-012 | AI Evaluation / Int | Mock LLM adapter |

---

### 2.5 Trust Analysis & Signal Governance (FEAT-030 – FEAT-032)

| AC ID | Specification ("Given / When / Then") | Traceability | Test Method | Environment Dependencies |
|---|---|---|:---:|---|
| **AC-030.1** | Given a creator profile, when Trust Analysis Agent runs, then observational signals for completeness, metric consistency, and anomaly notes are returned. | FEAT-030<br>FR-050<br>US-013 | AI Evaluation / Int | Mock LLM adapter |
| **AC-030.2** | Given generated trust output, when evaluated, then zero instances of words claiming definitive fraud detection ("fake", "guaranteed fraud", "authentic certified") are present. | FEAT-030<br>FR-051<br>US-013 | AI Evaluation / Unit | Rule-based linter |
| **AC-030.3** | Given any screen displaying trust signals, when rendered, then a persistent disclaimer stating signals are informational and do not guarantee authenticity is visible. | FEAT-032<br>FR-052<br>US-014 | E2E / Manual UX | Browser |
| **AC-031.1** | Given a brand profile, when viewed by a creator, then objective brand trust indicators (account age, profile completeness, completed collaborations) are rendered. | FEAT-031<br>FR-054<br>US-030 | Integration / E2E | Browser |
| **AC-032.1** | Given an unauthenticated or non-owning user, when attempting to fetch detailed creator trust analysis reports directly via API, then access is denied. | FEAT-030<br>FR-056<br>US-043 | Integration | API server |

---

### 2.6 Collaboration Workflow & Delivery (FEAT-040 – FEAT-044)

| AC ID | Specification ("Given / When / Then") | Traceability | Test Method | Environment Dependencies |
|---|---|---|:---:|---|
| **AC-040.1** | Given an active campaign, when an authenticated creator submits an application with pitch note, then an Application record with status `pending` is created. | FEAT-040<br>FR-060<br>US-031 | Integration | PostgreSQL test container |
| **AC-040.2** | Given an existing pending application, when the same creator attempts to re-apply to the same campaign, then 409 Conflict is returned. | FEAT-040<br>FR-061<br>US-032 | Integration | PostgreSQL test container |
| **AC-041.1** | Given submitted applications, when the brand opens campaign management, then all applications are listed with creator profiles and match explanations. | FEAT-041<br>FR-062<br>US-016 | Integration / E2E | Seed DB fixtures |
| **AC-041.2** | Given an application, when the brand clicks Accept, then application status becomes `accepted` and a Collaboration record is initialized. | FEAT-041<br>FR-063<br>US-017 | Integration | PostgreSQL test container |
| **AC-041.3** | Given an application, when the brand clicks Decline, then application status becomes `declined` and no collaboration record is created. | FEAT-041<br>FR-063<br>US-017 | Integration | PostgreSQL test container |
| **AC-042.1** | Given an active collaboration, when participants view the collaboration page, then the current lifecycle state (`invited`, `accepted`, `in_progress`, `completed`) is visible. | FEAT-042<br>FR-065<br>US-018 | Integration / E2E | Browser |
| **AC-043.1** | Given an active collaboration, when a participant submits a message, then the Message record is stored and rendered chronologically in the thread. | FEAT-043<br>FR-066<br>US-019 | Integration / E2E | PostgreSQL test container |
| **AC-044.1** | Given completed deliverables, when submitted and confirmed by the brand, then collaboration status transitions to `completed` and is archived. | FEAT-044<br>FR-068<br>US-020 | Integration / E2E | PostgreSQL test container |

---

### 2.7 Dashboards & Navigation (FEAT-050 – FEAT-052)

| AC ID | Specification ("Given / When / Then") | Traceability | Test Method | Environment Dependencies |
|---|---|---|:---:|---|
| **AC-050.1** | Given an authenticated brand, when navigating to `/dashboard`, then active campaigns, pending applications, and active collaborations are rendered. | FEAT-050<br>FR-070<br>US-044 | Integration / E2E | Browser |
| **AC-051.1** | Given an authenticated creator, when navigating to `/dashboard`, then matched opportunities, submitted application statuses, and active collaborations are rendered. | FEAT-051<br>FR-071<br>US-045 | Integration / E2E | Browser |
| **AC-052.1** | Given an authenticated user, when viewing the top navigation, then menu links strictly reflect their account role (`brand` vs `creator`). | FEAT-052<br>FR-072<br>US-046 | Unit / E2E | Browser |
| **AC-052.2** | Given a new user with zero records, when loading dashboard, then empty states with actionable onboarding guidance are rendered. | FEAT-050<br>FR-076<br>US-050 | E2E | Browser |

---

## 3. Related Documents

| Document | Purpose |
|---|---|
| [`functional-requirements.md`](./functional-requirements.md) | Granular functional specifications (`FR-001`–`FR-076`) |
| [`non-functional-requirements.md`](./non-functional-requirements.md) | Performance, security, and AI guardrail constraints (`NFR-001`–`NFR-077`) |
| [`user-stories.md`](./user-stories.md) | Narrative user stories (`US-001`–`US-050`) |
| [`docs/06-testing/test-plan.md`](../06-testing/test-plan.md) | Test plan mapping ACs to execution suites |
