# CollabTrust — Test Plan

> **Status:** Draft  
> **Phase:** Phase F — Testing  
> **Depends on:** [`test-strategy.md`](./test-strategy.md), [`acceptance-criteria.md`](../02-requirements/acceptance-criteria.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

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
* **Focus:** Creator application submission, idempotent application prevention, brand acceptance and collaboration record initialization, messaging thread persistence, and milestone completion.

### 2.5 Suite 5: End-to-End User Journey Tests
* **Targets:** Full product loop.
* **Focus:** Automated Playwright browser tests executing Journey J-1 (Brand Campaign creation to completion) and Journey J-2 (Creator discovery to delivery).

---

## 3. Defect Management & Severity Criteria

| Severity | Definition | Resolution SLA |
|---|---|:---:|
| **Blocker (P0)** | Core marketplace loop broken; database corruption; security auth bypass; crash on load. | Immediate / Prevents deployment |
| **Critical (P1)** | AI Agent schema failure without fallback; trust disclaimer missing; broken navigation route. | 24 Hours |
| **Major (P2)** | Filter inconsistency; minor styling regression; non-fatal delay in match loading. | Prior to MVP sign-off |
| **Minor (P3)** | Copy typo; subtle cosmetic alignment issue on mobile viewport. | Backlog / Post-MVP |

---

## 4. Entry & Exit Criteria

* **Entry Criteria:** TypeScript code compiles cleanly; database migrations run without errors; environment variables configured in `.env`.
* **Exit Criteria:** 100% of P0 and P1 test cases passing; 100% of acceptance criteria verified; zero high-severity security vulnerabilities reported by dependency audit.

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`test-strategy.md`](./test-strategy.md) | High-level testing framework and tooling |
| [`test-cases.md`](./test-cases.md) | Itemized test cases |
| [`docs/02-requirements/acceptance-criteria.md`](../02-requirements/acceptance-criteria.md) | Complete acceptance criteria index |
