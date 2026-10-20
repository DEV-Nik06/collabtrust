# CollabTrust — UX User Flows

> **Status:** Draft  
> **Phase:** Phase 6 — Design  
> **Depends on:** [`user-journeys.md`](../01-product/user-journeys.md), [`feature-requirements.md`](../01-product/feature-requirements.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview & Information Architecture

CollabTrust's user experience is designed for intuitive, low-friction interactions tailored to two distinct user roles: **Brands** (e.g., small brand founder Priya) and **Creators** (e.g., emerging creator Maya).

### High-Level Sitemaps

#### Brand Sitemap
```
/
├── /login & /register
├── /dashboard (Active campaigns, applications, active collaborations)
├── /campaigns
│   ├── /new (Free-text entry -> AI Structuring preview -> Edit brief)
│   ├── /:id (Campaign detail, status controls)
│   ├── /:id/matches (Ranked creator matches with match explanations)
│   └── /:id/applications (Submitted applications review + Trust Signal panel)
├── /creators/:id (Creator profile — authenticated brand viewers; self-reported platform/audience data, trust signals)
├── /collaborations/:id (Milestone status tracking, message thread — open decision: chat vs. comment/note thread, see mvp-scope.md §3.5)
└── /settings/profile (Brand company details)
```

#### Creator Sitemap
```
/
├── /login & /register
├── /dashboard (Matched opportunities, submitted applications, collaborations)
├── /explore (Marketplace feed of active brand campaigns, filters)
├── /campaigns/:id (Campaign detail view, brand profile summary, Apply button)
├── /applications (Track submitted application statuses)
├── /collaborations/:id (Collaboration status tracking, message thread)
└── /settings/profile (Creator bio, self-reported platforms and audience figures, completeness)
```

---

## 2. Core User Flows

### 2.1 Flow 1: Brand Campaign Creation with AI Structuring

```mermaid
flowchart TD
    A0["Entry: Brand registers at /register and completes brand profile setup"] --> A
    A["Brand clicks 'New Campaign'"] --> B["Screen: Free-Text Pitch Box"]
    B --> C["Brand enters informal text & clicks 'Structure with AI'"]
    C --> D["Loading indicator: 'Structuring brief...' (<30s)"]
    D --> E["Screen: Interactive Brief Editor pre-filled with AI fields"]
    E --> F{"Brand reviews fields"}
    F -->|Edits fields| E
    F -->|Satisfied| G["Brand clicks 'Publish Campaign'"]
    G --> H["Campaign transitions to Active"]
    H --> I["Redirects to Matches Tab with Creator Recommendations"]
```

* **Entry Point:** Registration (`/login & /register`) and brand profile setup precede this flow (per [`mvp-scope.md` §3.1](../01-product/mvp-scope.md)); the flow as drawn begins once the brand has a completed profile and is on the dashboard.
* **Key Screen States:** Free-text input box; loading spinner with cancellation option; multi-field editable form (Title, Goals, Target Audience, Deliverables, Timeline, Budget, Requirements); confirmation modal for publishing.

---

### 2.2 Flow 2: Creator Campaign Discovery & Application

```mermaid
flowchart TD
    A["Creator opens Marketplace Feed (/explore)"] --> B["Browses active campaign cards"]
    B --> C["Applies filter by Niche/Category"]
    C --> D["Clicks campaign card"]
    D --> E["Screen: Campaign Detail Page"]
    E --> F["Reviews deliverables, budget & brand profile summary"]
    F --> F2["Reviews brand-side trust indicators on the brand profile (FEAT-031: profile completeness, account age)"]
    F2 --> G["Clicks 'Apply to Campaign'"]
    G --> H["Modal: Optional pitch note input"]
    H --> I["Creator clicks 'Submit Application'"]
    I --> J["Success toast: 'Application submitted!'"]
    J --> K["Button state updates to 'Applied (Pending)'"]
```

* **Key Screen States:** Filterable card grid; detailed campaign view; brand-side trust indicator strip on the brand profile ([`FEAT-031`](../01-product/feature-requirements.md)); pitch note modal; pending application badge.

---

### 2.3 Flow 3: Brand Reviewing Applications & Trust Signals

```mermaid
flowchart TD
    A["Brand opens Campaign Dashboard -> Applications Tab"] --> B["Views list of creator applicant cards"]
    B --> C["Card displays: Creator Name, Niche, Match Score, Match Explanation"]
    C --> D["Brand clicks 'View Trust Signals & Profile'"]
    D --> E["Slide-over Panel: Trust Analysis Report"]
    E --> F["Panel displays: Profile completeness, engagement consistency, anomaly notes"]
    F --> G["Prominent Persistent Disclaimer: 'Informational observations only. CollabTrust surfaces signals and evidence, not fraud guarantees or definitive authenticity verdicts.'"]
    G --> H{"Brand human decision"}
    H -->|Click 'Accept'| I["Application Accepted -> Collaboration initialized"]
    H -->|Click 'Decline'| J["Application marked Declined"]
```

* **Key Screen States:** Applications table/list; detailed applicant profile slide-over; trust signal cards with severity tags (`info`, `anomaly`); persistent disclaimer banner; Accept/Decline action buttons.

---

### 2.4 Flow 4: Collaboration State Tracking & Delivery

```mermaid
flowchart TD
    A["Both parties navigate to /collaborations/:id"] --> B["Screen: Active Collaboration Hub"]
    B --> C["Status Stepper: Invited -> Accepted -> In Progress -> Completed"]
    C --> D["Message Thread: Centralized text communication (FEAT-043; chat vs. comment/note thread is an open decision)"]
    D --> E["Creator posts deliverable links and marks 'Ready for Review' (Deferred (post-MVP) — not in MVP scope; no FEAT, checklist deferred per mvp-scope.md §3.5)"]
    E --> F["Brand inspects deliverables"]
    F --> G{"Brand verifies deliverables"}
    G -->|Requests changes| D
    G -->|Approves| H["Brand clicks 'Confirm Completion' (FEAT-044)"]
    H --> I["Status transitions to Completed -> Archived to history"]
    I --> J["Campaign marked complete (mvp-scope.md §2 core loop)"]
```

* **Key Screen States:** Progress stepper; split view with deliverable checklist on left and chronological message thread on right; completion modal. The deliverable checklist and "Ready for Review" controls are **Deferred (post-MVP) — not in MVP scope** (no FEAT exists; the collaboration checklist is NICE-TO-HAVE/deferred per [`mvp-scope.md` §3.5](../01-product/mvp-scope.md)). Collaboration completion is covered by [`FEAT-044`](../01-product/feature-requirements.md).

---

## 3. Flow-to-Journey Mapping

Each flow above implements one or more of the narrative journeys defined in [`user-journeys.md`](../01-product/user-journeys.md):

| Flow | Journey(s) | Coverage Notes |
|---|---|---|
| Flow 1 — Brand Campaign Creation (§2.1) | [J-1: Brand Campaign Journey](../01-product/user-journeys.md#3-j-1-brand-campaign-journey) | J-1 steps 1–6: registration/profile setup through viewing matched creators. |
| Flow 2 — Creator Campaign Discovery & Application (§2.2) | [J-2: Creator Discovery Journey](../01-product/user-journeys.md#4-j-2-creator-discovery-journey), [J-4: Creator Evaluating a Brand Opportunity](../01-product/user-journeys.md#6-j-4-creator-evaluating-a-brand-opportunity) | J-2 steps 3–7 (browse → apply); J-4 steps 1–6 occur on the campaign detail page (including brand-side trust indicators, FEAT-031). |
| Flow 3 — Brand Reviewing Applications & Trust Signals (§2.3) | [J-3: Brand Evaluating Trust Signals](../01-product/user-journeys.md#5-j-3-brand-evaluating-trust-signals), [J-1: Brand Campaign Journey](../01-product/user-journeys.md#3-j-1-brand-campaign-journey) | J-3 steps 1–6 (trust signal review); J-1 steps 9–11 (applications review and creator selection). |
| Flow 4 — Collaboration State Tracking & Delivery (§2.4) | [J-1: Brand Campaign Journey](../01-product/user-journeys.md#3-j-1-brand-campaign-journey), [J-2: Creator Discovery Journey](../01-product/user-journeys.md#4-j-2-creator-discovery-journey) | J-1 steps 12–13 and J-2 steps 9–10: collaboration tracking through collaboration and campaign completion. |

---

## 4. Related Documents

| Document | Purpose |
|---|---|
| [`design-system.md`](./design-system.md) | Visual design tokens, typography, and UI components |
| [`wireframes/README.md`](./wireframes/README.md) | Wireframe layouts and screen structural blueprints |
| [`user-journeys.md`](../01-product/user-journeys.md) | Narrative user journeys |
