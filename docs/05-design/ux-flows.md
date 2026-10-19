# CollabTrust — UX User Flows

> **Status:** Draft  
> **Phase:** Phase E — Design  
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
├── /creators/:id (Public creator profile, channel overview, trust signals)
├── /collaborations/:id (Milestone status tracking, message thread)
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
├── /collaborations/:id (Deliverable milestone checklist, message thread)
└── /settings/profile (Creator bio, connected channels, audience metrics, completeness)
```

---

## 2. Core User Flows

### 2.1 Flow 1: Brand Campaign Creation with AI Structuring

```mermaid
flowchart TD
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
    F --> G["Clicks 'Apply to Campaign'"]
    G --> H["Modal: Optional pitch note input"]
    H --> I["Creator clicks 'Submit Application'"]
    I --> J["Success toast: 'Application submitted!'"]
    J --> K["Button state updates to 'Applied (Pending)'"]
```

* **Key Screen States:** Filterable card grid; detailed campaign view; pitch note modal; pending application badge.

---

### 2.3 Flow 3: Brand Reviewing Applications & Trust Signals

```mermaid
flowchart TD
    A["Brand opens Campaign Dashboard -> Applications Tab"] --> B["Views list of creator applicant cards"]
    B --> C["Card displays: Creator Name, Niche, Match Score, Match Explanation"]
    C --> D["Brand clicks 'View Trust Signals & Profile'"]
    D --> E["Slide-over Panel: Trust Analysis Report"]
    E --> F["Panel displays: Profile completeness, engagement consistency, anomaly notes"]
    F --> G["Prominent Persistent Disclaimer: 'Informational observations only'"]
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
    C --> D["Integrated Message Thread: Centralized text communication"]
    D --> E["Creator posts deliverable links and marks 'Ready for Review'"]
    E --> F["Brand inspects deliverables"]
    F --> G{"Brand verifies deliverables"}
    G -->|Requests changes| D
    G -->|Approves| H["Brand clicks 'Confirm Completion'"]
    H --> I["Status transitions to Completed -> Archived to history"]
```

* **Key Screen States:** Progress stepper; split view with deliverable checklist on left and chronological message thread on right; completion modal.

---

## 3. Related Documents

| Document | Purpose |
|---|---|
| [`design-system.md`](./design-system.md) | Visual design tokens, typography, and UI components |
| [`wireframes/README.md`](./wireframes/README.md) | Wireframe layouts and screen structural blueprints |
| [`user-journeys.md`](../01-product/user-journeys.md) | Narrative user journeys |
