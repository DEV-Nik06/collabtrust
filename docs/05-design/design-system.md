# CollabTrust — Design System

> **Status:** Draft (Proposed)  
> **Phase:** Phase 6 — Design  
> **Depends on:** [`ux-flows.md`](./ux-flows.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Visual Language & Principles

The CollabTrust interface embodies three core principles:
1. **Clarity & Trust:** Crisp typography, generous whitespace, and neutral surfaces establish credibility without distraction.
2. **Accessible Decision-Support:** Complex AI information (match explanations, trust signals) is organized into clear cards with explicit hierarchical labeling.
3. **Role-Tailored Cohesion:** Brands and creators share a unified aesthetic with subtle contextual accent cues.

---

## 2. Color Palette (Tailwind Tokens)

### Neutral Base (Slate)
* **Canvas Background:** `bg-slate-50` (`#F8FAFC`)
* **Card & Modal Surface:** `bg-white` (`#FFFFFF`)
* **Subtle Borders & Dividers:** `border-slate-200` (`#E2E8F0`)
* **Muted Text / Meta Labels:** `text-slate-500` (`#64748B`)
* **Body Text:** `text-slate-700` (`#334155`)
* **Headings & High-Emphasis:** `text-slate-900` (`#0F172A`)

### Primary Accent (Indigo / Trust Blue)
* **Brand Primary:** `bg-indigo-600` (`#4F46E5`), hover `bg-indigo-700` (`#4338CA`)
* **Interactive Focus / Selection:** `ring-indigo-500` / `text-indigo-600`
* **Light Accent Surface:** `bg-indigo-50` (`#EEF2FF`)

### Semantic Status Colors
* **Success / Completed:** `emerald-600` (`#059669`) / `bg-emerald-50` (`#ECFDF5`)
* **Warning / Anomaly Flag:** `amber-600` (`#D97706`) / `bg-amber-50` (`#FFFBEB`)
* **Error / High Alert:** `rose-600` (`#E11D48`) / `bg-rose-50` (`#FFF1F2`)
* **Informational / Neutral Signal:** `slate-600` (`#475569`) / `bg-slate-100` (`#F1F5F9`)

---

## 3. Typography & Hierarchy

Font family: **Inter** or standard system sans-serif (`font-sans`).

| Level | Size / Weight | Tailwind Class | Usage |
|---|---|---|---|
| **Page Title (H1)** | 28px (1.75rem) / Bold | `text-2xl font-bold tracking-tight text-slate-900` | Dashboard headings, Campaign titles |
| **Section Title (H2)** | 20px (1.25rem) / SemiBold | `text-xl font-semibold text-slate-900` | Card group titles, Tab headers |
| **Subsection (H3)** | 16px (1.0rem) / Medium | `text-base font-medium text-slate-900` | Fieldset legends, Modal titles |
| **Body Regular** | 14px (0.875rem) / Normal | `text-sm text-slate-700 leading-relaxed` | Brief descriptions, Message threads |
| **Meta / Small** | 12px (0.75rem) / Normal | `text-xs text-slate-500` | Timestamps, Disclaimers, Tag labels |

---

## 4. Reusable UI Components

### 4.1 Buttons
* **Primary:** `bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition`
* **Secondary:** `bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-lg border border-slate-300 shadow-sm transition`
* **Danger:** `bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition`

### 4.2 Cards
* Standard container: `bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:border-slate-300 transition`
* AI Recommendation Highlight: `bg-white rounded-xl border-2 border-indigo-200 shadow-sm p-6`

### 4.3 Form Inputs
* Text fields & Textareas: `block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`

### 4.4 Trust Signal Card Component

> All audience and engagement figures in trust signals are based on **creator self-reported profile data** — the MVP has no live platform analytics integration. Every trust signal card must be accompanied by the Mandatory Trust Disclaimer Banner (§4.5), reproduced verbatim: *"Informational observations only. CollabTrust surfaces signals and evidence, not fraud guarantees or definitive authenticity verdicts."*

* **Informational Signal (sample):**
  ```html
  <div class="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
    <span class="inline-block w-2 h-2 mt-1.5 rounded-full bg-slate-400"></span>
    <div>
      <p class="text-xs font-semibold text-slate-800">Engagement Consistency</p>
      <p class="text-xs text-slate-600">Self-reported engagement figures are consistent across recent posts. (Sample content — based on creator self-reported data, not platform analytics.)</p>
    </div>
  </div>
  ```
* **Anomaly Flag (sample):**
  ```html
  <div class="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
    <span class="inline-block w-2 h-2 mt-1.5 rounded-full bg-amber-500"></span>
    <div>
      <p class="text-xs font-semibold text-amber-900">Self-Reported Audience Figure</p>
      <p class="text-xs text-amber-700">Creator self-reported followers: 12,400 (updated 2026-10-01) — self-reported, not platform-verified. (Sample content for illustration.)</p>
    </div>
  </div>
  ```

### 4.5 Mandatory Trust Disclaimer Banner
```html
<div class="p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2">
  <svg class="w-4 h-4 text-slate-400 flex-shrink-0" ...></svg>
  <span>Informational observations only. CollabTrust surfaces signals and evidence, not fraud guarantees or definitive authenticity verdicts.</span>
</div>
```

---

## 5. Responsive Breakpoints

* **Mobile (`< 640px`):** Single-column stacked cards, bottom navigation or collapsible drawer, full-width touch buttons.
* **Tablet (`640px – 1024px`):** Two-column grids, collapsed sidebar navigation.
* **Desktop (`>= 1024px`):** Persistent left sidebar, multi-column dashboard layouts, slide-over preview panels.

---

## 6. Related Documents

| Document | Purpose |
|---|---|
| [`ux-flows.md`](./ux-flows.md) | User interaction flows and sitemaps |
| [`wireframes/README.md`](./wireframes/README.md) | Wireframe blueprints |
| [`docs/02-requirements/non-functional-requirements.md`](../02-requirements/non-functional-requirements.md) | Accessibility and performance standards |
