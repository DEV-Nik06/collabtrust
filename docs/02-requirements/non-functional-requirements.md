# CollabTrust — Non-Functional Requirements

> **Status:** Draft  
> **Phase:** Phase 3 — Requirements  
> **Depends on:** [`product-vision.md`](../01-product/product-vision.md), [`mvp-scope.md`](../01-product/mvp-scope.md), [`feature-requirements.md`](../01-product/feature-requirements.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview & Objectives

This document specifies the Non-Functional Requirements (NFRs) for the CollabTrust platform, establishing technical constraints, quality attributes, and operational standards. 

In alignment with the [Product Vision](../01-product/product-vision.md) and [MVP Scope](../01-product/mvp-scope.md), CollabTrust is an AI-assisted marketplace where humans retain control over critical decisions. Trust analysis surfaces observational signals rather than fraud guarantees, and AI workflows assist rather than act autonomously.

### Scope & Phase Context
* **Current Phase:** Phase 3 — Requirements (MVP Definition).
* **Target Environment:** Development, local testing, and single-instance cloud deployment for MVP validation. Production-scale high availability, distributed caching, and multi-region resilience are explicitly deferred post-MVP.
* **Traceability:** Requirements map to product principles in [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) and technical directions established in [PROJECT_CONTEXT.md §7 (Proposed Technical Direction)](../../PROJECT_CONTEXT.md#7-proposed-technical-direction).

### Convention & Priority Definitions
* **Requirement ID Format:** `NFR-XXX` (stable sequential identifier).
* **Priority (MoSCoW):**
  * `MUST-HAVE`: Essential for MVP delivery and core loop validation.
  * `SHOULD-HAVE`: Strongly recommended; omitted only if extreme timeline constraints arise.
  * `NICE-TO-HAVE`: Valuable optimization, deferred to post-MVP if necessary.
* **Decision Status:**
  * `Confirmed`: Agreed architectural decision backed by project constraints.
  * `Proposed`: Engineering target subject to benchmarking and architectural confirmation (ADR).

---

## 2. NFR Summary by Category

| Category | ID Range | Total Requirements | MUST-HAVE | SHOULD-HAVE | NICE-TO-HAVE |
|---|:---:|:---:|:---:|:---:|:---:|
| 1. Performance | NFR-001 – NFR-006 | 6 | 4 | 2 | 0 |
| 2. Security | NFR-010 – NFR-018 | 9 | 8 | 1 | 0 |
| 3. Reliability & Availability | NFR-020 – NFR-025 | 6 | 5 | 1 | 0 |
| 4. Usability & Accessibility | NFR-030 – NFR-035 | 6 | 4 | 2 | 0 |
| 5. Scalability & Architecture | NFR-040 – NFR-044 | 5 | 3 | 2 | 0 |
| 6. Maintainability & Code Quality | NFR-050 – NFR-055 | 6 | 5 | 1 | 0 |
| 7. Data Integrity & Privacy | NFR-060 – NFR-065 | 6 | 5 | 1 | 0 |
| 8. AI-Specific Guardrails & Controls | NFR-070 – NFR-077 | 8 | 8 | 0 | 0 |
| **Total** | | **52** | **42** | **10** | **0** |

---

## 3. Requirement Specifications

### 3.1 Performance Requirements

CollabTrust MVP prioritizes responsiveness for interactive flows while establishing realistic boundaries for LLM inference times. High-throughput distributed scaling is not an MVP requirement.

| ID | Specification ("The system shall...") | Priority | Target Metric | Status | Notes / Rationale |
|---|---|:---:|---|:---:|---|
| **NFR-001** | The system shall complete initial page load and render above-the-fold content within target time on standard broadband connections (>= 15 Mbps). | **MUST-HAVE** | `< 3.0 seconds` initial load; `< 1.0 second` client-side route change | Proposed | Ensures seamless user onboarding for both brands and creators without heavy asset overhead. |
| **NFR-002** | The backend API shall respond to standard non-AI CRUD requests within target latency under normal operating conditions. | **MUST-HAVE** | `< 500 ms` at p95 percentile | Proposed | Applies to authentication, profile updates, campaign listings, and status updates. |
| **NFR-003** | The system shall complete AI agent LLM invocations and deliver structured responses within acceptable interactive waiting bounds. | **MUST-HAVE** | `< 30.0 seconds` at p95; `< 15.0 seconds` target median | Proposed | Applies to Campaign Brief Agent, Creator Matching Agent, and Trust Analysis Agent. |
| **NFR-004** | The system shall render an active visual loading indicator and informative progress message whenever an operation exceeds 1.0 second. | **MUST-HAVE** | Latency trigger: `> 1.0 second` | Confirmed | Crucial during LLM inference to prevent user frustration or duplicate submissions. |
| **NFR-005** | The web application shall maintain a lightweight client-side memory footprint to prevent browser tab sluggishness. | **SHOULD-HAVE** | `< 150 MB` browser memory heap | Proposed | Prevents browser tab crashes on low-resource laptops used by emerging creators. |
| **NFR-006** | The system shall limit search and filtering query execution times against the database to sub-second thresholds. | **SHOULD-HAVE** | `< 250 ms` query execution | Proposed | Applies to creator directory filtering and campaign browsing queries. |

---

### 3.2 Security Requirements

Security controls must guarantee identity verification, prevent data tampering between competing brands or creators, protect credentials, and eliminate injection vulnerabilities.

| ID | Specification ("The system shall...") | Priority | Target Metric | Status | Notes / Rationale |
|---|---|:---:|---|:---:|---|
| **NFR-010** | The system shall authenticate user identities using cryptographically secure tokens or session cookies with strict expiry. | **MUST-HAVE** | Token expiry: `15 minutes` (access token); `7 days` (refresh) | Confirmed | Session persistence per FEAT-002 and journey flows. Immediate revocation on logout/password change is enforced via short access-token TTL + server-side `tokenVersion` check (see ADR-003 amendment and [`security-design.md` §2.2](../03-architecture/security-design.md)). Configurable via `JWT_EXPIRY` / `JWT_REFRESH_EXPIRY` (see [`environment-configuration.md`](../07-deployment/environment-configuration.md)). |
| **NFR-011** | The system shall hash user passwords using modern adaptive one-way hashing algorithms prior to storage. | **MUST-HAVE** | `bcrypt` (salt rounds >= 12) or `argon2id` | Confirmed | Plaintext or reversible password storage is strictly forbidden. |
| **NFR-012** | The backend API shall enforce server-side Role-Based Access Control (RBAC) on every non-public endpoint. | **MUST-HAVE** | `100%` endpoints protected; zero privilege escalation | Confirmed | Brands cannot edit creator profiles; creators cannot edit campaigns or review unsubmitted brand briefs. |
| **NFR-013** | The system shall mandate Transport Layer Security (TLS/HTTPS) for all network traffic. | **MUST-HAVE** | TLS 1.2 minimum; TLS 1.3 preferred; HSTS enabled | Confirmed | Protects credentials and communication in transit across public networks. |
| **NFR-014** | The system shall validate and sanitize all inbound client payloads against strict backend schema definitions. | **MUST-HAVE** | Strict input schema validation (e.g., Zod); `100%` payload coverage | Confirmed | Blocks SQL injection, NoSQL injection, and Cross-Site Scripting (XSS) in free-text fields. |
| **NFR-015** | The system shall prohibit hardcoded secrets, API tokens, database connection strings, or LLM credentials in source code. | **MUST-HAVE** | `0` committed secrets; automated secret detection | Confirmed | Enforced via `.env` files, environment injection, and `.gitignore` governance. |
| **NFR-016** | The system shall immediately invalidate session tokens upon user logout or password change. | **MUST-HAVE** | Immediate revocation (`< 100 ms`) | Confirmed | Prevents replay attacks from shared devices or public computers. |
| **NFR-017** | The system shall suppress internal error stack traces, database schema definitions, and vendor logs in client API error responses. | **MUST-HAVE** | `0` raw stack traces exposed to client | Confirmed | Returns standardized error envelope `{ code, message, requestId, details }` (canonical shape defined in [`api-design.md` §2](../03-architecture/api-design.md)). |
| **NFR-018** | The system shall rate-limit public authentication endpoints to mitigate automated brute-force attacks. | **SHOULD-HAVE** | Max `5` failed attempts per IP / account per `15 minutes` | Proposed | Applied to `/api/v1/auth/login`, `/api/v1/auth/forgot-password`, and `/api/v1/auth/reset-password`. |

---

### 3.3 Reliability & Availability Requirements

The MVP represents an evaluative platform. A high-resilience 99.99% multi-cloud setup is unnecessary, but graceful error handling and AI fallback behavior are mandatory.

| ID | Specification ("The system shall...") | Priority | Target Metric | Status | Notes / Rationale |
|---|---|:---:|---|:---:|---|
| **NFR-020** | The platform shall maintain service availability during core MVP testing and demonstration windows. | **MUST-HAVE** | `95.0%` uptime for MVP stage | Proposed | Sufficient for hackathon demonstration and initial user testing cycles. |
| **NFR-021** | The system shall provide deterministic fallback pathways when upstream LLM APIs fail, time out, or exceed rate limits. | **MUST-HAVE** | `100%` agent endpoints possess fallback logic | Confirmed | Example: Fallback to manual campaign form if Campaign Brief Agent fails (AC-011.3). |
| **NFR-022** | The database system shall perform automated daily backups with verifiable point-in-time recovery. | **MUST-HAVE** | Recovery Point Objective (RPO) `< 24 hours`; Recovery Time Objective (RTO) `< 2 hours` | Proposed | Safeguards seed datasets, user profiles, and campaign history during testing. |
| **NFR-023** | The system shall capture structured server errors with operational context (correlation ID, timestamp, route) without logging PII. | **MUST-HAVE** | `100%` 5xx exceptions logged with Correlation ID | Confirmed | Enables rapid debugging without exposing sensitive creator or brand info in log drains. |
| **NFR-024** | The system shall retry transient upstream AI failures automatically before declaring request failure. | **MUST-HAVE** | `1-2` retries with exponential backoff (jitter) | Proposed | Mitigates transient network blips and momentary rate limiting from LLM providers. |
| **NFR-025** | The client application shall preserve user-entered form state in local memory during network disconnects or API errors. | **SHOULD-HAVE** | Zero unsaved draft loss during single session | Proposed | Prevents lost work if a brand writes a detailed campaign brief and submission fails. |

---

### 3.4 Usability & Accessibility Requirements

CollabTrust serves two distinct personas: small brand founders (e.g., Priya) with limited marketing expertise and emerging creators (e.g., Maya) entering their first formal collaborations.

| ID | Specification ("The system shall...") | Priority | Target Metric | Status | Notes / Rationale |
|---|---|:---:|---|:---:|---|
| **NFR-030** | The web interface shall deliver a fully responsive layout across desktop, tablet, and mobile screens. | **MUST-HAVE** | Supported viewports: `375px` to `1920px+` | Confirmed | Creators frequently manage campaigns via mobile browsers; brands prefer desktop. |
| **NFR-031** | The application shall adhere to baseline Web Content Accessibility Guidelines (WCAG). | **MUST-HAVE** | WCAG 2.1 Level AA conformance for contrast, semantic headings, and keyboard navigation | Proposed | Ensures inclusive access for all founders and creators. |
| **NFR-032** | The system shall display user-friendly, non-technical error messages accompanied by clear recovery actions. | **MUST-HAVE** | `100%` user-facing errors explain "what happened" and "what to do next" | Confirmed | Avoids cryptic technical errors (e.g., "500 Internal Error" replaced with actionable copy). |
| **NFR-033** | The interface shall provide role-tailored navigation hierarchies and dashboards based on user type. | **MUST-HAVE** | Strict UI separation: Brand view vs Creator view | Confirmed | Eliminates clutter; brands see campaign creation tools, creators see discovery tools. |
| **NFR-034** | The system shall display profile completeness progress indicators to guide onboarding users. | **SHOULD-HAVE** | Progress bar showing percentage complete + missing fields | Confirmed | Addresses FEAT-004 / AC-004.4 and helps improve matching data quality. |
| **NFR-035** | The application shall maintain visual styling consistency across all modules using design tokens and shared components. | **SHOULD-HAVE** | Tailwind CSS design system consistency | Confirmed | Shared typography, color palette, badges, buttons, and alert components. |

---

### 3.5 Scalability & Architectural Boundaries

The MVP architecture favors simplicity, low operational overhead, and rapid verification over complex distributed patterns.

| ID | Specification ("The system shall...") | Priority | Target Metric | Status | Notes / Rationale |
|---|---|:---:|---|:---:|---|
| **NFR-040** | The system architecture shall support concurrent active users sufficient for MVP validation on a single host instance. | **MUST-HAVE** | `>= 50` concurrent active sessions without latency degradation | Proposed | Adequate for user feedback cohorts, hackathon demos, and initial pilot users. |
| **NFR-041** | The backend API service shall remain completely stateless. | **MUST-HAVE** | Zero local server file-system state; session state externalized | Confirmed | Ensures future horizontal scaling behind a reverse proxy requires zero code rewrites. |
| **NFR-042** | The database schema shall implement relational indexes on all foreign keys, status flags, and search filters. | **MUST-HAVE** | Indexing on `campaign_status`, `creator_niche`, `user_role`, `brand_id` | Confirmed | Ensures performant queries as seed data and application volume expand. |
| **NFR-043** | The system shall defer distributed message brokers, Kafka queues, and Kubernetes orchestration until post-MVP. | **SHOULD-HAVE** | In-process or lightweight async job handling | Confirmed | Explicit boundary to eliminate premature architectural complexity. |
| **NFR-044** | The system shall defer multi-region database replication and CDN edge computing until production roadmap. | **SHOULD-HAVE** | Single-region database deployment (PostgreSQL) | Confirmed | Aligns with [mvp-scope.md §6](../01-product/mvp-scope.md#6-technical-scope-for-mvp). |

---

### 3.6 Maintainability & Code Quality Requirements

To sustain rapid development and seamless team handoffs across sessions, strict engineering hygiene is mandated.

| ID | Specification ("The system shall...") | Priority | Target Metric | Status | Notes / Rationale |
|---|---|:---:|---|:---:|---|
| **NFR-050** | The frontend, backend, and shared libraries shall use TypeScript with strict type checking enabled. | **MUST-HAVE** | `"strict": true` in `tsconfig.json`; zero unchecked `any` in core domains | Confirmed | Prevents runtime type errors and ensures clear interface contracts. |
| **NFR-051** | The codebase shall maintain a modular monorepo architecture with clean package boundaries. | **MUST-HAVE** | Monorepo layout matching `PROJECT_CONTEXT.md §8` | Confirmed | Clear separation between `apps/web`, `apps/api`, `packages/shared`, and `packages/ai`. |
| **NFR-052** | The API shall be documented via an OpenAPI / Swagger 3.0 specification kept in sync with code routes. | **MUST-HAVE** | `100%` public endpoints documented with request/response schemas | Confirmed | Enables frontend-backend contract validation and integration testing. |
| **NFR-053** | The codebase shall maintain automated test suites covering critical domain logic and API routes. | **MUST-HAVE** | Automated tests executed via Vitest and Supertest in CI | Confirmed | Verifies authentication, campaign lifecycle, matching parsers, and error paths. |
| **NFR-054** | The repository shall enforce automated linting and code formatting rules. | **MUST-HAVE** | Prettier and ESLint passing in CI without warnings | Confirmed | Guarantees code readability and consistent stylistic standards. |
| **NFR-055** | Major architectural decisions and technical trade-offs shall be recorded in Architecture Decision Records (ADRs). | **SHOULD-HAVE** | Formatted ADRs placed in `docs/03-architecture/ADR/` | Confirmed | Preserves decision rationale for authentication, database schema, and AI agent engine. |

---

### 3.7 Data Integrity & Privacy Requirements

CollabTrust handles creator profiles and brand campaign budgets. The system must collect only essential data and enforce relational integrity.

| ID | Specification ("The system shall...") | Priority | Target Metric | Status | Notes / Rationale |
|---|---|:---:|---|:---:|---|
| **NFR-060** | The database layer shall enforce referential integrity and ACID transactions for state transitions. | **MUST-HAVE** | PostgreSQL foreign keys, cascade rules, and Prisma transactions | Confirmed | Prevents orphaned applications, orphaned collaborations, or corrupted campaign states. |
| **NFR-061** | The system shall adhere to data minimization principles, collecting zero PII beyond operational necessities. | **MUST-HAVE** | Only email, account name/company, public handles, and self-reported metrics | Confirmed | Eliminates regulatory exposure (GDPR/CCPA); no personal phone numbers, physical addresses, or SSNs. |
| **NFR-062** | The application shall validate all incoming data models at boundary layers using strongly typed schemas. | **MUST-HAVE** | Zod validation on API inputs and LLM structured outputs | Confirmed | Guarantees corrupt or unexpected payloads are rejected before database persistence. |
| **NFR-063** | The database shall provide reproducible seed scripts for demo and automated testing environments. | **MUST-HAVE** | `prisma db seed` executable with realistic test personas | Confirmed | Populates Priya, Daniel, Maya, Jordan test fixtures consistently. |
| **NFR-064** | The system shall support user account deletion and associated data removal upon request. | **MUST-HAVE** | Soft or hard deletion completing within 1 business day | Proposed | Ensures compliance with user data removal requests. |
| **NFR-065** | The system shall prohibit logging or storing raw payment card details or banking credentials. | **SHOULD-HAVE** | `0` financial data collected; payment processing out of scope | Confirmed | Enforces boundary: payments are explicitly out of MVP scope ([mvp-scope.md §4](../01-product/mvp-scope.md#4-mvp-features---explicitly-out-of-scope)). |

---

### 3.8 AI-Specific Guardrails & Operational Requirements

Because AI agents assist in core workflows (brief structuring, matching, trust analysis), rigorous guardrails are established to maintain user agency, transparency, and safety.

| ID | Specification ("The system shall...") | Priority | Target Metric | Status | Notes / Rationale |
|---|---|:---:|---|:---:|---|
| **NFR-070** | All AI agent responses shall be strictly parsed and validated against deterministic JSON schemas. | **MUST-HAVE** | `100%` agent completions conform to typed Zod / JSON schemas | Confirmed | Eliminates unstructured markdown or conversational drift breaking the frontend UI. |
| **NFR-071** | Every AI creator match recommendation shall generate an understandable, human-readable rationale explaining the fit. | **MUST-HAVE** | `100%` matches include explicit fit reasons (niche, audience, content style) | Confirmed | Implements Core Principle 4 (Explainability) from [product-vision.md §6](../01-product/product-vision.md#6-core-product-principles). |
| **NFR-072** | The system shall mandate explicit human user confirmation for all critical marketplace actions. | **MUST-HAVE** | Zero autonomous campaign publishing or creator selection | Confirmed | Implements Core Principle 2 (AI-assisted, human-controlled). AI suggests; users decide. |
| **NFR-073** | All trust analysis outputs shall present observational signals and explicitly disclaim definitive authenticity or fraud guarantees. | **MUST-HAVE** | Prominent disclaimer displayed alongside `100%` trust score displays | Confirmed | Implements Core Principle 3 (Evidence over claims) and FEAT-032. |
| **NFR-074** | The system shall strictly prohibit autonomous payments, automated dispute adjudication, or autonomous mass messaging. | **MUST-HAVE** | `0` autonomous outbound outreach or financial transactions | Confirmed | Enforces product boundaries established in [product-vision.md §8](../01-product/product-vision.md#8-what-collabtrust-is-not). |
| **NFR-075** | LLM prompts, system instructions, and schema definitions shall be version-controlled in dedicated code modules. | **MUST-HAVE** | Prompts stored in `packages/ai/src/prompts/` | Confirmed | Prohibits inline string concatenation in API controllers; enables systematic prompt testing. |
| **NFR-076** | The system shall enforce token limits and timeout bounds per LLM call to control operational costs and latency. | **MUST-HAVE** | Max `2,000` output tokens; hard timeout of `30 seconds` per call | Confirmed | Prevents infinite inference loops and runaway API billing. |
| **NFR-077** | AI agents shall restrict contextual generation strictly to verified database records and user prompt inputs. | **MUST-HAVE** | Grounding instructions present in all agent system prompts | Confirmed | Prevents hallucination of creator follower counts, non-existent portfolios, or fake testimonials. |

---

## 4. Assumptions & Deferred Capabilities

### 4.1 Explicit Assumptions
1. **Self-Reported Data Adequacy:** During MVP, creator profile data (niche, audience size, sample links) is self-reported and sufficient for the Creator Matching Agent to generate meaningful recommendations. Social media platform API integrations are post-MVP.
2. **Third-Party LLM Reliability:** Upstream LLM providers (e.g., OpenAI, Anthropic) maintain adequate API availability. Fallback mechanisms (NFR-021) are designed to handle transient outages without crashing the application.
3. **English-Only Localization:** The MVP interface and AI agent prompts operate exclusively in English. Multi-language tokenization and internationalization are deferred.

### 4.2 Explicitly Deferred Capabilities (Post-MVP)
The following operational capabilities are documented as deferred to maintain a tight hackathon scope:
* **Horizontal Auto-Scaling & Container Orchestration:** Multi-container Kubernetes clusters and horizontal pod autoscalers.
* **Message Broker Infrastructure:** Kafka, RabbitMQ, or AWS SQS message buses.
* **Advanced Content Delivery Networks (CDNs):** Edge caching and multi-region asset replication.
* **Payment Gateway & Escrow Services:** Stripe/PayPal integration and financial compliance engines.
* **Automated Social Scraping / Multi-Platform OAuth:** Automated Instagram/TikTok token refresh and background metrics scraping.

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`product-vision.md`](../01-product/product-vision.md) | Mission, vision, core principles, and architectural boundaries |
| [`mvp-scope.md`](../01-product/mvp-scope.md) | MVP feature prioritization, scope boundaries, and constraints |
| [`feature-requirements.md`](../01-product/feature-requirements.md) | Functional feature descriptions and existing acceptance criteria |
| [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) | Master handoff document and technical direction source of truth |
