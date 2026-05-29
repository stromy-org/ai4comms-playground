---
name: messaging-framework
description: "Build structured messaging frameworks — core narrative, messaging pillars, proof points, audience adaptations, and verbal guardrails — from positioning and research inputs. Supports five framework types: Message House, Messaging Hierarchy, Messaging Matrix, Strategic Narrative, and Product Messaging. Produces format-agnostic messaging architecture that downstream skills (talking-points, media-pitch, campaign briefs) can consume. Integrates with company profiles for branded output and maintains a reusable messaging content library. Use this skill whenever the user asks to build a messaging framework, create a message house, develop messaging pillars, write a messaging hierarchy, build a messaging matrix, define key messages, create a messaging architecture, develop brand messaging, write positioning messages, structure audience-specific messaging, or anything involving 'what should we say and to whom' — even if they just say 'we need messaging for X' or 'help me figure out what to say about this.'"
---

# Messaging Framework

## Inputs from client-data

- `companies/{client_slug}/charter.json` — brand identity
- `companies/{client_slug}/profile.json` — company positioning + audiences
- `companies/{client_slug}/messaging/` (optional) — prior frameworks for context
- `client-data/clients/{client_slug}/voice/voice-profile.md` (optional) — entity voice profile (L2)
- `client-data/clients/{client_slug}/voice/voice-anchors.md` (optional) — entity voice anchors (L2)

## Voice

Messaging copy is prose, so run the org voice cascade before writing any
audience-facing language (core narrative, pillar statements, proof points,
adaptations).

1. **Read the L1 baseline.** When the `stromy-format` MCP is connected, read
   `voice://baseline` (anti-AI-smell rules) and `voice://review` (the pre-output
   review checklist) via `ReadMcpResourceTool`.
2. **Read the local L2 profile when present.** Resolve the company slug as in
   "Company Data Integration" and read
   `client-data/clients/<slug>/voice/voice-profile.md` and `voice-anchors.md`
   if they exist. When no slug is in scope, use the local `stromy` profile only
   if that directory exists; otherwise proceed with L1 only.
3. **Two-pass write.** Draft the messaging language, run the review checklist
   against it, then rewrite once before finalizing the framework.

This is a text-only voice pass. The skill mentions the cascade as context; it
does not invoke another skill.

## Overview

This skill builds structured messaging frameworks — the strategic bridge between positioning and execution. A messaging framework organizes an organization's core claims, supporting evidence, and audience-specific language into a reusable system that teams can actually pull from when writing copy, preparing spokespeople, briefing agencies, or planning campaigns.

The skill is format-agnostic: it produces messaging architecture as structured content, then outputs in whatever format the user needs (markdown, DOCX, PPTX, PDF). It also populates a reusable content library under `client-data/clients/<company>/messaging/` so downstream comms skills can consume the same pillars, proof points, and audience profiles.

## Company Data Integration

### Discovery

1. List `client-data/clients/` for available company profiles
2. One company → use by default; multiple → ask which company's messaging this is for
3. If none exist → gather company details manually during intake

### Loading Company Data

```
client-data/clients/<name>/profile.json           → Company identity, services, value proposition
client-data/clients/<name>/charter.json      → Colors, fonts, logo (for branded output)
client-data/clients/<name>/messaging/              → Messaging content library:
  ├── pillars.json         → Reusable messaging pillars with proof attachments
  ├── proof-points.json    → Evidence library organized by type and topic
  ├── audiences.json       → Audience profiles with pain points, vocabulary, decision criteria
  └── narratives.json      → Core narratives, positioning statements, elevator pitches
```

When a `messaging/` directory already exists, the skill operates in **update mode** — it reads the existing library and builds on it rather than starting from scratch. When no `messaging/` directory exists, the skill creates it as part of the output.

### Content Assembly

Each component loads from its own source within the messaging library or company profile. When data isn't available, ask the user — don't guess or pull from other skills' data directories.

| Framework Component | Source | Fallback |
|--------------------|--------|----------|
| Company positioning | `messaging/narratives.json` | Ask user |
| Target audiences | `messaging/audiences.json` | Ask user |
| Existing pillars | `messaging/pillars.json` | Build from scratch |
| Evidence | `messaging/proof-points.json` | Ask user |
| Company identity | `profile.json` → `company` | Ask user |
| Services/capabilities | `profile.json` → `services[]` | Ask user |
| Credentials | `profile.json` → `credentials` | Omit |

**Client resolution**: If the user doesn't specify which company's messaging they're building, and multiple companies exist in `client-data/clients/`, ask — don't infer. For a single company, use it by default and confirm.

## Framework Types

The skill supports five framework types. Each produces a different structure optimized for a different use case. If the user doesn't specify a type, recommend one based on their context.

| Type | Structure | Best For | Recommend When |
|------|-----------|----------|----------------|
| **Message House** | Roof (core message) → 3-4 pillars → proof foundation | PR teams, media training, quick internal alignment | User needs a one-page reference for spokespeople or comms teams |
| **Messaging Hierarchy** | Layered pyramid: brand promise → positioning → pillars → proof → tone | Comprehensive brand architecture, long-term strategy | User is building or refreshing brand-level messaging from scratch |
| **Messaging Matrix** | Audience × message grid with tailored proof per cell | Multi-persona activation, sales enablement, content planning | User has 3+ distinct audiences who need different emphasis |
| **Strategic Narrative** | Transformation arc: old world → shift → new world → your role → proof | Category creation, investor decks, thought leadership | User is defining a new category or needs a "why now" story |
| **Product Messaging** | Per-product: positioning → feature-benefit-proof table → competitive differentiation | Product launches, PMM, sales collateral | User is launching a product or needs sales-ready messaging |

For detailed structural specifications, examples, and configuration options for each type, see [framework-types.md](references/framework-types.md).

## Workflow

The workflow has 5 phases. Phases 1-3 happen before any messaging is written. This mirrors how practitioners work — the most common messaging failures stem from skipping research and jumping straight to wordsmithing.

### Phase 1 — Signal & Scope

**Step 1: Understand the request**

The user's input could range from "we need messaging for our new product" to a detailed brief with positioning, audiences, and competitive context. Accept whatever form it comes in.

**Step 2: Determine scope**

| Scope | Signals | Framework Type Default |
|-------|---------|----------------------|
| **Brand-level** | "brand messaging," "company messaging," "who we are" | Messaging Hierarchy |
| **Product/service** | "product launch," "new feature," specific product name | Product Messaging |
| **Campaign/initiative** | "campaign messaging," "launch comms," event name | Message House |
| **Category/narrative** | "why now," "category," "transformation," "investor story" | Strategic Narrative |
| **Audience activation** | "sales enablement," "persona messaging," multiple audiences named | Messaging Matrix |

Present the recommended scope and framework type. The user can override either.

**Step 3: Check existing messaging**

If `messaging/` exists, read the current library and summarize what's already there. Ask whether the user wants to:
- **Build new** — Start fresh (existing library preserved but not used as foundation)
- **Extend** — Add new pillars, audiences, or proof to the existing framework
- **Refresh** — Revisit and update the existing framework based on new context

### Phase 2 — Discovery Interview

Gather the inputs that shape the framework. Apply the same filtering principle as a good strategist: only ask questions whose answers would materially change the output. Pull whatever you can from company data first, then confirm or fill gaps.

**Always ask** (unless already clear from context):
- What is the primary audience? (even if building for multiple — one must be primary)
- What is the core differentiator? (what makes this meaningfully different from alternatives?)
- What is the desired outcome? (what should the audience think, feel, or do after receiving this message?)

**Ask only if unclear from context or company data:**
- Competitive landscape (who are the primary alternatives? how do they position?) — saved to `narratives.json` → `competitiveContext` for downstream skills like battlecards and thought leadership
- Existing positioning or brand strategy (is there a positioning statement to build on?)
- Tone/voice preferences (formal, conversational, bold, measured?)
- Known objections or skepticism from target audiences
- Proof availability (what evidence exists — data, case studies, third-party validation?)
- Internal alignment needs (is this for one team or cross-functional adoption?)

**Pull from data — don't ask:**
- Company name, description, services, credentials → `profile.json`
- Existing messaging pillars or narratives → `messaging/`
- Past performance evidence → ask user (curate into `messaging/proof-points.json`)

For the full interview question bank organized by framework type and scope, see [discovery-workflow.md](references/discovery-workflow.md).

### Phase 3 — Architecture Proposal

Before writing any messaging, present the structural outline for approval. This is the "strategy checkpoint" — it's much cheaper to restructure an outline than to rewrite finished messaging.

**Present to the user:**
1. Framework type (with brief rationale)
2. Core message direction (1-2 sentences summarizing the central claim)
3. Proposed pillar themes (3-4 topics, not finished language)
4. Audience map (who gets what adaptation)
5. Proof inventory (what evidence is available, where gaps exist)
6. Identified risks or gaps (missing proof, unclear differentiation, audience conflicts)

Wait for approval or adjustments before proceeding to Phase 4.

### Phase 4 — Assembly

Build the framework from the top down. Each layer must be solid before the next one builds on it.

**Step 1: Core message**

Write the single overarching message — the "roof" that everything else supports. This should pass the "cocktail party test": someone should be able to repeat it after hearing it once. Keep it under 25 words.

Test it against three criteria:
- **Clarity** — Is it immediately understandable without jargon or insider knowledge?
- **Differentiation** — Could a competitor say the same thing? If yes, sharpen.
- **Relevance** — Does it address what the audience actually cares about?

**Step 2: Messaging pillars**

Build 3-4 supporting pillars. Each pillar is a distinct theme that reinforces the core message from a different angle. Pillars should be:
- **Mutually reinforcing** — Together they build a complete case
- **Non-overlapping** — Each covers distinct territory
- **Memorable** — Short enough to recall after 24 hours
- **Provable** — Each must have at least 2 proof points (enforce this — unsubstantiated pillars get flagged)

For each pillar, write:
- Pillar headline (3-7 words)
- Short statement (single sentence, under 20 words — derivative-ready for battlecards, social, cheat sheets)
- Supporting statement (1-2 sentences expanding the headline)
- 2-4 proof points (see Step 3)
- Message lengths: headline (under 10 words), short (1 sentence), full (2-3 sentences)

**Step 3: Proof mapping**

Attach evidence to each pillar. Use the proof taxonomy to ensure variety — don't rely on only one type. See [proof-taxonomy.md](references/proof-taxonomy.md) for the full taxonomy and selection guidance.

| Proof Type | Examples | Strength |
|-----------|---------|----------|
| **Quantitative** | Statistics, benchmarks, ROI figures, performance data | Strongest when specific and verifiable |
| **Customer evidence** | Case studies, testimonials, NPS scores, user stories | Strongest when named and from similar context |
| **Third-party validation** | Awards, analyst rankings, certifications, media coverage | Strong for credibility, weak for differentiation |
| **Capability** | Patents, proprietary methods, unique technology, team expertise | Strong for "how" questions |
| **Credibility markers** | Years in business, client logos, market position, team size | Useful but generic — use sparingly |
| **Narrative** | Before/after stories, transformation examples, customer journeys | Strong for emotional resonance |

**Proof gap analysis**: After mapping, identify any pillar with fewer than 2 proof points or only one proof type. Flag these to the user with suggestions for what evidence would strengthen them.

**Step 4: Audience adaptation**

For each audience beyond the primary, create an adaptation layer. See [audience-adaptation.md](references/audience-adaptation.md) for detailed techniques.

The core principle: the core message stays stable. What changes per audience:
- **Emphasis** — Which pillar leads (e.g., ROI for executives, ease-of-use for end users)
- **Vocabulary** — Technical vs. business vs. consumer language
- **Proof selection** — Which evidence is most relevant to this audience's concerns
- **Framing** — The "so what" that connects the message to this audience's priorities
- **Objection handling** — What this audience is most skeptical about

For each audience, produce:
- Audience-specific headline (core message reframed for their perspective)
- Pillar priority order (which pillar leads for this audience)
- Selected proof points (2-3 most relevant per pillar)
- Key objection + response (the #1 thing this audience pushes back on)
- Preferred channels (where this audience is best reached — LinkedIn, conferences, email, etc.)

**Step 5: Verbal guardrails**

Define what the messaging sounds like — and what it doesn't.

- **Voice attributes** (3-5 adjectives: e.g., "confident, precise, human" — not "professional, innovative, passionate")
- **Language to use** — Approved terms, preferred phrases, vocabulary that reinforces positioning
- **Language to avoid** — Buzzwords, competitor terminology, claims that can't be substantiated, generic phrases ("world-class," "cutting-edge," "solutions")
- **Elevator pitch** — 30-50 word version of the core message for verbal delivery
- **Tagline candidates** (optional) — 2-3 options under 10 words

### Phase 5 — Validation & Output

**Step 1: Quality validation**

Run the framework through the validation checklist. See [quality-criteria.md](references/quality-criteria.md) for the full checklist.

Quick validation summary:

| Criterion | Test |
|-----------|------|
| **Clarity** | Can someone outside the organization repeat the core message after hearing it once? |
| **Differentiation** | Could a direct competitor make the same claims? If yes, the framework needs sharpening. |
| **Proof coverage** | Does every pillar have 2+ proof points from 2+ proof types? |
| **Audience relevance** | Does each audience adaptation address that audience's actual pain points? |
| **Internal consistency** | Do the pillars support the core message without contradicting each other? |
| **Actionability** | Can a team member pull language directly from this framework to write copy? |
| **Specificity** | Does the messaging use precise language, not generic claims? |

Flag any criterion that fails and suggest fixes before finalizing.

**Step 2: Produce output**

The primary output is a structured markdown document. After the content is finalized, produce the document in the user's requested format. See the Output Format Production section below for format skill mapping and brand context.

The output structure depends on the framework type — see [framework-types.md](references/framework-types.md) for type-specific templates.

**Step 3: Update content library**

After the user approves the framework, offer to save it to the company's messaging library:

```
client-data/clients/<company>/messaging/
├── pillars.json         → Pillar headlines, short statements, message lengths, proof attachments
├── proof-points.json    → All proof points with type, source, and pillar linkage
├── audiences.json       → Audience profiles with adaptations and channel guidance
└── narratives.json      → Core message, elevator pitch, tagline, positioning, competitive context, version/status
```

Include `version` and `status` (`"draft"`, `"approved"`, `"under-review"`) in `narratives.json` so downstream skills know whether they're building on approved messaging.

This makes the messaging available to downstream skills. If the `messaging/` directory already existed, merge new content with existing (don't overwrite unless the user chose "Build new" in Phase 1).

**Step 4: Review triggers**

Include a "When to revisit" section in the output — messaging frameworks are living documents, not one-time artifacts. Common triggers:
- Major product launch or pivot
- New competitor enters the market
- Audience research reveals shifting priorities
- Quarterly review (recommended cadence for active messaging)
- M&A, leadership change, or rebrand
- Message pull-through analysis shows low adoption

## Reference Files

Load these as needed — do not read all at once.

| File | When to Load |
|------|-------------|
| [framework-types.md](references/framework-types.md) | Phase 3 — when selecting framework type or configuring output structure |
| [discovery-workflow.md](references/discovery-workflow.md) | Phase 2 — interview question bank and research inputs checklist |
| [proof-taxonomy.md](references/proof-taxonomy.md) | Phase 4, Step 3 — when categorizing and attaching proof points |
| [audience-adaptation.md](references/audience-adaptation.md) | Phase 4, Step 4 — when building audience-specific messaging layers |
| [quality-criteria.md](references/quality-criteria.md) | Phase 5 — validation checklists and common pitfalls |
| [company-data-schema.md](references/company-data-schema.md) | Phase 1 — content library schema for the `messaging/` directory |

## Error Handling

| Situation | Response |
|-----------|----------|
| No positioning exists | Help the user articulate positioning before building messaging — ask about differentiator, audience, and category |
| No company data available | Gather essentials manually, note that a content library can be created from the output |
| Existing messaging conflicts with new brief | Surface the conflict, ask which takes priority, document the decision |
| Insufficient proof points | Flag the gap, suggest evidence types that would strengthen the pillar, proceed with what's available |
| Too many audiences (5+) | Recommend prioritizing 3-4 primary audiences and noting the rest for future adaptation |
| User wants "just a tagline" | Explain that a tagline without a framework behind it tends to be arbitrary — offer a lightweight Message House as minimum viable structure |
| Framework type unclear | Default to Message House (simplest, most portable) and offer to expand later |

## Output Format Production

This skill owns messaging architecture — framework structure, pillar development, proof mapping, and audience adaptation. Document production is handled by the appropriate format skill:

| Output | Skill | What it provides |
|--------|-------|-----------------|
| DOCX | `docx` | Word document creation with branded styling, heading hierarchy |
| PPTX | `pptx` | Branded presentation — ideal for Message House and Strategic Narrative visual formats |
| PDF | `pdf` | PDF creation for distribution-ready frameworks |

**Default**: If the user doesn't specify a format, produce markdown first and ask whether they'd like a formatted deliverable. Recommend PPTX for Message House and Strategic Narrative (visual structures that present well as slides), DOCX for Messaging Hierarchy and Messaging Matrix (reference documents teams pull language from).

**Brand context to carry forward** when producing formatted output:
- Brand charter location: `client-data/clients/<name>/charter.json`
- Apply heading color from `colors.primary`, body font from `fonts.body`, logo from `brand/logos/` (path in charter `logo` section)
- Use `document` section from charter for DOCX margins/headers, `presentation` section for PPTX layout

## Output Location

Messaging frameworks follow the standard workspace project structure:

```
workspace/<client>/
├── build/<deliverable>/    ← build scripts and intermediates
└── output/<deliverable>/   ← final messaging files (docx, pptx, pdf)
```

**Override**: If the prompt specifies a target output directory, pass it through to the output format skill.


