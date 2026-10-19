# ADR-004: AI Agent Architecture and LLM Integration

> **Status:** Proposed  
> **Date:** 2026-10-12  
> **Deciders:** Engineering & AI Team  
> **Consulted:** [`PROJECT_CONTEXT.md`](../../../PROJECT_CONTEXT.md), [`mvp-scope.md`](../../01-product/mvp-scope.md)  

---

## 1. Context & Problem Statement

CollabTrust features multiple planned AI capabilities: Campaign Brief Agent (Priority 1), Trust Analysis Agent (Priority 2), Creator Matching Agent (Priority 3), and Profile Insight Agent. We must determine how to orchestrate these agents inside the application architecture:
* Should we adopt heavy multi-agent frameworks (e.g., LangGraph, AutoGen)?
* Or should we implement a lightweight, structured orchestration service embedded directly within the Express backend?

---

## 2. Decision

We propose a **Lightweight Custom AI Service Layer** embedded directly within the Node.js/Express backend, interacting with external LLM APIs (e.g., Anthropic Claude / OpenAI / Google Gemini API) via typed SDKs or direct HTTP clients. Structured outputs will be enforced and validated using **Zod schemas**.

Heavy frameworks like LangGraph are deferred until post-MVP multi-turn autonomous agent needs genuinely require them.

---

## 3. Rationale

1. **Focused MVP Scope:** In the MVP, all agent interactions are single-turn or simple request-response workflows (e.g., text-to-brief, creator-profile-to-matches, profile-to-trust-signals). Complex graph orchestration or cyclic autonomous planning is unnecessary.
2. **Deterministic Control & Safety:** Direct TypeScript services wrapping prompt templates allow complete control over input sanitization, XML delimitation, error fallback handling, and schema validation.
3. **Reduced Dependency Risk:** Minimizes dependency bloat and keeps the build fast and debuggable.
4. **Enforcing Human-in-the-Loop:** Explicit service methods guarantee that AI outputs return to human users for review, preventing autonomous action execution.

---

## 4. Consequences & Trade-offs

* **Positive:** Fast execution, minimal overhead, straightforward unit and integration testing via mock LLM adapters.
* **Negative:** If future product phases require complex autonomous multi-agent debates or tool-use loops, a framework like LangGraph may need to be evaluated and integrated later.
