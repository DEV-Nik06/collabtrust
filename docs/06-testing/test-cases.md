# CollabTrust — Test Cases Catalog

> **Status:** Draft  
> **Phase:** Phase 7 — Testing & Deployment  
> **Depends on:** [`acceptance-criteria.md`](../02-requirements/acceptance-criteria.md), [`test-plan.md`](./test-plan.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

> **Note:** No test infrastructure exists yet; all cases are design-stage specifications.

---

## 1. Overview

This catalog defines concrete, itemized test cases mapping directly to acceptance criteria (`AC-XXX`) and functional requirements (`FR-XXX`).

---

## 2. Authentication & Profile Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-AUTH-01** | Successful User Registration (Brand) | DB clean | POST `/api/v1/auth/register` with valid email, password, role `brand` | 201 Created returned; user persisted with hashed password | AC-001.1<br>FR-001 |
| **TC-AUTH-02** | Duplicate Email Rejection | User exists | POST `/api/v1/auth/register` with existing email | 409 Conflict; no duplicate created | AC-001.3<br>FR-001 |
| **TC-AUTH-03** | Weak Password Rejection (Length) | DB clean | POST `/api/v1/auth/register` with a password below the minimum length | 400 Bad Request; validation error returned | AC-001.4<br>FR-002 |
| **TC-AUTH-04** | Invalid Credentials Login | User exists | POST `/api/v1/auth/login` with wrong password | 401 Unauthorized; generic error message | AC-002.2<br>FR-004 |
| **TC-AUTH-05** | RBAC Route Protection | Creator logged in | GET `/api/v1/campaigns/new` with Creator token | 403 Forbidden | AC-002.6<br>FR-006 |
| **TC-AUTH-06** | Password Complexity — Missing Number | DB clean | POST `/api/v1/auth/register` with a password of sufficient length containing symbols but no number | 400 Bad Request; validation error returned | AC-001.4<br>FR-002<br>Planned |
| **TC-AUTH-07** | Password Complexity — Missing Symbol | DB clean | POST `/api/v1/auth/register` with a password of sufficient length containing a number but no symbol | 400 Bad Request; validation error returned | AC-001.4<br>FR-002<br>Planned |
| **TC-AUTH-08** | Valid Complex Password Accepted | DB clean | POST `/api/v1/auth/register` with a password meeting all FR-002 complexity rules | 201 Created; user persisted with hashed password | AC-001.1<br>FR-002<br>Planned |
| **TC-AUTH-09** | Forgot Password — No User Enumeration | Registered and unregistered emails available | POST `/api/v1/auth/forgot-password` once with a registered email, once with an unregistered email | 200 OK for both requests with identical response body; reset email dispatched only for the registered address | AC-005.1<br>FR-007<br>Planned |
| **TC-AUTH-10** | Reset Password with Valid Token | Reset token issued via forgot-password | POST `/api/v1/auth/reset-password` with the token and a new password meeting FR-002 rules | 200 OK; password hash updated; token invalidated immediately (replay rejected) | AC-005.3<br>FR-008<br>Planned |
| **TC-AUTH-11** | Reset Password with Expired or Used Token | Token expired (>60 min) or already consumed | POST `/api/v1/auth/reset-password` with the expired/used token | 4xx Rejected (400 Bad Request); password unchanged | AC-005.2<br>FR-008<br>Planned |
| **TC-AUTH-12** | Login Rate Limiting | Clean rate-limit counter for test IP | POST `/api/v1/auth/login` 6 times within 15 minutes from the same IP with failed credentials | First 5 attempts return 401 Unauthorized; 6th attempt returns 429 Too Many Requests | NFR-018<br>FR-004<br>Planned |
| **TC-PROF-01** | Brand Profile Creation & Update | Brand user authenticated | PUT `/api/v1/users/me/profile` with brand fields | 200 OK; profile saved; completeness score calculated | AC-003.1<br>FR-010 |
| **TC-PROF-02** | Creator Profile Creation | Creator authenticated | PUT `/api/v1/users/me/profile` with niche and platforms | 200 OK; profile persisted with platforms JSON | AC-004.1<br>FR-013 |

---

## 3. Campaign & AI Structuring Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-CAMP-01** | AI Brief Structuring Success | Brand authenticated | POST `/api/v1/campaigns/ai-draft` with raw text | 200 OK; valid structured JSON brief returned | AC-011.2<br>FR-021 |
| **TC-CAMP-02** | Brief Agent Error Fallback | Brand authenticated, mock LLM throws 500 | POST `/api/v1/campaigns/ai-draft` | 200 OK; body contains `fallback: true` and an empty/placeholder structured brief for manual completion (per the [`api-design.md`](../03-architecture/api-design.md) manual-fallback contract) | AC-011.3<br>FR-023 |
| **TC-CAMP-03** | Campaign Publication Gate | Campaign in draft | POST `/api/v1/campaigns/:id/publish` by owning brand | 200 OK; status transitions to `active`; matching triggered | AC-013.1<br>FR-026 |
| **TC-CAMP-04** | Creator Campaign Listing Feed | Active campaigns exist | GET `/api/v1/campaigns` as creator | 200 OK; active campaigns returned; draft campaigns excluded | AC-014.1<br>FR-028 |

---

## 4. Matching & Trust Signal Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-MATCH-01** | Creator Matching Generation | Active campaign with creators in DB | GET `/api/v1/campaigns/:id/matches` as owning brand | 200 OK; list of matches with `score` and `explanation` | AC-020.1<br>FR-040 |
| **TC-MATCH-02** | Match Explanation Presence | Active match generated | Inspect `explanation` field in match record | String is non-empty and references specific fit factors | AC-020.2<br>FR-041 |
| **TC-TRUST-01** | Trust Signal Observational Format | Creator profile exists | GET `/api/v1/creators/:id/trust-signals` | 200 OK; returns signals array and disclaimer string | AC-030.1<br>FR-050 |
| **TC-TRUST-02** | Non-Verdict Compliance Check | Generated trust report | Run text regex check across all `signalValue` strings | Zero occurrences of any term from the canonical prohibited-terminology list ([`safety-guardrails.md` § 2](../04-ai/safety-guardrails.md)) — e.g., "fake", "guaranteed fraud", "certified authentic" | AC-030.2<br>FR-051 |
| **TC-TRUST-03** | Mandatory Disclaimer Verification | UI renders trust panel | Inspect DOM for disclaimer text | Verbatim disclaimer string is present and visible | AC-030.3<br>FR-052 |

---

## 5. Collaboration Workflow Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-COLLAB-01** | Creator Submits Application | Active campaign, creator authenticated | POST `/api/v1/campaigns/:id/apply` with pitch note | 201 Created; application status `pending` | AC-040.1<br>FR-060 |
| **TC-COLLAB-02** | Duplicate Application Prevented | Application already pending | POST `/api/v1/campaigns/:id/apply` second time | 409 Conflict | AC-040.2<br>FR-061 |
| **TC-COLLAB-03** | Brand Accepts Application | Pending application exists | POST `/api/v1/applications/:id/decision` with `accepted` | 200 OK; Application `accepted`; Collaboration record created with initial status `invited` (awaiting creator confirmation) | AC-041.2<br>FR-063<br>FR-064 |
| **TC-COLLAB-04** | Message Thread Exchange | Collaboration active | POST `/api/v1/collaborations/:id/messages` with text | 201 Created; message visible in thread | AC-043.1<br>FR-066 |
| **TC-COLLAB-05** | Collaboration Completion | Collaboration `in_progress`; deliverables submitted and mutually confirmed by brand and creator | PUT `/api/v1/collaborations/:id/status` to `completed` | 200 OK; collaboration status `completed`; record archived | AC-044.1<br>FR-068 |
| **TC-COLLAB-06** | Unconfirmed Collaboration Cannot Be Activated | Collaboration in `invited` status; creator has not confirmed | PUT `/api/v1/collaborations/:id/status` to `in_progress` by the brand | 409 Conflict; invalid transition rejected; status remains `invited` | FR-064<br>FR-065<br>Planned |
| **TC-COLLAB-07** | Wrong-Role Status Change Rejected | Collaboration exists; authenticated user is not a participant | PUT `/api/v1/collaborations/:id/status` by an unrelated account | 403 Forbidden; status unchanged | AC-002.6<br>FR-006<br>NFR-012<br>Planned |

---

## 6. End-to-End Journey Test Cases

All cases in this section are **Planned** (Playwright E2E per [`test-plan.md`](./test-plan.md) Suite 5; journey steps from [`user-journeys.md`](../01-product/user-journeys.md)).

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-E2E-01** | J-1 Brand Journey: Register → Publish (Steps 1–5) | Clean DB; Playwright browser against full stack | Register as brand; complete brand profile; enter free-text campaign idea; review AI-structured brief and edit fields; publish campaign | Account, profile, and campaign created; brief remains editable until publish; campaign becomes `active` and matching is triggered | J-1 Steps 1–5<br>AC-001.1<br>AC-003.1<br>AC-011.2<br>AC-013.1<br>Planned |
| **TC-E2E-02** | J-1 Brand Journey: Select Creator → Complete (Steps 6–13) | Active campaign with matches, applications, and a collaboration in flight | View matched creators with explanations; open creator profile and trust signals; review applications; accept an application; confirm collaboration lifecycle; mark deliverables complete; close campaign | Match explanations and observational trust signals with disclaimer render; collaboration moves `invited` → `accepted` → `in_progress` → `completed`; campaign closes | J-1 Steps 6–13<br>AC-020.2<br>AC-030.3<br>AC-041.2<br>AC-044.1<br>Planned |
| **TC-E2E-03** | J-2 Creator Journey: Register → Evaluate (Steps 1–6) | Clean DB seeded with active campaigns | Register as creator; complete creator profile; browse campaign feed; filter campaigns; open campaign detail; view match fit indicator; view brand profile and brand trust indicators | Full brief renders with requirements and deliverables; filters narrow the feed; pre-computed fit indicator and brand trust indicators display when available | J-2 Steps 1–6<br>AC-004.1<br>AC-014.1<br>AC-015.1<br>AC-021.1<br>AC-031.1<br>Planned |
| **TC-E2E-04** | J-2 Creator Journey: Apply → Deliver (Steps 7–10) | Active campaign viewed by logged-in creator | Submit application with pitch note; track application status; receive acceptance; view collaboration on dashboard; complete collaboration | Application shows `pending` then decision status; collaboration appears and transitions to `completed` | J-2 Steps 7–10<br>AC-040.1<br>AC-042.1<br>AC-044.1<br>Planned |

---

## 7. Coverage Matrix

Status reflects whether at least one test case exists in this catalog for the group (`Covered`) or not yet (`Planned`); per-criterion verification status is tracked in [`acceptance-criteria.md`](../02-requirements/acceptance-criteria.md).

| AC Group | Canonical AC IDs | Test Case IDs | Status |
|---|---|---|:---:|
| Authentication & User Management | AC-001.x, AC-002.x, AC-005.x | TC-AUTH-01 – TC-AUTH-12 | Covered |
| Profile Management | AC-003.x, AC-004.x | TC-PROF-01, TC-PROF-02 | Covered |
| Campaign Lifecycle & Structuring | AC-010.x – AC-017.x | TC-CAMP-01 – TC-CAMP-04 | Covered |
| Creator Discovery & Matching | AC-020.x – AC-023.x | TC-MATCH-01, TC-MATCH-02 | Covered |
| Trust Analysis & Signal Governance | AC-030.x – AC-032.x | TC-TRUST-01 – TC-TRUST-03 | Covered |
| Collaboration Workflow & Delivery | AC-040.x – AC-044.x | TC-COLLAB-01 – TC-COLLAB-07 | Covered |
| Dashboards & Navigation | AC-050.x – AC-052.x | — | Planned |
| Performance & Load (NFRs) | NFR-001 – NFR-006, NFR-040 | Suite 6 in [`test-plan.md`](./test-plan.md) §2.6 | Planned |

---

## 8. Related Documents

| Document | Purpose |
|---|---|
| [`test-strategy.md`](./test-strategy.md) | Testing strategy and architecture |
| [`test-plan.md`](./test-plan.md) | Execution suites and scheduling |
| [`docs/02-requirements/acceptance-criteria.md`](../02-requirements/acceptance-criteria.md) | Full acceptance criteria matrix |
