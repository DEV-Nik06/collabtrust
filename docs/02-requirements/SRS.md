# CollabTrust — Software Requirements Specification (SRS)

> **Status:** Draft  
> **Phase:** Phase B — Engineering Requirements  
> **Depends on:** [`PRD.md`](../01-product/PRD.md), [`feature-requirements.md`](../01-product/feature-requirements.md), [`mvp-scope.md`](../01-product/mvp-scope.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the formal engineering baseline for CollabTrust. It synthesizes the product definition ([`PRD.md`](../01-product/PRD.md)), functional requirements ([`functional-requirements.md`](./functional-requirements.md)), and quality attributes ([`non-functional-requirements.md`](./non-functional-requirements.md)) into an integrated technical contract for the MVP.

### 1.2 Scope
CollabTrust is an AI-assisted marketplace connecting brands and creators of different sizes and stages, with an initial focus on small/growing brands and emerging/micro creators. The platform automates campaign structuring, creator discovery with explainable matching, trust signal summarization, and lightweight collaboration management.

**In Scope for MVP:**
* User authentication and role-based access control (`brand`, `creator`).
* Brand and creator profile management with completeness scoring.
* Campaign brief drafting via Campaign Brief Agent and manual editing.
* AI-driven creator matching with explicit reasoning strings.
* Observational trust signal summaries with mandatory limitation disclosures.
* Creator applications and brand selection workflows.
* Milestone-based collaboration state tracking and communication.
* Role-specific dashboards and navigation.

**Explicitly Out of Scope:**
* Autonomous outreach, autonomous payments, and autonomous dispute resolution.
* Guaranteed fraud detection or definitive authenticity claims.
* Native mobile applications and multi-platform social media API scrapers.
* Payment gateway integrations and escrow processing.

### 1.3 Definitions & Acronyms
* **FR:** Functional Requirement.
* **NFR:** Non-Functional Requirement.
* **US:** User Story.
* **AC:** Acceptance Criteria.
* **LLM:** Large Language Model.
* **RBAC:** Role-Based Access Control.
* **Trust Signal:** An observational, evidence-backed data point concerning account history, audience patterns, or completeness; never a fraud verdict.

---

## 2. Overall Description

### 2.1 System Overview
CollabTrust operates as a two-sided marketplace architecture supported by an asynchronous/synchronous AI orchestration layer.

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Web App                         │
│             React / TypeScript / Tailwind CSS               │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST (JSON)
┌──────────────────────────────▼──────────────────────────────┐
│                      Express API Server                      │
│             (Authentication, RBAC, Services, ORM)           │
├──────────────────────────────┬──────────────────────────────┤
│       Data Access Layer      │      AI Orchestration Layer   │
│         (Prisma ORM)         │   (Prompt Templates, LLM SDK)│
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
        ┌──────▼──────┐                ┌──────▼──────┐
        │ PostgreSQL  │                │ External LLM│
        │  Database   │                │   API Host  │
        └─────────────┘                └─────────────┘
```

### 2.2 User Classes & Characteristics
1. **Brand User (Primary Persona: Priya Sharma / Daniel Okafor):**
   * Small business owners or lean marketing managers with limited time and budget.
   * Requires intuitive campaign creation without agency jargon.
   * Demands clear explanations for creator recommendations and transparent trust evidence.
2. **Creator User (Primary Persona: Maya Torres / Jordan Ellis):**
   * Emerging and micro content creators looking for legitimate brand partnerships.
   * Requires proactive campaign discovery and clear brief requirements.
   * Relies on brand legitimacy signals to avoid scams and non-payment.
3. **Platform Administrator:**
   * Internal maintenance user overseeing marketplace health and safety (basic view for MVP).

### 2.3 Operating Environment
* **Server Runtime:** Node.js 18+ LTS on Linux container.
* **Database Engine:** PostgreSQL 15+.
* **Client Environment:** Modern evergreen browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile viewports.
* **External AI Engine:** Hosted LLM REST API (e.g., Anthropic Claude, OpenAI, or Google Gemini API).

---

## 3. Requirements Overview & Traceability

### 3.1 Functional Requirements Summary
The system specifies **62 Functional Requirements** detailed in [`functional-requirements.md`](./functional-requirements.md):
* **Authentication & User Management:** `FR-001` – `FR-008` (6 MUST-HAVE, 2 SHOULD-HAVE)
* **Profile Management:** `FR-010` – `FR-018` (7 MUST-HAVE, 2 SHOULD-HAVE)
* **Campaign Lifecycle & Structuring:** `FR-020` – `FR-032` (9 MUST-HAVE, 4 SHOULD-HAVE)
* **Creator Discovery & Matching:** `FR-040` – `FR-048` (6 MUST-HAVE, 3 SHOULD-HAVE)
* **Trust Analysis & Signal Governance:** `FR-050` – `FR-056` (5 MUST-HAVE, 2 SHOULD-HAVE)
* **Collaboration Workflow:** `FR-060` – `FR-068` (7 MUST-HAVE, 2 SHOULD-HAVE)
* **Dashboard & Navigation:** `FR-070` – `FR-076` (4 MUST-HAVE, 3 SHOULD-HAVE)

### 3.2 Non-Functional Requirements Summary
The system specifies **52 Non-Functional Requirements** detailed in [`non-functional-requirements.md`](./non-functional-requirements.md):
* **Performance:** `NFR-001`–`NFR-006` (Page load `< 3.0s`, API `< 500ms`, AI response `< 30s`).
* **Security:** `NFR-010`–`NFR-018` (bcrypt >= 12 rounds, RBAC on 100% private endpoints, TLS 1.2+, zero hardcoded secrets).
* **Reliability:** `NFR-020`–`NFR-025` (95% MVP uptime, deterministic AI fallbacks, daily backups).
* **Usability:** `NFR-030`–`NFR-035` (Responsive 375px–1920px, WCAG 2.1 AA baseline, role-based UI separation).
* **Scalability:** `NFR-040`–`NFR-044` (Stateless backend, >= 50 concurrent active users).
* **Maintainability:** `NFR-050`–`NFR-055` (TypeScript strict mode, OpenAPI 3.0 sync, unit/integration testing).
* **Data Integrity:** `NFR-060`–`NFR-065` (PostgreSQL ACID, Prisma migrations, zero financial data stored).
* **AI Guardrails:** `NFR-070`–`NFR-077` (Structured schema validation, mandatory explainability, mandatory disclaimers, no autonomous outreach/payments).

---

## 4. External Interface Requirements

### 4.1 User Interfaces
* Clean, modular, responsive single-page web app built with Tailwind CSS.
* Dedicated Brand Console (campaign creation, matches review, application decisions, active collaborations).
* Dedicated Creator Console (marketplace feed, active applications, collaboration milestones).

### 4.2 Hardware & Network Interfaces
* Standard TCP/IP over HTTPS (Port 443).
* Local development environment requires Node.js 18+ and PostgreSQL connection string.

### 4.3 Software Interfaces
* **Database:** PostgreSQL accessed via Prisma Client ORM over secure connection pool.
* **LLM Service:** External HTTPS REST client executing structured JSON prompt interactions with exponential backoff retry.
* **Email Mailer:** Standard SMTP/Transactional API client for password resets (stubbable in development).

---

## 5. System Constraints & Assumptions

### 5.1 Technical Constraints
1. **Monolithic Architecture:** Frontend and backend kept in a modular workspace; microservices and event buses are prohibited for MVP.
2. **Stateless API:** All user session state managed via signed tokens or secure cookies; backend instances remain interchangeable.
3. **Budget & Rate Limits:** LLM inference costs must be managed via caching of matches and prompt token budgeting.

### 5.2 Assumptions & Dependencies
1. Self-reported creator profile data is sufficient for initial heuristic and LLM matching.
2. Users accept AI-generated campaign briefs as drafts requiring human review.
3. External LLM APIs maintain availability within the 95% target SLA.

---

## 6. Open Engineering Issues & Decisions

| Issue ID | Topic | Status | Impact Area | Proposed Direction |
|---|---|:---:|---|---|
| **ISSUE-01** | Token storage mechanism | Proposed | Auth / Security | httpOnly secure cookie with CSRF protection (see ADR-003). |
| **ISSUE-02** | LLM API Provider | Proposed | AI Orchestration | Evaluate Anthropic Claude 3.5 Sonnet vs. OpenAI GPT-4o-mini for cost/latency. |
| **ISSUE-03** | Cloud Hosting Target | Proposed | Deployment | Single container PaaS (Railway, Render, or Fly.io) with managed PostgreSQL. |

---

## 7. Related Documents

| Document | Purpose |
|---|---|
| [`PRD.md`](../01-product/PRD.md) | Product Requirements Document |
| [`functional-requirements.md`](./functional-requirements.md) | Granular functional specifications (`FR-001`–`FR-076`) |
| [`non-functional-requirements.md`](./non-functional-requirements.md) | Quality attributes and constraints (`NFR-001`–`NFR-077`) |
| [`user-stories.md`](./user-stories.md) | User persona narrative stories (`US-001`–`US-050`) |
| [`acceptance-criteria.md`](./acceptance-criteria.md) | Acceptance criteria traceability index |
