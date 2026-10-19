# CollabTrust — Product Vision

> **Status:** Defined  
> **Phase:** 2.1 — Product Vision  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  
> **Do not modify without updating `PROJECT_CONTEXT.md` to reflect any changes.**

---

## 1. Project Overview

**CollabTrust** is an AI-assisted creator-brand collaboration marketplace that connects brands and creators of different sizes and stages, helping both sides discover, evaluate, match, and manage collaboration opportunities.

---

## 2. Mission

> Make creator-brand collaborations more accessible, transparent, and efficient for creators and brands of different sizes and stages.

---

## 3. Vision

> CollabTrust aims to become an intelligent collaboration platform where brands and creators can discover relevant opportunities, evaluate collaboration signals, and manage campaigns through AI-assisted workflows.

---

## 4. Initial Focus

The initial and primary target segment is **emerging/micro creators** and **small/growing brands**.

This is a focus choice, not a hard product limitation. The platform design supports creators ranging from emerging to established, and brands ranging from small businesses and startups to established companies.

---

## 5. Core Value Proposition

| User | Value |
|---|---|
| **Brands** | Find relevant creators faster, within limited budgets, with clear fit signals. |
| **Creators** | Discover relevant brand opportunities matched to their niche, audience, and goals. |
| **Both sides** | AI reduces repetitive work in discovery, profiling, outreach, and workflow management. |
| **Both sides** | Explainable AI recommendations show *why* a match is a good fit. |
| **Both sides** | Users remain in control of all important collaboration decisions. |

---

## 6. Core Product Principles

1. **Marketplace first** — The core product is the relationship between brands and creators. Everything else serves that relationship.
2. **AI-assisted, human-controlled** — AI recommends, summarizes, analyzes, and drafts; users make all important decisions.
3. **Evidence over claims** — Trust analysis presents signals and evidence rather than definitive authenticity guarantees or fraud verdicts.
4. **Explainability** — Important AI recommendations must explain the reasoning behind them.
5. **Focused MVP** — Start with a narrow set of high-value workflows; do not build beyond what the core loop requires.
6. **Documentation as source of truth** — Important product and technical decisions must be documented; implementation follows documented requirements.

---

## 7. Core Product Loop

```text
Brand creates campaign
  → AI structures campaign brief
  → Relevant creators are matched
  → Match explanations are shown to the brand
  → Creators discover and apply to campaigns
  → Brand reviews creator profiles and applications
  → Collaboration begins
  → Campaign completes
  → Outcomes and reputation can improve future marketplace intelligence
```

---

## 8. What CollabTrust Is Not

The initial product is **not** intended to be:

- A social media platform
- A replacement for Instagram, TikTok, or YouTube
- An AI-generated influencer
- An autonomous marketing agency
- A guaranteed fraud detector
- An automated spam or mass-outreach system
- A system that makes important collaboration decisions on behalf of users
- A complete payment-processing platform

These boundaries exist to keep the product focused and to ensure users remain in control of high-impact decisions.

---

## 9. Planned AI Capabilities

The following AI agents are planned for the platform. Each agent has a defined user/business purpose. No agent should be added merely because it is technically possible.

| Agent | Purpose |
|---|---|
| **Campaign Brief Agent** | Converts a brand's free-text campaign idea into a structured, editable campaign draft. |
| **Creator Matching Agent** | Finds suitable creators based on campaign requirements and provides match explanations. |
| **Profile Insight Agent** | Summarizes creator profile information and relevant audience/content signals. |
| **Trust Analysis Agent** | Summarizes available trust signals and potential anomalies. Must NOT claim to definitively identify fake creators or guarantee authenticity. |
| **Collaboration Assistant** | Drafts communication, requirements, checklists, and collaboration preparation materials. |
| **Workflow Coordinator** | Routes defined workflow events, retries appropriate operations, and tracks workflow state. |

**Hackathon priority order:**
1. Campaign Brief Agent
2. Trust Analysis Agent
3. Creator Matching + explanation
4. Workflow assistance

**Hard constraint:** No autonomous outreach, autonomous payments, autonomous dispute resolution, or other high-impact autonomous actions in the initial MVP.

---

## 10. Proposed Technical Direction

> These are directional choices. Verify against documentation before assuming a tool exists. Final decisions will be recorded in Architecture Decision Records under `docs/03-architecture/ADR/`.

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| AI / Agents | LLM API; agent/workflow layer (LangGraph or lightweight custom engine — to be decided after requirements are finalized) |
| Testing | Vitest, Supertest, Playwright |
| API | REST, OpenAPI / Swagger |
| Infrastructure | Git + GitHub, GitHub Actions, Docker where useful; deployment platform to be finalized |

---

## 11. Related Documents

| Document | Purpose |
|---|---|
| [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) | Master handoff document; phase status, next task, working rules |
| [`docs/01-product/problem-definition.md`](./problem-definition.md) | Detailed problem definition (Phase 2.2) |
| [`docs/README.md`](../README.md) | Documentation directory index |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | Branch, commit, and PR conventions |
| [`AGENTS.md`](../../AGENTS.md) | Rules for AI agents working on this repository |
