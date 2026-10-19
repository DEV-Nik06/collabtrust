# CollabTrust — System Architecture

> **Status:** Draft (Proposed)
> **Phase:** Phase C — Architecture
> **Depends on:** [`PRD.md`](../01-product/PRD.md), [`mvp-scope.md`](../01-product/mvp-scope.md), [`feature-requirements.md`](../01-product/feature-requirements.md)
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)

> [!WARNING]
> The technology stack described here is **directional, not confirmed**. Final decisions will be recorded in Architecture Decision Records under `docs/03-architecture/ADR/`. Do not treat proposed choices as approved until ADRs are accepted.

---

## 1. Architecture Overview

CollabTrust uses a **monolithic, layered architecture** for the MVP. There are two deployable units:

1. **Web Application** — A single-page application (SPA) serving the brand and creator user interfaces.
2. **API Server** — A REST API handling business logic, data access, and AI agent orchestration.

Both connect to a single **PostgreSQL database** and make outbound calls to an **LLM API** for AI agent functionality.

```
┌───────────────────────────────────────────────────────┐
│                    Client (Browser)                    │
│              React + TypeScript + Tailwind             │
└──────────────────────┬────────────────────────────────┘
                       │ HTTPS / REST
┌──────────────────────▼────────────────────────────────┐
│                     API Server                         │
│            Node.js + Express + TypeScript               │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐    │
│  │  Routes   │  │ Services │  │   AI Agent Layer  │    │
│  │ (REST API)│→ │ (Business│→ │ (LLM orchestration│    │
│  │          │  │  Logic)  │  │  + prompt mgmt)   │    │
│  └──────────┘  └────┬─────┘  └────────┬──────────┘    │
│                     │                 │                │
│              ┌──────▼─────┐   ┌───────▼──────────┐    │
│              │ Data Access │   │  LLM API Client  │    │
│              │  (Prisma)   │   │  (HTTP calls)    │    │
│              └──────┬──────┘   └───────┬──────────┘    │
└─────────────────────┼─────────────────┼───────────────┘
                      │                 │
               ┌──────▼──────┐  ┌───────▼──────────┐
               │  PostgreSQL  │  │   LLM Provider   │
               │  Database    │  │   (External API)  │
               └─────────────┘  └──────────────────┘
```

---

## 2. Component Description

### 2.1 Web Application (Frontend)

| Property | Value |
|---|---|
| Framework | React 18+ with TypeScript |
| Styling | Tailwind CSS |
| State management | TBD — React context or lightweight library (proposal) |
| Routing | React Router (proposal) |
| API communication | Fetch or Axios to REST API |
| Authentication | JWT stored in httpOnly cookie or Authorization header (TBD — see [ADR-003](./ADR/ADR-003-authentication.md)) |

**Responsibilities:**
- Render brand and creator user interfaces (role-based views).
- Handle user input for registration, profiles, campaigns, and applications.
- Display AI agent outputs (campaign briefs, match results, trust signals).
- Manage client-side routing and form validation.

**Does NOT:**
- Call LLM APIs directly (all AI goes through the API server).
- Access the database directly.

### 2.2 API Server (Backend)

| Property | Value |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js with TypeScript |
| API style | REST with JSON request/response bodies |
| API documentation | OpenAPI / Swagger (proposal) |
| ORM | Prisma |
| Authentication | JWT issuance and verification (proposal) |

**Internal Layers:**

1. **Routes Layer** — Defines REST endpoints, validates request parameters, enforces authentication/authorization.
2. **Service Layer** — Contains business logic. Orchestrates data operations and AI agent calls.
3. **AI Agent Layer** — Manages agent prompts, LLM API calls, response parsing, and structured output validation.
4. **Data Access Layer** — Prisma client operations for database reads/writes.

**Responsibilities:**
- Enforce authentication and role-based authorization.
- Implement all business logic (campaign lifecycle, matching, collaboration workflow).
- Orchestrate AI agent calls and parse structured responses.
- Validate inputs and sanitize outputs.
- Serve data to the frontend via REST API.

### 2.3 Database

| Property | Value |
|---|---|
| Engine | PostgreSQL 15+ |
| ORM | Prisma |
| Migrations | Prisma Migrate |

Single relational database. Schema design in [database-design.md](./database-design.md).

### 2.4 AI Agent Layer

The AI Agent Layer is part of the API server (not a separate service). It handles:

- Prompt construction for each agent (Campaign Brief, Creator Matching, Trust Analysis, Profile Insight).
- LLM API calls (HTTP requests to external provider).
- Response parsing and structured output extraction.
- Error handling and fallback behavior.
- Evaluation hooks (for future quality measurement).

See [docs/04-ai/ai-architecture.md](../04-ai/ai-architecture.md) for detailed AI specifications.

### 2.5 External Dependencies

| Dependency | Purpose | Status |
|---|---|---|
| LLM API provider | Powers AI agents | Provider TBD (see [ADR-004](./ADR/ADR-004-ai-architecture.md)) |
| Email service | Password reset, notifications (if SHOULD-HAVE features are included) | Provider TBD; may be deferred |
| Deployment platform | Hosting web app and API | TBD (see [ADR-005](./ADR/ADR-005-deployment.md)) |

---

## 3. API Design Summary

Full API design is in [api-design.md](./api-design.md). Key characteristics:

- **Style:** REST with JSON.
- **Authentication:** Bearer JWT in Authorization header (proposed).
- **Versioning:** `/api/v1/` prefix (proposed).
- **Error format:** Consistent JSON error responses with error code, message, and details.
- **Documentation:** OpenAPI/Swagger specification generated from route definitions.

### Resource Summary

| Resource | Key Endpoints | Auth Required |
|---|---|---|
| `/api/v1/auth` | POST register, POST login, POST reset-password | No (public) |
| `/api/v1/users/me` | GET/PUT profile | Yes |
| `/api/v1/campaigns` | GET list, POST create, GET/:id, PUT/:id, POST/:id/publish | Yes (brand) |
| `/api/v1/campaigns/:id/matches` | GET matched creators | Yes (brand) |
| `/api/v1/campaigns/:id/applications` | GET/POST applications | Yes |
| `/api/v1/creators` | GET list, GET/:id | Yes |
| `/api/v1/creators/:id/trust-signals` | GET trust analysis | Yes (brand) |
| `/api/v1/creators/:id/insights` | GET profile insights | Yes (brand) |
| `/api/v1/collaborations` | GET list, POST create, PUT/:id/status | Yes |
| `/api/v1/collaborations/:id/messages` | GET/POST messages | Yes |

---

## 4. Security Architecture Summary

Full security design is in [security-design.md](./security-design.md). Key decisions:

- **Authentication:** JWT-based (proposed). Passwords hashed with bcrypt.
- **Authorization:** Role-based (brand, creator). Middleware checks on protected routes.
- **Data protection:** HTTPS in transit. Sensitive fields encrypted at rest (if needed). No PII beyond required fields.
- **Input validation:** All inputs validated on the API layer. SQL injection prevented by Prisma parameterized queries.
- **Secrets management:** No secrets in code. Environment variables via `.env` files (`.env.example` as ledger).
- **AI safety:** Agent outputs validated before display. Trust analysis includes mandatory limitations disclosure. No autonomous high-impact actions.

---

## 5. Deployment Architecture (MVP)

| Component | Deployment Target | Notes |
|---|---|---|
| Web app | Static hosting or containerized | Single build artifact |
| API server | PaaS or containerized | Single process |
| Database | Managed PostgreSQL | Single instance |
| LLM API | External SaaS | No self-hosted models for MVP |

Deployment platform is TBD. Options under consideration: Railway, Render, Fly.io, or similar PaaS.

No Kubernetes, no microservices, no message queues, no CDN for MVP.

See [docs/07-deployment/deployment-guide.md](../07-deployment/deployment-guide.md) for deployment details.

---

## 6. Explicitly Not Included in MVP Architecture

| Component | Reason |
|---|---|
| Microservices | Unnecessary complexity for MVP |
| Message queues / event buses | Synchronous request-response is sufficient |
| Container orchestration (K8s) | Single-container deployment is sufficient |
| CDN / edge caching | Not needed at MVP scale |
| WebSocket connections | Unless basic messaging requires it |
| Background job processor | Unless async AI calls require it (evaluate during implementation) |
| Worker service | Deferred — `apps/worker/` is planned but not required for MVP |

---

## 7. Open Architecture Decisions

| # | Decision | Status | ADR |
|---|---|---|---|
| 1 | Technology stack confirmation | Proposed | [ADR-001](./ADR/ADR-001-stack.md) |
| 2 | Database engine confirmation | Proposed | [ADR-002](./ADR/ADR-002-database.md) |
| 3 | Authentication mechanism | Proposed (JWT) | [ADR-003](./ADR/ADR-003-authentication.md) |
| 4 | AI architecture and LLM provider | Proposed | [ADR-004](./ADR/ADR-004-ai-architecture.md) |
| 5 | Deployment platform | Pending | [ADR-005](./ADR/ADR-005-deployment.md) |
| 6 | Frontend state management | Open | — |
| 7 | API versioning strategy | Proposed (/api/v1/) | — |
| 8 | Background job processing (if needed) | Open | — |

---

## 8. Related Documents

| Document | Purpose |
|---|---|
| [`database-design.md`](./database-design.md) | Database schema and entity relationships |
| [`api-design.md`](./api-design.md) | REST API endpoint specifications |
| [`security-design.md`](./security-design.md) | Security architecture and controls |
| [`ADR/`](./ADR/) | Architecture Decision Records |
| [`docs/04-ai/ai-architecture.md`](../04-ai/ai-architecture.md) | AI agent architecture |
| [`docs/01-product/mvp-scope.md`](../01-product/mvp-scope.md) | MVP scope and technical constraints |
| [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) | Master handoff document |
