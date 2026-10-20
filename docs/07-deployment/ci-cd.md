# CollabTrust — Continuous Integration & Continuous Deployment (CI/CD)

> **Status:** Draft (Proposed)  
> **Phase:** Phase 7 — Testing & Deployment  
> **Depends on:** [`deployment-guide.md`](./deployment-guide.md), [`test-strategy.md`](../06-testing/test-strategy.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. CI/CD Architecture Overview

> **Status:** Blueprint — no workflows implemented yet (`.github/workflows/` is empty).

CollabTrust will use **GitHub Actions** for continuous integration and automated deployment (per [`ADR-005-deployment.md`](../03-architecture/ADR/ADR-005-deployment.md)). Once implemented, every pull request will be validated through linting, dependency auditing (`npm audit`), and tests before merging to `main`.

---

## 2. GitHub Actions Workflow Blueprint

### Planned CI Validation Gates

The `validate` job runs the following gates in order. Each npm script below is a **planned script** that does not exist yet:

1. `npm run typecheck` (planned script)
2. `npm run lint` (planned script)
3. `npm audit --audit-level=high`
4. `npm run build:api` (planned script)
5. `npm run build:web` (planned script)
6. `npm run test` (planned script)

> [!IMPORTANT]
> **Prerequisites (not yet met):** The `npm ci` steps below require a committed `package-lock.json`, which does not exist yet (no `package.json` has been initialized). The `npx prisma migrate deploy` step requires `prisma/schema.prisma` to be initialized first. All npm scripts above are planned; the standard planned scripts are `build:api`, `build:web`, `typecheck`, `lint`, `test`, and `e2e`.
>
> **Secrets:** Workflow steps reference repository secrets via `${{ secrets.* }}` — never inline literals. The LLM provider is **mocked in CI**; no `LLM_API_KEY` secret is required for CI runs.

### Workflow: `.github/workflows/ci.yml` (proposed blueprint)

```yaml
name: Continuous Integration & Verification

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    name: Validate (typecheck, lint, audit, build, test)
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
        run: npm ci # requires package-lock.json, not yet committed

      - name: TypeScript Compile Check
        run: npm run typecheck # planned script

      - name: Run ESLint
        run: npm run lint # planned script

      - name: Dependency Security Scan
        run: npm audit --audit-level=high

      - name: Build API
        run: npm run build:api # planned script

      - name: Build Web
        run: npm run build:web # planned script

      - name: Run Database Migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy # once prisma/schema.prisma is initialized

      - name: Run Tests
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
        run: npm run test # planned script; LLM provider is mocked in CI (no LLM_API_KEY secret required)

  deploy:
    name: Deploy to PaaS
    needs: validate
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy (PaaS provider action — vendor TBD)
        # Deployment is performed by the PaaS GitHub Action for the chosen
        # provider (Railway/Render/Fly.io — see ADR-005). The PaaS release
        # phase runs `npx prisma migrate deploy` before switching traffic.
        run: echo "Deploy step to be implemented once a PaaS vendor is chosen"
```

---

## 3. Continuous Deployment (CD) Strategy

* **Trigger:** Successful merge (push) to the `main` branch.
* **Mechanism:** A dedicated `deploy` GitHub Actions job (see the workflow blueprint in §2), per [`ADR-005-deployment.md`](../03-architecture/ADR/ADR-005-deployment.md). The deploy job runs only after the `validate` job succeeds on `main`. (This replaces earlier wording that described native PaaS git-hook deployment — ADR-005 designates GitHub Actions as the CD mechanism.)
* **Automated Migration Step:** The PaaS release phase executes `npx prisma migrate deploy` (once `prisma/schema.prisma` is initialized). The full migration and rollback procedure is maintained in [`deployment-guide.md` §4 Rollback & Maintenance](./deployment-guide.md) and is not restated here.
* **Zero-Downtime Rolling Update:** The new container must pass the `GET /api/v1/health` check (see [`monitoring-logging.md` §3.1](./monitoring-logging.md)) before traffic is routed to the new instance.

---

## 4. Branch & Release Management

* **Protected Main Branch (required policy):** Branch protection on `main` must be configured via repository settings once CI workflows exist: direct commits to `main` are disabled; changes require a pull request and all required CI checks green.
* **Commit Conventions:** Strictly enforces Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).
* **Local Identity Preservation:** All local development commits must maintain local `.git/config` identity per office machine safety rules.

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`deployment-guide.md`](./deployment-guide.md) | Deployment and rollback instructions |
| [`docs/06-testing/test-strategy.md`](../06-testing/test-strategy.md) | Test pyramid and quality gates |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | PR submission workflow |
