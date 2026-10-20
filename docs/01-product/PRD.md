# CollabTrust — Product Requirements Document (PRD)

> **Status:** Draft
> **Phase:** 2.9 — PRD
> **Depends on:** All Phase A documents
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)

---

## 1. Document Purpose

This PRD consolidates the product definition for CollabTrust. It is a summary and index document — detailed content lives in the individual documents linked below. This PRD should be read alongside those documents, not as a standalone replacement.

---

## 2. Product Summary

**Product:** CollabTrust — an AI-assisted creator-brand collaboration marketplace.

**Mission:** Make creator-brand collaborations more accessible, transparent, and efficient for creators and brands of different sizes and stages.

**Two primary problems:**
1. **Brands** can't easily discover relevant creators within limited budgets, nor evaluate authenticity and fit.
2. **Creators** can't easily find legitimate, relevant brand opportunities that match their niche, audience, and goals.

**Solution approach:** A two-sided marketplace with AI-assisted campaign structuring, creator matching with explanations, trust signal summaries, and collaboration workflows. AI assists — users decide.

**Initial focus:** Small/growing brands and emerging/micro creators.

**Full details:** [product-vision.md](./product-vision.md) | [problem-definition.md](./problem-definition.md)

---

## 3. Target Users

| Segment | Role | MVP Relevance |
|---|---|---|
| Small/growing brands | Campaign creators, creator seekers | Primary |
| Emerging/micro creators | Opportunity seekers, collaboration partners | Primary |
| Mid-size brands | Niche campaign operators | Secondary (future) |
| Mid-tier creators | Quality-focused collaborators | Secondary |

**Primary personas:**
- **Priya Sharma** — Small brand founder who needs affordable, guided creator discovery.
- **Daniel Okafor** — Growing brand marketing manager scaling influencer campaigns.
- **Maya Torres** — Emerging creator seeking first legitimate brand collaborations.

**Full details:** [target-users.md](./target-users.md) | [personas.md](./personas.md)

---

## 4. Core Product Loop

```
Brand creates campaign → Campaign Brief Agent structures it → Creator Matching Agent
finds relevant creators → Match explanations shown → Creators discover and apply →
Brand reviews (with Profile Insight + Trust Analysis) → Brand selects creators →
Collaboration begins → Campaign completes
```

**User journey details:** [user-journeys.md](./user-journeys.md)

---

## 5. MVP Scope Summary

### In-Scope Features (28 features)

| Category | MUST-HAVE | SHOULD-HAVE | NICE-TO-HAVE |
|---|---|---|---|
| Authentication & Profiles | 4 | 1 | — |
| Campaign Lifecycle & Structuring | 6 | 2 | — |
| Creator Discovery & Matching (incl. Creator Matching & Profile Insight agents) | 2 | 2 | — |
| Trust Analysis & Signals (incl. Trust Analysis agent) | 2 | 1 | — |
| Collaboration Workflow | 4 | 1 | — |
| Dashboard & Navigation | 1 | 2 | — |
| **Totals** | **19** | **9** | **0** |

> AI agents are counted within their product domain (each feature counted exactly once), matching the 28-feature catalog in [`feature-requirements.md`](./feature-requirements.md).

### AI Agents in MVP

| Agent | MVP Status | Priority |
|---|---|---|
| Campaign Brief Agent | ✅ Included | 1 |
| Trust Analysis Agent | ✅ Included | 2 |
| Creator Matching Agent | ✅ Included | 3 |
| Profile Insight Agent | ✅ If feasible | 4 |
| Collaboration Assistant | ⏸️ Deferred | — |
| Workflow Coordinator | ⏸️ Deferred | — |

### Out of Scope for MVP

Payment processing, autonomous outreach, advanced analytics, social API integrations, legal contracts, mobile app, autonomous AI actions, guaranteed fraud detection.

**Full details:** [mvp-scope.md](./mvp-scope.md) | [feature-requirements.md](./feature-requirements.md)

---

## 6. Product Goals & Success Criteria

### Product Goals (G-1 through G-6)

1. Reduce time-to-match for brands seeking creators.
2. Enable creators to discover relevant brand opportunities.
3. Provide explainable AI-assisted matching.
4. Surface trust signals without claiming fraud guarantees.
5. Provide structured collaboration workflows.
6. Validate the core marketplace loop.

### MVP Goals

1. Core loop works end-to-end.
2. AI agents produce useful, explainable outputs.
3. Both sides find value.
4. Platform is accessible to small brands and emerging creators.

### Key Metrics (14 metrics across 4 categories)

- **Marketplace health:** Active campaigns, sign-ups, match rate, completion rate.
- **AI quality:** Brief usefulness, match relevance, explanation helpfulness, trust signal accuracy.
- **User engagement:** Time to first match, application rate, return usage.
- **User satisfaction:** Brand/creator satisfaction scores, NPS, qualitative feedback.

**Full details:** [goals-success-metrics.md](./goals-success-metrics.md)

---

## 7. Product Principles & Constraints

1. **Marketplace first** — Core product is the brand-creator relationship.
2. **AI-assisted, human-controlled** — AI recommends; users decide.
3. **Evidence over claims** — Trust analysis presents signals, not verdicts.
4. **Explainability** — AI recommendations explain their reasoning.
5. **Focused MVP** — Narrow set of high-value workflows.
6. **Documentation as source of truth** — Decisions must be documented.

### Hard Constraints
- No autonomous outreach, payments, or dispute resolution.
- No guaranteed fraud detection or definitive authenticity claims.
- No application code until documentation is complete and approved.

**Full details:** [product-vision.md](./product-vision.md)

---

## 8. Technical Direction (Proposed)

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| AI | LLM API; agent framework TBD |
| Testing | Vitest, Supertest, Playwright |
| API | REST, OpenAPI/Swagger |
| Infrastructure | GitHub Actions, Docker; deployment platform TBD |

> [!NOTE]
> These are **directional choices**, not confirmed decisions. Final decisions will be recorded in Architecture Decision Records (Phase C). See [`PROJECT_CONTEXT.md` §7](../../PROJECT_CONTEXT.md).

---

## 9. Known Risks

| Risk | Mitigation |
|---|---|
| Marketplace cold start | Focus on narrow initial niche (niche TBD) |
| Competition from existing platforms | Differentiate on accessibility, explainability, and AI assistance for underserved segment |
| Trust signal accuracy | Present as signals, not guarantees; include limitations disclosure |
| AI reliability | Structured schemas, validation, human review of outputs |
| Scope creep | Strict MVP boundary; deferred features are documented |
| Data/privacy | Collect minimum data; never commit secrets |

**Full details:** [`PROJECT_CONTEXT.md` §13](../../PROJECT_CONTEXT.md)

---

## 10. Unresolved Decisions & Open Questions

| # | Decision / Question | Impact | Status |
|---|---|---|---|
| 1 | Narrowest viable launch niche | High | Open — needed for cold-start strategy |
| 2 | Cold-start strategy | High | Open |
| 3 | LLM provider and model | Medium | Open — affects cost and quality |
| 4 | Deployment platform | Medium | Open |
| 5 | Authentication mechanism (JWT vs. session) | Medium | Open |
| 6 | AI agent framework (LangGraph vs. custom) | Medium | Open |
| 7 | Minimum viable creator profile fields | Medium | Open |
| 8 | Minimum viable campaign brief fields | Medium | Open |
| 9 | Should creators see all campaigns or only matched ones? | Medium | Open |
| 10 | Messaging model (chat, threads, or notes) | Medium | Open |
| 11 | Pricing model | High | Open — deferred beyond MVP |

---

## 11. Assumptions Requiring Validation

All assumptions below are **unvalidated hypotheses**. See [problem-definition.md §11](./problem-definition.md#11-assumptions-and-open-questions) for the full list.

| # | Assumption |
|---|---|
| 1 | Small brands find creator discovery genuinely difficult. |
| 2 | Emerging creators struggle to find legitimate opportunities. |
| 3 | Both sides would use a marketplace at an accessible price point. |
| 4 | Explainable matching is more valuable than unexplained ranking. |
| 5 | Trust signals from public data are useful in practice. |
| 6 | Cold-start can be managed with a narrow niche. |
| 7 | Users accept AI recommendations with human control retained. |
| 8 | The target segment is underserved by existing tools. |
| 9 | Hackathon timeline is sufficient for the core loop. |

---

## 12. Document Index — Phase A (Product Definition)

| # | Document | Phase | Status |
|---|---|---|---|
| 1 | [`product-vision.md`](./product-vision.md) | 2.1 | Defined |
| 2 | [`problem-definition.md`](./problem-definition.md) | 2.2 | Defined |
| 3 | [`target-users.md`](./target-users.md) | 2.3 | Draft |
| 4 | [`personas.md`](./personas.md) | 2.4 | Draft |
| 5 | [`user-journeys.md`](./user-journeys.md) | 2.5 | Draft |
| 6 | [`goals-success-metrics.md`](./goals-success-metrics.md) | 2.6 | Draft |
| 7 | [`mvp-scope.md`](./mvp-scope.md) | 2.7 | Draft |
| 8 | [`feature-requirements.md`](./feature-requirements.md) | 2.8 | Draft |
| 9 | [`PRD.md`](./PRD.md) | 2.9 | Draft |

---

## 13. Next Phases

| Phase | Directory | Status |
|---|---|---|
| B — Engineering Requirements | `docs/02-requirements/` | Pending |
| C — Architecture | `docs/03-architecture/` | Pending |
| D — AI Specifications | `docs/04-ai/` | Pending |
| E — Design | `docs/05-design/` | Pending |
| F — Testing | `docs/06-testing/` | Pending |
| G — Deployment | `docs/07-deployment/` | Pending |
