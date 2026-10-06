# CollabTrust — Project Context

> Persistent handoff document for continuing CollabTrust development across ChatGPT sessions.

## 1. Project Overview

**Project:** CollabTrust

**Concept:** An AI-assisted influencer marketplace connecting emerging creators with small and growing brands.

**Core problem:**
- Small/growing brands struggle to discover relevant creators within limited budgets.
- Emerging creators struggle to discover legitimate and relevant brand collaboration opportunities.
- Both sides spend time evaluating profiles, finding suitable matches, communicating requirements, and managing collaboration workflows.
- Trust and authenticity are difficult to assess reliably from limited/public data.

**Core value proposition:**
- Brands find relevant emerging creators faster.
- Creators discover relevant brand opportunities.
- AI reduces repetitive work and provides explainable matching/trust signals.
- Users remain in control of important collaboration decisions.

## 2. Product Vision

**Mission:**
> Make creator-brand collaborations more accessible, transparent, and efficient for emerging creators and growing brands.

**Vision:**
> CollabTrust aims to become an intelligent collaboration platform where brands and creators can discover relevant opportunities, evaluate collaboration signals, and manage campaigns through AI-assisted workflows.

## 3. Core Product Principles

1. **Marketplace first** — the core product is the relationship between brands and creators.
2. **AI-assisted, human-controlled** — AI recommends, summarizes, analyzes, and drafts; users make important decisions.
3. **Evidence over claims** — trust analysis presents signals/evidence rather than definitive authenticity or fraud guarantees.
4. **Explainability** — important AI recommendations should explain why.
5. **Focused MVP** — start with a narrow set of high-value workflows.
6. **Documentation as source of truth** — important product and technical decisions must be documented.

## 4. AI Direction

Planned AI capabilities/agents:

### Campaign Brief Agent
Converts a brand's free-text campaign idea/brief into a structured, editable campaign draft.

### Creator Matching Agent
Finds suitable creators based on campaign requirements and provides match explanations.

### Profile Insight Agent
Summarizes creator profile information and relevant audience/content signals.

### Trust Analysis Agent
Summarizes available trust signals and potential anomalies. It must NOT claim to definitively identify fake creators or guarantee authenticity.

### Collaboration Assistant
Drafts communication, requirements, checklists, and collaboration preparation.

### Workflow Coordinator
Routes defined workflow events, retries appropriate operations, and tracks workflow state.

**Hackathon priority:**
1. Campaign Brief Agent
2. Trust Analysis Agent
3. Creator Matching + explanation
4. Workflow assistance

Avoid autonomous outreach, autonomous payments, autonomous dispute resolution, or other high-impact actions in the initial MVP.

## 5. Core Product Loop

Brand creates campaign
→ AI structures campaign
→ Relevant creators are matched
→ Match explanations are shown
→ Creators discover/apply
→ Brand reviews creators
→ Collaboration begins
→ Campaign completes
→ Outcomes/reputation can improve future marketplace intelligence

## 6. What CollabTrust Is NOT

Initial product is not intended to be:
- A social media platform
- A replacement for Instagram/TikTok/YouTube
- An AI-generated influencer
- An autonomous marketing agency
- A guaranteed fraud detector
- An automated spam/mass-outreach system
- A system that makes important collaboration decisions for users
- A complete payment-processing platform

## 7. Proposed Technical Direction

**Frontend:** React, TypeScript, Tailwind CSS

**Backend:** Node.js, Express, TypeScript

**Database:** PostgreSQL, Prisma ORM

**AI:** LLM API; agent/workflow layer such as LangGraph or a lightweight custom workflow engine to be evaluated after requirements are finalized.

**Testing:** Vitest, Supertest, Playwright

**API:** REST, OpenAPI/Swagger

**Infrastructure:** Git + GitHub, GitHub Actions, Docker where useful. Deployment platform to be finalized.

## 8. Repository Structure

```text
collabtrust/
├── apps/
│   ├── web/
│   ├── api/
│   └── worker/
├── packages/
│   ├── shared/
│   ├── config/
│   └── ai/
├── docs/
│   ├── 01-product/
│   ├── 02-requirements/
│   ├── 03-architecture/
│   │   └── ADR/
│   ├── 04-ai/
│   ├── 05-design/
│   │   └── wireframes/
│   ├── 06-testing/
│   └── 07-deployment/
├── knowledge-base/
│   ├── product/
│   ├── technical/
│   ├── ai-agents/
│   ├── decisions/
│   └── research/
├── infrastructure/
├── scripts/
├── .github/
├── PROJECT_CONTEXT.md
├── README.md
├── CONTRIBUTING.md
├── .gitignore
├── .env.example
└── LICENSE
```

## 9. Documentation Roadmap

### Phase 2 — Product Definition
1. Product Vision
2. Problem Definition
3. Target Users
4. User Personas
5. User Journeys
6. Product Goals & Success Metrics
7. MVP Scope
8. Feature Requirements
9. PRD

### Phase 3 — Requirements
1. SRS
2. Functional Requirements
3. Non-Functional Requirements
4. User Stories
5. Acceptance Criteria

### Phase 4 — Architecture
1. System Architecture
2. Database Design
3. API Design
4. Security Design
5. Architecture Decision Records

### Phase 5 — AI
1. AI Architecture
2. Agent Specifications
3. Agent Tools/Permissions
4. Workflow Specifications
5. Prompt Specifications
6. AI Evaluation Plan
7. AI Safety/Guardrails

### Phase 6 — Design
1. UX flows
2. Wireframes
3. Design system
4. Final UI specifications

### Phase 7 — Testing & Deployment
1. Test strategy
2. Test cases
3. Deployment guide
4. CI/CD
5. Monitoring/logging

## 10.5 Repository Identity and Authentication

CollabTrust is being developed from an office computer where the existing global Git configuration must remain unchanged.

### Git identity strategy

- The office machine's global Git `user.name` and `user.email` must not be changed.
- CollabTrust uses a **local repository Git identity** configured inside `.git/config`.
- Local configuration takes precedence over the global configuration for this repository.
- Company repositories continue using the existing office/global Git identity.

For CollabTrust, configure:

```bash
git config --local user.name "Your Personal Name"
git config --local user.email "your-personal-email@example.com"
```

Verify the local identity:

```bash
git config --local user.name
git config --local user.email
```

Verify the global office identity separately:

```bash
git config --global user.name
git config --global user.email
```

### GitHub authentication

Git commit identity and GitHub authentication are separate concepts.

- **Git identity** determines the author information recorded on commits.
- **GitHub authentication** determines which GitHub account has permission to access/push to a repository.
- The CollabTrust remote points to the personal CollabTrust GitHub repository.
- Do not change company GitHub access or global Git configuration unnecessarily.

### Safety rule

Never run the following with personal details on the office machine:

```bash
git config --global user.name "..."
git config --global user.email "..."
```

Use `--local` inside the CollabTrust repository instead.


## 10. Phase Status

### Phase 1 — Repository Setup
**Status: COMPLETE**

Completed:
- GitHub repository created
- Local Git repository configured
- Initial folder structure created
- README created
- `.gitignore` created
- `.env.example` created
- `CONTRIBUTING.md` created
- Pull Request template created
- Feature, bug, and documentation issue templates created
- Documentation index created
- Initial commits pushed to GitHub

### Phase 2 — Product Definition
**Status: IN PROGRESS**

Current step:
**2.1 Product Vision**

Product vision has been defined and should be stored in:

`docs/01-product/product-vision.md`

Next step:
**2.2 Problem Definition**

## 11. Phase 2 Working Sequence

```text
2.1 Product Vision
      ↓
2.2 Problem Definition
      ↓
2.3 Target Users
      ↓
2.4 User Personas
      ↓
2.5 User Journeys
      ↓
2.6 Product Goals & Success Metrics
      ↓
2.7 MVP Scope
      ↓
2.8 Feature Requirements
      ↓
2.9 PRD
```

## 12. Immediate Next Task

Start **Phase 2.2 — Problem Definition**.

Cover:
- Current situation for small/growing brands
- Current situation for emerging creators
- Pain points for each side
- Root causes
- Existing alternatives/workarounds
- Weaknesses of existing approaches
- Trust/authenticity problem
- Marketplace cold-start problem
- Why CollabTrust is needed
- Problem statements
- Jobs-to-be-done
- Evidence and assumptions that still need validation

Do not jump directly to technical implementation.

## 13. Important Product Risks

1. **Marketplace cold start** — need both brands and creators; a narrow initial niche may be necessary.
2. **Competition** — existing influencer platforms mean CollabTrust needs a clear differentiator.
3. **Trust accuracy** — public metrics can be incomplete or misleading; AI should show signals and limitations.
4. **AI reliability** — agent outputs need structured schemas, validation, evaluation, and human control.
5. **Scope creep** — do not build payments, autonomous outreach, advanced analytics, or every social integration before validating the core workflow.
6. **Data/privacy** — collect only required data and never commit secrets.

## 14. Development Rules

- Document important decisions.
- Use feature/fix/docs/chore branches as appropriate.
- Use Conventional Commits.
- Keep `main` stable.
- Update documentation when implementation changes documented behavior.
- Review AI-generated code before merging.
- Never commit secrets.
- Prefer simple architecture until requirements justify complexity.
- Do not introduce an AI agent merely because it is technically possible; every agent must have a clear user/business purpose.

## 15. Working Style for Future ChatGPT Sessions

When continuing this project:
1. Read `PROJECT_CONTEXT.md`.
2. Inspect relevant files under `docs/`.
3. Determine the current phase and task.
4. Continue from the next unfinished step.
5. Do not redo completed work unless there is a reason to revise it.
6. Update documentation when a decision changes.
7. Keep the repository as the persistent source of truth.

## 16. Current Handoff

**Last completed:** Phase 1 — Repository Setup

**Current phase:** Phase 2 — Product Definition

**Current task:** 2.1 Product Vision

**Next task:** 2.2 Problem Definition

**Do not start coding the MVP yet.**

The immediate goal is to finish product and technical documentation before implementation.
