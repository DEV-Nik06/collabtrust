# ADR-002: Relational Database and ORM Architecture

> **Status:** Proposed  
> **Date:** 2026-10-12  
> **Deciders:** Engineering Team  
> **Consulted:** [`database-design.md`](../database-design.md), [`system-architecture.md`](../system-architecture.md)  

---

## 1. Context & Problem Statement

CollabTrust requires a persistent data storage solution for its two-sided marketplace. The platform manages relational entities with strict referential dependencies: Users, Profiles, Campaigns, Applications, Matches, Collaborations, and Messages. In addition, certain data attributes (e.g., creator social channel lists, trust signal metadata) have semi-structured formats.

---

## 2. Decision

We propose **PostgreSQL 15+** managed instance coupled with **Prisma ORM** as the database layer.

---

## 3. Rationale

1. **Relational Integrity:** Marketplace operations require strict foreign key constraints (e.g., an Application must reference a valid Campaign and CreatorProfile; Collaborations cannot exist without an accepted Application).
2. **ACID Transactions:** State transitions (such as accepting an application and simultaneously initializing a collaboration record) require transactional guarantees.
3. **JSONB Flexibility:** PostgreSQL's native JSONB allows storing creator channel links and observational trust anomalies without schema overhead, offering the benefits of document stores within a relational engine.
4. **Prisma Developer Experience:** Auto-generated TypeScript types, declarative migrations (`prisma migrate`), and compile-time query safety significantly reduce boilerplate and regression risks.

---

## 4. Consequences & Trade-offs

* **Positive:** Eliminates SQL injection vulnerabilities through parameterized queries; simplifies schema evolution via versioned migrations; ensures full type safety across backend services.
* **Negative:** Connection pooling must be configured carefully in serverless or auto-scaled environments (addressed via Prisma Accelerate or PgBouncer if necessary post-MVP).
