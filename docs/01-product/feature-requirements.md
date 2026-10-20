# CollabTrust — Feature Requirements

> **Status:** Draft
> **Phase:** 2.8 — Feature Requirements
> **Depends on:** [`product-vision.md`](./product-vision.md), [`problem-definition.md`](./problem-definition.md), [`mvp-scope.md`](./mvp-scope.md), [`user-journeys.md`](./user-journeys.md)
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)

---

## 1. Feature Summary

| ID | Feature | User | MVP Priority | AI Agent |
|---|---|---|---|---|
| FEAT-001 | User registration | Both | MUST-HAVE | — |
| FEAT-002 | User login / authentication | Both | MUST-HAVE | — |
| FEAT-003 | Brand profile management | Brand | MUST-HAVE | — |
| FEAT-004 | Creator profile management | Creator | MUST-HAVE | — |
| FEAT-005 | Password reset | Both | SHOULD-HAVE | — |
| FEAT-010 | Campaign creation (free-text) | Brand | MUST-HAVE | — |
| FEAT-011 | Campaign Brief Agent structuring | Brand | MUST-HAVE | Campaign Brief Agent |
| FEAT-012 | Campaign editing and review | Brand | MUST-HAVE | — |
| FEAT-013 | Campaign publishing | Brand | MUST-HAVE | — |
| FEAT-014 | Campaign listing | Creator | MUST-HAVE | — |
| FEAT-015 | Campaign detail view | Creator | MUST-HAVE | — |
| FEAT-016 | Campaign status management | Brand | SHOULD-HAVE | — |
| FEAT-017 | Campaign filtering / search | Creator | SHOULD-HAVE | — |
| FEAT-020 | AI-powered creator matching | Brand | MUST-HAVE | Creator Matching Agent |
| FEAT-021 | Match explanation display | Brand | MUST-HAVE | Creator Matching Agent |
| FEAT-022 | Creator browsing / search (manual) | Brand | SHOULD-HAVE | — |
| FEAT-023 | Creator profile viewing with insights | Brand | SHOULD-HAVE | Profile Insight Agent |
| FEAT-030 | Trust signal summary (creator) | Brand | MUST-HAVE | Trust Analysis Agent |
| FEAT-031 | Brand-side trust signals | Creator | SHOULD-HAVE | — |
| FEAT-032 | Signal limitations disclosure | Both | MUST-HAVE | — |
| FEAT-040 | Creator application to campaigns | Creator | MUST-HAVE | — |
| FEAT-041 | Brand reviews and selects creators | Brand | MUST-HAVE | — |
| FEAT-042 | Collaboration status tracking | Both | MUST-HAVE | — |
| FEAT-043 | Basic messaging / communication | Both | SHOULD-HAVE | — |
| FEAT-044 | Collaboration completion | Both | MUST-HAVE | — |
| FEAT-050 | Brand dashboard | Brand | SHOULD-HAVE | — |
| FEAT-051 | Creator dashboard | Creator | SHOULD-HAVE | — |
| FEAT-052 | Navigation and layout | Both | MUST-HAVE | — |

---

## 2. Feature Details

> [!IMPORTANT]
> **Acceptance criteria authority:** This document defines *what each feature is*. Testable acceptance criteria live exclusively in [`acceptance-criteria.md`](../02-requirements/acceptance-criteria.md). Each feature below links to its canonical AC group; no AC text is duplicated here, so the two documents can never drift apart.

### 2.1 Authentication & User Management

#### FEAT-001 — User Registration

| Field | Value |
|---|---|
| **Feature ID** | FEAT-001 |
| **Name** | User registration |
| **Description** | Users can register for a CollabTrust account by providing an email address, password, and selecting their role (brand or creator). |
| **User** | Both |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None |
| **Dependencies** | None |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-001.x`.

#### FEAT-002 — User Login / Authentication

| Field | Value |
|---|---|
| **Feature ID** | FEAT-002 |
| **Name** | User login / authentication |
| **Description** | Registered users can log in with email and password. Sessions are maintained via JWT or session tokens (TBD). |
| **User** | Both |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-001 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-002.x`.

#### FEAT-003 — Brand Profile Management

| Field | Value |
|---|---|
| **Feature ID** | FEAT-003 |
| **Name** | Brand profile management |
| **Description** | Brand users can create and edit their profile: company name, category, description, budget range, collaboration goals, website. |
| **User** | Brand |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-001, FEAT-002 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-003.x`.

#### FEAT-004 — Creator Profile Management

| Field | Value |
|---|---|
| **Feature ID** | FEAT-004 |
| **Name** | Creator profile management |
| **Description** | Creator users can create and edit their profile: niche/category, social platforms, audience size, content style, collaboration preferences, bio. |
| **User** | Creator |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-001, FEAT-002 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-004.x`.

#### FEAT-005 — Password Reset

| Field | Value |
|---|---|
| **Feature ID** | FEAT-005 |
| **Name** | Password reset |
| **Description** | Users can request a password reset via email. |
| **User** | Both |
| **MVP Priority** | SHOULD-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-001 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-005.x`.
---

### 2.2 Campaign Management

#### FEAT-010 — Campaign Creation (Free-Text)

| Field | Value |
|---|---|
| **Feature ID** | FEAT-010 |
| **Name** | Campaign creation (free-text input) |
| **Description** | Brand users enter a campaign idea as free-text or through guided fields. This input is sent to the Campaign Brief Agent for structuring. |
| **User** | Brand |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | Input to Campaign Brief Agent |
| **Dependencies** | FEAT-002, FEAT-003 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-010.x`.

#### FEAT-011 — Campaign Brief Agent Structuring

| Field | Value |
|---|---|
| **Feature ID** | FEAT-011 |
| **Name** | Campaign Brief Agent structuring |
| **Description** | The Campaign Brief Agent converts the brand's free-text campaign input into a structured, editable campaign draft with fields such as: campaign title, goals, target audience, deliverables, timeline, budget, and requirements. |
| **User** | Brand |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | **Campaign Brief Agent** (hackathon priority 1) |
| **Dependencies** | FEAT-010 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-011.x`.

#### FEAT-012 — Campaign Editing and Review

| Field | Value |
|---|---|
| **Feature ID** | FEAT-012 |
| **Name** | Campaign editing and review |
| **Description** | Brand users can review, edit, and refine the AI-structured campaign brief before publishing. |
| **User** | Brand |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None (user edits AI output) |
| **Dependencies** | FEAT-011 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-012.x`.

#### FEAT-013 — Campaign Publishing

| Field | Value |
|---|---|
| **Feature ID** | FEAT-013 |
| **Name** | Campaign publishing |
| **Description** | Brand users can publish a campaign, making it visible to creators and triggering the Creator Matching Agent. |
| **User** | Brand |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | Triggers Creator Matching Agent |
| **Dependencies** | FEAT-012 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-013.x`.

#### FEAT-014 — Campaign Listing

| Field | Value |
|---|---|
| **Feature ID** | FEAT-014 |
| **Name** | Campaign listing |
| **Description** | Creators can browse a list of active/published campaigns. |
| **User** | Creator |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-013 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-014.x`.

#### FEAT-015 — Campaign Detail View

| Field | Value |
|---|---|
| **Feature ID** | FEAT-015 |
| **Name** | Campaign detail view |
| **Description** | Creators can view the full details of a campaign before deciding whether to apply. |
| **User** | Creator |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-014 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-015.x`.

#### FEAT-016 — Campaign Status Management

| Field | Value |
|---|---|
| **Feature ID** | FEAT-016 |
| **Name** | Campaign status management |
| **Description** | Campaigns have a status lifecycle: Draft → Active → Closed/Completed. |
| **User** | Brand |
| **MVP Priority** | SHOULD-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-013 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-016.x`.

#### FEAT-017 — Campaign Filtering / Search

| Field | Value |
|---|---|
| **Feature ID** | FEAT-017 |
| **Name** | Campaign filtering / search |
| **Description** | Creators can filter and search campaigns by category, budget range, or other attributes. |
| **User** | Creator |
| **MVP Priority** | SHOULD-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-014 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-017.x`.
---

### 2.3 Creator Discovery & Matching

#### FEAT-020 — AI-Powered Creator Matching

| Field | Value |
|---|---|
| **Feature ID** | FEAT-020 |
| **Name** | AI-powered creator matching |
| **Description** | When a campaign is published, the Creator Matching Agent identifies creators whose profiles align with the campaign requirements and produces a ranked list. |
| **User** | Brand |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | **Creator Matching Agent** (hackathon priority 3) |
| **Dependencies** | FEAT-013, FEAT-004 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-020.x`.

#### FEAT-021 — Match Explanation Display

| Field | Value |
|---|---|
| **Feature ID** | FEAT-021 |
| **Name** | Match explanation display |
| **Description** | Each creator match includes a human-readable explanation of why this creator was matched to this campaign. |
| **User** | Brand |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | **Creator Matching Agent** (output) |
| **Dependencies** | FEAT-020 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-021.x`.

#### FEAT-022 — Creator Browsing / Search (Manual)

| Field | Value |
|---|---|
| **Feature ID** | FEAT-022 |
| **Name** | Creator browsing / search (manual) |
| **Description** | Brands can browse or search creator profiles manually, in addition to AI matching. |
| **User** | Brand |
| **MVP Priority** | SHOULD-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-004 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-022.x`.

#### FEAT-023 — Creator Profile Viewing with Insights

| Field | Value |
|---|---|
| **Feature ID** | FEAT-023 |
| **Name** | Creator profile viewing with insights |
| **Description** | When a brand views a creator profile, the Profile Insight Agent provides a summary of the creator's profile data, content style, and audience signals. |
| **User** | Brand |
| **MVP Priority** | SHOULD-HAVE |
| **AI Involvement** | **Profile Insight Agent** |
| **Dependencies** | FEAT-004 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-023.x`.
---

### 2.4 Trust & Analysis

#### FEAT-030 — Trust Signal Summary (Creator)

| Field | Value |
|---|---|
| **Feature ID** | FEAT-030 |
| **Name** | Trust signal summary (creator) |
| **Description** | The Trust Analysis Agent surfaces available trust signals for a creator's profile: engagement patterns, profile completeness, account age indicators, content consistency, and potential anomalies. |
| **User** | Brand |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | **Trust Analysis Agent** (hackathon priority 2) |
| **Dependencies** | FEAT-004 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-030.x`.
> [!IMPORTANT]
> Trust Analysis must present **signals and evidence**, not fraud verdicts or definitive authenticity claims. This is a core product principle. See [product-vision.md §6, Principle 3](./product-vision.md#6-core-product-principles).

#### FEAT-031 — Brand-Side Trust Signals

| Field | Value |
|---|---|
| **Feature ID** | FEAT-031 |
| **Name** | Brand-side trust signals |
| **Description** | Creators can view basic trust indicators about a brand: profile completeness, account age, collaboration history (if available). |
| **User** | Creator |
| **MVP Priority** | SHOULD-HAVE |
| **AI Involvement** | None (computed from profile data) |
| **Dependencies** | FEAT-003 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-031.x`.

#### FEAT-032 — Signal Limitations Disclosure

| Field | Value |
|---|---|
| **Feature ID** | FEAT-032 |
| **Name** | Signal limitations disclosure |
| **Description** | The platform displays a clear disclosure wherever trust signals are shown, stating that signals are observations and not guarantees of authenticity or fraud detection. |
| **User** | Both |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None (UI/copy) |
| **Dependencies** | FEAT-030 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-032.x`.
---

### 2.5 Collaboration Workflow

#### FEAT-040 — Creator Application to Campaigns

| Field | Value |
|---|---|
| **Feature ID** | FEAT-040 |
| **Name** | Creator application to campaigns |
| **Description** | Creators can apply to active campaigns. The application is submitted to the brand for review. |
| **User** | Creator |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-015, FEAT-004 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-040.x`.

#### FEAT-041 — Brand Reviews and Selects Creators

| Field | Value |
|---|---|
| **Feature ID** | FEAT-041 |
| **Name** | Brand reviews and selects creators |
| **Description** | Brands can review creator applications and matched creators, and select creators for collaboration. |
| **User** | Brand |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None (selection is human decision) |
| **Dependencies** | FEAT-020, FEAT-040 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-041.x`.

#### FEAT-042 — Collaboration Status Tracking

| Field | Value |
|---|---|
| **Feature ID** | FEAT-042 |
| **Name** | Collaboration status tracking |
| **Description** | Both brands and creators can view and update the status of an active collaboration. Minimum statuses: Invited → Accepted → In Progress → Completed. |
| **User** | Both |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-041 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-042.x`.

#### FEAT-043 — Basic Messaging / Communication

| Field | Value |
|---|---|
| **Feature ID** | FEAT-043 |
| **Name** | Basic messaging / communication |
| **Description** | Brands and creators can exchange messages within the context of an active collaboration. Can be simplified to a comment/note thread. |
| **User** | Both |
| **MVP Priority** | SHOULD-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-042 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-043.x`.

#### FEAT-044 — Collaboration Completion

| Field | Value |
|---|---|
| **Feature ID** | FEAT-044 |
| **Name** | Collaboration completion |
| **Description** | Either party can mark a collaboration as complete. |
| **User** | Both |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-042 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-044.x`.
---

### 2.6 Dashboard & Navigation

#### FEAT-050 — Brand Dashboard

| Field | Value |
|---|---|
| **Feature ID** | FEAT-050 |
| **Name** | Brand dashboard |
| **Description** | An overview for brand users showing their active campaigns, matched creators, pending applications, and active collaborations. |
| **User** | Brand |
| **MVP Priority** | SHOULD-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-003, FEAT-013, FEAT-020, FEAT-042 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-050.x`.

#### FEAT-051 — Creator Dashboard

| Field | Value |
|---|---|
| **Feature ID** | FEAT-051 |
| **Name** | Creator dashboard |
| **Description** | An overview for creator users showing available/matched campaigns, submitted applications, and active collaborations. |
| **User** | Creator |
| **MVP Priority** | SHOULD-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-004, FEAT-014, FEAT-040, FEAT-042 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-051.x`.

#### FEAT-052 — Navigation and Layout

| Field | Value |
|---|---|
| **Feature ID** | FEAT-052 |
| **Name** | Navigation and layout |
| **Description** | The application has a consistent navigation structure appropriate to the user's role (brand or creator). |
| **User** | Both |
| **MVP Priority** | MUST-HAVE |
| **AI Involvement** | None |
| **Dependencies** | FEAT-002 |

**Acceptance Criteria:** Defined canonically in [acceptance-criteria.md](../02-requirements/acceptance-criteria.md) as `AC-052.x`.
---

## 3. Feature Interactions

Key features are connected in the following flow:

```
FEAT-010 (Campaign creation)
  → FEAT-011 (Campaign Brief Agent)
  → FEAT-012 (Campaign editing)
  → FEAT-013 (Campaign publishing)
      → FEAT-020 (Creator Matching Agent)
      → FEAT-021 (Match explanations)
      → FEAT-014 (Campaign listing for creators)
          → FEAT-040 (Creator applies)
              → FEAT-041 (Brand reviews/selects)
                  → FEAT-042 (Collaboration tracking)
                      → FEAT-044 (Completion)
```

Trust signals (FEAT-030) and profile insights (FEAT-023) are consumed during the brand review step (FEAT-041).

Brand-side trust signals (FEAT-031) are consumed during the creator evaluation step (J-4 in [user-journeys.md](./user-journeys.md)).

---

## 4. Deferred Features (Post-MVP)

| Feature | Reason | Reference |
|---|---|---|
| Payment processing | Regulatory complexity; not needed for core loop validation | [mvp-scope.md §4](./mvp-scope.md#4-mvp-features---explicitly-out-of-scope) |
| Autonomous outreach | Conflicts with human-controlled principle | [product-vision.md §6](./product-vision.md#6-core-product-principles) |
| Advanced analytics / dashboards | Not needed for MVP validation | [mvp-scope.md §4](./mvp-scope.md#4-mvp-features---explicitly-out-of-scope) |
| Multi-platform social API integrations | MVP uses self-reported data | [mvp-scope.md §4](./mvp-scope.md#4-mvp-features---explicitly-out-of-scope) |
| Legal contract generation | Requires legal review | [mvp-scope.md §4](./mvp-scope.md#4-mvp-features---explicitly-out-of-scope) |
| Mobile application | Web-only for MVP | [mvp-scope.md §4](./mvp-scope.md#4-mvp-features---explicitly-out-of-scope) |
| Rating / review system | Post-collaboration reputation is post-MVP | [mvp-scope.md §4](./mvp-scope.md#4-mvp-features---explicitly-out-of-scope) |
| Notification system (beyond basic) | Push/email notifications deferred | [mvp-scope.md §4](./mvp-scope.md#4-mvp-features---explicitly-out-of-scope) |
| Collaboration Assistant agent (full) | Deferred per hackathon priority | [mvp-scope.md §5](./mvp-scope.md#5-ai-agents-in-mvp) |
| Workflow Coordinator agent (full) | Deferred per hackathon priority | [mvp-scope.md §5](./mvp-scope.md#5-ai-agents-in-mvp) |

---

## 5. Open Questions

| # | Question | Impact | Related Feature |
|---|---|---|---|
| 1 | What are the minimum required fields for a creator profile to enable useful matching? | High | FEAT-004, FEAT-020 |
| 2 | What are the minimum required fields for a campaign brief to enable useful matching? | High | FEAT-010, FEAT-011, FEAT-020 |
| 3 | Should matching happen automatically on campaign publish or be manually triggered? | Medium | FEAT-013, FEAT-020 |
| 4 | What authentication mechanism (JWT vs. session)? | Medium | FEAT-002 |
| 5 | What is the messaging model — threaded comments, chat, or simple notes? | Medium | FEAT-043 |
| 6 | Should creators see all campaigns or only matched ones? | Medium | FEAT-014 |
| 7 | What brand-side trust signals are available at launch? | Medium | FEAT-031 |

---

## 6. Related Documents

| Document | Purpose |
|---|---|
| [`product-vision.md`](./product-vision.md) | Core principles and product boundaries |
| [`problem-definition.md`](./problem-definition.md) | Problems these features address |
| [`mvp-scope.md`](./mvp-scope.md) | Feature priorities and MVP boundaries |
| [`user-journeys.md`](./user-journeys.md) | How features are used in user flows |
| [`personas.md`](./personas.md) | Who uses each feature |
| [`goals-success-metrics.md`](./goals-success-metrics.md) | Success metrics for feature effectiveness |
| [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) | Master handoff document |
