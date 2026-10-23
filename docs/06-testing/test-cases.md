# CollabTrust — Test Cases Catalog

> **Status:** Draft  
> **Phase:** Phase 7 — Testing & Deployment  
> **Depends on:** [`acceptance-criteria.md`](../02-requirements/acceptance-criteria.md), [`test-plan.md`](./test-plan.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

> **Note:** All test cases in this catalog are **Planned** design-stage specifications. No test infrastructure, database fixtures, or application code exist yet. Test execution begins in Phase 8 (MVP Implementation).

---

## 1. Overview

This catalog defines concrete, itemized test cases mapping directly to acceptance criteria (`AC-XXX`) and functional requirements (`FR-XXX`). In accordance with Phase 7 quality criteria, every one of the 65 canonical acceptance criteria defined in [`acceptance-criteria.md`](../02-requirements/acceptance-criteria.md) is mapped to an explicit test case.

---

## 2. Authentication & Profile Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-AUTH-01** | Successful User Registration (Brand) | Clean DB | POST `/api/v1/auth/register` with valid email, password, role `brand` | 201 Created; user persisted with hashed password; access token returned; `collabtrust_refresh_token` httpOnly cookie set | AC-001.1<br>FR-001<br>Planned |
| **TC-AUTH-02** | Duplicate Email Rejection | User exists in DB | POST `/api/v1/auth/register` with existing email | 409 Conflict; duplicate registration rejected | AC-001.3<br>FR-001<br>Planned |
| **TC-AUTH-03** | Weak Password Rejection (Length) | Clean DB | POST `/api/v1/auth/register` with password shorter than 8 characters | 400 Bad Request; validation error returned | AC-001.4<br>FR-002<br>Planned |
| **TC-AUTH-04** | Invalid Credentials Login | User exists in DB | POST `/api/v1/auth/login` with incorrect password | 401 Unauthorized; generic error message | AC-002.2<br>FR-004<br>Planned |
| **TC-AUTH-05** | RBAC Route Protection | Creator authenticated | GET `/api/v1/campaigns/new` with Creator token | 403 Forbidden; brand-only route protected | AC-002.6<br>FR-006<br>Planned |
| **TC-AUTH-06** | Password Complexity — Missing Number | Clean DB | POST `/api/v1/auth/register` with password having letters and symbols but no number | 400 Bad Request; validation error returned | AC-001.4<br>FR-002<br>Planned |
| **TC-AUTH-07** | Password Complexity — Missing Symbol | Clean DB | POST `/api/v1/auth/register` with password having letters and numbers but no symbol | 400 Bad Request; validation error returned | AC-001.4<br>FR-002<br>Planned |
| **TC-AUTH-08** | Valid Complex Password Accepted | Clean DB | POST `/api/v1/auth/register` with password meeting all length and complexity rules | 201 Created; account created successfully | AC-001.1<br>FR-002<br>Planned |
| **TC-AUTH-09** | Forgot Password — No User Enumeration | Registered and unregistered emails | POST `/api/v1/auth/forgot-password` with registered vs unregistered email | 200 OK with identical response message for both; reset token issued only for registered | AC-005.1<br>FR-007<br>Planned |
| **TC-AUTH-10** | Reset Password with Valid Token | Reset token issued | POST `/api/v1/auth/reset-password` with valid token and strong new password | 200 OK; password hash updated; token invalidated immediately (replay rejected) | AC-005.3<br>FR-008<br>Planned |
| **TC-AUTH-11** | Reset Password with Expired/Used Token | Token expired (>60 min) or consumed | POST `/api/v1/auth/reset-password` with expired or used token | 400 Bad Request; password unchanged | AC-005.2<br>FR-008<br>Planned |
| **TC-AUTH-12** | Login Rate Limiting | Clean IP counter | POST `/api/v1/auth/login` 6 times in 15 minutes with invalid credentials | First 5 attempts return 401; 6th attempt returns 429 Too Many Requests | NFR-018<br>FR-004<br>Planned |
| **TC-AUTH-13** | Registration Role Validation | Clean DB | POST `/api/v1/auth/register` with email and password but omitting role | 400 Bad Request; validation error requiring role `brand` or `creator` | AC-001.2<br>FR-001<br>Planned |
| **TC-AUTH-14** | Successful User Login | User registered | POST `/api/v1/auth/login` with valid email and password | 200 OK; user object returned; access token in body; refresh token in httpOnly cookie | AC-002.1<br>FR-003<br>Planned |
| **TC-AUTH-15** | Session Persistence Across Reload | User logged in | Reload page or call `GET /api/v1/users/me/profile` with valid access token | 200 OK; active session recognized without re-prompting login | AC-002.3<br>FR-003<br>Planned |
| **TC-AUTH-16** | Session Logout & Token Revocation | User logged in | POST `/api/v1/auth/logout` | 200 OK; refresh cookie cleared; `tokenVersion` incremented; subsequent sensitive requests rejected | AC-002.4<br>FR-005<br>Planned |
| **TC-AUTH-17** | Unauthenticated Route Protection | Unauthenticated client | GET `/api/v1/users/me/profile` without credentials | 401 Unauthorized; standardized error envelope returned | AC-002.5<br>FR-006<br>Planned |
| **TC-AUTH-18** | Refresh Token Exchange & Rotation | Valid refresh cookie | POST `/api/v1/auth/refresh` | 200 OK; returns new 15-minute access token; rotates refresh cookie | NFR-010<br>FR-003<br>Planned |
| **TC-PROF-01** | Brand Profile Creation | Brand user authenticated | PUT `/api/v1/users/me/profile` with company name, category, budget range | 200 OK; profile persisted; completeness score computed | AC-003.1<br>FR-010<br>Planned |
| **TC-PROF-02** | Creator Profile Creation | Creator authenticated | PUT `/api/v1/users/me/profile` with display name, niche, platforms JSON | 200 OK; creator profile persisted | AC-004.1<br>FR-013<br>Planned |
| **TC-PROF-03** | Brand Profile Update | Brand profile exists | PUT `/api/v1/users/me/profile` with modified description or budget | 200 OK; updated attributes persisted | AC-003.2<br>FR-011<br>Planned |
| **TC-PROF-04** | Creator Views Brand Public Profile | Brand profile exists | GET `/api/v1/brands/:id` as authenticated creator | 200 OK; public brand info displayed; private account email/tokenVersion excluded | AC-003.3<br>FR-012<br>Planned |
| **TC-PROF-05** | Profile Timestamp Auto-Update | Existing profile | PUT `/api/v1/users/me/profile` | 200 OK; `updatedAt` timestamp is updated to current time | AC-003.4<br>FR-017<br>Planned |
| **TC-PROF-06** | Creator Profile Update | Creator profile exists | PUT `/api/v1/users/me/profile` with updated bio and platforms | 200 OK; modified creator attributes persisted | AC-004.2<br>FR-014<br>Planned |
| **TC-PROF-07** | Brand Views Creator Public Profile | Creator profile exists | GET `/api/v1/creators/:id` as authenticated brand | 200 OK; display name, niche, handles, and self-reported metrics rendered | AC-004.3<br>FR-016<br>Planned |
| **TC-PROF-08** | Profile Completeness Guidance | Creator profile incomplete | GET `/api/v1/users/me/profile` | 200 OK; completeness percentage and guidance prompts for missing fields returned | AC-004.4<br>FR-015<br>Planned |

---

## 3. Campaign & AI Structuring Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-CAMP-01** | AI Brief Structuring Success | Brand authenticated | POST `/api/v1/campaigns/ai-draft` with raw concept text | 200 OK; structured JSON brief returned containing all 7 canonical fields | AC-011.2<br>FR-021<br>Planned |
| **TC-CAMP-02** | Brief Agent Error Fallback | Brand authenticated, mock LLM fails | POST `/api/v1/campaigns/ai-draft` | 200 OK; body contains `fallback: true` and empty brief structure for manual entry | AC-011.3<br>FR-023<br>Planned |
| **TC-CAMP-03** | Campaign Publication Gate | Campaign in draft owned by brand | POST `/api/v1/campaigns/:id/publish` | 200 OK; status transitions `draft` -> `active`; matching triggered | AC-013.1<br>FR-026<br>Planned |
| **TC-CAMP-04** | Creator Campaign Marketplace Feed | Active and draft campaigns exist | GET `/api/v1/campaigns` as creator | 200 OK; only `active` campaigns returned; `draft` campaigns excluded | AC-014.1<br>FR-028<br>Planned |
| **TC-CAMP-05** | Free-Text Campaign Input Submission | Brand authenticated | POST `/api/v1/campaigns/ai-draft` with free text | 200 OK; agent sanitizes input and processes with XML tag boundaries | AC-010.1<br>FR-020<br>Planned |
| **TC-CAMP-06** | Brief Pre-Save In-Memory Editing | AI brief returned | Modify title, budget, and deliverables in client UI state | Fields updated in client memory before database persistence | AC-010.2<br>FR-022<br>Planned |
| **TC-CAMP-07** | Structured Brief Field Editability | Structured brief draft in UI | Verify title, goals, audience, deliverables, timeline, budget, requirements are editable | All 7 fields remain editable prior to publish | AC-011.1<br>FR-024<br>Planned |
| **TC-CAMP-08** | Save Intermediate Campaign Draft | Edited brief | POST `/api/v1/campaigns` with brief payload | 201 Created; Campaign record persisted with status `draft` | AC-012.1<br>FR-025<br>Planned |
| **TC-CAMP-09** | Campaign Publication Non-Owner Gate | Campaign owned by another brand | POST `/api/v1/campaigns/:id/publish` as non-owner | 403 Forbidden; status remains unchanged | AC-013.2<br>FR-026<br>Planned |
| **TC-CAMP-10** | Campaign Publish Timestamp & Lifecycle | Draft campaign | POST `/api/v1/campaigns/:id/publish` by owning brand | 200 OK; status becomes `active`; `updatedAt` modified; matching engine notified | AC-013.3<br>FR-027<br>Planned |
| **TC-CAMP-11** | Creator Views Full Campaign Brief | Active campaign | GET `/api/v1/campaigns/:id` as creator | 200 OK; full requirements, deliverables, budget, and brand profile rendered | AC-015.1<br>FR-029<br>Planned |
| **TC-CAMP-12** | Brand Closes Active Campaign | Active campaign owned by brand | POST `/api/v1/campaigns/:id/close` | 200 OK; status changes to `closed`; new creator applications disabled | AC-016.1<br>FR-030<br>Planned |
| **TC-CAMP-13** | Application to Non-Active Campaign Rejected | Campaign with status `closed` or `draft` | POST `/api/v1/campaigns/:id/apply` as creator | 400 Bad Request; application rejected with descriptive error | AC-016.2<br>FR-031<br>Planned |
| **TC-CAMP-14** | Marketplace Campaign Category Filtering | Active campaigns across categories | GET `/api/v1/campaigns?category=Beauty+%26+Wellness` | 200 OK; returns only active campaigns matching category filter | AC-017.1<br>FR-032<br>Planned |

---

## 4. Matching & Trust Signal Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-MATCH-01** | Creator Matching Generation | Active campaign with creators in DB | GET `/api/v1/campaigns/:id/matches` as owning brand | 200 OK; ranked list of matches with `score` and `explanation` | AC-020.1<br>FR-040<br>Planned |
| **TC-MATCH-02** | Match Explanation Presence | Match generated | Inspect `explanation` field in match record | String is non-empty and cites specific fit factors (niche, style, audience) | AC-020.2<br>FR-041<br>Planned |
| **TC-MATCH-03** | Zero Match Empty State | Campaign with rare niche, 0 creators | GET `/api/v1/campaigns/:id/matches` | 200 OK; empty matches array returned with helpful empty-state message | AC-020.3<br>FR-043<br>Planned |
| **TC-MATCH-04** | Zero Autonomous Outreach on Match | Matching completed | Inspect notification and mailer queues | Zero automated emails, messages, or invitations sent to creators | AC-020.4<br>FR-048<br>Planned |
| **TC-MATCH-05** | Match Cache Reuse & Refresh Invalidation | Campaign matches generated | GET `/api/v1/campaigns/:id/matches` twice; then POST `/api/v1/matches/refresh` | First query returns cached records (`criteriaHash` match, 0 LLM calls); refresh forces regeneration | AC-020.5<br>FR-047<br>Planned |
| **TC-MATCH-06** | Brand Matches Ranking & Fit Factors | Computed matches exist | GET `/api/v1/campaigns/:id/matches` | 200 OK; matches ordered by score descending; `factors` JSON included | AC-020.6<br>FR-042<br>Planned |
| **TC-MATCH-07** | Creator Pre-Computed Match Indicator | Active campaign with pre-computed match | GET `/api/v1/campaigns/:id` as matched creator | 200 OK; pre-computed match fit indicator rendered on campaign view | AC-021.1<br>FR-044<br>Planned |
| **TC-MATCH-08** | Manual Creator Search & Filtering | Diverse creator profiles in DB | GET `/api/v1/creators?niche=Sustainable+Living` as brand | 200 OK; filtered creator results returned | AC-022.1<br>FR-045<br>Planned |
| **TC-MATCH-09** | Profile Insight Agent Summary | Creator profile complete | GET `/api/v1/creators/:id/insights` as brand | 200 OK; structured audience and content style summary returned | AC-023.1<br>FR-046<br>Planned |
| **TC-TRUST-01** | Trust Signal Observational Format | Creator profile exists | GET `/api/v1/creators/:id/trust-signals` | 200 OK; returns signals array and disclaimer string | AC-030.1<br>FR-050<br>Planned |
| **TC-TRUST-02** | Non-Verdict Compliance Check | Generated trust report | Run text regex check across all `signalValue` strings | Zero occurrences of canonical prohibited terms ("fake", "guaranteed fraud", "certified authentic") | AC-030.2<br>FR-051<br>Planned |
| **TC-TRUST-03** | Mandatory Disclaimer Verification | UI renders trust panel | Inspect DOM for disclaimer text | Verbatim disclaimer string is present and prominently displayed | AC-030.3<br>FR-052<br>Planned |
| **TC-TRUST-04** | Trust Signal Groundedness & Expansion | Trust signal card displayed | Expand trust signal card in UI | Card reveals underlying self-reported data point and date | AC-030.4<br>FR-055<br>Planned |
| **TC-TRUST-05** | Trust Signal Severity Tagging | Trust analysis complete | Inspect `severity` field in signals array | Every signal carries valid enum value `info`, `note`, or `anomaly` | AC-030.5<br>FR-053<br>Planned |
| **TC-TRUST-06** | Brand Objective Trust Indicators | Brand profile exists | GET `/api/v1/brands/:id` as creator | 200 OK; objective brand signals (account age, completed campaigns) displayed | AC-031.1<br>FR-054<br>Planned |
| **TC-TRUST-07** | Trust Signal Access Control | Unauthenticated or unauthorized user | GET `/api/v1/creators/:id/trust-signals` without brand token | 401 Unauthorized / 403 Forbidden; trust analysis protected | AC-032.1<br>FR-056<br>Planned |

---

## 5. Collaboration Workflow Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-COLLAB-01** | Creator Submits Application | Active campaign, creator authenticated | POST `/api/v1/campaigns/:id/apply` with pitch note | 201 Created; application record created with status `pending` and `pitchNote` | AC-040.1<br>FR-060<br>Planned |
| **TC-COLLAB-02** | Duplicate Application Prevented | Application already pending | POST `/api/v1/campaigns/:id/apply` second time | 409 Conflict; duplicate application rejected | AC-040.2<br>FR-061<br>Planned |
| **TC-COLLAB-03** | Brand Accepts Application | Pending application exists | POST `/api/v1/applications/:id/decision` with `accepted` | 200 OK; application `accepted`; Collaboration record created with initial status `invited` | AC-041.2<br>FR-063<br>Planned |
| **TC-COLLAB-04** | Message Thread Exchange | Active collaboration | POST `/api/v1/collaborations/:id/messages` with content | 201 Created; message stored and rendered chronologically in thread | AC-043.1<br>FR-066<br>Planned |
| **TC-COLLAB-05** | Collaboration Completion | Collaboration `in_progress`; mutual confirmation | PUT `/api/v1/collaborations/:id/status` to `completed` | 200 OK; collaboration status becomes `completed`; record archived | AC-044.1<br>FR-068<br>Planned |
| **TC-COLLAB-06** | Unconfirmed Collaboration Cannot Be Activated | Collaboration in `invited` status | PUT `/api/v1/collaborations/:id/status` to `in_progress` by brand | 409 Conflict; cannot activate before creator acknowledgement; status remains `invited` | FR-064<br>FR-065<br>Planned |
| **TC-COLLAB-07** | Wrong-Role Status Change Rejected | Collaboration exists | PUT `/api/v1/collaborations/:id/status` by non-participant | 403 Forbidden; unauthorized modification rejected | AC-002.6<br>FR-006<br>NFR-012<br>Planned |
| **TC-COLLAB-08** | Brand Lists Campaign Applications | Applications submitted | GET `/api/v1/campaigns/:id/applications` as owning brand | 200 OK; applications listed with creator profiles, pitchNote, and match explanations | AC-041.1<br>FR-062<br>Planned |
| **TC-COLLAB-09** | Brand Declines Application | Pending application exists | POST `/api/v1/applications/:id/decision` with `declined` | 200 OK; application status `declined`; no collaboration created | AC-041.3<br>FR-063<br>Planned |
| **TC-COLLAB-10** | Creator Explicit Confirmation Gate | Brand accepted application | PUT `/api/v1/collaborations/:id/status` with `accepted` by creator | 200 OK; status transitions `invited` -> `accepted`; required before work begins | AC-041.4<br>FR-064<br>Planned |
| **TC-COLLAB-11** | Collaboration Lifecycle State Visibility | Active collaboration | GET `/api/v1/collaborations/:id` as participant | 200 OK; current state (`invited`, `accepted`, `in_progress`, `completed`) rendered | AC-042.1<br>FR-065<br>Planned |
| **TC-COLLAB-12** | Mutual Deliverable Completion Request | Collaboration `in_progress` | PUT `/api/v1/collaborations/:id/status` marking deliverable delivered | 200 OK; status remains `in_progress`; completion request and thread notice recorded | AC-044.2<br>FR-067<br>Planned |

---

## 6. Dashboards & Navigation Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-DASH-01** | Brand Dashboard Rendering | Authenticated brand | GET `/dashboard` as brand | 200 OK; active campaigns, pending applications, and active collaborations rendered | AC-050.1<br>FR-070<br>Planned |
| **TC-DASH-02** | Creator Dashboard Rendering | Authenticated creator | GET `/dashboard` as creator | 200 OK; matched opportunities, application statuses, and active collaborations rendered | AC-051.1<br>FR-071<br>Planned |
| **TC-DASH-03** | Role-Tailored Navigation Bars | Authenticated brand and creator | Inspect top navigation menus for each user role | Brand sees campaign creation and match management; creator sees marketplace feed and applications | AC-052.1<br>FR-072<br>Planned |
| **TC-DASH-04** | Dashboard Empty State Onboarding | New user with zero records | Navigate to `/dashboard` | Empty state cards with clear onboarding actions and next steps rendered | AC-052.2<br>FR-076<br>Planned |

---

## 7. End-to-End Journey Test Cases

All cases in this section are **Planned** (Playwright E2E per [`test-plan.md`](./test-plan.md) Suite 5; journey steps from [`user-journeys.md`](../01-product/user-journeys.md)).

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-E2E-01** | J-1 Brand Journey: Register → Publish (Steps 1–5) | Clean DB; Playwright browser against full stack | Register as brand; complete brand profile; enter free-text campaign idea; review AI-structured brief and edit fields; publish campaign | Account, profile, and campaign created; brief remains editable until publish; campaign becomes `active` and matching is triggered | J-1 Steps 1–5<br>AC-001.1<br>AC-003.1<br>AC-011.2<br>AC-013.1<br>Planned |
| **TC-E2E-02** | J-1 Brand Journey: Select Creator → Complete (Steps 6–13) | Active campaign with matches, applications, and a collaboration in flight | View matched creators with explanations; open creator profile and trust signals; review applications; accept an application; confirm collaboration lifecycle; mark deliverables complete; close campaign | Match explanations and observational trust signals with disclaimer render; collaboration moves `invited` → `accepted` → `in_progress` → `completed`; campaign closes | J-1 Steps 6–13<br>AC-020.2<br>AC-030.3<br>AC-041.2<br>AC-044.1<br>Planned |
| **TC-E2E-03** | J-2 Creator Journey: Register → Evaluate (Steps 1–6) | Clean DB seeded with active campaigns | Register as creator; complete creator profile; browse campaign feed; filter campaigns; open campaign detail; view match fit indicator; view brand profile and brand trust indicators | Full brief renders with requirements and deliverables; filters narrow the feed; pre-computed fit indicator and brand trust indicators display when available | J-2 Steps 1–6<br>AC-004.1<br>AC-014.1<br>AC-015.1<br>AC-021.1<br>AC-031.1<br>Planned |
| **TC-E2E-04** | J-2 Creator Journey: Apply → Deliver (Steps 7–10) | Active campaign viewed by logged-in creator | Submit application with pitch note; track application status; receive acceptance; view collaboration on dashboard; complete collaboration | Application shows `pending` then decision status; collaboration appears and transitions to `completed` | J-2 Steps 7–10<br>AC-040.1<br>AC-042.1<br>AC-044.1<br>Planned |

---

## 8. Coverage Matrix

Every canonical acceptance criterion defined in [`acceptance-criteria.md`](../02-requirements/acceptance-criteria.md) is mapped below. All cases are **Planned** awaiting Phase 8 implementation.

| AC Group | Canonical AC IDs | Test Case IDs | Verification Status |
|---|---|---|:---:|
| **Authentication & User Management** | AC-001.1 – AC-001.4<br>AC-002.1 – AC-002.6<br>AC-005.1 – AC-005.3 | TC-AUTH-01 – TC-AUTH-18 | Planned |
| **Profile Management** | AC-003.1 – AC-003.4<br>AC-004.1 – AC-004.4 | TC-PROF-01 – TC-PROF-08 | Planned |
| **Campaign Lifecycle & Structuring** | AC-010.1 – AC-010.2<br>AC-011.1 – AC-011.3<br>AC-012.1<br>AC-013.1 – AC-013.3<br>AC-014.1<br>AC-015.1<br>AC-016.1 – AC-016.2<br>AC-017.1 | TC-CAMP-01 – TC-CAMP-14 | Planned |
| **Creator Discovery & Matching** | AC-020.1 – AC-020.6<br>AC-021.1<br>AC-022.1<br>AC-023.1 | TC-MATCH-01 – TC-MATCH-09 | Planned |
| **Trust Analysis & Signal Governance** | AC-030.1 – AC-030.5<br>AC-031.1<br>AC-032.1 | TC-TRUST-01 – TC-TRUST-07 | Planned |
| **Collaboration Workflow & Delivery** | AC-040.1 – AC-040.2<br>AC-041.1 – AC-041.4<br>AC-042.1<br>AC-043.1<br>AC-044.1 – AC-044.2 | TC-COLLAB-01 – TC-COLLAB-12 | Planned |
| **Dashboards & Navigation** | AC-050.1<br>AC-051.1<br>AC-052.1 – AC-052.2 | TC-DASH-01 – TC-DASH-04 | Planned |
| **End-to-End User Journeys** | J-1 Steps 1–13<br>J-2 Steps 1–10 | TC-E2E-01 – TC-E2E-04 | Planned |
| **Performance & Load (NFRs)** | NFR-001 – NFR-006, NFR-040 | Suite 6 in [`test-plan.md`](./test-plan.md) §2.6 | Planned |

---

## 9. Related Documents

| Document | Purpose |
|---|---|
| [`test-strategy.md`](./test-strategy.md) | Testing strategy and architecture |
| [`test-plan.md`](./test-plan.md) | Execution suites and scheduling |
| [`docs/02-requirements/acceptance-criteria.md`](../02-requirements/acceptance-criteria.md) | Canonical acceptance criteria index (65 criteria) |
