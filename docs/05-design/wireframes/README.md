# CollabTrust — UI Wireframes Blueprint

> **Status:** Draft (Structural Blueprints)  
> **Phase:** Phase 6 — Design  
> **Depends on:** [`ux-flows.md`](../ux-flows.md), [`design-system.md`](../design-system.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../../PROJECT_CONTEXT.md)  

> [!NOTE]
> This directory documents the structural layouts and wireframe blueprints for core CollabTrust screens. Actual visual design assets and Figma mockups will be created when the visual identity is finalized. No uncreated binary graphic assets exist yet.

---

## 1. Core Screen Layout Blueprints

### 1.1 Screen 1: Brand Campaign Creation (`/campaigns/new`)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [CollabTrust Logo]   Dashboard   Campaigns   Creators        [Profile] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Create a New Campaign Brief                                           │
│  Describe your campaign concept informally, and let AI structure it.   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Pitch / Concept Description                                      │  │
│  │ ┌──────────────────────────────────────────────────────────────┐ │  │
│  │ │ Looking for 3 skincare creators to test our green tea       │ │  │
│  │ │ moisturizer. Need 1 Reel and 2 Stories with link...          │ │  │
│  │ └──────────────────────────────────────────────────────────────┘ │  │
│  │                                                                  │  │
│  │ [ ✨ Structure with AI ]   [ Switch to Manual Form ]             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ─── Generated Campaign Brief Preview (Editable) ─────────────────────  │
│                                                                        │
│  Campaign Title: [ Green Tea Facial Moisturizer Product Review      ]  │
│  Target Audience: [ Eco-conscious skincare enthusiasts aged 18-35   ]  │
│  Deliverables:   [ 1 Instagram Reel + 2 Instagram Stories           ]  │
│  Budget Range:   [ $500 total budget                                ]  │
│                                                                        │
│  [ Save as Draft ]                        [ 🚀 Publish Campaign ]      │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 1.2 Screen 2: Brand Matched Creators & Trust Signals (`/campaigns/:id/matches`)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [CollabTrust Logo]   Dashboard   Campaigns   Creators        [Profile] │
├────────────────────────────────────────────────────────────────────────┤
│  ← Back to Campaigns                                                   │
│  Green Tea Facial Moisturizer Review [Active]                          │
│  [ Overview ]  [ Matched Creators (3) ]  [ Applications (2) ]          │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Maya Torres  •  @mayagreen (Instagram)                           │  │
│  │ Niche: Sustainable Living  •  Audience: 8.5k (self-reported)     │  │
│  │ Match Score: 88% Match                                           │  │
│  │                                                                  │  │
│  │ 💡 AI Match Explanation:                                         │  │
│  │ High audience alignment in clean skincare; consistent engagement  │  │
│  │ in product review reel format matches your deliverables.         │  │
│  │                                                                  │  │
│  │ ── Trust Signal Summary ───────────────────────────────────────  │  │
│  │ [ℹ️ Profile Complete] [ℹ️ Consistent Engagement] [⚠️ Spike Note] │  │
│  │                                                                  │  │
│  │ ℹ️ Disclaimer: Informational observations only. CollabTrust       │  │
│  │ surfaces signals and evidence, not fraud guarantees or           │  │
│  │ definitive authenticity verdicts.                                │  │
│  │                                                                  │  │
│  │ [ View Full Profile ]                          [ ⭐ Shortlist ] │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

> [!NOTE]
> In accordance with the approved marketplace workflow, matched creator cards support discovery actions: viewing the creator profile and shortlisting candidates. Brands cannot directly invite or initialize collaborations from AI match suggestions; creators must submit an application before a brand can accept or decline them. Acceptance and decline actions are located exclusively within the Applications tab ([`/campaigns/:id/applications`](../../03-architecture/api-design.md#35-applications--collaboration-workflow)).

---

### 1.3 Screen 3: Creator Marketplace Feed (`/explore`)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [CollabTrust Logo]   Dashboard   Explore Campaigns   Profile  [Avatar] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Explore Brand Collaboration Opportunities                             │
│  Discover campaigns matched to your audience and niche.                │
│                                                                        │
│  Search: [ Search campaigns... ]  Category: [ Beauty & Wellness ▼ ]    │
│                                                                        │
│  ┌─────────────────────────┐     ┌─────────────────────────┐          │
│  │ Glow Skincare Co        │     │ PureFit Apparel         │          │
│  │ Green Tea Moisturizer   │     │ Summer Activewear Launch│          │
│  │ Budget: $500            │     │ Budget: $800            │          │
│  │ Deliverables: 1 Reel    │     │ Deliverables: 2 TikToks │          │
│  │ Match: 88% High Fit     │     │ Match: 65% Moderate Fit │          │
│  │                         │     │                         │          │
│  │ [ View Details & Apply] │     │ [ View Details & Apply] │          │
│  └─────────────────────────┘     └─────────────────────────┘          │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 1.4 Screen 4: Active Collaboration Workspace (`/collaborations/:id`)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [CollabTrust Logo]   Dashboard   Collaboration Hub           [Avatar] │
├────────────────────────────────────────────────────────────────────────┤
│  Collaboration: Glow Skincare Co × Maya Torres                         │
│  Campaign: Green Tea Facial Moisturizer Product Review                 │
│                                                                        │
│  Status: [1. Invited] ── [2. Accepted] ── [3. In Progress] ── [4. Done]│
│                                                                        │
│  ┌───────────────────────────┐  ┌───────────────────────────────────┐  │
│  │ Campaign Details Summary  │  │ Collaboration Messages            │  │
│  │ (Deliverables Checklist is│  │                                   │  │
│  │  DEFERRED POST-MVP; links │  │ Maya: Received the moisturizer!   │  │
│  │  shared via messages)     │  │ Glow Co: Great, let us know when  │  │
│  │                           │  │ you have the first draft ready.   │  │
│  │ Deliverables:             │  │ Maya: Draft posted: drive.link/...│  │
│  │ • 1 Reel (30-60s)         │  │                                   │  │
│  │ • 2 Stories with link     │  │ [ Type your message...     ] [Send│  │
│  └───────────────────────────┘  └───────────────────────────────────┘  │
│                                                                        │
│  [ Confirm All Deliverables Completed ]                                │
└────────────────────────────────────────────────────────────────────────┘
```

> [!NOTE]
> **FEAT coverage:** The status stepper maps to [`FEAT-042`](../../01-product/feature-requirements.md) (Collaboration Status Tracking, MUST-HAVE), the message pane to [`FEAT-043`](../../01-product/feature-requirements.md) (Basic Messaging, SHOULD-HAVE), and "Confirm All Deliverables Completed" to [`FEAT-044`](../../01-product/feature-requirements.md) (Collaboration Completion, MUST-HAVE). Interactive checklist checkboxes and external link submission forms are **explicitly deferred post-MVP**: deliverable confirmation for MVP is coordinated directly through the message thread and finalized via the mutual completion action.

---

## 2. Related Documents

| Document | Purpose |
|---|---|
| [`ux-flows.md`](../ux-flows.md) | Step-by-step user interaction flows |
| [`design-system.md`](../design-system.md) | Component styling, tokens, and typography |
| [`docs/01-product/mvp-scope.md`](../../01-product/mvp-scope.md) | MVP feature scope |
