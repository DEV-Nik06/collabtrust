# CollabTrust — AI Architecture

> **Status:** Draft (Proposed)  
> **Phase:** Phase 5 — AI  
> **Depends on:** [`system-architecture.md`](../03-architecture/system-architecture.md), [`ADR-004-ai-architecture.md`](../03-architecture/ADR/ADR-004-ai-architecture.md), [`mvp-scope.md`](../01-product/mvp-scope.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview & AI Principles

CollabTrust leverages generative AI to eliminate repetitive manual work across creator discovery, brief structuring, and trust signal synthesis.

### Foundational Guardrails
1. **AI-Assisted, Human-Controlled:** AI recommends, analyzes, and drafts; human users make all publishing, application, selection, and collaboration decisions.
2. **Evidence Over Claims:** Trust Analysis presents observational signals and potential anomalies, never claiming guaranteed fraud detection or definitive authenticity verdicts.
3. **Mandatory Explainability:** Every creator match surfaced by AI includes a human-readable explanation of why the match is suitable.
4. **No Autonomous Outbound Action:** AI agents have zero access to outbound messaging or payment execution tools.

---

## 2. AI Layer Architecture

The AI subsystem operates as an integrated service layer within the Express API server:

```
┌─────────────────────────────────────────────────────────────┐
│                    API Service Layer                        │
├─────────────────────────────────────────────────────────────┤
│                    AI Orchestration Layer                   │
│                                                             │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │ Campaign Brief Agent  │       │ Creator Matching Agent │  │
│  └──────────┬────────────┘       └──────────┬────────────┘  │
│  ┌──────────▼────────────┐       ┌──────────▼────────────┐  │
│  │ Trust Analysis Agent  │       │ Profile Insight Agent │  │
│  └──────────┬────────────┘       └──────────┬────────────┘  │
│             │                               │               │
│             └───────────────┬───────────────┘               │
│                             │                               │
│              ┌──────────────▼───────────────┐               │
│              │ Prompt Sanitizer & Delimiter │               │
│              └──────────────┬───────────────┘               │
│              ┌──────────────▼───────────────┐               │
│              │  External LLM Client (REST)  │               │
│              └──────────────┬───────────────┘               │
│              ┌──────────────▼───────────────┐               │
│              │ Zod Schema Validator & Filter│               │
│              └──────────────┬───────────────┘               │
└─────────────────────────────┼───────────────────────────────┘
                              │ HTTPS
                       ┌──────▼──────┐
                       │ External LLM│
                       │     API     │
                       └─────────────┘
```

> **Figure:** The AI orchestration layer — MVP agents only. Deferred agents (Collaboration Assistant, Workflow Coordinator) are omitted from this diagram; see [`agent-specifications.md`](./agent-specifications.md).

---

## 3. Planned AI Agents Catalog

| Agent Name | Role & Purpose | MVP Status | Hackathon Priority | Primary Inputs | Output Structure |
|---|---|:---:|:---:|---|---|
| **Campaign Brief Agent** | Converts free-text ideas into structured, editable campaign drafts | **MVP** | 1 | Brand unstructured text | Structured JSON Brief |
| **Trust Analysis Agent** | Synthesizes observational signals and anomaly notes | **MVP** | 2 | Creator profile & self-reported metrics | Structured Signals Array + Mandatory Disclaimer |
| **Creator Matching Agent** | Compares briefs to creator profiles with explicit reasoning | **MVP** | 3 | Campaign brief + Candidate creator profiles | Ranked Matches + Explanation Strings |
| **Profile Insight Agent** | Summarizes creator audience and content style alignment | **MVP (if feasible)** | 4 | Creator profile & channels | Concise Profile Summary |
| **Collaboration Assistant** | Generates deliverable checklists and communication drafts | Deferred | — | Collaboration requirements | Checklist / Message Draft |
| **Workflow Coordinator** | Orchestrates multi-step event triggers and retries | Deferred | — | Workflow state transitions | State transition commands |

---

## 4. Operational Pipeline

1. **Input Sanitization:** User text is cleansed and wrapped in XML tags (`<user_input>`) to prevent prompt injection.
2. **Template Composition:** System instructions, developer guardrails, input data, and schema formatting instructions are combined.
3. **Inference Execution:** Sent via HTTP client to the LLM endpoint with a 30s timeout; 1 retry; exponential backoff with jitter (`NFR-024`).
4. **Schema Validation:** Raw output is parsed as JSON and validated against strict Zod schemas.
5. **Post-Processing & Filtering:** Text is verified against blacklist filters (e.g., stripping definitive fraud guarantees).
6. **Graceful Fallback:** If inference fails, the system invokes deterministic fallbacks (e.g., manual form entry).

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`agent-specifications.md`](./agent-specifications.md) | Granular agent inputs, outputs, and prompts |
| [`tool-permissions.md`](./tool-permissions.md) | Security boundary and permission scopes |
| [`workflow-specifications.md`](./workflow-specifications.md) | Agent lifecycle and human approval touchpoints |
| [`safety-guardrails.md`](./safety-guardrails.md) | Trust disclaimers and prompt injection mitigation |
