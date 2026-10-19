# CollabTrust — AI Workflow Specifications

> **Status:** Draft  
> **Phase:** Phase D — AI Specifications  
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
[Campaign Brief Agent] LLM inference executes (max 30s)
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

---

## 3. Workflow 2: Explainable Creator Matching

```
[Brand User] Publishes campaign (or clicks "Refresh Matches")
      │
      ▼
[API Server] Queries active CreatorProfiles matching coarse category
      │
      ▼
[Creator Matching Agent] Compares brief requirements to creator profiles
      │                  Generates fit scores + human-readable reasoning
      ▼
[Zod Schema Validator] Validates array of matches with explanation strings
      │
      ▼
[Persist Match Records] Saves to PostgreSQL `Match` table
      │
      ▼
[Brand Console UI] Renders ranked creators with explicit match explanations
      │
      ▼
[HUMAN APPROVAL GATE 2]
Brand user reviews candidates, reads explanations, and evaluates applications
```

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

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`agent-specifications.md`](./agent-specifications.md) | Agent input/output definitions |
| [`prompt-specifications.md`](./prompt-specifications.md) | Prompt templates and schemas |
| [`safety-guardrails.md`](./safety-guardrails.md) | Safety rules and copy guidelines |
