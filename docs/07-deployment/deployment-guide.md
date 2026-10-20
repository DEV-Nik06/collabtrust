# CollabTrust — Deployment Guide

> **Status:** Draft (Proposed)  
> **Phase:** Phase 7 — Testing & Deployment  
> **Depends on:** [`system-architecture.md`](../03-architecture/system-architecture.md), [`ADR-005-deployment.md`](../03-architecture/ADR/ADR-005-deployment.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

> [!NOTE]
> This guide documents the intended deployment procedures for CollabTrust. No cloud infrastructure has been provisioned yet.

---

## 1. Prerequisites

* **Node.js:** Version 20.x or 22.x LTS (Node 18 reached end-of-life in April 2025).
* **PostgreSQL:** Version 15+ running locally or as a managed cloud service.
* **LLM API Key:** Valid credentials for the designated LLM API provider.
* **Git:** Configured with local repository identity (per `PROJECT_CONTEXT.md §10.5`).

---

## 2. Local Development Setup

1. **Clone repository:**
   ```bash
   git clone <repository-url> collabtrust
   ```
   Then verify your working tree:
   ```bash
   git status
   ```
2. **Install root dependencies (when package.json is initialized):**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Copy the example template to a local private configuration file:
   ```bash
   cp .env.example .env
   ```
   Fill in the required variables per [`environment-configuration.md` §2](./environment-configuration.md) — at minimum `DATABASE_URL`, `JWT_SECRET`, `LLM_PROVIDER`, and `LLM_API_KEY`.
4. **Run Database Migrations:**
   ```bash
   npx prisma migrate dev
   ```
5. **Start Development Servers:**
   ```bash
   npm run dev
   ```
   * Frontend accessible at `http://localhost:5173`
   * API server accessible at `http://localhost:3000`

---

## 3. Cloud Deployment (PaaS Blueprint)

### Target: Container / PaaS Deployment (e.g., Railway / Render / Fly.io)

> [!IMPORTANT]
> [`environment-configuration.md` §2](./environment-configuration.md) is the single source of truth for environment variables. The required variables per service are listed explicitly below for convenience.

1. **Database Provisioning:**
   * Create a managed PostgreSQL 15 database instance.
   * Copy the connection string to the `DATABASE_URL` environment variable.
2. **API Backend Service:**
   * Link the GitHub repository `main` branch.
   * Build command: `npm run build:api` (or `npm run build`).
   * Start command: `node dist/apps/api/index.js`.
   * Required environment variables (per [`environment-configuration.md` §2](./environment-configuration.md)): `DATABASE_URL`, `JWT_SECRET`, `LLM_PROVIDER`, `LLM_API_KEY`, `CORS_ORIGIN` (plus `NODE_ENV=production`).
   * Release command (runs automatic migrations): `npx prisma migrate deploy` (once `prisma/schema.prisma` is initialized).
3. **Web Frontend Service:**
   * Static web service linked to `apps/web`.
   * Build command: `npm run build:web`.
   * Publish directory: `dist/apps/web`.
   * Required environment variable: `VITE_API_URL=https://api.yourdomain.com/api/v1`.
   * The frontend uses this value as the full base URL for all API requests (path prefix included) in every environment.
4. **Worker Service (planned):**
   * The AI job-processing worker defined in `PROJECT_CONTEXT.md §8` (`apps/worker`) is planned but not yet implemented.
   * Runs from the same container image as the API service, but with a different entrypoint (e.g., `node dist/apps/worker/index.js`).
   * Requires the same backend variables as the API service: `DATABASE_URL`, `JWT_SECRET`, `LLM_PROVIDER`, `LLM_API_KEY`.
   * Concurrency must honor `NFR-043`: in-process or lightweight async job handling only — no external message brokers or queue infrastructure until post-MVP.

---

## 4. Rollback & Maintenance

* **Application Rollback:** PaaS platforms maintain instant previous-deployment rollbacks accessible via dashboard or CLI.
* **Database Rollback:** Prisma migrations are forward-only — there are no programmatic rollback scripts. To undo a breaking schema change, roll forward with a corrective migration. Restore from the pre-deploy snapshot only for catastrophic failures.
* **Database Snapshots:** Managed PostgreSQL instances will be configured per [`ADR-005-deployment.md`](../03-architecture/ADR/ADR-005-deployment.md) with automated daily backups and a retention period of N days. Point-in-time recovery is optional and not yet approved. (No backups exist yet — no infrastructure has been provisioned.)

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`environment-configuration.md`](./environment-configuration.md) | Variable definitions and secrets rules |
| [`ci-cd.md`](./ci-cd.md) | CI/CD pipeline automation specifications |
| [`monitoring-logging.md`](./monitoring-logging.md) | Operational logging and health check architecture |
