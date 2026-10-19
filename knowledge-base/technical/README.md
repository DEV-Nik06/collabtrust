# Knowledge Base — Technical Knowledge

> **Category:** Technical Knowledge  
> **Source Documents:** [`docs/03-architecture/`](../../docs/03-architecture/), [`docs/02-requirements/`](../../docs/02-requirements/)  

---

## 1. Monolithic Layered Architecture
For MVP speed and operational simplicity, CollabTrust uses a clean monolithic architecture:
* **Frontend:** React 18, TypeScript, Tailwind CSS, Vite.
* **Backend:** Node.js, Express, TypeScript.
* **Database:** PostgreSQL 15, Prisma ORM.
* **API Pattern:** RESTful HTTP endpoints under `/api/v1`.

---

## 2. Relational Schema & State Machines
* **Entity Relationships:** User -> BrandProfile / CreatorProfile -> Campaign -> Match / Application -> Collaboration -> Messages.
* **Collaboration State Lifecycle:** `invited` -> `accepted` -> `in_progress` -> `completed`.
* **ACID Transactions:** Prisma `$transaction` guarantees atomicity when accepting applications and creating collaboration records.

---

## 3. Security Standards Summary
* **Passwords:** `bcrypt` >= 12 rounds.
* **Authentication:** Signed JWT stored in `httpOnly`, `Secure`, `SameSite=Lax` cookies.
* **RBAC:** Enforced at the Express router level on 100% of non-public endpoints.
* **Injection Prevention:** Parameterized SQL queries via Prisma; contextual HTML escaping in React; Zod payload validation.

---

## 4. Key Technical References
* [`docs/03-architecture/system-architecture.md`](../../docs/03-architecture/system-architecture.md)
* [`docs/03-architecture/database-design.md`](../../docs/03-architecture/database-design.md)
* [`docs/03-architecture/api-design.md`](../../docs/03-architecture/api-design.md)
* [`docs/03-architecture/security-design.md`](../../docs/03-architecture/security-design.md)
