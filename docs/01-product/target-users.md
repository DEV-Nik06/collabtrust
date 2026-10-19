# CollabTrust — Target Users

> **Status:** Draft
> **Phase:** 2.3 — Target Users
> **Depends on:** [`product-vision.md`](./product-vision.md), [`problem-definition.md`](./problem-definition.md)
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)

---

## 1. Overview

CollabTrust is a **two-sided marketplace** connecting brands and creators for collaboration opportunities. The platform must serve both sides to function — brands need creators to match with, and creators need brand campaigns to discover.

This document defines who the platform serves, which segments are prioritized for the initial launch, and which user types are deferred.

---

## 2. Primary User Segments

### 2.1 Brands — Initial Focus: Small and Growing Brands

**Who they are:** Companies or individuals who want to run influencer/creator marketing campaigns but lack the budget, team, or tooling to do so efficiently through existing channels.

**What makes this segment distinct:**

- **Limited budgets** — cannot afford enterprise influencer marketing platforms or agency fees.
- **Small or no marketing teams** — the founder, owner, or a single marketing manager handles everything including creator outreach.
- **Unvalidated influencer channel** — many are attempting creator collaborations for the first time, or have done only a handful with inconsistent results.
- **Manual processes** — discovery, outreach, and collaboration management happen via social media search, DMs, email, and spreadsheets.

**Typical goals and motivations:**

- Find relevant creators whose audiences align with their products.
- Launch campaigns without spending weeks on manual discovery.
- Understand why a creator is a good match before committing.
- Keep costs manageable relative to their marketing budget.

**Typical constraints:**

- Time (founder wears many hats; marketing manager has many responsibilities).
- Budget (cannot justify expensive platforms before proving the channel works).
- Knowledge (may not know how to write a proper campaign brief or evaluate creator profiles).
- Tooling (no CRM, no influencer platform subscription, no agency relationship).

**Current behaviors and workarounds:**

- Manual social media hashtag search.
- Word-of-mouth and personal network referrals.
- Spreadsheets for tracking outreach and collaborations.
- Instagram/TikTok DMs for communication.
- Trial-and-error with creator selection.

**What they need from a platform:**

- Affordable or free marketplace access.
- AI-assisted campaign brief creation.
- AI-powered creator matching with explanations.
- Trust signals for evaluating creators (not fraud guarantees).
- Simple, structured collaboration workflow.

> [!NOTE]
> The platform design is **not limited** to small/growing brands. Larger brands may also use the platform, but initial MVP design, UX, pricing, and feature priority decisions target this segment. See [product-vision.md §4](./product-vision.md#4-initial-focus).

---

### 2.2 Creators — Initial Focus: Emerging and Micro Creators

**Who they are:** Content creators building audiences on social media platforms who want to monetize through brand collaborations but lack the visibility, connections, or tools to find legitimate opportunities.

**What makes this segment distinct:**

- **Growing but small audiences** — typically thousands to low tens of thousands of followers; genuine engagement but limited reach.
- **Limited visibility to brands** — rarely discovered by brands through organic search or existing platforms that favor large creators.
- **Difficulty finding legitimate opportunities** — exposed to spam, low-quality offers, and unverifiable brand inquiries.
- **Reactive discovery** — wait to be contacted rather than proactively finding campaigns, because no structured proactive channel exists for their audience size.

**Typical goals and motivations:**

- Find their first (or next) legitimate brand collaboration.
- Get discovered by brands relevant to their niche and audience.
- Build a portfolio of collaborations to grow their career.
- Work with brands that align with their content and values.

**Typical constraints:**

- Visibility (small following means brands don't find them).
- Trust (can't verify whether a brand inquiry is legitimate).
- Knowledge (may not know standard collaboration workflows, rates, or expectations).
- Tooling (no media kit, no standardized profile, no platform presence).

**Current behaviors and workarounds:**

- Posting content consistently and hoping to be discovered.
- Searching hashtags like #brandcollab or #sponsoredopportunity.
- Responding to unsolicited DMs with limited ability to verify the sender.
- Following larger creators' strategies without the same reach or connections.

**What they need from a platform:**

- Creator-facing campaign discovery (proactive, not just reactive).
- Structured profile to describe niche, audience, content style, and collaboration preferences.
- Brand-side trust signals so they can verify brand legitimacy.
- Match explanations showing why a campaign is relevant to them.
- Structured collaboration workflow with clear expectations.

> [!NOTE]
> The platform also supports established and mid-tier creators. However, emerging/micro creators represent the underserved segment with the greatest unmet need, as identified in [problem-definition.md §7](./problem-definition.md#7-the-marketplace-gap).

---

## 3. Secondary Users (Not in MVP Scope)

The following user types may be served in future phases but are **not primary targets for the MVP:**

| User Type | Description | Why Deferred |
|---|---|---|
| **Marketing managers at larger companies** | Have existing agency relationships and enterprise tools. May use CollabTrust for niche campaigns. | Already served by existing tools; not the underserved segment. |
| **Talent agencies and creator management** | Manage rosters of creators and negotiate on their behalf. | Adds multi-party complexity; not needed for core loop validation. |
| **Freelance marketing consultants** | Manage influencer campaigns on behalf of multiple small brands. | Interesting growth segment but not needed for MVP. |
| **Platform administrators** | Internal team managing the CollabTrust platform. | Basic admin capability may be included but is not a user segment to design for. |

---

## 4. Initial Target Niche

The initial focus is on the intersection of **small/growing brands** and **emerging/micro creators**. However, the specific **vertical or category niche** for the initial launch has not yet been defined.

> [!WARNING]
> The narrowest viable niche is an **open question** (see [problem-definition.md §11, Open Question #1](./problem-definition.md#open-questions)). Choosing a niche is critical for addressing the **marketplace cold-start problem** — a two-sided marketplace needs sufficient participants on both sides to deliver value. Launching broadly risks having too few participants in any single category to produce useful matches.
>
> Potential niche strategies (not yet evaluated):
> - Focus on a single product category (e.g., beauty, fitness, food).
> - Focus on a single social platform (e.g., Instagram-focused creators).
> - Focus on a geographic region.
> - Use seed data or curated profiles for initial matching.
>
> This decision should be made during or after Phase 2.7 (MVP Scope).

---

## 5. User Segments Not Served Initially

The following are explicitly **out of scope** for the initial product:

| Segment | Reason |
|---|---|
| **Enterprise brands with large agency relationships** | Already well-served by existing enterprise platforms and agencies. |
| **Celebrity-tier creators** | Have established management, do not need marketplace discovery. |
| **Content agencies managing creator rosters** | Adds multi-party complexity beyond MVP scope. |
| **Automated marketing services** | Conflicts with human-controlled AI principle. |
| **End consumers** | CollabTrust is a B2B marketplace, not a consumer-facing product. |

---

## 6. Assumptions

| # | Assumption | Status | Notes |
|---|---|---|---|
| 1 | Small/growing brands are underserved by existing influencer marketing tools. | **Assumption** | Per [problem-definition.md §11](./problem-definition.md#11-assumptions-and-open-questions). Needs competitive analysis. |
| 2 | Emerging creators would use a structured marketplace for proactive opportunity discovery. | **Assumption** | Needs user research/interviews. |
| 3 | Both segments exist in sufficient density within a viable niche to overcome cold-start. | **Assumption** | Niche not yet defined. |

---

## 7. Related Documents

| Document | Purpose |
|---|---|
| [`product-vision.md`](./product-vision.md) | Mission, vision, initial focus, and product boundaries |
| [`problem-definition.md`](./problem-definition.md) | Pain points, root causes, marketplace gap |
| [`personas.md`](./personas.md) | Representative user personas for each segment |
| [`goals-success-metrics.md`](./goals-success-metrics.md) | Product goals and success metrics |
| [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) | Master handoff document |
