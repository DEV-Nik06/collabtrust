# CollabTrust — Deployment Guide

> **Status:** Draft (Proposed)  
> **Phase:** Phase G — Deployment and Operations  
> **Depends on:** [`system-architecture.md`](../03-architecture/system-architecture.md), [`ADR-005-deployment.md`](../03-architecture/ADR/ADR-005-deployment.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

> [!NOTE]
> This guide documents the intended deployment procedures for CollabTrust. No cloud infrastructure has been provisioned yet.

---

## 1. Prerequisites

* **Node.js:** Version 18.x or 20.x LTS.
* **PostgreSQL:** Version 15+ running locally or as a managed cloud service.
* **LLM API Key:** Valid credentials for the designated LLM API provider.
* **Git:** Configured with local repository identity (per `AGENTS.md`).

---

## 2. Local Development Setup

1. **Clone repository & inspect:**
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
   Fill in `DATABASE_URL`, `JWT_SECRET`, and `LLM_API_KEY`.
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

1. **Database Provisioning:**
   * Create a managed PostgreSQL 15 database instance.
   * Copy the connection string to the `DATABASE_URL` environment variable.
2. **API Backend Service:**
   * Link the GitHub repository `main` branch.
   * Build command: `npm run build:api` (or `npm run build`).
   * Start command: `node dist/apps/api/index.js`.
   * Configure environment variables: `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `LLM_API_KEY`, `CORS_ORIGIN`.
   * Release command (runs automatic migrations): `npx prisma migrate deploy`.
3. **Web Frontend Service:**
   * Static web service linked to `apps/web`.
   * Build command: `npm run build:web`.
   * Publish directory: `dist/apps/web`.
   * Configure environment variable: `VITE_API_URL=https://api.yourdomain.com`.

---

## 4. Rollback & Maintenance

* **Application Rollback:** PaaS platforms maintain instant previous-deployment rollbacks accessible via dashboard or CLI.
* **Database Rollback:** Prisma migrations support programmatic rollback scripts if schema breaking changes occur.
* **Database Snapshots:** Managed PostgreSQL instances are configured for automatic daily backups with point-in-time recovery.

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`environment-configuration.md`](./environment-configuration.md) | Variable definitions and secrets rules |
| [`ci-cd.md`](./ci-cd.md) | CI/CD pipeline automation specifications |
| [`monitoring-logging.md`](./monitoring-logging.md) | Operational logging and health check architecture |
