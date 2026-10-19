# CollabTrust — Security Design

> **Status:** Draft (Proposed)  
> **Phase:** Phase C — Architecture  
> **Depends on:** [`system-architecture.md`](./system-architecture.md), [`api-design.md`](./api-design.md), [`non-functional-requirements.md`](../02-requirements/non-functional-requirements.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Threat Model & Security Objectives

CollabTrust is an AI-assisted two-sided marketplace managing brand campaign strategies and creator professional credentials. The security architecture prioritizes:
1. **Protection of User Credentials & Communications:** Preventing unauthorized access to accounts, campaign drafts, and private collaboration threads.
2. **AI Input/Output Safety:** Mitigating prompt injection vulnerabilities and enforcing human-controlled boundaries.
3. **Data Integrity & Confidentiality:** Ensuring zero leakage of sensitive operational or personal data.
4. **Platform Availability & Anti-Abuse:** Preventing spam applications, credential stuffing, and bot scraping.

---

## 2. Authentication & Session Management

### 2.1 Password Hashing & Credentials
* **Hashing Algorithm:** `bcrypt` with a minimum cost factor of 12 rounds.
* **Password Policy:** Minimum 8 characters; enforced validation requiring at least one number and one symbol (per `NFR-010`).
* **Storage:** Raw passwords are never logged, cached, or persisted in unhashed form.

### 2.2 Token-Based Authentication (ADR-003)
* **Token Type:** JSON Web Tokens (JWT) signed via HMAC-SHA256 (`HS256`) using a cryptographically secure 256-bit secret stored in environment variables.
* **Token Payload:**
  ```json
  {
    "sub": "user-uuid",
    "email": "user@example.com",
    "role": "brand", // "brand" | "creator"
    "iat": 1728730800,
    "exp": 1728817200
  }
  ```
* **Expiration:** Standard session tokens expire after 24 hours.
* **Delivery:** Delivered via `httpOnly`, `Secure`, `SameSite=Lax` cookies to mitigate Cross-Site Scripting (XSS) token extraction. Alternatively supported via `Authorization: Bearer <token>` header for headless API testing.

---

## 3. Role-Based Access Control (RBAC)

The system implements strict server-side RBAC middleware (`authenticateUser`, `requireRole('brand')`, `requireRole('creator')`).

### Access Control Matrix

| Resource / Action | Public | Authenticated Brand | Authenticated Creator | Admin |
|---|:---:|:---:|:---:|:---:|
| User Registration & Login | ✅ | ✅ | ✅ | ✅ |
| Password Reset Request | ✅ | ✅ | ✅ | ✅ |
| View Own Profile | ❌ | ✅ | ✅ | ✅ |
| Update Own Profile | ❌ | ✅ | ✅ | ✅ |
| View Creator Public Profile | ❌ | ✅ | ❌ | ✅ |
| View Brand Public Profile | ❌ | ❌ | ✅ | ✅ |
| Create & Publish Campaign | ❌ | ✅ | ❌ | ✅ |
| View Active Campaign Feed | ❌ | ❌ | ✅ | ✅ |
| View Campaign AI Matches | ❌ | ✅ (Owner Only) | ❌ | ✅ |
| View Creator Trust Analysis | ❌ | ✅ (Owner Only) | ❌ | ✅ |
| Submit Campaign Application | ❌ | ❌ | ✅ | ✅ |
| Accept/Decline Application | ❌ | ✅ (Owner Only) | ❌ | ✅ |
| Post in Collaboration Thread | ❌ | ✅ (Participant) | ✅ (Participant) | ✅ |

---

## 4. Input Validation & Injection Mitigation

### 4.1 SQL & NoSQL Injection
* All database interactions are executed strictly through **Prisma ORM**, which utilizes parameterized prepared statements for all queries, eliminating SQL injection vectors.
* Direct raw SQL query execution is prohibited.

### 4.2 Cross-Site Scripting (XSS)
* Frontend rendering is handled via React's JSX engine, which performs automatic contextual HTML entity encoding.
* Direct use of `dangerouslySetInnerHTML` is prohibited across the codebase.
* Inbound request payloads are sanitized and validated against explicit **Zod schemas** in API middleware before reaching service layers.

### 4.3 Cross-Site Request Forgery (CSRF)
* For cookie-based authentication, CSRF tokens (Double Submit Cookie pattern) or `SameSite=Lax` / `SameSite=Strict` cookie policies are enforced.
* State-changing HTTP verbs (`POST`, `PUT`, `DELETE`) require custom headers (`Content-Type: application/json` and CSRF validation headers).

---

## 5. AI Guardrails & Prompt Injection Mitigation

### 5.1 Prompt Isolation & Delimitation
* User inputs supplied to LLMs (free-text campaign briefs, creator bios) are strictly wrapped in semantic XML delimiters (e.g., `<user_campaign_input>...</user_campaign_input>`).
* System prompts explicitly instruct agents to treat wrapped content purely as data to be analyzed or structured, never as executable meta-instructions.

### 5.2 Structured Output Schema Validation
* LLM outputs are forced into strict JSON structures.
* The backend parses raw LLM output and validates it against formal Zod schemas before persisting or returning data to the client.
* Unparsable or schema-violating outputs trigger deterministic fallbacks (e.g., manual form fallback).

### 5.3 Mandatory Disclaimers & Prohibitions
* Trust Analysis Agent outputs are passed through an internal copy filter confirming that no definitive fraud claims ("fake", "guaranteed authentic") are present.
* Persistent disclaimers are programmatically appended to all trust reports before response delivery.
* Autonomous outbound network requests or message dispatches by AI agents are architecturally prohibited (zero network tools exposed to LLMs).

---

## 6. Secrets & Environment Management

* **Zero Hardcoded Secrets:** Passwords, API keys, database connection strings, and JWT secrets are loaded strictly via environment variables.
* **Version Control Protection:**
  * `.gitignore` explicitly excludes `.env`, `.env.*`, and temporary credential files.
  * `.env.example` serves as the non-secret key ledger.
  * Local Git identity uses local repository config, ensuring office machine settings remain untouched.

---

## 7. Related Documents

| Document | Purpose |
|---|---|
| [`system-architecture.md`](./system-architecture.md) | High-level system structure and boundary layers |
| [`api-design.md`](./api-design.md) | Endpoint specifications and request validation |
| [`ADR/ADR-003-authentication.md`](./ADR/ADR-003-authentication.md) | Architecture Decision Record on authentication |
| [`docs/04-ai/safety-guardrails.md`](../04-ai/safety-guardrails.md) | Detailed AI safety and guardrail specifications |
