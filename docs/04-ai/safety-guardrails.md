# CollabTrust — AI Safety & Guardrails

> **Status:** Draft  
> **Phase:** Phase D — AI Specifications  
> **Depends on:** [`product-vision.md`](../01-product/product-vision.md), [`problem-definition.md`](../01-product/problem-definition.md), [`agent-specifications.md`](./agent-specifications.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview & Ethical AI Principles

CollabTrust implements strict architectural, algorithmic, and copy guardrails to ensure that AI capabilities enhance human agency rather than undermining trust.

### Foundational Principles
1. **AI-Assisted, Human-Controlled:** AI acts solely as a draft generator, summarizer, and recommender. Critical commercial and relational actions (publishing campaigns, sending invitations, selecting creators, approving deliverables) require explicit human user clicks.
2. **Evidence Over Claims:** Trust analysis provides observational signals and evidence; it is architecturally prohibited from making definitive fraud claims.
3. **Transparency & Explainability:** Recommendations must explicitly communicate why a pairing was suggested.
4. **Zero Autonomous Outbound High-Impact Actions:** The AI engine has no network hooks for messaging, outreach, or payment release.

---

## 2. Guardrail 1: Observational Trust Signals & Non-Verdict Language

### The Risk
Automated systems that label content creators as "fake" or "fraudulent" risk causing severe reputational damage based on imperfect public metrics or algorithmic errors. Conversely, systems that label accounts as "certified authentic" create dangerous false senses of security for brands.

### The Guardrail
* **Prohibited Terminology:** AI agents, backend services, and frontend UI components are prohibited from using definitive fraud assertions:
  * ❌ Prohibited: `"Fake account"`, `"Guaranteed fraud"`, `"100% authentic"`, `"Certified genuine"`, `"Verified non-fraudulent"`.
  * ✅ Permitted: `"Observational signals"`, `"Consistent engagement ratio"`, `"Unusual follower growth spike observed"`, `"Self-reported audience metrics"`.
* **Mandatory Copy Disclaimer:** Every UI card, modal, or API response displaying trust signals must include the following verbatim disclaimer:
  > *"Informational observations only. CollabTrust surfaces signals and evidence, not fraud guarantees or definitive authenticity verdicts."*
* **Architectural Enforcement:** The backend Trust Analysis service passes all generated text through a string filter that validates against prohibited terminology before persisting or returning data.

---

## 3. Guardrail 2: Human-in-the-Loop Decision Gates

| Action | Can AI Perform Automatically? | Mandatory Human Approval Requirement |
|---|:---:|---|
| Structure Campaign Brief | ✅ Yes (Generates Draft) | Brand must review, edit, and click "Save" or "Publish". |
| Publish Campaign to Marketplace | ❌ Prohibited | Brand must explicitly click "Publish". |
| Suggest Matching Creators | ✅ Yes (Ranks & Explains) | System displays candidates; zero invites dispatched. |
| Outreach / Message Creator | ❌ Prohibited | Brand must review application and click "Accept" or message manually. |
| Accept / Decline Application | ❌ Prohibited | Brand user must make the decision. |
| Approve Deliverables / Complete Campaign | ❌ Prohibited | Brand user must verify content links and confirm completion. |
| Release Payments / Financial Transfers | ❌ Prohibited | All payments are completely out of scope for MVP. |

---

## 4. Guardrail 3: Prompt Injection Mitigation & Schema Enforcement

* **XML Tag Delimitation:** All untrusted user inputs (free-text campaign descriptions, creator bios, pitches) are sanitized and wrapped in unambiguous XML tags (`<user_campaign_input>`). System instructions explicitly instruct models to treat wrapped text purely as unstructured data.
* **Schema Validation (Zod):** Models are forced to output JSON. The backend parses and strictly validates the JSON against Zod schemas. If the output deviates or contains extraneous non-JSON content, the request fails gracefully to deterministic fallback UI forms.
* **Prompt Isolation:** Prompts do not contain internal system secrets, database credentials, or private communication histories of other users.

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`agent-specifications.md`](./agent-specifications.md) | Agent behaviors and criteria |
| [`prompt-specifications.md`](./prompt-specifications.md) | System and user prompt templates |
| [`tool-permissions.md`](./tool-permissions.md) | Tool and sandbox access boundaries |
| [`security-design.md`](../03-architecture/security-design.md) | Platform security architecture |
