# Knowledge Base — Strategic Decisions & ADR Index

> **Category:** Architecture & Product Decisions  
> **Source Documents:** [`docs/03-architecture/ADR/`](../../docs/03-architecture/ADR/)  

---

## 1. Overview
This directory indexes foundational architectural decisions and product trade-offs documented as Architecture Decision Records (ADRs).

---

## 2. Architecture Decision Records Index

| ADR ID | Title | Status | Summary of Decision |
|---|---|:---:|---|
| [`ADR-001`](../../docs/03-architecture/ADR/ADR-001-stack.md) | Technology Stack Selection | Proposed | Adopt React + TypeScript + Tailwind CSS (web) and Node.js + Express + TypeScript (API). |
| [`ADR-002`](../../docs/03-architecture/ADR/ADR-002-database.md) | Relational Database & ORM | Proposed | Use PostgreSQL 15+ with Prisma ORM for relational integrity and type safety. |
| [`ADR-003`](../../docs/03-architecture/ADR/ADR-003-authentication.md) | User Authentication & Session Management | Proposed | JWT stored in httpOnly, Secure cookies; role-based access control. |
| [`ADR-004`](../../docs/03-architecture/ADR/ADR-004-ai-architecture.md) | AI Agent Architecture & LLM Integration | Proposed | Embedded custom AI service layer with Zod schema validation; defer LangGraph. |
| [`ADR-005`](../../docs/03-architecture/ADR/ADR-005-deployment.md) | Cloud Deployment & Hosting Strategy | Proposed | Deploy to a containerized PaaS (Railway/Render) with managed PostgreSQL. |

---

## 3. Product Principles Log
* **Marketplace First:** Every feature must serve the relationship between brands and creators.
* **Advisory AI:** AI models recommend and summarize; human users authorize all transactions.
* **Evidence Over Claims:** Trust signals provide transparent data observations rather than false certainty.
