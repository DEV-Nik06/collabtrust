# CollabTrust — User Personas

> **Status:** Draft  
> **Phase:** 2.4 — User Personas  
> **Depends on:** [`product-vision.md`](./product-vision.md), [`problem-definition.md`](./problem-definition.md), [`target-users.md`](./target-users.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)

---

> [!IMPORTANT]
> These are **illustrative personas**, created to guide product design and prioritization. They are **not** based on real user research, customer interviews, or validated data. No statistics, market numbers, or behavioral data should be inferred from these personas. They should be revised once actual user research is conducted.

---

## 1. Purpose

This document defines representative user personas for CollabTrust. Each persona represents a key segment within the platform's two-sided marketplace (brands and creators). Personas are used to:

- Ground feature discussions in concrete user needs
- Prioritize MVP capabilities for the most important initial users
- Provide a shared reference for design, development, and testing conversations
- Identify where different user types have overlapping vs. diverging needs

---

## 2. Persona Summary

| Persona | Side | Segment | MVP Relevance |
|---|---|---|---|
| [Priya Sharma](#31-priya-sharma---small-brand-founder) | Brand | Small brand | **Primary MVP user** |
| [Daniel Okafor](#32-daniel-okafor---growing-brand-marketing-manager) | Brand | Growing brand | **Primary MVP user** |
| [Lisa Chen](#33-lisa-chen---mid-size-brand-marketer) | Brand | Mid-size brand | Secondary / future user |
| [Maya Torres](#34-maya-torres---emerging--micro-creator) | Creator | Emerging / micro creator | **Primary MVP user** |
| [Jordan Ellis](#35-jordan-ellis---mid-tier-creator) | Creator | Mid-tier creator | Secondary MVP user |

---

## 3. Personas

### 3.1 Priya Sharma — Small Brand Founder

| | |
|---|---|
| **Name** | Priya Sharma |
| **Role / Title** | Founder & Owner |
| **Segment** | Small brand |
| **MVP Relevance** | **Primary MVP user** |

#### Background

Priya runs a small direct-to-consumer skincare brand that she founded two years ago. She handles most of the business operations herself, including marketing. She has heard that creator collaborations can drive awareness and sales, but she has no dedicated marketing team and a very limited marketing budget. She does everything from product sourcing to social media posting.

#### Goals

- Find creators whose audience genuinely aligns with her product category and brand values
- Launch her first creator collaboration without spending weeks searching for the right person
- Understand *why* a creator might be a good fit before reaching out
- Keep costs manageable — she cannot afford enterprise influencer platforms or agency fees

#### Frustrations / Pain Points

- **Discovery is exhausting.** She spends hours scrolling through Instagram and TikTok trying to find creators in her niche, with no structured way to filter or compare them. *(See [Problem Definition §2.1](./problem-definition.md#21-discovery-is-difficult-and-time-consuming))*
- **She can't tell who's real.** Follower counts are confusing — she's unsure which creators have genuine engagement and which have inflated numbers. *(See [Problem Definition §2.3](./problem-definition.md#23-authenticity-and-fit-are-hard-to-evaluate))*
- **Existing tools are too expensive.** The influencer marketing platforms she's looked at are priced for companies with much larger budgets. *(See [Problem Definition §2.2](./problem-definition.md#22-budget-constraints-limit-access))*
- **She doesn't know how to write a proper campaign brief.** She has a general idea of what she wants but struggles to articulate it in a way that a creator would find clear and actionable. *(See [Problem Definition §2.6](./problem-definition.md#26-structuring-campaigns-is-unguided))*

#### Current Behavior

- Searches Instagram hashtags and "suggested accounts" manually
- Asks friends and other small business owners for creator recommendations
- Manages outreach via Instagram DMs and personal email
- Tracks everything in a personal spreadsheet
- Has attempted one collaboration that didn't produce results, partly because the creator's audience didn't overlap with her target customers

#### What She Needs from CollabTrust

- An affordable, accessible marketplace where she can post a campaign and get matched to relevant creators
- **Campaign Brief Agent** to help her turn a rough idea into a structured brief
- **Creator Matching Agent** with explainable recommendations so she understands *why* a creator fits her campaign
- **Trust Analysis Agent** that surfaces available trust signals about a creator's profile (without claiming guaranteed fraud detection)
- A simple collaboration workflow so she doesn't have to manage everything over DMs

#### Quote

> *"I know creator marketing could work for my brand, but I don't have the time or budget to figure out who to work with. I just need someone to help me find the right person without it becoming a second job."*

---

### 3.2 Daniel Okafor — Growing Brand Marketing Manager

| | |
|---|---|
| **Name** | Daniel Okafor |
| **Role / Title** | Marketing Manager |
| **Segment** | Growing brand |
| **MVP Relevance** | **Primary MVP user** |

#### Background

Daniel manages a small marketing team at a growing fitness apparel company. The brand has validated its product-market fit and is now investing in creator collaborations to scale awareness. Daniel has run a handful of influencer campaigns but has done everything manually — finding creators, negotiating terms, tracking deliverables. As the number of collaborations grows, the manual process is breaking down.

#### Goals

- Scale the brand's creator collaboration program from a few collaborations per quarter to a steady pipeline
- Reduce the time spent on manual discovery and vetting of creators
- Bring structure and consistency to the collaboration workflow across his team
- Build relationships with a reliable pool of creators whose audiences align with the brand's fitness-focused customer base

#### Frustrations / Pain Points

- **Discovery doesn't scale.** What worked for two collaborations doesn't work for ten. Manual searching across multiple platforms is too slow. *(See [Problem Definition §2.1](./problem-definition.md#21-discovery-is-difficult-and-time-consuming))*
- **No explanation behind matches.** When he's used platforms in the past, he gets ranked lists with no reasoning. He can't justify creator selections to his team or leadership without clear rationale. *(See [Problem Definition §2.4](./problem-definition.md#24-matching-lacks-explanation))*
- **Outreach and collaboration management is fragmented.** He's managing relationships across email threads, Slack messages, Instagram DMs, and Google Sheets. Nothing is centralized. *(See [Problem Definition §2.5](./problem-definition.md#25-outreach-and-communication-are-fragmented))*
- **Budget is growing but still limited.** Enterprise platforms are still out of reach or hard to justify given the brand's stage. He needs tools that offer value at a price point appropriate for a growing brand.

#### Current Behavior

- Uses a combination of social media search, competitor analysis, and word-of-mouth referrals
- Has tried free tiers of existing influencer tools but found them limited
- Manages collaboration details in shared Google Sheets and Docs
- Personally handles most creator communication via email and DMs
- Spends a disproportionate amount of his time on logistics rather than strategy

#### What He Needs from CollabTrust

- A structured marketplace where he can post campaigns and receive AI-assisted creator matches with explanations
- **Creator Matching Agent** that considers campaign requirements, content alignment, and audience relevance — with reasoning
- **Trust Analysis Agent** to surface signals about creator profile quality so he can evaluate candidates with more confidence
- A shared collaboration workflow that his small team can use consistently
- Scalability — a tool that works for five collaborations as well as it works for one

#### Quote

> *"I've proven that creator marketing works for us. Now I need a way to do it ten times over without ten times the effort. I can't keep managing everything in spreadsheets."*

---

### 3.3 Lisa Chen — Mid-Size Brand Marketer

| | |
|---|---|
| **Name** | Lisa Chen |
| **Role / Title** | Senior Marketing Strategist |
| **Segment** | Mid-size brand |
| **MVP Relevance** | **Secondary / future user** |

#### Background

Lisa works at a mid-size consumer electronics company with a dedicated marketing department. The brand already runs creator campaigns through a combination of agency relationships and an enterprise influencer platform. Lisa is exploring CollabTrust as a potential complementary tool — particularly for reaching emerging creators in niche communities that her agency doesn't serve well.

#### Goals

- Discover emerging creators in niche technology and lifestyle communities that her current tools and agency miss
- Evaluate whether a newer, AI-assisted platform can surface better matches for specialized campaigns
- Supplement her existing influencer program with a broader pool of creators, especially for campaigns targeting niche audiences

#### Frustrations / Pain Points

- **Agency roster is limited.** Her agency works with a fixed roster of established creators, which doesn't cover every niche she needs. *(See [Problem Definition §4 — Influencer agencies](./problem-definition.md#4-current-approaches-and-their-limitations))*
- **Enterprise tools bias toward large creators.** The enterprise platform she uses favors established creators and doesn't surface emerging talent well.
- **Finding niche creators still requires manual work.** For specialized campaigns, she still ends up doing manual social media research, even with access to premium tools.

#### Current Behavior

- Uses an enterprise influencer marketing platform for most campaigns
- Works with an agency for larger, ongoing partnerships
- Manually searches for niche creators when agency and platform fall short
- Has budget and tooling but finds gaps in coverage for specialized or emerging-creator campaigns

#### What She Needs from CollabTrust

- Access to a pool of emerging/micro creators who are not represented on enterprise platforms
- AI-assisted matching that can surface relevant creators for niche, specialized campaigns
- Explainable match recommendations that help her compare candidates quickly
- Trust signals as a supplementary data point alongside her existing evaluation process

#### Quote

> *"My agency is great for big campaigns, but when I need someone who really knows a niche community, I'm back to scrolling through social media. I'd love a tool that fills that gap."*

> [!NOTE]
> Lisa represents a growth-opportunity persona. She is not part of the primary MVP target but illustrates how CollabTrust can expand to serve larger brands over time. Her needs should inform the platform's extensibility, not drive initial MVP scope.

---

### 3.4 Maya Torres — Emerging / Micro Creator

| | |
|---|---|
| **Name** | Maya Torres |
| **Role / Title** | Content Creator (part-time) |
| **Segment** | Emerging / micro creator |
| **MVP Relevance** | **Primary MVP user** |

#### Background

Maya is a lifestyle and sustainable living content creator who has been building her audience for about a year. She creates content on Instagram and TikTok, and has a small but engaged following. She's reached a point where she wants to start monetizing her platform through brand collaborations, but she doesn't know where to start. She has never worked with a brand before.

#### Goals

- Find her first legitimate brand collaboration that aligns with her content niche and personal values
- Get discovered by brands that are relevant to her audience, rather than waiting passively and hoping
- Understand what brands are looking for so she can present herself effectively
- Build a portfolio of collaborations that she can grow over time

#### Frustrations / Pain Points

- **She doesn't know where to find opportunities.** Brand opportunities feel invisible — she sees other creators doing collaborations but doesn't know how they found them. *(See [Problem Definition §3.1](./problem-definition.md#31-legitimate-opportunities-are-hard-to-find))*
- **Discovery is reactive.** She has to wait for brands to find her, but with a smaller following, she's rarely discovered. Platforms that do list opportunities tend to favor creators with large audiences. *(See [Problem Definition §3.2](./problem-definition.md#32-opportunity-discovery-is-reactive-not-proactive))*
- **Spam and low-quality offers.** The few brand inquiries she's received via DMs felt generic or potentially fraudulent. She couldn't verify whether the brands were legitimate. *(See [Problem Definition §3.4](./problem-definition.md#34-trust-works-both-ways))*
- **No way to signal what she's looking for.** There's no structured way to indicate the types of brands, product categories, or collaboration formats she's interested in. *(See [Problem Definition §3.3](./problem-definition.md#33-relevance-and-fit-are-unfiltered))*

#### Current Behavior

- Posts content consistently on Instagram and TikTok
- Occasionally searches hashtags like #brandcollab or #influenceropportunity with limited results
- Has responded to a few unsolicited DM offers but didn't follow through because the brands felt unverified
- Does not have a media kit or standardized profile for collaboration pitching
- Follows larger creators and tries to replicate their strategies, but lacks their reach and connections

#### What She Needs from CollabTrust

- A creator-facing marketplace where she can proactively browse and apply to relevant campaigns
- A structured profile where she can describe her niche, audience, content style, and collaboration preferences
- **Profile Insight Agent** to help present her profile information clearly to brands
- Brand-side trust signals so she can verify whether a brand is legitimate before engaging
- Clear match explanations that help her understand why a particular campaign is relevant to her
- A structured collaboration workflow so she knows what's expected if she lands a collaboration

#### Quote

> *"I've been creating content for a year and I'm ready to start working with brands, but I have no idea how to get started. I just want a way to find real opportunities that make sense for what I do."*

---

### 3.5 Jordan Ellis — Mid-Tier Creator

| | |
|---|---|
| **Name** | Jordan Ellis |
| **Role / Title** | Content Creator (full-time) |
| **Segment** | Mid-tier creator |
| **MVP Relevance** | **Secondary MVP user** |

#### Background

Jordan is a full-time fitness and wellness content creator with an established presence on YouTube and Instagram. He receives brand inquiries regularly but finds that many are irrelevant to his content or audience. He's done enough collaborations to know what works and what doesn't, and he's looking for better-matched, higher-quality opportunities rather than more volume.

#### Goals

- Receive brand collaboration opportunities that are genuinely relevant to his audience and content style
- Spend less time filtering through irrelevant or low-quality brand inquiries
- Evaluate brand legitimacy and collaboration terms before committing
- Manage multiple active collaborations efficiently without things falling through the cracks

#### Frustrations / Pain Points

- **Most inbound offers are irrelevant.** He receives frequent brand inquiries, but the majority are for products that don't align with his audience or values. There's no filter. *(See [Problem Definition §3.3](./problem-definition.md#33-relevance-and-fit-are-unfiltered))*
- **No structured way to evaluate brands.** When a brand reaches out, he has limited tools to assess their legitimacy, track record, or whether they have a history of fair collaboration. *(See [Problem Definition §3.4](./problem-definition.md#34-trust-works-both-ways))*
- **Collaboration logistics are messy.** Managing multiple ongoing collaborations across email, DMs, and informal agreements leads to confusion and occasional missed commitments. *(See [Problem Definition §3.5](./problem-definition.md#35-no-structured-collaboration-workflow))*
- **He wants quality, not quantity.** He doesn't need more offers; he needs better-matched ones.

#### Current Behavior

- Receives brand inquiries via email and Instagram DMs
- Manually evaluates each brand by researching their website and social presence
- Negotiates terms informally via email or messaging
- Tracks deliverables and deadlines in his own notes and calendar
- Occasionally turns down collaborations after investing time in evaluation, because the fit wasn't right
- Has worked with a few brands through agencies, but prefers direct relationships

#### What He Needs from CollabTrust

- A platform that matches him to campaigns based on genuine audience and content alignment — not just follower count
- AI-assisted filtering so irrelevant opportunities don't clutter his inbox
- Brand-side trust signals so he can quickly assess whether a brand is worth engaging with
- A structured collaboration workflow to track active campaigns, deliverables, and communication in one place
- Match explanations that clarify why a campaign is relevant to him

#### Quote

> *"I get plenty of brand offers, but most of them aren't a fit. I need a smarter filter — something that only shows me opportunities that actually make sense for my audience."*

> [!NOTE]
> Jordan represents a user who benefits from CollabTrust but is not the highest-urgency MVP target. His needs (filtering, quality matching, workflow management) overlap with primary MVP users but at a different scale. His persona helps ensure the platform design doesn't inadvertently exclude mid-tier creators.

---

## 4. Persona–Problem Mapping

The table below maps each persona to the primary problems they experience, as defined in the [Problem Definition](./problem-definition.md).

| Problem | Priya (Small Brand) | Daniel (Growing Brand) | Lisa (Mid-Size Brand) | Maya (Emerging Creator) | Jordan (Mid-Tier Creator) |
|---|:---:|:---:|:---:|:---:|:---:|
| Discovery is difficult and time-consuming | ● | ● | ○ | ● | ○ |
| Budget constraints limit access | ● | ● | ○ | — | — |
| Authenticity and fit are hard to evaluate | ● | ● | ○ | — | — |
| Matching lacks explanation | ● | ● | ○ | ○ | ○ |
| Outreach and communication are fragmented | ○ | ● | ○ | ○ | ● |
| Structuring campaigns is unguided | ● | ○ | — | — | — |
| Legitimate opportunities are hard to find | — | — | — | ● | ○ |
| Opportunity discovery is reactive | — | — | — | ● | ○ |
| Relevance and fit are unfiltered | — | — | — | ● | ● |
| Trust works both ways (brand legitimacy) | — | — | — | ● | ● |
| No structured collaboration workflow | ○ | ● | ○ | ● | ● |

**Legend:** ● = Primary pain point for this persona | ○ = Relevant but secondary | — = Not a primary concern

---

## 5. MVP Prioritization

The personas inform which capabilities should be prioritized for the MVP:

### Primary MVP personas (must be well-served by MVP)

1. **Priya Sharma** — Small brand founder. Represents the brand user who needs accessible, guided entry into creator collaboration.
2. **Daniel Okafor** — Growing brand marketing manager. Represents the brand user who has validated the channel and needs to scale with better tooling.
3. **Maya Torres** — Emerging/micro creator. Represents the creator who needs proactive discovery of relevant, legitimate opportunities.

### Secondary MVP personas (should not be excluded, but need not drive initial scope)

4. **Jordan Ellis** — Mid-tier creator. Benefits from the platform but has less urgency; his needs inform quality and filtering features.
5. **Lisa Chen** — Mid-size brand marketer. Represents a future growth segment; her needs inform platform extensibility but not MVP scope.

### Capabilities most critical to primary personas

| Capability | Primary Personas Served |
|---|---|
| Campaign Brief Agent | Priya, Daniel |
| Creator Matching Agent (with explanations) | Priya, Daniel, Maya |
| Trust Analysis Agent (signals, not guarantees) | Priya, Daniel, Maya |
| Creator-facing campaign discovery | Maya |
| Structured creator profile | Maya |
| Basic collaboration workflow | Priya, Daniel, Maya |

---

## 6. Assumptions

The following assumptions underpin these personas. They are consistent with the assumptions documented in [Problem Definition §11](./problem-definition.md#11-assumptions-and-open-questions).

| # | Assumption |
|---|---|
| 1 | Small brand founders frequently handle their own marketing and lack dedicated influencer relations staff. |
| 2 | Growing brand marketing managers experience a transition point where manual creator collaboration processes stop scaling. |
| 3 | Emerging creators want to proactively discover opportunities rather than wait to be contacted. |
| 4 | Mid-tier creators' primary frustration is relevance filtering, not opportunity volume. |
| 5 | Both brand and creator personas value explainable match recommendations over opaque ranked lists. |
| 6 | Both sides value trust signals presented as evidence, not as definitive fraud/legitimacy verdicts. |
| 7 | All personas in this document are illustrative and should be refined or replaced based on actual user research. |

---

## 7. Related Documents

| Document | Purpose |
|---|---|
| [`product-vision.md`](./product-vision.md) | Mission, vision, principles, and product boundaries |
| [`problem-definition.md`](./problem-definition.md) | Detailed problem definition; pain points referenced throughout this document |
| [`target-users.md`](./target-users.md) | User segments and initial focus definition |
| [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) | Master handoff document; phase status, next task, working rules |
