# CollabTrust — AI Evaluation Plan

> **Status:** Draft  
> **Phase:** Phase D — AI Specifications  
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

---

## 2. Evaluation Suites by Agent

### 2.1 Campaign Brief Agent Evaluation
* **Test Dataset:** 25 synthetic free-text campaign pitches spanning diverse styles (e.g., highly informal slang, bullet points, sparse 1-line inputs, overly detailed paragraphs).
* **Metrics & Benchmarks:**
  * **JSON Parse Success Rate:** Target 100%.
  * **Key Entity Extraction:** Target >= 90% accuracy in extracting title, deliverables, and budget.
  * **Human Acceptance Rate (`AQ-1`):** Target >= 70% of briefs accepted with minor or no edits during user testing.

### 2.2 Creator Matching Agent Evaluation
* **Test Dataset:** 10 diverse campaign briefs matched against a synthetic pool of 50 varied creator profiles (varying niches, platform handles, audience sizes).
* **Metrics & Benchmarks:**
  * **Top-3 Ranking Relevance:** Evaluated by human reviewers for obvious topical overlap (target >= 80%).
  * **Explanation Clarity (`AQ-2`):** Human review of explanation strings for presence of specific alignment factors (target >= 85%).
  * **Interaction Rate (`AQ-3`):** Target >= 40% of suggested matches clicked or shortlisted by brand testers.

### 2.3 Trust Analysis Agent Evaluation
* **Test Dataset:** 20 creator profiles with varying metric distributions, missing fields, and simulated anomalous engagement ratios.
* **Metrics & Benchmarks:**
  * **Guardrail Compliance (`AC-030.2`):** 100% pass rate in automated regex linter checking for prohibited words ("fake", "guaranteed authentic", "fraud detected").
  * **Anomaly Detection Consistency:** Verifies that artificial engagement spikes trigger observational anomaly notes without throwing definitive verdicts.
  * **Disclaimer Presence (`AC-030.3`):** 100% verification that the mandatory disclaimer string is attached.

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

* **Automated CI Integration:** A lightweight synthetic test suite runs during CI regression testing using mock responses or a small deterministic test budget.
* **Human-in-the-Loop Review:** Periodic spot checks by developers and product reviewers before major prompt revisions.

---

## 4. Related Documents

| Document | Purpose |
|---|---|
| [`agent-specifications.md`](./agent-specifications.md) | Agent behaviors and criteria |
| [`prompt-specifications.md`](./prompt-specifications.md) | Prompts and schemas evaluated |
| [`safety-guardrails.md`](./safety-guardrails.md) | Safety rules and copy constraints |
| [`docs/06-testing/test-plan.md`](../06-testing/test-plan.md) | Overall platform testing strategy |
