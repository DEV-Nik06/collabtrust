# CollabTrust — Continuous Integration & Continuous Deployment (CI/CD)

> **Status:** Draft (Proposed)  
> **Phase:** Phase G — Deployment and Operations  
> **Depends on:** [`deployment-guide.md`](./deployment-guide.md), [`test-strategy.md`](../06-testing/test-strategy.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. CI/CD Architecture Overview

CollabTrust utilizes **GitHub Actions** for continuous integration and automated deployment. Every pull request is validated through automated static analysis, security audits, unit tests, and API integration suites before merging to `main`.

---

## 2. GitHub Actions Workflow Blueprint

### Workflow: `.github/workflows/ci.yml`

```yaml
name: Continuous Integration & Verification

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-typecheck:
    name: Lint & Typecheck
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: TypeScript Compile Check
        run: npm run typecheck

  test-suite:
    name: Automated Unit & Integration Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: collabtrust_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Database Migrations
        env:
          DATABASE_URL: postgresql://testuser:testpassword@localhost:5432/collabtrust_test
        run: npx prisma migrate deploy

      - name: Run Unit Tests
        run: npm run test:unit

      - name: Run API Integration Tests
        env:
          DATABASE_URL: postgresql://testuser:testpassword@localhost:5432/collabtrust_test
          JWT_SECRET: test_ci_jwt_secret_key_minimum_256_bits
        run: npm run test:integration

      - name: Run AI Schema & Guardrail Tests
        run: npm run test:ai-eval

  security-audit:
    name: Dependency Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm audit --audit-level=high
```

---

## 3. Continuous Deployment (CD) Strategy

* **Trigger:** Successful merge to the `main` branch.
* **Mechanism:** Git-hook deployment natively handled by PaaS host (Railway/Render).
* **Automated Migration Hook:** Pre-deploy release command automatically executes:
  ```bash
  npx prisma migrate deploy
  ```
* **Zero-Downtime Rolling Update:** The PaaS container spins up and passes health check before traffic is routed to the new instance.

---

## 4. Branch & Release Management

* **Protected Main Branch:** Direct commits to `main` are disabled; changes require a pull request and all green CI checks.
* **Commit Conventions:** Strictly enforces Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).
* **Local Identity Preservation:** All local development commits must maintain local `.git/config` identity per office machine safety rules.

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`deployment-guide.md`](./deployment-guide.md) | Deployment and rollback instructions |
| [`docs/06-testing/test-strategy.md`](../06-testing/test-strategy.md) | Test pyramid and quality gates |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | PR submission workflow |
