# CollabTrust — Functional Requirements

> **Status:** Draft  
> **Phase:** Phase B — Engineering Requirements  
> **Depends on:** [`PRD.md`](../01-product/PRD.md), [`feature-requirements.md`](../01-product/feature-requirements.md), [`mvp-scope.md`](../01-product/mvp-scope.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview

This document specifies the complete set of Functional Requirements (FR) for the CollabTrust platform. Functional requirements define the precise behavioral and operational capabilities of the software, tracing directly to feature specifications (`FEAT-XXX`) from [`feature-requirements.md`](../01-product/feature-requirements.md).

### Core Marketplace Problems Solved
1. **Brands:** Cannot easily discover relevant creators within limited budgets, nor evaluate authenticity and fit.
2. **Creators:** Cannot easily find legitimate, relevant brand opportunities matching their niche, audience, and goals.

### Principles Enforced
* **AI-Assisted, Human-Controlled:** AI recommends, analyzes, and drafts; human users make all publishing, application, selection, and collaboration decisions.
* **Evidence Over Claims:** Trust Analysis presents observational signals and potential anomalies, never claiming guaranteed fraud detection or definitive authenticity verdicts.

---

## 2. Requirements Summary Matrix

| Category | ID Range | Features Traced | Count | MUST-HAVE | SHOULD-HAVE | NICE-TO-HAVE |
|---|---|---|:---:|:---:|:---:|:---:|
| 1. Authentication & User Management | FR-001 – FR-008 | FEAT-001, FEAT-002, FEAT-005 | 8 | 6 | 2 | 0 |
| 2. Profile Management | FR-010 – FR-018 | FEAT-003, FEAT-004 | 9 | 7 | 2 | 0 |
| 3. Campaign Lifecycle & Structuring | FR-020 – FR-032 | FEAT-010 – FEAT-017 | 13 | 9 | 4 | 0 |
| 4. Creator Discovery & Matching | FR-040 – FR-048 | FEAT-020 – FEAT-023 | 9 | 6 | 3 | 0 |
| 5. Trust Analysis & Signal Governance | FR-050 – FR-056 | FEAT-030 – FEAT-032 | 7 | 5 | 2 | 0 |
| 6. Collaboration Workflow | FR-060 – FR-068 | FEAT-040 – FEAT-044 | 9 | 7 | 2 | 0 |
| 7. Dashboard & Navigation | FR-070 – FR-076 | FEAT-050 – FEAT-052 | 7 | 4 | 3 | 0 |
| **Total** | | | **62** | **44** | **18** | **0** |

---

## 3. Detailed Functional Requirements

### 3.1 Authentication & User Management

| ID | Requirement Specification | Feature Trace | Priority | Notes / Rationale |
|---|---|:---:|:---:|---|
| **FR-001** | The system shall allow new users to register an account with a unique email address, password, and explicit role selection (`brand` or `creator`). | FEAT-001 | **MUST-HAVE** | Core onboarding entry point. |
| **FR-002** | The system shall enforce password complexity standards (minimum 8 characters, at least one number and one symbol) during registration and update. | FEAT-001 | **MUST-HAVE** | Security baseline per `NFR-010`. |
| **FR-003** | The system shall authenticate users via valid email and password credentials, returning an authenticated session token. | FEAT-002 | **MUST-HAVE** | Session-based or JWT token (see ADR-003). |
| **FR-004** | The system shall reject invalid credentials with a generic error message ("Invalid email or password") to prevent username enumeration. | FEAT-002 | **MUST-HAVE** | Security standard. |
| **FR-005** | The system shall terminate active sessions and invalidate tokens upon user logout request. | FEAT-002 | **MUST-HAVE** | Session hygiene. |
| **FR-006** | The system shall restrict access to protected endpoints and UI routes based strictly on user authentication status and assigned role. | FEAT-002 | **MUST-HAVE** | Role-based authorization. |
| **FR-007** | The system shall permit users to request a password reset token sent to their registered email address. | FEAT-005 | **SHOULD-HAVE** | Self-service recovery flow. |
| **FR-008** | The system shall validate password reset tokens, enforce a 60-minute expiration window, and invalidate used tokens immediately upon password update. | FEAT-005 | **SHOULD-HAVE** | Token security. |

---

### 3.2 Profile Management

| ID | Requirement Specification | Feature Trace | Priority | Notes / Rationale |
|---|---|:---:|:---:|---|
| **FR-010** | The system shall require brand users to create a brand profile comprising company name, industry category, description, and budget range. | FEAT-003 | **MUST-HAVE** | Minimum data needed for campaign matching. |
| **FR-011** | The system shall allow brand users to update their profile information at any time. | FEAT-003 | **MUST-HAVE** | Profile maintenance. |
| **FR-012** | The system shall expose public brand profile views to authenticated creator users, displaying company details and verified collaboration indicators. | FEAT-003, FEAT-031 | **MUST-HAVE** | Enables creators to evaluate legitimacy. |
| **FR-013** | The system shall require creator users to create a profile specifying display name, primary content niche, connected platforms, estimated audience size, and content style. | FEAT-004 | **MUST-HAVE** | Profile foundation for AI matching. |
| **FR-014** | The system shall allow creator users to update their profile attributes, portfolio links, and collaboration preferences. | FEAT-004 | **MUST-HAVE** | Profile maintenance. |
| **FR-015** | The system shall calculate and display a profile completeness indicator to creator and brand users. | FEAT-004, FEAT-031 | **SHOULD-HAVE** | Encourages complete data for matching. |
| **FR-016** | The system shall render public creator profiles for authenticated brand users showing niche, platforms, self-reported audience metrics, and bio. | FEAT-004 | **MUST-HAVE** | Brand vetting surface. |
| **FR-017** | The system shall record timestamps for profile creation and all profile updates. | FEAT-003, FEAT-004 | **MUST-HAVE** | Auditability and trust signals. |
| **FR-018** | The system shall support optional brand and creator profile image upload or URL reference. | FEAT-003, FEAT-004 | **SHOULD-HAVE** | Visual identity. |

---

### 3.3 Campaign Lifecycle & Structuring

| ID | Requirement Specification | Feature Trace | Priority | Notes / Rationale |
|---|---|:---:|:---:|---|
| **FR-020** | The system shall provide brand users with a free-text input interface to describe campaign concepts, goals, and constraints. | FEAT-010 | **MUST-HAVE** | Lowers barrier for small brands. |
| **FR-021** | The system shall submit raw campaign text to the Campaign Brief Agent and receive a structured JSON brief (title, target audience, deliverables, timeline, budget, requirements). | FEAT-011 | **MUST-HAVE** | Priority 1 AI Agent. |
| **FR-022** | The system shall populate an editable campaign draft form using the Campaign Brief Agent's structured output. | FEAT-011, FEAT-012 | **MUST-HAVE** | Human-in-the-loop validation. |
| **FR-023** | The system shall provide a manual form fallback for campaign creation if the Campaign Brief Agent fails or encounters network errors. | FEAT-011 | **MUST-HAVE** | Graceful degradation (`NFR-022`). |
| **FR-024** | The system shall allow brand users to edit any field in the generated campaign brief prior to publication. | FEAT-012 | **MUST-HAVE** | Human retains control over brief content. |
| **FR-025** | The system shall save intermediate campaign drafts with status `draft`. | FEAT-012, FEAT-016 | **MUST-HAVE** | Prevents data loss during brief writing. |
| **FR-026** | The system shall require explicit human confirmation by the brand user to publish a campaign, transitioning its status from `draft` to `active`. | FEAT-013 | **MUST-HAVE** | Mandatory human approval gate. |
| **FR-027** | The system shall trigger the Creator Matching Agent upon campaign publication. | FEAT-013, FEAT-020 | **MUST-HAVE** | Core loop transition. |
| **FR-028** | The system shall display published active campaigns in a searchable marketplace feed accessible to authenticated creators. | FEAT-014 | **MUST-HAVE** | Proactive creator discovery channel. |
| **FR-029** | The system shall provide a detailed campaign view displaying all brief attributes, requirements, deliverables, and brand summary to creators. | FEAT-015 | **MUST-HAVE** | Opportunity evaluation screen. |
| **FR-030** | The system shall allow brand users to transition campaign status (`active` -> `closed` -> `completed`). | FEAT-016 | **SHOULD-HAVE** | Lifecycle management. |
| **FR-031** | The system shall prevent creator applications on campaigns with status other than `active`. | FEAT-016, FEAT-040 | **MUST-HAVE** | Workflow integrity. |
| **FR-032** | The system shall allow creators to filter active campaigns by niche, category, and budget range. | FEAT-017 | **SHOULD-HAVE** | Discovery efficiency. |

---

### 3.4 Creator Discovery & Matching

| ID | Requirement Specification | Feature Trace | Priority | Notes / Rationale |
|---|---|:---:|:---:|---|
| **FR-040** | The system shall invoke the Creator Matching Agent to compare active campaign briefs against creator profiles and return ranked candidate matches. | FEAT-020 | **MUST-HAVE** | Core AI value proposition. |
| **FR-041** | The system shall generate and persist a human-readable match explanation string alongside every creator recommendation. | FEAT-021 | **MUST-HAVE** | Core principle: Explainability. |
| **FR-042** | The system shall display ranked matched creators with their respective match explanations to the brand owner of the campaign. | FEAT-020, FEAT-021 | **MUST-HAVE** | Transparent decision support. |
| **FR-043** | The system shall handle empty match results gracefully with clear guidance ("No matching creators found for this criteria") without throwing system errors. | FEAT-020 | **MUST-HAVE** | Edge case resilience. |
| **FR-044** | The system shall enable creators viewing a campaign to see personalized relevance indicators if the matching agent identified a profile match. | FEAT-021 | **SHOULD-HAVE** | Creator-side fit clarity. |
| **FR-045** | The system shall allow brand users to manually search and browse registered creator profiles by niche, platforms, and audience tier. | FEAT-022 | **SHOULD-HAVE** | Complements AI discovery with manual search. |
| **FR-046** | The system shall allow brand users to invoke the Profile Insight Agent to generate a concise summary of a creator's audience alignment and content style. | FEAT-023 | **SHOULD-HAVE** | Decision-support summarization. |
| **FR-047** | The system shall cache match results per campaign-creator pair to prevent redundant LLM invocations unless campaign criteria change. | FEAT-020 | **MUST-HAVE** | Performance and cost control. |
| **FR-048** | The system shall never automatically invite or message creators without explicit brand action. | FEAT-020 | **MUST-HAVE** | Guardrail: No autonomous outreach. |

---

### 3.5 Trust Analysis & Signal Governance

| ID | Requirement Specification | Feature Trace | Priority | Notes / Rationale |
|---|---|:---:|:---:|---|
| **FR-050** | The system shall invoke the Trust Analysis Agent to evaluate public/self-reported profile data and produce structured trust signals (completeness, consistency, anomaly flags). | FEAT-030 | **MUST-HAVE** | Priority 2 AI Agent. |
| **FR-051** | The system shall present trust evaluation output strictly as observational signals and evidence, prohibiting definitive "fraud", "fake", or "guaranteed authentic" classifications. | FEAT-030, FEAT-032 | **MUST-HAVE** | Guardrail: Evidence over claims. |
| **FR-052** | The system shall render a persistent disclaimer on all trust analysis UI panels stating that signals are informational observations and do not guarantee authenticity or fraud detection. | FEAT-032 | **MUST-HAVE** | Legal and ethical compliance. |
| **FR-053** | The system shall categorize trust signals into neutral observational categories (e.g., `Profile Completeness`, `Audience Metric Consistency`, `Historical Activity`). | FEAT-030 | **MUST-HAVE** | Transparent UI structuring. |
| **FR-054** | The system shall display brand trust indicators to creators (account age, profile completeness, completed collaboration count). | FEAT-031 | **SHOULD-HAVE** | Two-way trust symmetry. |
| **FR-055** | The system shall allow users to inspect the factual data points underlying any highlighted trust signal or anomaly flag. | FEAT-030 | **SHOULD-HAVE** | Inspectable evidence. |
| **FR-056** | The system shall restrict visibility of detailed creator trust analysis reports to authenticated brand users reviewing that creator. | FEAT-030 | **MUST-HAVE** | Privacy & authorization rule. |

---

### 3.6 Collaboration Workflow

| ID | Requirement Specification | Feature Trace | Priority | Notes / Rationale |
|---|---|:---:|:---:|---|
| **FR-060** | The system shall allow authenticated creators to submit an application to active campaigns, including an optional pitch note. | FEAT-040 | **MUST-HAVE** | Proactive creator application loop. |
| **FR-061** | The system shall prevent creators from submitting multiple active applications to the same campaign. | FEAT-040 | **MUST-HAVE** | Idempotency and anti-spam rule. |
| **FR-062** | The system shall present submitted applications in the brand's campaign management console, alongside match explanations and trust signals. | FEAT-041 | **MUST-HAVE** | Integrated review workflow. |
| **FR-063** | The system shall require explicit brand user action to accept or decline creator applications, initiating a collaboration upon acceptance. | FEAT-041 | **MUST-HAVE** | Human decision gate. |
| **FR-064** | The system shall create a `Collaboration` entity with status `invited` or `accepted` when a brand approves an application. | FEAT-041, FEAT-042 | **MUST-HAVE** | State machine transition. |
| **FR-065** | The system shall track collaboration state across defined lifecycle stages: `invited` -> `accepted` -> `in_progress` -> `completed`. | FEAT-042 | **MUST-HAVE** | Core workflow tracking. |
| **FR-066** | The system shall provide an in-platform chronological communication thread for active collaborations between brand and selected creator. | FEAT-043 | **SHOULD-HAVE** | Replaces fragmented DMs/email. |
| **FR-067** | The system shall allow either collaboration participant to mark deliverables delivered and request completion confirmation. | FEAT-044 | **MUST-HAVE** | Milestone closing. |
| **FR-068** | The system shall transition a collaboration to `completed` upon mutual confirmation or brand finalization, archiving the record. | FEAT-044 | **MUST-HAVE** | Collaboration loop completion. |

---

### 3.7 Dashboard & Navigation

| ID | Requirement Specification | Feature Trace | Priority | Notes / Rationale |
|---|---|:---:|:---:|---|
| **FR-070** | The system shall render a Brand Dashboard displaying active campaigns, pending creator applications, matched recommendations, and active collaborations. | FEAT-050 | **MUST-HAVE** | Primary brand hub. |
| **FR-071** | The system shall render a Creator Dashboard displaying matched opportunities, submitted application statuses, and active collaborations. | FEAT-051 | **MUST-HAVE** | Primary creator hub. |
| **FR-072** | The system shall provide role-aware top-level navigation that dynamically adapts menu links and actionable shortcuts to the user's role. | FEAT-052 | **MUST-HAVE** | Role-tailored UX. |
| **FR-073** | The system shall display unread activity badges on applications and collaboration messages in navigation bars. | FEAT-050, FEAT-051 | **SHOULD-HAVE** | Activity awareness. |
| **FR-074** | The system shall provide breadcrumbs and clear back-navigation across hierarchical campaign and profile views. | FEAT-052 | **SHOULD-HAVE** | Usability standard. |
| **FR-075** | The system shall allow users to toggle account settings and initiate logout from any application view. | FEAT-052 | **MUST-HAVE** | Standard account navigation. |
| **FR-076** | The system shall render informative empty states with actionable call-to-actions when dashboards have zero records. | FEAT-050, FEAT-051 | **SHOULD-HAVE** | Cold-start onboarding guidance. |

---

## 4. Traceability & Integrity Validation

All 62 functional requirements trace to features in [`feature-requirements.md`](../01-product/feature-requirements.md):
* **Authentication:** `FR-001`–`FR-008` ↔ `FEAT-001`, `FEAT-002`, `FEAT-005`
* **Profiles:** `FR-010`–`FR-018` ↔ `FEAT-003`, `FEAT-004`
* **Campaigns:** `FR-020`–`FR-032` ↔ `FEAT-010`–`FEAT-017`
* **Matching:** `FR-040`–`FR-048` ↔ `FEAT-020`–`FEAT-023`
* **Trust Analysis:** `FR-050`–`FR-056` ↔ `FEAT-030`–`FEAT-032`
* **Collaboration:** `FR-060`–`FR-068` ↔ `FEAT-040`–`FEAT-044`
* **Dashboards:** `FR-070`–`FR-076` ↔ `FEAT-050`–`FEAT-052`

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`PRD.md`](../01-product/PRD.md) | Product Requirements Document |
| [`feature-requirements.md`](../01-product/feature-requirements.md) | Feature catalog and MoSCoW priorities |
| [`non-functional-requirements.md`](./non-functional-requirements.md) | Quality attributes, security, and performance constraints |
| [`SRS.md`](./SRS.md) | Software Requirements Specification index |
| [`user-stories.md`](./user-stories.md) | User persona narrative stories |
| [`acceptance-criteria.md`](./acceptance-criteria.md) | Testable acceptance criteria matrix |
