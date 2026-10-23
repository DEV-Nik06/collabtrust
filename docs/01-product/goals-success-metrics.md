# CollabTrust — Product Goals & Success Metrics

> **Status:** Draft  
> **Phase:** 2.6 — Product Goals & Success Metrics  
> **Depends on:** [`product-vision.md`](./product-vision.md), [`problem-definition.md`](./problem-definition.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  
> **Do not modify without updating `PROJECT_CONTEXT.md` to reflect any changes.**

---

## 1. Product Goals

The following high-level goals are derived from the product vision and problem definition. They represent what CollabTrust aims to achieve as a product, independent of any single release.

### G-1. Reduce Time-to-Match for Brands Seeking Creators

Brands — particularly small and growing ones — currently spend significant manual effort on creator discovery (see [problem-definition.md §2.1](./problem-definition.md#21-discovery-is-difficult-and-time-consuming)). CollabTrust should dramatically reduce the time between a brand defining a campaign need and being presented with relevant, explained creator matches.

### G-2. Enable Creators to Discover Relevant Brand Opportunities

Emerging creators currently rely on reactive, unstructured, and often unreliable channels to find brand partnerships (see [problem-definition.md §3.1–3.3](./problem-definition.md#31-legitimate-opportunities-are-hard-to-find)). CollabTrust should provide a structured, proactive discovery channel where creators can find campaigns matched to their niche, audience, and goals.

### G-3. Provide Explainable AI-Assisted Matching

Match recommendations must include explicit reasoning about why a creator-campaign pairing is a good fit (see [product-vision.md §6, Principle 4](./product-vision.md#6-core-product-principles)). Unexplained rankings are insufficient. Every match surfaced to a user should come with human-readable explanations.

### G-4. Surface Trust Signals Without Claiming Fraud Guarantees

Trust Analysis must present available signals, evidence, and potential anomalies rather than issuing definitive verdicts about creator authenticity or brand legitimacy (see [product-vision.md §8](./product-vision.md#8-what-collabtrust-is-not) and [problem-definition.md §10](./problem-definition.md#10-problem-boundaries-and-out-of-scope-problems)). The system must never claim to be a guaranteed fraud detector.

### G-5. Provide Structured Collaboration Workflows

Both brands and creators currently manage collaborations through fragmented, informal processes (see [problem-definition.md §2.5, §3.5](./problem-definition.md#25-outreach-and-communication-are-fragmented)). CollabTrust should offer shared workflow tools — briefs, checklists, communication, and status tracking — that give both sides a common framework.

### G-6. Validate the Core Marketplace Loop

Before expanding features, CollabTrust must validate that the core product loop works end-to-end: campaign creation → AI structuring → matching → creator discovery/application → brand review → collaboration (see [product-vision.md §7](./product-vision.md#7-core-product-loop)).

---

## 2. MVP Goals

The MVP is the first testable version of CollabTrust. Its purpose is validation, not completeness. The MVP specifically aims to demonstrate or validate the following:

### MVP-G-1. Core Loop Works End-to-End

The MVP must demonstrate the complete core product loop:

1. A brand creates a campaign (free-text input).
2. The Campaign Brief Agent structures it into an editable draft.
3. Relevant creators are matched and match explanations are presented.
4. Creators can discover and apply to campaigns.
5. A brand can review creator profiles and applications.
6. A collaboration can begin with basic shared workflow structure.

If any step in this loop is broken or missing, the MVP has not achieved its primary goal.

### MVP-G-2. AI Agents Provide Useful, Explainable Outputs

The MVP must demonstrate that:

- The **Campaign Brief Agent** converts free-text campaign ideas into structured, useful campaign drafts.
- The **Creator Matching Agent** produces relevant matches with human-readable explanations.
- The **Trust Analysis Agent** surfaces meaningful trust signals without overclaiming.

"Useful" and "meaningful" are subjective terms at this stage. The MVP should collect qualitative feedback to assess whether users find these outputs helpful.

### MVP-G-3. Both Sides Find Value in the Marketplace

The marketplace must deliver tangible value to both brands and creators. Specifically:

- **Brands** should report that the platform made it easier to find relevant creators compared to their current process.
- **Creators** should report that the platform surfaced brand opportunities they would not have found otherwise.

> [!NOTE]
> Measuring this rigorously requires user testing and feedback collection. MVP success here is qualitative — not statistically significant validation.

### MVP-G-4. Platform Is Accessible to Small Brands and Emerging Creators

The MVP must be usable by the initial target segment without requiring:

- Large marketing budgets or teams
- Large existing audiences or follower counts
- Prior experience with influencer marketing platforms

Accessibility here means low friction to onboard, understandable interface, and no features gated behind enterprise pricing.

---

## 3. Success Metrics

The following metrics are grouped by category. For each metric:

- **Metric name** — short identifier.
- **Description** — what it measures and why it matters.
- **Target** — proposed target or TBD if not yet defined.
- **Measurement method** — how it will be collected.

> [!IMPORTANT]
> No metrics below have been measured. Targets labeled "Proposed" are initial proposals subject to revision after MVP testing. Targets labeled "TBD" require further discussion before a number can be set.

### 3.1 Marketplace Health

These metrics indicate whether the marketplace has sufficient activity and participation on both sides.

| ID | Metric | Description | Target | Measurement Method |
|---|---|---|---|---|
| MH-1 | Active campaigns | Number of campaigns in "active" status at any given time | TBD | Database query on campaign status |
| MH-2 | Creator sign-ups | Total number of registered creator accounts | TBD | User registration count (creator role) |
| MH-3 | Brand sign-ups | Total number of registered brand accounts | TBD | User registration count (brand role) |
| MH-4 | Match rate | Percentage of campaigns that receive at least one AI-generated creator match | Proposed: ≥ 80% | (Campaigns with ≥ 1 match) / (Total campaigns created) |
| MH-5 | Two-sided activity ratio | Ratio of active creators to active campaigns | TBD | Active creator profiles / Active campaigns per period |
| MH-6 | Campaign completion rate | Percentage of started collaborations that reach a "completed" state | TBD | (Completed collaborations) / (Started collaborations) |

### 3.2 AI Quality

These metrics assess whether the AI agents produce outputs that are useful, accurate, and trustworthy.

| ID | Metric | Description | Target | Measurement Method |
|---|---|---|---|---|
| AQ-1 | Brief structuring usefulness | Percentage of AI-generated campaign briefs that brands accept (with or without edits) rather than discard | Proposed: ≥ 70% | (Accepted briefs) / (Total AI-generated briefs) |
| AQ-2 | Match explanation usefulness | User rating of whether match explanations helped them understand why a creator was recommended | TBD | In-app feedback prompt (e.g., "Was this explanation helpful?" — Yes/No or 1–5 scale) |
| AQ-3 | Match relevance | Percentage of AI-suggested matches that brands interact with (view profile, shortlist, or contact) | Proposed: ≥ 40% | (Matches interacted with) / (Total matches surfaced) |
| AQ-4 | Trust signal perceived accuracy | User assessment of whether surfaced trust signals were consistent with their own evaluation | TBD | Post-review feedback prompt |
| AQ-5 | Brief edit rate | How much brands edit AI-generated briefs before publishing (a proxy for brief quality) | TBD | Diff-based analysis of AI draft vs. published version, or edit-count tracking |

> [!NOTE]
> AI quality metrics require in-app feedback mechanisms to be built into the MVP. These should be lightweight — a single question or thumbs up/down interaction — not a separate survey.

### 3.3 User Engagement

These metrics track whether users are actively using core platform features.

| ID | Metric | Description | Target | Measurement Method |
|---|---|---|---|---|
| UE-1 | Time to first match | Elapsed time from campaign creation to the first AI-generated match being shown to the brand | Proposed: < 5 minutes | Timestamp difference (campaign created → first match displayed) |
| UE-2 | Creator application rate | Percentage of matched creators who apply to or express interest in a campaign | TBD | (Creator applications) / (Match notifications or match views) |
| UE-3 | Brand response rate | Percentage of creator applications that receive a brand response (accept, reject, or message) | TBD | (Responded applications) / (Total applications received) |
| UE-4 | Collaboration initiation rate | Percentage of campaigns that result in at least one accepted collaboration | TBD | (Campaigns with ≥ 1 accepted collaboration) / (Total campaigns with applicants) |
| UE-5 | Return usage | Number of users who return to the platform after their first session | TBD | Session tracking — users with ≥ 2 sessions |
| UE-6 | Feature adoption | Percentage of users who use each core feature at least once (campaign creation, matching, trust signals, workflow tools) | TBD | Feature-level event tracking |

### 3.4 User Satisfaction

These metrics capture subjective user sentiment about the platform.

| ID | Metric | Description | Target | Measurement Method |
|---|---|---|---|---|
| SAT-1 | Brand satisfaction score | Brand-side satisfaction with the overall matching and collaboration experience | TBD | Post-collaboration survey or in-app rating (1–5 scale) |
| SAT-2 | Creator satisfaction score | Creator-side satisfaction with opportunity discovery and collaboration experience | TBD | Post-collaboration survey or in-app rating (1–5 scale) |
| SAT-3 | Net Promoter Score (NPS) | Willingness of users to recommend CollabTrust to peers | TBD | Standard NPS survey question |
| SAT-4 | Qualitative feedback themes | Recurring themes in open-ended user feedback | N/A (qualitative) | Thematic analysis of feedback collected via in-app forms or interviews |

> [!NOTE]
> During early MVP testing, satisfaction data will likely come from direct user interviews or small feedback forms rather than statistically significant surveys. This is expected and acceptable for validation purposes.

---

## 4. Non-Goals for MVP

The following are explicitly **not** goals for the MVP. They may become goals in later phases.

| Non-Goal | Rationale |
|---|---|
| Revenue generation | The MVP is for validation, not monetization. Pricing model is an open question (see [problem-definition.md §11](./problem-definition.md#open-questions)). |
| Scale / high-volume traffic | The MVP does not need to support large concurrent user loads. Performance optimization for scale is deferred. |
| Payment processing | Automated payments are out of scope due to regulatory and trust complexity (see [problem-definition.md §10](./problem-definition.md#10-problem-boundaries-and-out-of-scope-problems)). |
| Advanced analytics / reporting | Post-campaign performance analytics, ROI dashboards, and trend reporting are deferred to later phases. |
| Multi-platform social API integrations | Deep integrations with Instagram, TikTok, YouTube APIs are not required for the MVP core loop. May be introduced incrementally. |
| Legal contract generation | Requires legal review and is out of scope for MVP. |
| Autonomous AI actions | No autonomous outreach, payments, or dispute resolution. AI remains advisory per [product-vision.md §6, Principle 2](./product-vision.md#6-core-product-principles). |
| Guaranteed fraud detection | Trust analysis surfaces signals; it does not guarantee detection (see [product-vision.md §8](./product-vision.md#8-what-collabtrust-is-not)). |
| Mobile-native application | A responsive web application is sufficient for MVP. Native mobile apps are deferred. |

---

## 5. Assumptions

The goals and metrics defined in this document rest on the following assumptions. These are explicitly called out because they have **not been independently validated**. They align with the assumptions documented in [problem-definition.md §11](./problem-definition.md#11-assumptions-and-open-questions).

| # | Assumption | Reference |
|---|---|---|
| A-1 | Small and growing brands find creator discovery genuinely difficult and would use an AI-assisted marketplace to reduce that effort. | problem-definition.md §11, Assumption 1 |
| A-2 | Emerging creators find it hard to discover relevant brand opportunities and would use a structured marketplace for proactive discovery. | problem-definition.md §11, Assumption 2 |
| A-3 | Both sides would use a structured marketplace if it existed at an accessible price point. | problem-definition.md §11, Assumption 3 |
| A-4 | Explainable AI matching is more valuable to users than unexplained ranking or sorting. | problem-definition.md §11, Assumption 4 |
| A-5 | Trust signals can be surfaced from available data at sufficient quality to be perceived as useful by users. | problem-definition.md §11, Assumption 5 |
| A-6 | Users will accept AI-assisted recommendations as long as they retain final decision control. | problem-definition.md §11, Assumption 7 |
| A-7 | The metrics defined above can be measured with reasonable accuracy using the proposed measurement methods in the MVP. | **New assumption** — needs validation during implementation |
| A-8 | Users will provide in-app feedback when prompted with lightweight feedback mechanisms. | **New assumption** — feedback response rate is unknown |
| A-9 | The MVP can be built within the hackathon timeline with sufficient fidelity to validate the core loop. | problem-definition.md §11, Assumption 9 |

> [!WARNING]
> If Assumptions A-1, A-2, or A-3 are invalidated through user testing, the product goals should be revisited before further investment. These are foundational assumptions.

---

## 6. Related Documents

| Document | Purpose |
|---|---|
| [`product-vision.md`](./product-vision.md) | Mission, vision, principles, and product boundaries |
| [`problem-definition.md`](./problem-definition.md) | Detailed problem analysis, root causes, and assumptions |
| [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) | Master handoff document; phase status, next task, working rules |
| [`mvp-scope.md`](./mvp-scope.md) | Detailed MVP scope, feature priorities, and cut-line decisions |
| [`docs/README.md`](../README.md) | Documentation directory index |
