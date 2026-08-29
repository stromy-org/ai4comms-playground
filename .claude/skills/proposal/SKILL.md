---
name: proposal
description: "Build production-quality consulting proposals, executive briefs, and bid documents. Supports 5 proposal archetypes (Corporate, Consultant, Entrepreneur, Creative, Minimal) with quick-setup and full intake workflows. Format-agnostic — handles proposal strategy, content assembly, and quality validation, then produces the final document in the requested output format (DOCX, PPTX, PDF). Use when creating new proposals, revising existing ones, merging sections, or condensing documents."
license: Proprietary. LICENSE.txt has complete terms
---

# Consulting Proposal Builder

## Inputs from client-data

- `companies/{client_slug}/charter.json` — brand identity; read `expression` (optional) for compact brand direction (`principles`, `signatureElements`, `antiPatterns`) and `identity.positioning`
- `companies/{client_slug}/profile.json` — company name, services, regions
- `companies/{client_slug}/proposals/methodologies.json` (optional) — methodology library
- `companies/{client_slug}/boilerplate.json` (optional) — boilerplate sections
- `companies/{client_slug}/voice/voice-profile.md` (optional) — entity voice profile (L2)
- `companies/{client_slug}/voice/voice-anchors.md` (optional) — entity voice anchors (L2)

## Voice

A proposal is client-facing prose, so run the org voice cascade before writing the
narrative sections (context, approach, scope, pricing rationale, next steps).

1. **Read the L1 baseline.** When the `stromy-format` MCP is connected, read
   `voice://baseline` (anti-AI-smell rules) and `voice://review` (the pre-output
   review checklist) via `ReadMcpResourceTool`.
2. **Read the local L2 profile when present.** Resolve the company slug as in
   "Company Data Integration" and read `companies/<slug>/voice/voice-profile.md` and
   `voice-anchors.md` if they exist.
3. **Apply, then disclose.** Review the draft against L1 + L2; if neither is
   reachable, say so explicitly rather than letting a silent skip read as a pass.
   L2 may add bans but never relax L1.

## Deliverable canvas (prerequisite)

<!-- canvas-protocol:start v1 -->
This skill produces a multi-section deliverable. Collaborate through a single
chat artifact — the deliverable canvas. The canvas is the source of truth for
the in-progress draft; chat scroll-back is not.

1. **Resolve the section plan from this skill's own workflow.** Use the
   approved structure this skill already defines (or the prompt/resource it
   names). The canvas protocol does not invent sections.
2. **Choose the substrate.** Use `markdown` by default for strategic wording,
   plans, and other content where layout does not change meaning. Use `html`
   only when visual arrangement materially affects the user's decision. HTML is
   a **one-way display** surface only: never call back into an MCP from the
   artifact.
3. **Open the canvas.** Mint an 8-character hex `canvas_id`, then emit exactly
   one artifact with identifier `canvas-<canvas_id>-<deliverable_type>`. One
   chat = one canvas.
4. **Iterate in the canvas.** After every change, re-emit the **full** canvas
   as a new version of the same artifact. Never emit deltas. Never mint a
   second canvas mid-session.
5. **Self-check before handoff.** Every planned section exists, is substantive,
   and appears in the agreed order. No `TBD`, placeholders, or pending
   structural questions remain.
6. **Sign-off gate.** Ask the user to confirm the canvas is final before any
   render handoff or client-data write.
7. **Construct the envelope.** Hand off `{deliverable_type, title, client_id,
   sections:[{id, title, body}], meta:{canvas_id, substrate,
   methodology_version}}`, where `methodology_version` is `1`. The downstream
   formatter or terminal write step consumes the envelope — never raw chat
   history.
<!-- canvas-protocol:end -->

## Overview

This skill produces polished consulting proposals, executive briefs, capability statements, and bid documents. It is **format-agnostic** — it owns the proposal domain logic (structure, content strategy, quality gates) and hands signed-off render work to `format-prepare-document`.

**This skill provides the *what*** — proposal structure, content assembly from company data, interactive intake, and quality gates.
**`format-prepare-document` provides the render-path handoff** — structure packaging, substrate-aware planning, and routing to the final `format-*` renderer.

Use this skill when a user asks to:
- Write or generate a consulting proposal
- Create an executive brief or capability statement
- Revise, update, or refresh an existing proposal
- Merge content from multiple proposal sources
- Condense a full proposal into a shorter format
- Build a bid document or statement of work
- Respond to a client brief with a formal proposal

## Company Data Integration

This skill draws from structured company data stored in `client-data/clients/<company-name>/`.

### Discovery

1. List `client-data/clients/` to find available company profiles
2. If only one company exists, use it by default
3. If multiple exist, ask which company is proposing
4. If none exist, fall back to gathering inputs manually (as in legacy mode)
5. After loading company data, check for `people.json` — use it for "Prepared by" and contact sections (filter by `roles` containing `"author"`, auto-select if `"default": true`)

### Loading Company Data

```
client-data/clients/<name>/profile.json       → Company identity, services, pricing, credentials, legal
client-data/clients/<name>/charter.json  → Visual identity (colors, fonts, logo, format settings)
client-data/clients/<name>/proposals/           → Proposal content library:
  ├── case-studies.json      → Past performance
  ├── team-bios.json         → Key personnel with bio variants
  ├── methodologies.json     → Standard approaches/frameworks
  ├── boilerplate.json       → Assumptions, disclaimers, legal terms
  ├── testimonials.json      → Client quotes
  ├── differentiators.json   → Win themes and competitive positioning
  └── partnerships.json      → Technology and strategic partnerships
```

For full schema documentation, see [company-data-schema.md](references/company-data-schema.md).

### Content Library Assembly

Map library items to proposal sections by matching tags, service IDs, and industry relevance:

| Proposal Section | Content Source | Selection Criteria |
|------------------|---------------|-------------------|
| Client Context | Manual (from brief/RFP) | — |
| Approach & Methodology | `methodologies.json` | Match by `applicableServices` or tags |
| Team & Qualifications | `team-bios.json` | Match by `expertise` tags; use `executive` or `technical` variant based on audience |
| Relevant Experience | `case-studies.json` | Match by `tags` (industry, service type); use `short` or `long` variant based on depth |
| Pricing & Investment | `profile.json` → `pricing.models` | Match by service's `pricingModel` reference |
| Risk Management | `boilerplate.json` → `assumptions` | Standard assumptions + engagement-specific ones |
| Terms & Conditions | `boilerplate.json` → `legalTerms` | Standard terms from `profile.json` → `legal.standardTerms` |
| Proof Points (inline) | `testimonials.json` | Match by `tags` and `caseStudy` reference |
| Win Themes (inline) | `differentiators.json` | Match by `applicableServices` or tags; thread throughout proposal |
| Partnership Proof (inline) | `partnerships.json` | Match by `relevantServices`; use in Team & Qualifications or Credentials |

## Interactive Intake Workflow

The proposal process begins with a structured conversation to gather requirements before writing.

### Phase 1 — Signal

User provides:
- Client brief, RFP, or verbal description of the opportunity
- Which company is proposing (if multiple profiles exist)

### Phase 2 — Smart Interview

For common B2B scenarios, a quick-setup path can shortcut configuration using proposal archetypes. See [archetypes.md](references/archetypes.md) for presets.

Ask **only questions that genuinely add value** — skip anything deducible from the brief. Aim for 3-5 focused questions, adapting based on what's already known.

**Always ask:**
- What depth: executive brief (2-4 pages) or full proposal (15-25 pages)?
- Which pricing model? (present options from `profile.json` → `pricing.models`)

**Ask if not clear from brief:**
- What's the primary pain point to emphasize?
- Which team members to highlight or exclude?
- Any sections to skip or emphasize?
- Target audience: technical evaluators, executives, or mixed?
- Competitive context: sole-source or competitive bid?

**Never ask:**
- Questions answered in the brief/RFP
- Generic questions that don't change the output
- Questions about the company's own capabilities (that's in the data layer)

For detailed guidance, see [intake-workflow.md](references/intake-workflow.md).

### Phase 3 — Strategy

Present a content plan for user approval before writing:

1. **Proposed sections** — which sections from the skeleton to include, with rationale
2. **Content selections** — which case studies, team members, and methodology to feature (with reasons)
3. **Pricing structure** — proposed pricing model and breakdown approach
4. **Key differentiators** — 3-5 win themes to thread through the proposal
5. **Output format** — DOCX, PPTX, or PDF (confirm with user)
6. **Archetype** — which proposal archetype best fits (Corporate, Consultant, Entrepreneur, Creative, Minimal). See [archetypes.md](references/archetypes.md)

Wait for user approval before proceeding to Phase 4.

### Phase 4 — Production

Execute the proposal workflow (Steps 1-7 below). All drafting happens **in the deliverable canvas** (see "Deliverable canvas" above) — open it now if not already open.

### Phase 5 — Review

Present the draft canvas to the user with a quality gate summary. Run the checklists from [quality-gates.md](references/quality-gates.md) and flag any issues. Iterate in the canvas until the user signs off — only then proceed to document production (Step 3 Assembly onward).

## Editing Modes

Choose the correct mode based on what the user needs:

### Create New
Start from a brief, template, or verbal description and produce a complete proposal.
→ Run intake workflow (Phases 1-3), then workflow Steps 1-7 below.

### Revise Existing
Update scope, pricing, staffing, case studies, or other sections in an existing proposal without breaking formatting.
→ Edit the existing document in place, or use the redlining workflow if tracked changes are needed.

### Merge Sections
Combine content from multiple source documents (e.g., prior proposals, boilerplate library, SME drafts) into a single cohesive proposal.
→ Extract content from sources, then follow Create New workflow with pre-written section content.

### Condense
Shorten a full proposal to N pages (e.g., produce a 2-page executive brief from a 40-page proposal).
→ Read the full proposal, identify key messages per section, then Create New with a reduced skeleton (see condensed format mapping in [sections.md](references/sections.md)).

**Decision tree:**
1. Does a proposal document already exist? → **Revise** or **Condense**
2. Are there multiple source documents to unify? → **Merge**
3. Starting from scratch or a brief? → **Create New**

## Standard Proposal Skeleton

The canonical section order for a full consulting proposal. Not every proposal needs every section — adapt based on scope and formality.

| # | Section | Purpose |
|---|---------|---------|
| 1 | Cover Page | First impression — client name, project title, date, firm branding |
| 2 | Table of Contents | Navigation — auto-generated from heading styles |
| 3 | Executive Summary | The pitch — written *last*, distills scope + differentiators + key proof points |
| 4 | Client Context | Shows understanding — restate the client's situation, challenges, and goals |
| 5 | Objectives | Alignment — what success looks like, measurable where possible |
| 6 | Approach & Methodology | The "how" — phased approach, frameworks, tools, techniques |
| 7 | Work Plan & Timeline | The schedule — phases, milestones, dependencies, Gantt or table format |
| 8 | Deliverables | What the client receives — tangible outputs with descriptions |
| 9 | Team & Qualifications | Who delivers — key personnel, roles, relevant credentials |
| 10 | Relevant Experience | Proof — case studies, past performance, client references |
| 11 | Pricing & Investment | The ask — fee structure, payment terms, what's included/excluded |
| 12 | Risk Management | Confidence — identified risks, mitigation strategies, assumptions |
| 13 | Terms & Conditions | Legal — engagement terms, IP, confidentiality, liability |
| 14 | Appendices | Supporting detail — resumes, detailed methodologies, certifications |
| 15 | Next Steps | Call to action — what happens after acceptance, contact information |

**Key rule**: The Executive Summary is always written *last*, after all other sections are finalized. It synthesizes the final scope, differentiators, and strongest proof points.

For detailed guidance on each section, see [sections.md](references/sections.md).

## Workflow

### Step 1 — Document Plan

1. Select editing mode (Create / Revise / Merge / Condense)
2. Choose which sections from the skeleton are needed (full proposal vs. exec brief vs. capability statement)
3. Map content library items to sections:
   - Case studies → Relevant Experience (match by tags to client industry/service)
   - Team bios → Team & Qualifications (select `executive` or `technical` variant based on audience)
   - Methodologies → Approach & Methodology (match by `applicableServices`)
   - Boilerplate → Risk Management, Terms & Conditions
   - Pricing models → Pricing & Investment (from `profile.json`)
4. Identify gaps — content that needs to be written fresh vs. pulled from library
5. Note any client-specific formatting requirements (page limits, required sections, naming conventions)

### Step 2 — Section Drafting

Draft each section **in the deliverable canvas**, following the guidance in [sections.md](references/sections.md):

- **Pull from content library first** — reuse and adapt case studies, bios, and methodology descriptions before writing new content
- **Substantiate every claim** — each assertion needs a proof point (case study reference, metric with source, certification)
- **Write for the evaluator** — lead with the answer, then provide supporting detail
- **Maintain consistent voice** — same tense, same level of formality, same terminology throughout
- **Skip the executive summary** — it gets written in Step 4
- **Apply brand expression (if present).** Read `expression` from `charter.json`. If present, use as prose guidance — not hard layout rules:
  - `expression.principles` — let these inform tone and emphasis (e.g., "measured authority" → lead with evidence, not assertion)
  - `expression.signatureElements` — weave into structure where natural (e.g., a brand that uses "indexed rules" may benefit from numbered evidence citations)
  - `expression.antiPatterns` — avoid these constructions in the prose and section framing
  - `identity.positioning` — use to sharpen the executive summary angle and differentiation framing
  - If `expression` is absent, fall back to the voice profile only (soft note; no hard failure — output-tier brands may legitimately omit it)
  - **Voice-cascade rule:** `expression` is additive to the L1 baseline + L2 profile bans, never a relaxation. Expression principles may sharpen tone but must not reintroduce a banned construction. Where a Brand Context API narrative is attached (`candidate.context`), treat it as input evidence for expression principles, not a voice source that overrides the cascade.

### Step 3 — Assembly

**Gate: do not start this step until the user has signed off on the canvas** (see "Deliverable canvas" Step 5 — pending feedback or placeholders block assembly).

Produce the document in the chosen output format. Pass the following context to `format-prepare-document`:

- **Brand charter**: `companies/{client_slug}/charter.json`
- **Logo**: `companies/{client_slug}/logos/` (path in charter `logo` section)
- **Drafted sections**: the content from Step 2
- **Tone and archetype**: from intake Phase 2/3
- **Brand expression**: include `expression` (if resolved from charter) and `deliverable_genre: "proposal"` in the envelope so the downstream renderer applies the same compact direction

`format-prepare-document` then routes to the terminal renderer:
- DOCX output → `format-docx`
- PPTX output → usually `format-pptx-hd`
- PDF output → usually `format-pdf-hd`

### Step 4 — Executive Summary

Write the executive summary last — in the canvas, as the final section before the sign-off gate — synthesizing:
- **The opportunity** — 1-2 sentences on the client's situation and need
- **The solution** — what you're proposing, at the highest level
- **Key differentiators** — why this firm, why this team, why this approach (2-3 bullets)
- **Proof points** — strongest evidence (metrics, case studies, credentials)
- **The investment** — total cost and timeline at a glance
- **Call to action** — next step to move forward

Target length: 1-2 pages. An executive should be able to read only this section and make an informed decision.

### Step 5 — Layout Validation

Before quality gates, verify visual presentation:
- Cover page renders correctly with branding
- Table of contents is generated and accurate
- Page breaks fall before major sections
- Tables don't split across pages awkwardly
- Headers and footers appear consistently
- No orphan headings (heading at bottom of page, content on next)
- Consistent spacing between sections

Convert DOCX to images (DOCX → PDF via LibreOffice → images via pdftoppm) to visually inspect output.

### Step 6 — Quality Gates

Run the quality checklist. See [quality-gates.md](references/quality-gates.md) for the full detailed checklists.

**Quick reference:**

| Gate | Check |
|------|-------|
| Content completeness | Every required section exists with substantive content; no TBD, placeholders, or lorem ipsum |
| Claim substantiation | Every claim has a proof source (case study ID, metric source, internal reference) |
| Section coherence | No contradictions between sections; pricing matches scope; timeline matches deliverables |
| Visual consistency | Cover page present, TOC generated, heading styles consistent, page numbers present |
| Formatting hygiene | All formatting via styles (no manual), no orphan headings, tables don't split badly |
| Cross-references | All "see Section X" references point to actual sections; all appendix references valid |

### Step 7 — Packaging

Produce final deliverables:
1. **Final document** — in the requested format via `format-prepare-document`
2. **PDF export** (if requested) — via the renderer selected on that handoff path
3. **Email summary** (if requested) — 10-bullet summary suitable for forwarding to the client as a cover email

After handoff, *mention* (never auto-activate) that the user can capture feedback on the proposal with `asset-feedback`, and file your own `source: agent` retrospective there if the run hit an instruction gap or tool-call failure worth fixing.

## Quality Gates — Quick Reference

These are the high-level checks. For detailed per-section checklists and common failure modes, see [quality-gates.md](references/quality-gates.md).

**Content completeness**
- Every section in the document plan exists and has substantive content
- No "TBD", "[placeholder]", "[insert here]", or lorem ipsum text
- Word/page targets met for each section

**Claim substantiation**
- Every capability claim has a supporting reference (case study, metric, certification)
- No vague claims without evidence ("we are industry leaders" → needs proof)
- Metrics include source and timeframe

**Section coherence**
- Pricing aligns with the scope described in Approach & Methodology
- Timeline aligns with deliverables and milestones
- Team composition matches the approach (right skills for the proposed methods)
- No contradictions between sections

**Visual consistency**
- Cover page has correct client name, project title, date, branding
- Table of contents is present and accurate
- Heading styles are consistent (all H1s look the same, all H2s look the same)
- Page numbers present in footer; headers have firm/project name

**Formatting hygiene**
- All formatting uses styles (no manual bold/italic/font-size for headings)
- No orphan headings at page bottoms
- Tables don't split across pages in confusing ways
- Consistent paragraph spacing throughout

## Customization

### Client Branding

Brand data is loaded from `client-data/clients/<name>/charter.json`. The charter covers all output formats:

- **`document`** section → DOCX margins, headers, footers, heading colors
- **`presentation`** section → PPTX slide margins, aspect ratio
- **`video`** section → Remotion resolution, fps

If no company data exists, accept brand parameters as manual inputs:
- **Primary color** — used for headings, cover page accents
- **Secondary color** — used for subheadings, table headers
- **Fonts** — heading font, body font
- **Logo** — file path for cover page placement

### Tone & Voice

Accept tone parameters and apply consistently:
- **Formality**: formal / conversational (default: formal)
- **Audience**: technical / executive / mixed (default: executive)
- **Stance**: assertive / consultative / neutral (default: consultative)
- **Default voice**: Professional, confident, specific. Avoid jargon without explanation. Lead with outcomes, support with methods.

### Evidence Rules

Define what counts as proof and how to cite it:
- **Case study reference**: `[CS-ID]` with client name (if permitted), industry, outcome metric
- **Metric citation**: Number + source + timeframe (e.g., "reduced cycle time by 35% — ABC Corp engagement, 2024")
- **Certification reference**: Certification name + issuing body + current status
- **Client name usage**: Check `namePublic` flag in case study — use name only if `true`, otherwise use industry descriptor

## Output Location

Proposals follow the standard workspace project structure:

```
workspace/<client>/
├── build/<deliverable>/    ← build scripts and intermediates
└── output/<deliverable>/   ← final proposal files (docx, pptx, pdf)
```

**Override**: If the prompt specifies a target output directory, pass it through to the output format skill.



## Output Format Production

This skill owns proposal content strategy. Document production is handled by the appropriate format skill:

| Output | Skill | What it provides |
|--------|-------|-----------------|
| DOCX | `docx` | Word document creation with docx-js, OOXML editing, redlining |
| PPTX | `pptx` | Branded presentation creation with html2pptx workflow |
| PDF | `pdf` | PDF creation, conversion, merging |
| XLSX | `xlsx` | Spreadsheet creation for pricing models |

Brand context to carry forward:
- Brand charter location: `companies/{client_slug}/charter.json`
- Apply heading color from `colors.primary`, body font from `fonts.body`, logo from `logos/` (path in charter `logo` section)
- Include resolved `expression` (if present) and `deliverable_genre: "proposal"` for downstream render direction
