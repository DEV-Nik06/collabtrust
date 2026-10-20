# CollabTrust — AI Workflow Specifications

> **Status:** Draft  
> **Phase:** Phase 5 — AI  
> **Depends on:** [`agent-specifications.md`](./agent-specifications.md), [`user-journeys.md`](../01-product/user-journeys.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview

This document specifies the end-to-end execution workflows connecting user actions to AI agent invocations, detailing human-in-the-loop approval gates, state transitions, and error recovery sequences.

---

## 2. Workflow 1: AI-Assisted Campaign Brief Structuring

```
[Brand User] Enters raw campaign text
      │
      ▼
[API Server] Sanitizes input & constructs prompt with XML delimiters
      │
      ▼
[Campaign Brief Agent] LLM inference executes (max 30s;
      │                  1 retry; exponential backoff with jitter)
      │
      ├───────────────────────┬───────────────────────┐
      ▼ (Success)             ▼ (Timeout / Error)     ▼ (Malformed JSON)
[Zod Schema Validator]   [Log Warning]           [Retry with backoff]
      │                       │                       │
      │ Valid JSON            │ Fallback Triggered    │ Failed twice
      ▼                       ▼                       ▼
[Populate Draft Form]    [Render Empty Form]     [Render Empty Form]
      │                       │                       │
      └───────────────────────┼───────────────────────┘
                              ▼
                [HUMAN APPROVAL GATE 1]
           Brand reviews & edits all fields
                              │
                              ▼
             Brand clicks "Save Draft" or "Publish"
```

* **Human Gate:** The brand user must review, optionally edit, and explicitly authorize saving or publishing the structured brief. No campaign is published automatically.
* **Retry Policy:** Transient inference failures use a 30s timeout; 1 retry; exponential backoff with jitter (`NFR-024`).

---

## 3. Workflow 2: Explainable Creator Matching

```
[Brand User] Publishes campaign (or requests refresh via
      │        POST /api/v1/matches/refresh)
      ▼
[API Server] Queries active CreatorProfiles matching coarse category
      │
      ▼
[Check Match Cache (FR-047)] Cached matches for this campaign exist,
      │                       are < 24h old, and criteria unchanged?
      ├───────────────────────────────┐
      ▼ (Yes)                         ▼ (No / Stale / Criteria changed)
[Return Cached Match Set]    [Creator Matching Agent]
      │    (skip LLM call)       │   Compares brief requirements to creator profiles
      │                               │   Generates fit scores + human-readable reasoning
      │                               ▼
      │                         [Zod Schema Validator] Validates array of matches with explanation strings
      │                               │
      │                               ▼
      │                         [Persist Match Records] Saves to PostgreSQL `Match` table
      │                               │
      └───────────────┬───────────────┘
                      ▼
[Brand Console UI] Renders ranked creators with explicit match explanations
      │
      ▼
[HUMAN APPROVAL GATE 2]
Brand user reviews candidates, reads explanations, and evaluates applications
```

* **Cache Gate (`FR-047` / `AC-020.5`):** If cached matches for this campaign exist and are < 24h old (and campaign criteria are unchanged), the existing Match record is returned instead of re-running the agent — no second LLM invocation occurs.
* **Human Gate:** The brand makes all outreach and selection decisions. Matching provides ranked recommendations; it never sends invites automatically.

---

## 4. Workflow 3: Trust Signal Synthesis & Evaluation

```
[Brand User] Clicks "View Creator Details & Trust Signals"
      │
      ▼
[API Server] Retrieves cached TrustSignals (or triggers Trust Analysis Agent)
      │
      ▼
[Trust Analysis Agent] Analyzes self-reported metrics, profile completeness,
      │                 and historical anomalies
      ▼
[Safety Guardrail Filter] Confirms absence of definitive fraud assertions
      │                   Injects mandatory informational disclaimer
      ▼
[Creator Profile UI] Renders observational signals, anomaly notes, and disclaimer
      │
      ▼
[HUMAN APPROVAL GATE 3]
Brand user interprets evidence and makes final selection decision
```

* **Human Gate:** Trust signals are presented strictly as observational evidence to inform human judgment. The system never automatically bans or approves creators based on signals.

---

## 5. Workflow 4: Profile Insight Synthesis

```
[Brand User] Requests profile insight while reviewing a creator profile
      │        (FR-046, US-012)
      ▼
[API Server] Serializes self-reported CreatorProfile data into prompt context
      │
      ▼
[Profile Insight Agent] Summarizes audience alignment & content style
      │                  (max 30s; 1 retry; exponential backoff with jitter)
      ▼
[Zod Schema Validator] Validates ProfileInsightSchema JSON (NFR-070)
      │
      ├───────────────────────┬───────────────────────┐
      ▼ (Success)             ▼ (Timeout / Error)     ▼ (Malformed JSON)
[Render Insight Card]    [Log Warning]           [Schema Failure]
      │                       │                       │
      │ Valid JSON            │ Fallback Triggered    │ Fallback Triggered
      ▼                       ▼                       ▼
[Brand Console UI]      [Show "Insight unavailable"] [Show "Insight unavailable"]
                               + raw profile fields      + raw profile fields
```

* **No Human Approval Gate:** The Profile Insight Agent is read-only — it produces no state changes and no outbound actions, so no approval gate is needed. Insights are decision support only.
* **Grounding:** Every output field derives from provided/self-reported profile data (`NFR-077`); the agent never infers metrics not present in the input.
* **Fallback:** On timeout, error, or schema-validation failure, the UI displays "Insight unavailable" and falls back to raw creator profile fields.

---

## 6. Related Documents

| Document | Purpose |
|---|---|
| [`agent-specifications.md`](./agent-specifications.md) | Agent input/output definitions |
| [`prompt-specifications.md`](./prompt-specifications.md) | Prompt templates and schemas |
| [`safety-guardrails.md`](./safety-guardrails.md) | Safety rules and copy guidelines |
