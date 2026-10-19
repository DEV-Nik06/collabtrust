# CollabTrust — Environment Configuration

> **Status:** Draft (Proposed)  
> **Phase:** Phase G — Deployment and Operations  
> **Depends on:** [`deployment-guide.md`](./deployment-guide.md), [`security-design.md`](../03-architecture/security-design.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Environment Variable Ledger

This document defines all runtime configuration variables for CollabTrust across development, testing, and production environments.

> [!IMPORTANT]
> Never commit actual secret values, API keys, database passwords, or `.env` files to git. The `.env.example` file in the repository root serves as the non-secret variable ledger.

---

## 2. Configuration Variables Table

| Variable Name | Required | Default / Example | Environment | Purpose / Notes |
|---|:---:|---|:---:|---|
| `NODE_ENV` | Yes | `development` / `production` | All | Node.js runtime optimization and error verbosity |
| `PORT` | No | `3000` | Backend | HTTP server listening port |
| `DATABASE_URL` | Yes | `postgresql://user:pass@localhost:5432/collabtrust` | Backend | PostgreSQL connection string with credentials |
| `JWT_SECRET` | Yes | `changeme_in_production_256bit_secret` | Backend | Secret key used to sign and verify HMAC-SHA256 JWTs |
| `JWT_EXPIRY` | No | `24h` | Backend | Lifetime of authenticated user session tokens |
| `CORS_ORIGIN` | Yes | `http://localhost:5173` | Backend | Allowed origin for frontend requests |
| `LLM_PROVIDER` | Yes | `anthropic` / `openai` / `gemini` | Backend | Active AI model provider adapter |
| `LLM_API_KEY` | Yes | `sk-live-...` | Backend | Secret API authentication key for LLM provider |
| `LLM_MODEL_NAME` | No | `claude-3-5-sonnet-20241022` | Backend | Specific model identifier |
| `LOG_LEVEL` | No | `info` (`debug` in local dev) | Backend | Pino / Winston logging verbosity |
| `VITE_API_URL` | Yes | `http://localhost:3000/api/v1` | Frontend | Base URL for backend API requests |

---

## 3. Environment Specifics

### 3.1 Local Development (`.env`)
* Uses local Docker or native PostgreSQL database instance.
* LLM provider can be pointed to mock fixtures or live developer API key.
* Verbose stack traces enabled.

### 3.2 Automated CI (`GitHub Actions Secrets`)
* `DATABASE_URL`: Ephemeral test container service.
* `JWT_SECRET`: Static test string.
* `LLM_API_KEY`: Staged dummy secret (unit/integration tests execute with mock LLM client).

### 3.3 Production (`PaaS Environment Settings`)
* Secure, high-entropy 256-bit `JWT_SECRET`.
* Managed PostgreSQL connection string with SSL enabled (`sslmode=require`).
* Production `LLM_API_KEY` with organization billing limits.
* `CORS_ORIGIN` locked strictly to the production frontend domain.

---

## 4. Related Documents

| Document | Purpose |
|---|---|
| [`deployment-guide.md`](./deployment-guide.md) | Deployment instructions |
| [`security-design.md`](../03-architecture/security-design.md) | Security controls and secrets management |
| [`.env.example`](../../.env.example) | Repository root environment ledger template |
