# CollabTrust — AI Tool Permissions & Access Scopes

> **Status:** Draft  
> **Phase:** Phase D — AI Specifications  
> **Depends on:** [`agent-specifications.md`](./agent-specifications.md), [`security-design.md`](../03-architecture/security-design.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Principle of Least Privilege for AI Agents

CollabTrust enforces strict sandboxing across all AI agents. Because the platform operates on the core principle of **"AI recommends, humans decide,"** AI agents are designed as pure analytical functions (Text In -> Structured Data Out) rather than autonomous actors equipped with system tools.

---

## 2. Agent Permission Matrix

| Agent Name | Database Read Access | Database Write Access | External Network / Web Access | Email / Messaging Access | Payment / Financial Tools |
|---|:---:|:---:|:---:|:---:|:---:|
| **Campaign Brief Agent** | None (Payload only) | None (Returns to API) | ❌ Prohibited | ❌ Prohibited | ❌ Prohibited |
| **Creator Matching Agent** | Read CreatorProfiles | None (Returns to API) | ❌ Prohibited | ❌ Prohibited | ❌ Prohibited |
| **Trust Analysis Agent** | Read CreatorProfile | None (Returns to API) | ❌ Prohibited | ❌ Prohibited | ❌ Prohibited |
| **Profile Insight Agent** | Read CreatorProfile | None (Returns to API) | ❌ Prohibited | ❌ Prohibited | ❌ Prohibited |
| **Collaboration Assistant** *(Deferred)* | Read Collaboration | None (Draft only) | ❌ Prohibited | ❌ Prohibited | ❌ Prohibited |
| **Workflow Coordinator** *(Deferred)* | Read Event state | Propose State change | ❌ Prohibited | ❌ Prohibited | ❌ Prohibited |

---

## 3. Explicit Tool Prohibitions

The following capabilities are **permanently prohibited** from being granted to any AI agent in the CollabTrust system:
1. **Autonomous Outreach:** Agents cannot initiate contact, dispatch emails, or send direct messages to creators or brands without human review and confirmation.
2. **Autonomous Publishing:** Agents cannot publish campaigns, set budgets, or modify live campaign listings directly.
3. **Financial / Payment Execution:** Agents have zero access to banking, payment processor tokens, or escrow release actions.
4. **Arbitrary Code Execution:** Agents are never provided shell access, code evaluation environments, or unconstrained file system write permissions.
5. **Direct External Web Scraping:** In the MVP, agents process only self-reported and platform-verified data provided in API payloads; unconstrained web scrapers are prohibited.

---

## 4. Enforcement Mechanisms

* **Architectural Isolation:** LLM API calls are executed using direct inference endpoints without registering tools or function-calling hooks capable of mutating state.
* **Service Mediation:** All database reads and writes are performed strictly by backend TypeScript service code before and after LLM inference. The LLM receives data purely as serialized string context.
* **Output Quarantine:** Raw LLM outputs are held in memory, parsed, and validated against Zod schemas before being presented to users for confirmation.

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`agent-specifications.md`](./agent-specifications.md) | Agent inputs, outputs, and behaviors |
| [`safety-guardrails.md`](./safety-guardrails.md) | Safety guardrails and disclaimer rules |
| [`security-design.md`](../03-architecture/security-design.md) | Platform security architecture |
