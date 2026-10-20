# ADR-001: Technology Stack Selection

> **Status:** Proposed  
> **Date:** 2026-10-12  
> **Deciders:** Engineering & Product Team  
> **Consulted:** [`PROJECT_CONTEXT.md`](../../../PROJECT_CONTEXT.md), [`product-vision.md`](../../01-product/product-vision.md)  

---

## 1. Context & Problem Statement

CollabTrust requires a technology stack capable of delivering an AI-assisted two-sided marketplace within a rapid MVP / hackathon timeframe. The stack must balance developer velocity, strong type safety, robust ecosystem support, and simplicity of deployment without introducing microservice overhead or distributed system complexity.

Key constraints:
* Two-sided marketplace workflows (brands and creators).
* Interactive AI agent integrations (free-text campaign structuring, creator matching, trust analysis).
* Monolithic architecture for MVP validation; no distributed queue or microservice overhead.
* Small engineering team requiring full-stack consistency.

---

## 2. Decision

We propose the following core technology stack:
* **Frontend:** React 18+ with TypeScript, styled using Tailwind CSS and bundled with Vite.
* **Backend:** Node.js 20+ LTS (20.x or 22.x; Node 18 reached EOL April 2025) with Express and TypeScript.
* **Database & ORM:** PostgreSQL 15+ using Prisma ORM.
* **API Style:** REST over HTTP with JSON payloads and OpenAPI 3.0 documentation.
* **Testing:** Vitest for unit tests, Supertest for API integration tests, and Playwright for E2E workflows.

---

## 3. Rationale & Alternatives Considered

### 3.1 Frontend: React + TypeScript + Tailwind CSS
* **Pros:** Industry standard, massive component ecosystem, rapid styling via utility-first Tailwind, seamless type sharing with backend TypeScript interfaces.
* **Alternatives Considered:**
  * *Next.js (Full-stack):* Considered, but separating a standalone Express API backend provides cleaner separation of concerns for AI agent service isolation and long-running HTTP operations.
  * *Vue / Svelte:* High velocity, but smaller team familiarity and fewer out-of-the-box UI component references.

### 3.2 Backend: Node.js + Express + TypeScript
* **Pros:** Single language across frontend and backend; mature HTTP server primitives; lightweight and unopinionated; excellent asynchronous I/O performance for external LLM API calls.
* **Alternatives Considered:**
  * *Python (FastAPI):* Excellent for AI/ML libraries, but CollabTrust uses external LLM APIs via REST rather than locally hosted PyTorch models. Node.js allows unified full-stack TypeScript tooling.
  * *NestJS:* Strong structure, but excessive boilerplate and decorator complexity for MVP speed.

### 3.3 Database: PostgreSQL + Prisma ORM
* **Pros:** PostgreSQL provides rock-solid ACID transactions, relational integrity for marketplace entities (User, Campaign, Match, Application, Collaboration), and native JSONB support for flexible metadata (platforms, trust anomalies). Prisma provides type-safe schema modeling and automatic migrations.
* **Alternatives Considered:**
  * *MongoDB:* Flexible schema, but lacks relational integrity constraints essential for marketplace financial transactions and matching relationships.

---

## 4. Consequences & Trade-offs

### Positive
* Single language (TypeScript) across the entire codebase accelerates development.
* Type safety from database schema (Prisma) to API layer to frontend interfaces.
* Simple monolithic deployment on standard PaaS containers.

### Negative / Limitations
* Express requires manual setup for structured validation (solved via Zod middleware).
* Node.js single-threaded event loop requires careful handling of CPU-bound operations (mitigated by delegating AI processing to external LLM APIs).
