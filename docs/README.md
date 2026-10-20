# CollabTrust Documentation

> **Master Status & Review Order:** [`DOCUMENTATION_STATUS.md`](./DOCUMENTATION_STATUS.md)  
> **Source of Truth:** [`PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md)  

This directory contains the comprehensive product, technical, AI, design, testing, and deployment documentation for CollabTrust.

---

## Directory Index

### [01 — Product](./01-product/)
* [`product-vision.md`](./01-product/product-vision.md) — Mission, vision, core principles, and boundaries.
* [`problem-definition.md`](./01-product/problem-definition.md) — Problem statements, root causes, and assumptions.
* [`target-users.md`](./01-product/target-users.md) — Two-sided marketplace segments and initial focus.
* [`personas.md`](./01-product/personas.md) — Illustrative user personas (Priya, Daniel, Maya, Jordan).
* [`user-journeys.md`](./01-product/user-journeys.md) — End-to-end user journeys (J-1 through J-4).
* [`goals-success-metrics.md`](./01-product/goals-success-metrics.md) — Product goals and measurable metrics.
* [`mvp-scope.md`](./01-product/mvp-scope.md) — MVP feature cut-lines and AI agent priority.
* [`feature-requirements.md`](./01-product/feature-requirements.md) — Feature catalog (`FEAT-001`–`FEAT-052`).
* [`PRD.md`](./01-product/PRD.md) — Consolidated Product Requirements Document.

### [02 — Requirements](./02-requirements/)
* [`SRS.md`](./02-requirements/SRS.md) — Software Requirements Specification baseline.
* [`functional-requirements.md`](./02-requirements/functional-requirements.md) — 62 functional requirements (`FR-001`–`FR-076`).
* [`non-functional-requirements.md`](./02-requirements/non-functional-requirements.md) — 52 quality attributes (`NFR-001`–`NFR-077`).
* [`user-stories.md`](./02-requirements/user-stories.md) — 50 user stories (`US-001`–`US-050`).
* [`acceptance-criteria.md`](./02-requirements/acceptance-criteria.md) - 65 canonical acceptance criteria (`AC-001.1`-`AC-052.2`), the single source of truth for ACs.

### [03 — Architecture](./03-architecture/)
* [`system-architecture.md`](./03-architecture/system-architecture.md) — Monolithic layered system architecture.
* [`database-design.md`](./03-architecture/database-design.md) — PostgreSQL 15 schema and Prisma models.
* [`api-design.md`](./03-architecture/api-design.md) — RESTful API catalog under `/api/v1`.
* [`security-design.md`](./03-architecture/security-design.md) — Threat model, RBAC matrix, and injection defenses.
* Architecture Decision Records:
  * [`ADR-001: Technology Stack`](./03-architecture/ADR/ADR-001-stack.md)
  * [`ADR-002: Relational Database & ORM`](./03-architecture/ADR/ADR-002-database.md)
  * [`ADR-003: User Authentication & Session Management`](./03-architecture/ADR/ADR-003-authentication.md)
  * [`ADR-004: AI Agent Architecture`](./03-architecture/ADR/ADR-004-ai-architecture.md)
  * [`ADR-005: Cloud Deployment Strategy`](./03-architecture/ADR/ADR-005-deployment.md)

### [04 — AI Specifications](./04-ai/)
* [`ai-architecture.md`](./04-ai/ai-architecture.md) — AI subsystem pipeline and agent catalog.
* [`agent-specifications.md`](./04-ai/agent-specifications.md) — Granular specifications for all 6 planned agents.
* [`tool-permissions.md`](./04-ai/tool-permissions.md) — Least-privilege sandboxing and tool prohibitions.
* [`workflow-specifications.md`](./04-ai/workflow-specifications.md) — Execution flows and human approval gates.
* [`prompt-specifications.md`](./04-ai/prompt-specifications.md) — System prompts and JSON schemas.
* [`evaluation-plan.md`](./04-ai/evaluation-plan.md) — AI benchmarking datasets and automated suites.
* [`safety-guardrails.md`](./04-ai/safety-guardrails.md) — Non-verdict language and mandatory disclaimers.

### [05 — Design](./05-design/)
* [`ux-flows.md`](./05-design/ux-flows.md) — Sitemaps and Mermaid interaction flowcharts.
* [`design-system.md`](./05-design/design-system.md) — Tailwind tokens, typography, and UI component standards.
* [`wireframes/README.md`](./05-design/wireframes/README.md) — Core screen structural layout blueprints.

### [06 — Testing](./06-testing/)
* [`test-strategy.md`](./06-testing/test-strategy.md) — Testing pyramid and CI quality gates.
* [`test-plan.md`](./06-testing/test-plan.md) — Test suites, defect severity SLA, and entry/exit criteria.
* [`test-cases.md`](./06-testing/test-cases.md) — Itemized test cases mapped to acceptance criteria.

### [07 — Deployment & Operations](./07-deployment/)
* [`deployment-guide.md`](./07-deployment/deployment-guide.md) — Local setup and cloud PaaS deployment.
* [`environment-configuration.md`](./07-deployment/environment-configuration.md) — Environment variables ledger.
* [`ci-cd.md`](./07-deployment/ci-cd.md) — GitHub Actions pipeline configuration.
* [`monitoring-logging.md`](./07-deployment/monitoring-logging.md) — Structured logging and health checks.

### [Knowledge Base](../knowledge-base/)
* Centralized, cross-cutting knowledge across [`product/`](../knowledge-base/product/README.md), [`technical/`](../knowledge-base/technical/README.md), [`ai-agents/`](../knowledge-base/ai-agents/README.md), [`decisions/`](../knowledge-base/decisions/README.md), and [`research/`](../knowledge-base/research/README.md).

---

## Documentation Principle
Documentation is the source of truth for the project. Implementation follows documented requirements and architecture. When a decision changes, the matching documentation must be updated in the same change.
