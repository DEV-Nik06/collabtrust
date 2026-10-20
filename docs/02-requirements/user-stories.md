# CollabTrust — User Stories

> **Status:** Draft  
> **Phase:** Phase 3 — Requirements  
> **Depends on:** [`personas.md`](../01-product/personas.md), [`user-journeys.md`](../01-product/user-journeys.md), [`feature-requirements.md`](../01-product/feature-requirements.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview

This document presents 50 user stories (`US-001` through `US-050`) capturing the operational goals of CollabTrust personas. User stories represent functional value from the user perspective, mapping directly to features (`FEAT-XXX`), functional requirements (`FR-XXX`), and acceptance criteria (`AC-XXX`).

### Core Marketplace Problems Solved
1. **Brands:** Cannot easily discover relevant creators within limited budgets, nor evaluate authenticity and fit.
2. **Creators:** Cannot easily find legitimate, relevant brand opportunities matching their niche, audience, and goals.

---

## 2. Brand User Stories (Priya Sharma & Daniel Okafor)

### Onboarding & Campaign Drafting

| ID | User Story | Priority | Trace |
|---|---|:---:|---|
| **US-001** | **As a** brand founder (Priya),<br>**I want to** register an account with my email, password, and brand role,<br>**so that** I can access brand campaign tools. | **MUST-HAVE** | FEAT-001<br>FR-001 |
| **US-002** | **As a** brand founder (Priya),<br>**I want to** set up my brand profile with company name, category, and budget range,<br>**so that** creators and matching algorithms understand my business context. | **MUST-HAVE** | FEAT-003<br>FR-010 |
| **US-003** | **As a** brand manager (Daniel),<br>**I want to** update my company profile and collaboration goals,<br>**so that** our information remains accurate as our product line expands. | **MUST-HAVE** | FEAT-003<br>FR-011 |
| **US-004** | **As a** brand founder (Priya),<br>**I want to** describe my campaign idea in informal, free-text language,<br>**so that** I don't have to spend hours formatting a professional brief from scratch. | **MUST-HAVE** | FEAT-010<br>FR-020 |
| **US-005** | **As a** brand founder (Priya),<br>**I want** the Campaign Brief Agent to convert my rough text into a structured brief with goals, deliverables, and timeline,<br>**so that** I have an actionable draft ready for creator review. | **MUST-HAVE** | FEAT-011<br>FR-021 |
| **US-006** | **As a** brand founder (Priya),<br>**I want** the system to gracefully provide a standard manual form if AI brief structuring is unavailable,<br>**so that** I can continue drafting my campaign without interruption. | **MUST-HAVE** | FEAT-011<br>FR-023 |
| **US-007** | **As a** brand manager (Daniel),<br>**I want to** edit any field in the generated campaign brief,<br>**so that** all campaign terms strictly match our company requirements before going live. | **MUST-HAVE** | FEAT-012<br>FR-024 |
| **US-008** | **As a** brand founder (Priya),<br>**I want to** explicitly review and click publish on my campaign draft,<br>**so that** no campaign is launched publicly without my deliberate human approval. | **MUST-HAVE** | FEAT-013<br>FR-026 |

### Matching, Evaluation & Selection

| ID | User Story | Priority | Trace |
|---|---|:---:|---|
| **US-009** | **As a** brand manager (Daniel),<br>**I want** the system to automatically match registered creators to my active campaign,<br>**so that** I don't have to manually search through hundreds of irrelevant profiles. | **MUST-HAVE** | FEAT-020<br>FR-040 |
| **US-010** | **As a** brand founder (Priya),<br>**I want to** read an explicit textual explanation of why each creator was recommended,<br>**so that** I understand the specific fit factors (audience overlap, content style) before contacting them. | **MUST-HAVE** | FEAT-021<br>FR-041 |
| **US-011** | **As a** brand founder (Priya),<br>**I want to** view a clear informational message if no matching creators are currently available,<br>**so that** I know I need to adjust criteria rather than encountering an error. | **MUST-HAVE** | FEAT-020<br>FR-043 |
| **US-012** | **As a** brand manager (Daniel),<br>**I want to** view a Profile Insight summary of a creator's audience and content alignment,<br>**so that** I can evaluate candidates rapidly without auditing their entire past post history. | **SHOULD-HAVE** | FEAT-023<br>FR-046 |
| **US-013** | **As a** brand founder (Priya),<br>**I want to** inspect observational trust signals (engagement patterns, profile completeness, anomaly notes) for a creator,<br>**so that** I can make a well-informed vetting decision. | **MUST-HAVE** | FEAT-030<br>FR-050 |
| **US-014** | **As a** brand manager (Daniel),<br>**I want to** see clear disclaimers that trust signals are observational evidence and not fraud guarantees,<br>**so that** I maintain realistic expectations and apply human judgment to the data. | **MUST-HAVE** | FEAT-032<br>FR-052 |
| **US-015** | **As a** brand manager (Daniel),<br>**I want to** manually filter and browse creator profiles by category and audience size,<br>**so that** I can explore potential collaborators outside algorithmic matching. | **SHOULD-HAVE** | FEAT-022<br>FR-045 |
| **US-016** | **As a** brand founder (Priya),<br>**I want to** review submitted creator applications alongside match explanations and trust signals,<br>**so that** I have all decision-making context in one place. | **MUST-HAVE** | FEAT-041<br>FR-062 |
| **US-017** | **As a** brand manager (Daniel),<br>**I want to** approve or decline creator applications with a single click,<br>**so that** I make the final human decision on who we work with. | **MUST-HAVE** | FEAT-041<br>FR-063 |

### Collaboration & Management

| ID | User Story | Priority | Trace |
|---|---|:---:|---|
| **US-018** | **As a** brand founder (Priya),<br>**I want to** track active collaborations across milestone states (Invited, Accepted, In Progress, Completed),<br>**so that** I know the status of all deliverables without managing a spreadsheet. | **MUST-HAVE** | FEAT-042<br>FR-065 |
| **US-019** | **As a** brand manager (Daniel),<br>**I want to** exchange messages with an approved creator inside the collaboration thread,<br>**so that** project communication is centralized alongside the brief and deliverables. | **SHOULD-HAVE** | FEAT-043<br>FR-066 |
| **US-020** | **As a** brand founder (Priya),<br>**I want to** mark a collaboration as completed once deliverables are verified,<br>**so that** our collaboration history is recorded and the campaign can close. | **MUST-HAVE** | FEAT-044<br>FR-068 |

---

## 3. Creator User Stories (Maya Torres & Jordan Ellis)

### Profile Setup & Discovery

| ID | User Story | Priority | Trace |
|---|---|:---:|---|
| **US-021** | **As an** emerging creator (Maya),<br>**I want to** register an account with creator role,<br>**so that** I can access brand collaboration opportunities. | **MUST-HAVE** | FEAT-001<br>FR-001<br>AC-001.1 |
| **US-022** | **As an** emerging creator (Maya),<br>**I want to** set up my creator profile with niche, connected channels, audience estimate, and content style,<br>**so that** relevant brands can find and match with me. | **MUST-HAVE** | FEAT-004<br>FR-013 |
| **US-023** | **As a** mid-tier creator (Jordan),<br>**I want to** update my profile and collaboration preferences as my content evolves,<br>**so that** brands only approach me with opportunities matching my current focus. | **MUST-HAVE** | FEAT-004<br>FR-014 |
| **US-024** | **As an** emerging creator (Maya),<br>**I want to** see a profile completeness indicator with tips on missing information,<br>**so that** I can optimize my profile to receive better match recommendations. | **SHOULD-HAVE** | FEAT-004<br>FR-015 |
| **US-025** | **As an** emerging creator (Maya),<br>**I want to** browse a marketplace feed of active brand campaigns,<br>**so that** I can proactively find sponsorship opportunities instead of waiting for inbound DMs. | **MUST-HAVE** | FEAT-014<br>FR-028 |
| **US-026** | **As a** mid-tier creator (Jordan),<br>**I want to** filter active campaigns by product category, deliverable type, and budget,<br>**so that** I can immediately isolate campaigns that fit my rate and style. | **SHOULD-HAVE** | FEAT-017<br>FR-032 |
| **US-027** | **As an** emerging creator (Maya),<br>**I want to** view complete campaign details including deliverables, deadlines, and brand requirements,<br>**so that** I can evaluate whether I can fulfill the expectations before applying. | **MUST-HAVE** | FEAT-015<br>FR-029 |
| **US-028** | **As an** emerging creator (Maya),<br>**I want to** see why a campaign was flagged as a match for my profile,<br>**so that** I understand the brand's alignment with my audience. | **SHOULD-HAVE** | FEAT-021<br>FR-044 |

### Evaluating Brands & Applying

| ID | User Story | Priority | Trace |
|---|---|:---:|---|
| **US-029** | **As an** emerging creator (Maya),<br>**I want to** view a brand's profile and background details before applying,<br>**so that** I can ensure the brand is legitimate and trustworthy. | **MUST-HAVE** | FEAT-003<br>FR-012 |
| **US-030** | **As a** mid-tier creator (Jordan),<br>**I want to** inspect brand trust indicators (account age, profile completeness, completed collaborations),<br>**so that** I don't waste time working with unverified or unreliable sponsors. | **SHOULD-HAVE** | FEAT-031<br>FR-054 |
| **US-031** | **As an** emerging creator (Maya),<br>**I want to** submit an application with an optional pitch note to an active campaign,<br>**so that** I can express my enthusiasm and specific content ideas. | **MUST-HAVE** | FEAT-040<br>FR-060 |
| **US-032** | **As an** emerging creator (Maya),<br>**I want** the system to prevent accidental duplicate applications to the same campaign,<br>**so that** my submission history remains clean and professional. | **MUST-HAVE** | FEAT-040<br>FR-061 |
| **US-033** | **As an** emerging creator (Maya),<br>**I want to** view the status of my submitted applications (Pending, Accepted, Declined),<br>**so that** I know where each opportunity stands. | **MUST-HAVE** | FEAT-051<br>FR-071<br>AC-051.1 |

### Collaboration Delivery

| ID | User Story | Priority | Trace |
|---|---|:---:|---|
| **US-034** | **As a** mid-tier creator (Jordan),<br>**I want to** receive notification and see a collaboration created when a brand accepts my application,<br>**so that** I know our partnership is confirmed and work can begin. | **MUST-HAVE** | FEAT-041<br>FR-064<br>AC-041.4 |
| **US-035** | **As an** emerging creator (Maya),<br>**I want to** view collaboration milestone states and due dates,<br>**so that** I stay on schedule and fulfill all contracted deliverables. | **MUST-HAVE** | FEAT-042<br>FR-065<br>AC-042.1 |
| **US-036** | **As a** mid-tier creator (Jordan),<br>**I want to** communicate directly with the brand point-of-contact within the collaboration thread,<br>**so that** requirements questions and draft reviews are documented in one place. | **SHOULD-HAVE** | FEAT-043<br>FR-066<br>AC-043.1 |
| **US-037** | **As an** emerging creator (Maya),<br>**I want to** submit links to my published content deliverables for brand review,<br>**so that** the brand can verify completion. | **MUST-HAVE** | FEAT-044<br>FR-067<br>AC-044.2 |
| **US-038** | **As a** mid-tier creator (Jordan),<br>**I want** completed collaborations logged in my collaboration history,<br>**so that** my track record on the platform grows over time. | **MUST-HAVE** | FEAT-044<br>FR-068<br>AC-044.1 |

---

## 4. Cross-Cutting & Governance Stories

### Security, Auth & Navigation

| ID | User Story | Priority | Trace |
|---|---|:---:|---|
| **US-039** | **As a** registered user (any),<br>**I want to** log in securely with my email and password,<br>**so that** I can access my private dashboard and records. | **MUST-HAVE** | FEAT-002<br>FR-003 |
| **US-040** | **As a** registered user (any),<br>**I want** clear and generic error feedback when login credentials fail,<br>**so that** unauthorized individuals cannot probe for registered user emails. | **MUST-HAVE** | FEAT-002<br>FR-004 |
| **US-041** | **As a** registered user (any),<br>**I want to** log out from the application navigation,<br>**so that** my session is terminated securely on shared computers. | **MUST-HAVE** | FEAT-002<br>FR-005 |
| **US-042** | **As a** registered user (any),<br>**I want to** request a secure password reset link sent to my email,<br>**so that** I can regain access if I forget my password. | **SHOULD-HAVE** | FEAT-005<br>FR-007 |
| **US-043** | **As a** registered user (any),<br>**I want** the system to enforce role-based access control,<br>**so that** brand-specific management pages are inaccessible to creators and vice-versa. | **MUST-HAVE** | FEAT-002<br>FR-006 |
| **US-044** | **As a** brand user,<br>**I want** a dedicated Brand Dashboard displaying active campaigns, incoming applications, and collaborations,<br>**so that** I have an immediate high-level view of my workload. | **SHOULD-HAVE** | FEAT-050<br>FR-070 |
| **US-045** | **As a** creator user,<br>**I want** a dedicated Creator Dashboard displaying matched opportunities, pending applications, and active collaborations,<br>**so that** I can manage my partnership pipeline at a glance. | **SHOULD-HAVE** | FEAT-051<br>FR-071 |
| **US-046** | **As a** user (any),<br>**I want** role-aware navigation that only shows menus relevant to my account type,<br>**so that** my interface is clean and uncluttered. | **MUST-HAVE** | FEAT-052<br>FR-072 |
| **US-047** | **As a** brand manager (Daniel),<br>**I want** the system to never send automated outreach messages or invitations to creators on my behalf,<br>**so that** our brand maintains complete control over communications. | **MUST-HAVE** | FEAT-020<br>FR-048 |
| **US-048** | **As a** user (any),<br>**I want** all sensitive data transmitted over encrypted TLS connections,<br>**so that** my credentials and business details are protected in transit. | **MUST-HAVE** | FEAT-002<br>NFR-013 |
| **US-049** | **As a** user (any),<br>**I want** responsive interfaces that function cleanly on mobile and desktop viewports,<br>**so that** I can check campaign updates from any device. | **MUST-HAVE** | FEAT-052<br>NFR-030 |
| **US-050** | **As a** user (any),<br>**I want** helpful empty states with guidance when viewing empty dashboards or search lists,<br>**so that** I understand what step to take next. | **SHOULD-HAVE** | FEAT-050<br>FR-076 |

---

## 5. Traceability Summary

All 50 user stories map directly to personas and technical specifications:
* **Brand Stories:** `US-001` – `US-020` (Priya Sharma & Daniel Okafor)
* **Creator Stories:** `US-021` – `US-038` (Maya Torres & Jordan Ellis)
* **Cross-Cutting Stories:** `US-039` – `US-050` (Platform Security & Usability)
* Every story links to functional requirements in [`functional-requirements.md`](./functional-requirements.md) and to testable criteria — either acceptance criteria in [`acceptance-criteria.md`](./acceptance-criteria.md) or non-functional requirements in [`non-functional-requirements.md`](./non-functional-requirements.md).

---

## 6. Related Documents

| Document | Purpose |
|---|---|
| [`personas.md`](../01-product/personas.md) | Persona profiles and behavioral motivations |
| [`user-journeys.md`](../01-product/user-journeys.md) | Step-by-step user journey maps |
| [`functional-requirements.md`](./functional-requirements.md) | Behavioral engineering requirements (`FR-XXX`) |
| [`acceptance-criteria.md`](./acceptance-criteria.md) | Testable acceptance criteria index (`AC-XXX`) |
| [`non-functional-requirements.md`](./non-functional-requirements.md) | Performance, security, and AI guardrails (`NFR-XXX`) |
