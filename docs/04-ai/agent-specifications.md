# CollabTrust — Agent Specifications

> **Status:** Draft  
> **Phase:** Phase D — AI Specifications  
> **Depends on:** [`ai-architecture.md`](./ai-architecture.md), [`feature-requirements.md`](../01-product/feature-requirements.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview

This document specifies the operational characteristics, inputs, outputs, failure modes, human approval gates, and evaluation criteria for each of the six planned CollabTrust AI agents.

---

## 2. Agent 1: Campaign Brief Agent (Priority 1 — MVP)

* **Purpose:** Converts a brand's unstructured, informal campaign concept into an actionable, structured campaign brief.
* **MVP Status:** **In Scope (MUST-HAVE)**.
* **Inputs:** Raw free-text string provided by brand user.
* **Outputs:** Structured JSON matching `CampaignBriefSchema`:
  * `title`: Concise campaign title (string).
  * `goals`: Core campaign objectives (string).
  * `targetAudience`: Target demographic and customer profile (string).
  * `deliverables`: Specific expected content pieces (e.g., "1 Reel, 2 Stories") (string).
  * `timeline`: Proposed duration or milestone dates (string).
  * `budget`: Budget range or payment model (string).
  * `requirements`: Creator criteria, product niche, or tone expectations (string).
* **Failure Handling:** Returns fallback flag to the frontend, rendering a clean blank form so the brand user can enter brief fields manually without blocking campaign creation.
* **Human Approval Point:** The brand user must review, optionally edit, and explicitly click "Save Draft" or "Publish".
* **Evaluation Criteria:** Accuracy of extracted deliverables; percentage of generated briefs accepted by brands without complete discarding (`AQ-1`).

---

## 3. Agent 2: Trust Analysis Agent (Priority 2 — MVP)

* **Purpose:** Analyzes creator profile information and self-reported metrics to surface observational trust signals and potential anomalies.
* **MVP Status:** **In Scope (MUST-HAVE)**.
* **Inputs:** CreatorProfile record (display name, niche, connected platforms, self-reported metrics, bio, account age).
* **Outputs:** Structured JSON matching `TrustAnalysisSchema`:
  * `disclaimer`: Mandatory disclaimer text.
  * `signals`: Array of `{ signalType: string, signalValue: string, severity: 'info' | 'anomaly' }`.
* **Critical Guardrail:** The agent is strictly prohibited from asserting definitive fraud or authenticity verdicts ("fake", "guaranteed authentic"). All outputs represent factual observations and anomaly flags.
* **Failure Handling:** If the agent fails, display basic profile completeness score and informational disclaimer.
* **Human Approval Point:** The brand user reviews signals during candidate vetting; trust signals are informational only and never disqualify creators automatically.
* **Evaluation Criteria:** Compliance with non-verdict guardrail (`AC-030.2`); perceived usefulness of observational signals by brands (`AQ-4`).

---

## 4. Agent 3: Creator Matching Agent (Priority 3 — MVP)

* **Purpose:** Compares active campaign requirements against registered creator profiles to return ranked candidate matches with explicit human-readable reasoning.
* **MVP Status:** **In Scope (MUST-HAVE)**.
* **Inputs:** Active Campaign record + collection of active CreatorProfile records.
* **Outputs:** Array of structured matches:
  * `creatorId`: Creator profile UUID.
  * `score`: Numerical fit score between 0.0 and 1.0.
  * `explanation`: Clear human-readable justification of why the creator fits (e.g., audience niche alignment, content format synergy).
  * `factors`: Breakdown of niche overlap and audience fit.
* **Failure Handling:** Returns empty match list with guidance ("No creators match criteria, try broadening requirements"); never throws fatal application errors.
* **Human Approval Point:** The brand user reviews matches and decides whether to shortlist, wait for applications, or manually invite.
* **Evaluation Criteria:** Helpfulness of explanation strings (`AQ-2`); brand interaction rate with suggested matches (`AQ-3`).

---

## 5. Agent 4: Profile Insight Agent (Priority 4 — MVP If Feasible)

* **Purpose:** Generates a concise executive summary of a creator's content focus, audience alignment, and key collaboration strengths.
* **MVP Status:** **In Scope (SHOULD-HAVE)**.
* **Inputs:** CreatorProfile record and recent portfolio/channel highlights.
* **Outputs:** Markdown summary highlighting audience demographic alignment and content style notes.
* **Failure Handling:** Renders raw creator profile fields without summary.
* **Human Approval Point:** Viewed during brand application review.

---

## 6. Agent 5: Collaboration Assistant (Deferred Post-MVP)

* **Purpose:** Drafts milestone checklists, deliverable requirements documents, and communication templates between brand and creator.
* **MVP Status:** **Deferred Post-MVP**.
* **Rationale:** In the MVP, basic milestone tracking and text messaging are handled directly by the application data model without AI generation.

---

## 7. Agent 6: Workflow Coordinator (Deferred Post-MVP)

* **Purpose:** Automates multi-step event triggers, deadline tracking, reminder notifications, and retry pipelines.
* **MVP Status:** **Deferred Post-MVP**.
* **Rationale:** MVP workflow state transitions are driven by direct user button interactions in the UI, rendering complex workflow orchestration unnecessary.

---

## 8. Related Documents

| Document | Purpose |
|---|---|
| [`ai-architecture.md`](./ai-architecture.md) | High-level AI layer architecture |
| [`tool-permissions.md`](./tool-permissions.md) | Tool and sandbox permission limits |
| [`prompt-specifications.md`](./prompt-specifications.md) | Detailed prompt templates and schemas |
| [`safety-guardrails.md`](./safety-guardrails.md) | Security rules and disclaimer copy |
