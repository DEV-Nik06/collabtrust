# CollabTrust — AI Evaluation Plan

> **Status:** Draft  
> **Phase:** Phase 5 — AI  
> **Depends on:** [`agent-specifications.md`](./agent-specifications.md), [`goals-success-metrics.md`](../01-product/goals-success-metrics.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview & Evaluation Goals

To ensure AI outputs are consistently reliable, safe, and explainable, CollabTrust implements an evaluation framework measuring both technical performance (schema conformity, latency) and product utility (relevance, explainability, compliance).

### Core Evaluation Objectives
1. **Schema Integrity:** Verify 100% valid JSON adherence across all agent outputs.
2. **Explainability Quality:** Ensure matching explanations are clear, actionable, and reference specific fit criteria.
3. **Safety & Guardrail Compliance:** Ensure zero instances of definitive fraud claims or hallucinated guarantees.
4. **Interactive Responsiveness:** Keep p95 inference latency below 30 seconds (`NFR-003`).

### Evaluation Infrastructure Status

The datasets, runner, and CI integration described in this plan are planned capabilities — none are implemented yet.

| Component | Type | Status | Owner |
|---|---|---|---|
| Campaign Brief dataset (25 synthetic pitches) | Test dataset | Planned — not yet implemented | TBD |
| Creator Matching dataset (10 briefs / 50 profiles) | Test dataset | Planned — not yet implemented | TBD |
| Trust Analysis dataset (20 profiles) | Test dataset | Planned — not yet implemented | TBD |
| Profile Insight dataset (creator profiles) | Test dataset | Planned — not yet implemented | TBD |
| Automated Evaluation Runner (CLI script) | Tooling | Planned — not yet implemented | TBD |
| CI regression job | CI job | Planned — not yet implemented | TBD |

---

## 2. Evaluation Suites by Agent

### 2.1 Campaign Brief Agent Evaluation
* **Test Dataset:** 25 synthetic free-text campaign pitches spanning diverse styles (e.g., highly informal slang, bullet points, sparse 1-line inputs, overly detailed paragraphs). Sparse and ambiguous inputs are specifically included to exercise partial/failure cases.
* **Metrics & Benchmarks:**
  * **JSON Parse Success Rate:** Target 100% (`NFR-070`).
  * **Key Entity Extraction:** Target >= 90% accuracy in extracting title, deliverables, and budget (Proposed target — no baseline yet).
  * **Structuring Coverage (`AC-011.2`):** Verify the structured JSON returned contains title, goals, target audience, deliverables, and budget for well-specified inputs; verify partial/failure cases (sparse or ambiguous input) degrade gracefully to the manual blank-form fallback instead of fabricating content (`NFR-077` grounding).
  * **Human Acceptance Rate (`AQ-1`):** Target >= 70% of briefs accepted with minor or no edits during user testing (Proposed target — no baseline yet; see [`goals-success-metrics.md`](../01-product/goals-success-metrics.md)).

### 2.2 Creator Matching Agent Evaluation
* **Test Dataset:** 10 diverse campaign briefs matched against a synthetic pool of 50 varied creator profiles (varying niches, platform handles, audience sizes).
* **Metrics & Benchmarks:**
  * **Top-3 Ranking Relevance:** Evaluated by human reviewers for obvious topical overlap (target >= 80%; Proposed target — no baseline yet).
  * **Explanation Clarity (`AQ-2`):** Human review of explanation strings for presence of specific alignment factors (target >= 85%; Proposed target — no baseline yet; `AQ-2` baseline is TBD in [`goals-success-metrics.md`](../01-product/goals-success-metrics.md)).
  * **Interaction Rate (`AQ-3`):** Target >= 40% of suggested matches clicked or shortlisted by brand testers (Proposed target — no baseline yet).

### 2.3 Trust Analysis Agent Evaluation
* **Test Dataset:** 20 creator profiles with varying metric distributions, missing fields, and simulated anomalous engagement ratios.
* **Metrics & Benchmarks:**
  * **Guardrail Compliance (`AC-030.2`):** 100% pass rate in automated regex linter checking against the canonical prohibited-terminology list in [`safety-guardrails.md`](./safety-guardrails.md) §2. The linter and evaluation datasets must reference that canonical list rather than maintaining local copies.
  * **Observational Signal Coverage (`AC-030.1`):** Verify returned signals cover profile completeness, metric (engagement) consistency, and anomaly notes; every `signalValue` must be phrased as a non-verdict observation (`FR-051`).
  * **Non-Verdict Phrasing (`AC-030.1` / `AC-030.2`):** Prohibited-phrase linter (canonical list: [`safety-guardrails.md`](./safety-guardrails.md) §2) runs over every generated signal; target 100% free of prohibited terms.
  * **Groundedness / Signal Traceability (`AC-030.4`):** Every returned signal must reference an underlying data point (profile field completeness score, self-reported audience metric, etc.) actually present in the input profile, so the UI can render the source data point on expansion (`NFR-077`); target 100% of signals traceable, with fields omitted when input data is absent.
  * **Anomaly Detection Consistency:** Verifies that artificial engagement spikes trigger observational anomaly notes without throwing definitive verdicts.
  * **Disclaimer Presence (`AC-030.3`):** 100% verification that the mandatory disclaimer string is attached.
  * **Perceived Accuracy (`AQ-4`):** Post-review user assessment that surfaced signals were consistent with their own evaluation; no numeric target yet (`AQ-4` baseline is TBD in [`goals-success-metrics.md`](../01-product/goals-success-metrics.md)).

### 2.4 Profile Insight Agent Evaluation
* **Test Dataset:** Synthetic creator profiles with varying completeness — including profiles missing audience or content-style fields to verify omission behavior.
* **Metrics & Benchmarks:**
  * **Summary Rendering (`AC-023.1`):** Verify a concise audience and content alignment summary is rendered for the brand reviewer.
  * **JSON Schema Conformance:** Target 100% valid JSON matching `ProfileInsightSchema`, with no Markdown or conversational text (`NFR-070`).
  * **Groundedness (`NFR-077`):** 100% of output fields derive from the provided/self-reported profile data; absent input data results in omitted fields, never inferred metrics.

---

## 3. Evaluation Pipeline & Execution

```
[Synthetic Fixtures Dataset]
      │
      ▼
[Automated Evaluation Runner (CLI script)]
      │
      ├───────────────────────┬───────────────────────┐
      ▼                       ▼                       ▼
[Schema Validation]     [Regex Safety Linter]   [Similarity Scoring]
(JSON / Zod)            (No fraud verdicts)     (Keyword / Heuristic)
      │                       │                       │
      └───────────────────────┼───────────────────────┘
                              ▼
                 [Generated Evaluation Report]
                 Summary of pass rates & latencies
```

* **Automated CI Integration (Planned):** A lightweight synthetic test suite is planned to run during CI regression testing using mock responses or a small deterministic test budget. Not yet implemented — see the Evaluation Infrastructure Status table in §1.
* **Human-in-the-Loop Review:** Periodic spot checks by developers and product reviewers before major prompt revisions.

---

## 4. Related Documents

| Document | Purpose |
|---|---|
| [`agent-specifications.md`](./agent-specifications.md) | Agent behaviors and criteria |
| [`prompt-specifications.md`](./prompt-specifications.md) | Prompts and schemas evaluated |
| [`safety-guardrails.md`](./safety-guardrails.md) | Safety rules and copy constraints |
| [`docs/06-testing/test-plan.md`](../06-testing/test-plan.md) | Overall platform testing strategy |
