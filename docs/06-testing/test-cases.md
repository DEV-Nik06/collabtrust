# CollabTrust — Test Cases Catalog

> **Status:** Draft  
> **Phase:** Phase F — Testing  
> **Depends on:** [`acceptance-criteria.md`](../02-requirements/acceptance-criteria.md), [`test-plan.md`](./test-plan.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview

This catalog defines concrete, itemized test cases mapping directly to acceptance criteria (`AC-XXX`) and functional requirements (`FR-XXX`).

---

## 2. Authentication & Profile Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-AUTH-01** | Successful User Registration (Brand) | DB clean | POST `/api/v1/auth/register` with valid email, password, role `brand` | 201 Created returned; user persisted with hashed password | AC-001.1<br>FR-001 |
| **TC-AUTH-02** | Duplicate Email Rejection | User exists | POST `/api/v1/auth/register` with existing email | 409 Conflict; no duplicate created | AC-001.3<br>FR-001 |
| **TC-AUTH-03** | Weak Password Rejection | DB clean | POST `/api/v1/auth/register` with 6-char password | 400 Bad Request; validation error returned | AC-001.4<br>FR-002 |
| **TC-AUTH-04** | Invalid Credentials Login | User exists | POST `/api/v1/auth/login` with wrong password | 401 Unauthorized; generic error message | AC-002.2<br>FR-004 |
| **TC-AUTH-05** | RBAC Route Protection | Creator logged in | GET `/api/v1/campaigns/new` with Creator token | 403 Forbidden | AC-002.6<br>FR-006 |
| **TC-PROF-01** | Brand Profile Creation & Update | Brand user authenticated | PUT `/api/v1/users/me/profile` with brand fields | 200 OK; profile saved; completeness score calculated | AC-003.1<br>FR-010 |
| **TC-PROF-02** | Creator Profile Creation | Creator authenticated | PUT `/api/v1/users/me/profile` with niche and platforms | 200 OK; profile persisted with platforms JSON | AC-004.1<br>FR-013 |

---

## 3. Campaign & AI Structuring Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-CAMP-01** | AI Brief Structuring Success | Brand authenticated | POST `/api/v1/campaigns/ai-draft` with raw text | 200 OK; valid structured JSON brief returned | AC-010.2<br>FR-021 |
| **TC-CAMP-02** | Brief Agent Error Fallback | Brand authenticated, mock LLM throws 500 | POST `/api/v1/campaigns/ai-draft` | 200 OK with `fallback: true` or 422 with manual form notice | AC-010.3<br>FR-023 |
| **TC-CAMP-03** | Campaign Publication Gate | Campaign in draft | POST `/api/v1/campaigns/:id/publish` by owning brand | 200 OK; status transitions to `active`; matching triggered | AC-013.1<br>FR-026 |
| **TC-CAMP-04** | Creator Campaign Listing Feed | Active campaigns exist | GET `/api/v1/campaigns` as creator | 200 OK; active campaigns returned; draft campaigns excluded | AC-014.1<br>FR-028 |

---

## 4. Matching & Trust Signal Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-MATCH-01** | Creator Matching Generation | Active campaign with creators in DB | GET `/api/v1/campaigns/:id/matches` as owning brand | 200 OK; list of matches with `score` and `explanation` | AC-020.1<br>FR-040 |
| **TC-MATCH-02** | Match Explanation Presence | Active match generated | Inspect `explanation` field in match record | String is non-empty and references specific fit factors | AC-020.2<br>FR-041 |
| **TC-TRUST-01** | Trust Signal Observational Format | Creator profile exists | GET `/api/v1/creators/:id/trust-signals` | 200 OK; returns signals array and disclaimer string | AC-030.1<br>FR-050 |
| **TC-TRUST-02** | Non-Verdict Compliance Check | Generated trust report | Run text regex check across all `signalValue` strings | Zero occurrences of "fake", "guaranteed fraud", "certified authentic" | AC-030.2<br>FR-051 |
| **TC-TRUST-03** | Mandatory Disclaimer Verification | UI renders trust panel | Inspect DOM for disclaimer text | Verbatim disclaimer string is present and visible | AC-030.3<br>FR-052 |

---

## 5. Collaboration Workflow Test Cases

| Case ID | Title | Pre-conditions | Test Steps | Expected Result | Trace |
|---|---|---|---|---|:---:|
| **TC-COLLAB-01** | Creator Submits Application | Active campaign, creator authenticated | POST `/api/v1/campaigns/:id/apply` with pitch note | 201 Created; application status `pending` | AC-040.1<br>FR-060 |
| **TC-COLLAB-02** | Duplicate Application Prevented | Application already pending | POST `/api/v1/campaigns/:id/apply` second time | 409 Conflict | AC-040.2<br>FR-061 |
| **TC-COLLAB-03** | Brand Accepts Application | Pending application exists | POST `/api/v1/applications/:id/decision` with `accepted` | 200 OK; Application `accepted`; Collaboration record created | AC-041.2<br>FR-063 |
| **TC-COLLAB-04** | Message Thread Exchange | Collaboration active | POST `/api/v1/collaborations/:id/messages` with text | 201 Created; message visible in thread | AC-043.1<br>FR-066 |
| **TC-COLLAB-05** | Collaboration Completion | Deliverables verified | PUT `/api/v1/collaborations/:id/status` to `completed` | 200 OK; collaboration status `completed` | AC-044.1<br>FR-068 |

---

## 6. Related Documents

| Document | Purpose |
|---|---|
| [`test-strategy.md`](./test-strategy.md) | Testing strategy and architecture |
| [`test-plan.md`](./test-plan.md) | Execution suites and scheduling |
| [`docs/02-requirements/acceptance-criteria.md`](../02-requirements/acceptance-criteria.md) | Full acceptance criteria matrix |
