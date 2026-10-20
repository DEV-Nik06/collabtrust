# CollabTrust — User Journeys

> **Status:** Draft
> **Phase:** 2.5 — User Journeys
> **Depends on:** [`product-vision.md`](./product-vision.md), [`problem-definition.md`](./problem-definition.md), [`target-users.md`](./target-users.md), [`personas.md`](./personas.md), [`mvp-scope.md`](./mvp-scope.md)
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)

---

## 1. Purpose

This document maps the primary user journeys through CollabTrust — the step-by-step flows that brands and creators follow to accomplish their goals. Journeys describe the sequence of user actions and system responses, including where AI agents are involved.

These journeys focus on **what happens**, not on visual design or UI layout (that is Phase E — Design).

---

## 2. Journey Summary

| # | Journey | Persona | Steps | Key AI Touchpoints | MVP Status |
|---|---|---|---|---|---|
| J-1 | [Brand Campaign Journey](#3-j-1-brand-campaign-journey) | Priya Sharma (small brand) | 13 | Campaign Brief Agent, Creator Matching Agent, Trust Analysis Agent, Profile Insight Agent | ✅ MVP |
| J-2 | [Creator Discovery Journey](#4-j-2-creator-discovery-journey) | Maya Torres (emerging creator) | 10 | Match explanation display | ✅ MVP |
| J-3 | [Brand Evaluating Trust Signals](#5-j-3-brand-evaluating-trust-signals) | Daniel Okafor (growing brand) | 6 | Trust Analysis Agent | ✅ MVP |
| J-4 | [Creator Evaluating a Brand Opportunity](#6-j-4-creator-evaluating-a-brand-opportunity) | Jordan Ellis (mid-tier creator) | 6 | — | ✅ MVP |

---

## 3. J-1: Brand Campaign Journey

**Persona:** Priya Sharma — Small brand founder (see [personas.md §3.1](./personas.md#31-priya-sharma---small-brand-founder))

**Description:** A small brand founder creates a campaign, gets AI assistance to structure it, discovers matching creators, reviews their profiles and trust signals, selects creators, and manages the collaboration to completion.

**Pre-conditions:**
- Priya has not used CollabTrust before.
- She has a general idea for a creator marketing campaign but has not structured it formally.

### Steps

| # | User Action | System Response | AI Agent |
|---|---|---|---|
| 1 | Visits CollabTrust and registers as a brand user. | Account is created. Brand profile form is presented. | — |
| 2 | Fills in brand profile: company name, category (skincare), description, budget range, goals. | Profile is saved. Dashboard is shown. | — |
| 3 | Clicks "Create Campaign" and enters a free-text description of her campaign idea. | Free text is submitted to the Campaign Brief Agent. | — |
| 4 | Reviews the AI-structured campaign brief. Edits fields as needed (target audience, deliverables, timeline, budget). | Structured brief is displayed in an editable form. Changes are saved. | **Campaign Brief Agent** |
| 5 | Publishes the campaign. | Campaign status changes to Active. Creator Matching Agent is triggered. | — |
| 6 | Views matched creators with match explanations. | A list of matched creators is displayed, each with a match score/rank and a human-readable explanation of why they fit. | **Creator Matching Agent** |
| 7 | Clicks on a matched creator's profile. | Creator profile is displayed with a profile summary. | **Profile Insight Agent** |
| 8 | Views trust signals for the creator. | Trust signal summary is displayed: self-reported engagement and follower figures, profile completeness, account age, potential anomalies. All signals are derived from the creator's self-reported profile data (no live platform integration); signals are presented as evidence, not verdicts. | **Trust Analysis Agent** |
| 9 | Receives creator applications. | Applications appear in the campaign dashboard. | — |
| 10 | Reviews applications against match explanations, trust signals, and profile summaries. | Application details and creator information are accessible from the campaign view. | — |
| 11 | Selects a creator for collaboration. | Collaboration status is created (Invited → Accepted). | — |
| 12 | Tracks collaboration progress through status updates. | Collaboration status is displayed (In Progress → Completed). | — |
| 13 | Marks campaign as complete. | Campaign status changes to Completed. | — |

**Post-conditions:**
- Campaign is complete. Creator has been selected and collaborated with.
- Priya has used the platform to go from a rough idea to a completed collaboration without manual social media searching.

**Key AI touchpoints:** Steps 4, 6, 7, 8.

**Open questions:**
- How does the Campaign Brief Agent handle very vague or very detailed input differently?
- What is the minimum campaign information needed for meaningful matching?
- Should matching happen immediately on publish, or can the brand trigger it manually?

---

## 4. J-2: Creator Discovery Journey

**Persona:** Maya Torres — Emerging/micro creator (see [personas.md §3.4](./personas.md#34-maya-torres---emerging--micro-creator))

**Description:** An emerging creator registers, creates a profile, discovers available campaigns, evaluates opportunities, and applies to a relevant campaign.

**Pre-conditions:**
- Maya has not used CollabTrust before.
- She has active social media accounts and content but has never done a formal brand collaboration.

### Steps

| # | User Action | System Response | AI Agent |
|---|---|---|---|
| 1 | Visits CollabTrust and registers as a creator. | Account is created. Creator profile form is presented. | — |
| 2 | Fills in creator profile: niche (sustainable living), platforms (Instagram, TikTok), audience size, content style, collaboration preferences. | Profile is saved. Creator dashboard is shown. | — |
| 3 | Browses available campaigns. | Campaign listing is displayed, optionally filtered/sorted by category, budget, recency. | — |
| 4 | Views a campaign detail page. | Full campaign brief is shown: brand description, campaign goals, deliverables, timeline, budget, requirements. | — |
| 5 | Sees match fit information. | If the Creator Matching Agent has identified this creator as a match, the match explanation is shown (why this campaign is relevant to her profile). | **Creator Matching Agent** (display of pre-computed match) |
| 6 | Views brand profile and brand-side trust signals. | Brand profile is displayed. Any available brand-side trust indicators (profile completeness, account age) are shown. | — |
| 7 | Decides to apply to the campaign. | Application is submitted. Campaign appears in her "Applied" list. | — |
| 8 | Waits for brand review. | Application status is visible: Pending → Accepted/Declined. | — |
| 9 | Receives acceptance. Collaboration status begins. | Collaboration is visible in her dashboard with status tracking. | — |
| 10 | Completes the collaboration. | Collaboration status moves to Completed. | — |

**Post-conditions:**
- Maya has proactively found and applied to a brand opportunity matched to her niche.
- She has verified the brand's legitimacy through available trust signals before applying.

**Key AI touchpoints:** Step 5 (match explanation display).

**Open questions:**
- Should creators see all campaigns or only those the matching agent has flagged as relevant?
- How should the platform handle the cold-start when few campaigns are available?
- What information should creators see about a brand before applying?

---

## 5. J-3: Brand Evaluating Trust Signals

**Persona:** Daniel Okafor — Growing brand marketing manager (see [personas.md §3.2](./personas.md#32-daniel-okafor---growing-brand-marketing-manager))

**Description:** A focused sub-journey showing how a brand user evaluates a creator's trustworthiness using the Trust Analysis Agent output.

**Pre-conditions:**
- Daniel has an active campaign with matched creators.
- He is reviewing a specific creator's profile.

### Steps

| # | User Action | System Response | AI Agent |
|---|---|---|---|
| 1 | Views a matched creator's profile from the campaign dashboard. | Creator profile is displayed with profile summary. | **Profile Insight Agent** |
| 2 | Clicks to view trust signals. | Trust Analysis Agent output is displayed as a structured summary. | **Trust Analysis Agent** |
| 3 | Reviews engagement quality signals. | System shows indicators derived from the creator's self-reported profile data, such as self-reported engagement figures versus stated audience size and self-reported follower history (not live platform analytics). | - |
| 4 | Reviews profile completeness and consistency signals. | System shows indicators such as profile completeness, content posting consistency, account age. | — |
| 5 | Sees any flagged anomalies with explanations. | Potential anomalies are listed with explanations of what was observed (e.g., "Self-reported follower count changed sharply between profile updates"). Presented as observations, not verdicts. | - |
| 6 | Makes an informed selection decision. | Daniel uses the trust signals alongside match explanations and profile data to decide whether to select this creator. The decision is his — the system does not make it for him. | — |

**Post-conditions:**
- Daniel has reviewed trust signals and understands they are evidence-based observations, not guarantees.
- He has made his own selection decision informed by the signals.

**Key AI touchpoints:** Steps 1, 2.

> [!IMPORTANT]
> Trust signals are **evidence and observations**, not fraud verdicts. The UI must make clear that these are signals to assist human judgment, not definitive assessments. See [product-vision.md §6, Principle 3](./product-vision.md#6-core-product-principles).

---

## 6. J-4: Creator Evaluating a Brand Opportunity

**Persona:** Jordan Ellis — Mid-tier creator (see [personas.md §3.5](./personas.md#35-jordan-ellis---mid-tier-creator))

**Description:** A creator evaluates whether a brand opportunity is worth pursuing by reviewing campaign details and brand-side trust signals.

**Pre-conditions:**
- Jordan has an active creator profile on CollabTrust.
- He is browsing available campaigns or has been notified of a match.

### Steps

| # | User Action | System Response | AI Agent |
|---|---|---|---|
| 1 | Browses available campaigns or views a specific campaign suggestion. | Campaign listing or detail page is shown. | — |
| 2 | Views the full campaign brief. | Structured campaign brief is displayed: brand information, goals, deliverables, timeline, budget, requirements. | — |
| 3 | Views the brand's profile. | Brand profile is displayed: company description, category, past campaigns (if any), profile completeness. | — |
| 4 | Reviews brand-side trust signals. | Available brand trust indicators are shown: account age, profile completeness, collaboration history (if any). | — |
| 5 | Evaluates fit with his content and audience. | Match explanation (if available) shows why this campaign was flagged as relevant to him. | — |
| 6 | Decides whether to apply. | Jordan applies or moves on to other campaigns. | — |

**Post-conditions:**
- Jordan has made an informed decision about whether the brand and campaign are worth his time.
- He has used brand-side trust signals and campaign details to evaluate the opportunity.

**Key AI touchpoints:** Step 5 (match explanation display, if pre-computed).

**Open questions:**
- What brand-side trust signals are available? (Brand collaboration history depends on platform maturity.)
- Should brand profiles show a "verified" status? If so, what does verification mean?

---

## 7. Cross-Cutting Observations

### AI Agent Involvement Summary

| AI Agent | Journey 1 (Brand Campaign) | Journey 2 (Creator Discovery) | Journey 3 (Trust Eval) | Journey 4 (Brand Eval) |
|---|:---:|:---:|:---:|:---:|
| Campaign Brief Agent | Step 4 | — | — | — |
| Creator Matching Agent | Step 6 | Step 5 (display) | — | Step 5 (display) |
| Profile Insight Agent | Step 7 | — | Step 1 | — |
| Trust Analysis Agent | Step 8 | — | Steps 2–5 | — |
| Collaboration Assistant | — (deferred) | — | — | — |
| Workflow Coordinator | — (deferred) | — | — | — |

### Human Decision Points

All important decisions are made by users, not by AI agents:
- **Brand selects creators** (J-1 Step 11) — AI recommends, brand decides.
- **Creator applies to campaign** (J-2 Step 7) — Creator evaluates and decides.
- **Brand evaluates trust signals** (J-3 Step 6) — Trust signals inform, brand decides.
- **Creator evaluates brand** (J-4 Step 6) — Creator evaluates and decides.

### Open Design Decisions (Across Journeys)

| # | Decision | Impact | Status |
|---|---|---|---|
| 1 | Should creators see all campaigns or only AI-matched ones? | Affects creator discovery UX | Open |
| 2 | What is the minimum viable campaign brief for meaningful matching? | Affects campaign creation flow | Open |
| 3 | Should matching happen automatically on publish or be manually triggered? | Affects brand workflow | Open |
| 4 | What brand-side trust signals are available at launch? | Affects creator trust evaluation | Open |
| 5 | Should the platform send notifications for new matches/applications? | Affects engagement and return usage | Open (basic notifications are SHOULD-HAVE per [mvp-scope.md](./mvp-scope.md)) |

---

## 8. Related Documents

| Document | Purpose |
|---|---|
| [`product-vision.md`](./product-vision.md) | Core product loop and principles |
| [`problem-definition.md`](./problem-definition.md) | Problems these journeys address |
| [`target-users.md`](./target-users.md) | User segments and initial focus |
| [`personas.md`](./personas.md) | Persona definitions referenced in each journey |
| [`mvp-scope.md`](./mvp-scope.md) | Feature priorities and MVP boundaries |
| [`goals-success-metrics.md`](./goals-success-metrics.md) | Success metrics these journeys contribute to |
| [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) | Master handoff document |
