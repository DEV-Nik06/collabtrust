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
│  │ [ View Full Profile ]                    [ Accept Collaboration ] │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

> [!NOTE]
> The primary action button uses the accept/select terminology defined in [`FEAT-041`](../../01-product/feature-requirements.md) (Brand Reviews and Selects Creators). Accepting initializes the collaboration in "Invited" status per [`FEAT-042`](../../01-product/feature-requirements.md); there is no separate "invite" action in MVP scope.

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
│  │ Deliverables Checklist    │  │ Collaboration Messages            │  │
│  │                           │  │                                   │  │
│  │ [✓] Product Received      │  │ Maya: Received the moisturizer!   │  │
│  │ [ ] Draft Reel Submitted  │  │ Glow Co: Great, let us know when  │  │
│  │ [ ] 2 Stories Published   │  │ you have the first draft ready.   │  │
│  │                           │  │                                   │  │
│  │ [ Submit Deliverable Link]│  │ [ Type your message...     ] [Send│  │
│  └───────────────────────────┘  └───────────────────────────────────┘  │
│                                                                        │
│  [ Confirm All Deliverables Completed ]                                │
└────────────────────────────────────────────────────────────────────────┘
```

> [!NOTE]
> **FEAT coverage:** The status stepper maps to [`FEAT-042`](../../01-product/feature-requirements.md) (Collaboration Status Tracking, MUST-HAVE), the message pane to [`FEAT-043`](../../01-product/feature-requirements.md) (Basic Messaging, SHOULD-HAVE), and "Confirm All Deliverables Completed" to [`FEAT-044`](../../01-product/feature-requirements.md) (Collaboration Completion, MUST-HAVE). The **Deliverables Checklist** and **"Submit Deliverable Link"** controls are **Deferred (post-MVP) — not in MVP scope**: no corresponding FEAT exists, and the collaboration checklist is NICE-TO-HAVE/deferred per [`mvp-scope.md` §3.5](../../01-product/mvp-scope.md).

---

## 2. Related Documents

| Document | Purpose |
|---|---|
| [`ux-flows.md`](../ux-flows.md) | Step-by-step user interaction flows |
| [`design-system.md`](../design-system.md) | Component styling, tokens, and typography |
| [`docs/01-product/mvp-scope.md`](../../01-product/mvp-scope.md) | MVP feature scope |
