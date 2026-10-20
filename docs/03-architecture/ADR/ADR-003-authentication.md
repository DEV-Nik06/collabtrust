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

### Token model (amended 2026-10-20)

* **Access token:** 15-minute TTL (`JWT_EXPIRY`), carries a `tokenVersion` claim.
* **Refresh token:** 7-day TTL (`JWT_REFRESH_EXPIRY`), used to obtain new access tokens.
* **Revocation:** the user record stores a `tokenVersion` counter; logout and password change increment it. Sensitive routes (password change, account deletion, campaign publication, application acceptance) verify the claim server-side, rejecting stale tokens immediately — satisfying FR-005 / NFR-016 (MUST, immediate revocation) without a per-request denylist.

> This amendment resolves the earlier conflict where this ADR declined instant revocation while FR-005 / NFR-016 required it.

---

## 3. Rationale

1. **Simplicity & Self-Contained:** JWT verification requires only the shared secret in environment variables; no separate session store (Redis) is required for MVP.
2. **XSS Protection:** Storing tokens in `httpOnly` cookies prevents JavaScript from reading token contents, eliminating client-side token theft via XSS.
3. **Role Embedding:** User role (`brand` or `creator`) is embedded directly in the verified token payload, allowing Express middleware to perform instant RBAC checks without redundant database lookups on every request.
4. **Independent from Third Parties:** Self-hosted email/password authentication avoids reliance on third-party OAuth provider approvals (Google/Instagram) during initial MVP development.

---

## 4. Consequences & Trade-offs

* **Positive:** Stateless verification keeps API endpoints fast; zero external infrastructure dependencies for auth; strong baseline security.
* **Negative:** Revocation relies on a `tokenVersion` claim checked on sensitive routes rather than on every request — a revoked access token remains technically valid for low-sensitivity reads until its 15-minute expiry. The 15-minute TTL bounds this exposure; refresh tokens are invalidated on password change, so a revoked user cannot mint new access tokens.
