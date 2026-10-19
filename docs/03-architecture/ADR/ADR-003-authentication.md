# ADR-003: User Authentication and Session Management

> **Status:** Proposed  
> **Date:** 2026-10-12  
> **Deciders:** Engineering Team  
> **Consulted:** [`security-design.md`](../security-design.md), [`functional-requirements.md`](../../02-requirements/functional-requirements.md)  

---

## 1. Context & Problem Statement

CollabTrust needs a secure, lightweight authentication mechanism for brand and creator users. The system must support role-based authorization, persist across client page reloads, protect against common web vulnerabilities (XSS, CSRF), and remain simple to deploy within a monolithic Node.js/Express environment without external identity provider dependencies for the MVP.

---

## 2. Decision

We propose **JSON Web Tokens (JWT) signed via HMAC-SHA256 (`HS256`)**, issued upon successful email/password authentication (passwords hashed via `bcrypt` >= 12 rounds). Tokens will be stored in client browsers using **`httpOnly`, `Secure`, `SameSite=Lax` cookies**. The API will also accept `Authorization: Bearer <token>` headers to facilitate automated integration testing.

---

## 3. Rationale

1. **Simplicity & Self-Contained:** JWT verification requires only the shared secret in environment variables; no separate session store (Redis) is required for MVP.
2. **XSS Protection:** Storing tokens in `httpOnly` cookies prevents JavaScript from reading token contents, eliminating client-side token theft via XSS.
3. **Role Embedding:** User role (`brand` or `creator`) is embedded directly in the verified token payload, allowing Express middleware to perform instant RBAC checks without redundant database lookups on every request.
4. **Independent from Third Parties:** Self-hosted email/password authentication avoids reliance on third-party OAuth provider approvals (Google/Instagram) during initial MVP development.

---

## 4. Consequences & Trade-offs

* **Positive:** Stateless verification keeps API endpoints fast; zero external infrastructure dependencies for auth; strong baseline security.
* **Negative:** Token revocation before expiration (24h) requires a token denylist table if instant invalidation is needed. For MVP, standard token expiration and client-side cookie deletion on logout is sufficient.
