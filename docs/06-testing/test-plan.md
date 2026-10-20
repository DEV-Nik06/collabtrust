# CollabTrust — Test Plan

> **Status:** Draft  
> **Phase:** Phase 7 — Testing & Deployment  
> **Depends on:** [`test-strategy.md`](./test-strategy.md), [`acceptance-criteria.md`](../02-requirements/acceptance-criteria.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

> **Note:** No test infrastructure exists yet; all cases are design-stage specifications.

---

## 1. Scope & Test Objectives

This test plan defines the execution phases, resource allocations, schedule milestones, and pass/fail criteria for testing CollabTrust throughout MVP development.

---

## 2. Test Execution Suites

### 2.1 Suite 1: Authentication & Authorization Tests
* **Targets:** `FR-001`–`FR-008`, `NFR-010`–`NFR-012`.
* **Focus:** Registration, duplicate email rejection, bcrypt hash verification, JWT expiry, and RBAC endpoint protection (verifying creators cannot invoke brand campaign endpoints).

### 2.2 Suite 2: Profile & Campaign Management Tests
* **Targets:** `FR-010`–`FR-032`.
* **Focus:** CRUD operations for BrandProfile and CreatorProfile; campaign lifecycle transitions (`draft` -> `active` -> `closed`); data validation for budget ranges and platform lists.

### 2.3 Suite 3: AI Agents & Schema Compliance Tests
* **Targets:** `FR-021`, `FR-040`, `FR-050`, `NFR-070`–`NFR-077`.
* **Focus:** Prompt construction, Zod schema validation on LLM outputs, Campaign Brief Agent fallback to manual form, match explanation generation, and Trust Analysis non-verdict compliance.

### 2.4 Suite 4: Marketplace Workflow & Collaboration Tests
* **Targets:** `FR-060`–`FR-068`.
* **Focus:** Creator application submission, idempotent application prevention, brand acceptance and collaboration record initialization (status `invited` per `FR-064`, mutual confirmation per `FR-068`), messaging thread persistence, and milestone completion.

### 2.5 Suite 5: End-to-End User Journey Tests
* **Targets:** Full product loop.
* **Focus:** Automated Playwright browser tests executing Journey J-1 (Brand Campaign creation to completion) and Journey J-2 (Creator discovery to delivery).

### 2.6 Suite 6: Performance & Load Tests
* **Targets:** `NFR-001`–`NFR-006`, `NFR-040`.
* **Focus:** p95 latency for non-AI CRUD API requests (`< 500 ms`), AI agent invocation bounds (p95 `< 30.0 s`), initial page load and route-change timing, loading-indicator trigger at `> 1.0 s`, search and filter query execution (`< 250 ms`), browser memory footprint (`< 150 MB`), and a load profile of `>= 50` concurrent active sessions without latency degradation.
* **Status:** All Suite 6 cases are **Planned** — no performance harness exists yet.

---

## 3. Execution Phases & Schedule Milestones

| Milestone | Phase | Entry Criteria |
|---|---|---|
| **M1 — Test Readiness** | Suites 1–2 authored and reviewable | Entry criteria (§6) met; test database and seed scripts (`prisma db seed`) available |
| **M2 — AI & Workflow Validation** | Suites 3–4 execution | Deterministic mock LLM adapter fixtures recorded; Suites 1–2 at 100% pass |
| **M3 — Journey & Performance Sign-off** | Suites 5–6 execution | MUST-HAVE API contracts stable; Playwright and load harnesses configured |

---

## 4. Resource Allocation

| Role | Allocation | Responsibilities |
|---|---|---|
| QA / Test Engineer | 1 (part-time) | Test case authoring, suite execution, defect triage |
| Backend Engineer | 1 (part-time) | Integration test harness, DB fixtures, defect fixes |
| AI Engineer | 1 (part-time) | Mock LLM fixtures, schema eval suites, guardrail linters |

---

## 5. Defect Management & Severity Criteria

| Severity | Definition | Resolution SLA |
|---|---|:---:|
| **Blocker (P0)** | Core marketplace loop broken; database corruption; security auth bypass; crash on load. | Immediate / Prevents deployment |
| **Critical (P1)** | AI Agent schema failure without fallback; trust disclaimer missing; broken navigation route. | 24 Hours |
| **Major (P2)** | Filter inconsistency; minor styling regression; non-fatal delay in match loading. | Prior to MVP sign-off |
| **Minor (P3)** | Copy typo; subtle cosmetic alignment issue on mobile viewport. | Backlog / Post-MVP |

---

## 6. Entry & Exit Criteria

* **Entry Criteria:** TypeScript code compiles cleanly; database migrations run without errors; environment variables configured in `.env`.
* **Exit Criteria:** 100% of P0 and P1 test cases passing; 100% of acceptance criteria have at least one Planned or Executed test case (tracked in the [`test-cases.md`](./test-cases.md) coverage matrix); all MUST-HAVE acceptance criteria are Executed before release; zero high-severity security vulnerabilities reported by dependency audit.

---

## 7. Related Documents

| Document | Purpose |
|---|---|
| [`test-strategy.md`](./test-strategy.md) | High-level testing framework and tooling |
| [`test-cases.md`](./test-cases.md) | Itemized test cases |
| [`docs/02-requirements/acceptance-criteria.md`](../02-requirements/acceptance-criteria.md) | Complete acceptance criteria index |
