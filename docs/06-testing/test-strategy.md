# CollabTrust — Test Strategy

> **Status:** Draft  
> **Phase:** Phase 7 — Testing & Deployment  
> **Depends on:** [`SRS.md`](../02-requirements/SRS.md), [`acceptance-criteria.md`](../02-requirements/acceptance-criteria.md), [`non-functional-requirements.md`](../02-requirements/non-functional-requirements.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

> **Note:** No test infrastructure exists yet; all cases are design-stage specifications.

---

## 1. Testing Philosophy & Objectives

The testing strategy for CollabTrust is designed to validate the core marketplace loop and verify strict compliance with safety guardrails during rapid development.

### Core Testing Pillars
1. **End-to-End Loop Integrity:** Verify seamless transitions across brand campaign creation, AI structuring, creator matching, application, and collaboration completion.
2. **AI Reliability & Schema Adherence:** Ensure 100% schema compliance for all structured outputs from external LLM APIs.
3. **Safety & Guardrail Compliance:** Enforce that trust signals never use prohibited definitive fraud language and always attach mandatory disclaimers.
4. **Security & Role Isolation:** Verify that brand and creator endpoints are completely protected by RBAC middleware.

---

## 2. Testing Pyramid & Tooling

```
             ┌───────────────┐
             │   E2E Tests   │  Playwright (Core user journeys)
             ├───────────────┤
             │  Integration  │  Supertest + Vitest (API & DB transactions)
             ├───────────────┤
             │ AI Eval Suite │  Zod schema & safety regex linter
             ├───────────────┤
             │  Unit Tests   │  Vitest (Utilities, business logic, sanitizers)
             └───────────────┘
```

| Layer | Primary Framework | Target Coverage | Purpose |
|---|---|:---:|---|
| **Unit Testing** | Vitest | >= 80% logic | Form validation, password rules, string sanitization, Zod parsing |
| **API Integration** | Supertest + Vitest | >= 85% routes | HTTP endpoint request/response contracts, RBAC checks, DB queries |
| **AI Evaluation** | Custom Vitest Runner | 100% prompts | Schema conformance, non-verdict copy linting, mock LLM fallback tests |
| **End-to-End (E2E)** | Playwright | Key flows | Browser-level simulation of Brand and Creator core loops |
| **Security Auditing** | npm audit / ESLint | 0 high vulns | Linting and dependency auditing (`npm audit`) |

---

## 3. Test Environments & Isolation

* **Unit & Integration:** Runs against an isolated local or CI PostgreSQL instance. Database state is reset using transactional rollbacks per test, or `prisma migrate reset` between suite runs.
* **AI Mocking in CI:** Integration and regression CI suites utilize deterministic mock LLM adapters returning pre-recorded fixture responses to prevent unpredictable external API costs or network latency.
* **Live AI Smoke Testing:** Dedicated manual and scheduled staging runs test live LLM API keys with real external inference calls.

---

## 4. Quality Gates for CI/CD

Prior to merging any pull request to `main` (planned scripts — no `package.json` exists yet):

1. `npm run typecheck` — Zero TypeScript type errors.
2. `npm run lint` — Zero ESLint errors.
3. `npm audit` — Zero high-severity dependency vulnerabilities.
4. `npm run build:api` — Clean API build.
5. `npm run build:web` — Clean web build.
6. `npm run test` — 100% passing unit, API integration, and AI evaluation suites.

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`test-plan.md`](./test-plan.md) | Operational test execution plan |
| [`test-cases.md`](./test-cases.md) | Granular test cases mapped to ACs |
| [`docs/04-ai/evaluation-plan.md`](../04-ai/evaluation-plan.md) | Detailed AI agent evaluation plan |
