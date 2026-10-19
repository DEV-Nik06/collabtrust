# Knowledge Base — AI Agents Knowledge

> **Category:** AI & Agents  
> **Source Documents:** [`docs/04-ai/`](../../docs/04-ai/)  

---

## 1. Multi-Agent Design Philosophy
CollabTrust deploys targeted single-responsibility AI agents rather than an unconstrained autonomous bot:
1. **Campaign Brief Agent:** Converts unstructured text into professional brief drafts.
2. **Creator Matching Agent:** Computes alignment scores with mandatory textual explanations.
3. **Trust Analysis Agent:** Evaluates profile completeness and signals without claiming fraud verdicts.
4. **Profile Insight Agent:** Synthesizes creator audience and content style summaries.

---

## 2. Core Guardrail Rules
* **No Definitive Fraud Claims:** Trust analysis produces observational signals and anomaly notes. Terms like "fake account" or "guaranteed authentic" are prohibited.
* **Mandatory Copy Disclaimer:** Every trust signal view carries the disclaimer: *"Informational observations only. CollabTrust surfaces signals and evidence, not fraud guarantees or definitive authenticity verdicts."*
* **Human Approval Gates:** AI outputs are advisory drafts; humans explicitly approve publishing, creator selection, and payments.
* **Zero Autonomous Outreach:** AI agents have no network access to dispatch emails or private messages.

---

## 3. Prompt Engineering Standards
* Delimit untrusted user inputs with XML tags (`<user_campaign_input>`).
* Enforce strict JSON output schemas validated via Zod.
* Implement deterministic fallbacks (e.g., standard manual form) if LLM calls fail.

---

## 4. Key AI References
* [`docs/04-ai/ai-architecture.md`](../../docs/04-ai/ai-architecture.md)
* [`docs/04-ai/agent-specifications.md`](../../docs/04-ai/agent-specifications.md)
* [`docs/04-ai/safety-guardrails.md`](../../docs/04-ai/safety-guardrails.md)
* [`docs/04-ai/prompt-specifications.md`](../../docs/04-ai/prompt-specifications.md)
