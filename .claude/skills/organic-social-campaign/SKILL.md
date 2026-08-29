---
name: organic-social-campaign
description: "Build organic B2B social media campaigns — editorial strategy, content pillars, editorial calendars, content matrices, community management playbooks, employee advocacy plans, and measurement specs. Interactive multi-phase process from discovery through governance. Integrates with company profiles, messaging libraries, and brand data for consistent voice and positioning. Use this skill whenever the user asks to build an organic social strategy, create a content calendar, plan social media content, develop editorial pillars, build a community management playbook, set up employee advocacy, plan organic LinkedIn content, create a social content program, or anything involving 'what should we post and how do we build an audience' — even if they just say 'we need a social presence' or 'help me plan our LinkedIn content.'"
---

# Organic Social Campaign

## Inputs from client-data

- `companies/{client_slug}/charter.json` — brand identity (colors, fonts, logo, image catalog); read `expression` (optional) for compact brand direction (`principles`, `signatureElements`, `antiPatterns`) and `identity.positioning`
- `companies/{client_slug}/profile.json` — company positioning, services, audiences
- `companies/{client_slug}/people.json` (optional) — SMEs, authors, spokespersons
- `companies/{client_slug}/messaging/pillars.json` (optional) — reusable messaging pillars
- `companies/{client_slug}/messaging/proof-points.json` (optional) — evidence library
- `companies/{client_slug}/messaging/audiences.json` (optional) — audience profiles / ICP seeds
- `companies/{client_slug}/messaging/narratives.json` (optional) — core narratives, positioning
- `companies/{client_slug}/voice/voice-profile.md` (optional) — L2 voice profile
- `companies/{client_slug}/voice/voice-anchors.md` (optional) — L2 reference passages
- `companies/{client_slug}/voice/voice-extensions.json` (optional) — L2 additive bans
- `companies/{client_slug}/social_media/config.json` (optional) — platforms, UTM, compliance, content_generation
- `companies/{client_slug}/social_media/organic/pillars.json` (optional) — editorial pillars from a prior run
- `companies/{client_slug}/social_media/organic/series.json` (optional) — repeatable content series
- `companies/{client_slug}/social_media/organic/community-playbook.json` (optional) — response SLAs, tone, escalation
- `companies/{client_slug}/social_media/organic/advocacy.json` (optional) — employee advocacy config
- `companies/{client_slug}/tokens.css` (optional) — design tokens for branded output
- `companies/{client_slug}/logos/` (optional) — logo variant files

### Path resolution (`{base}`)

Throughout this skill, `{base}` is the single resolved root for all the inputs
above. Resolve it **overlay-first** (per `skill-data-loading.md` §2):

1. **Plugin overlay (primary, steady state):** if a `companies/` directory
   exists, `{base}` = `companies/{client_slug}/`. Resolve `{client_slug}` from
   that overlay — zero entries → fail loud ("this plugin has no `companies/`
   overlay; client data unavailable"); one entry → use it; multiple → ask the
   user which client, never guess. Never accept `client_slug` as a parameter.
2. **Cowork source fallback (development):** when running inside the Cowork
   checkout with no `companies/` overlay, `{base}` = `client-data/clients/<slug>/`.

This skill is authored in Cowork and synced into client plugin overlays (the
same distribution model as `proposal`, `messaging-framework`, `press-release`).
The plugin overlay is therefore the **primary, steady-state contract** (it is
what `validate-plugin-completeness.py` Invariant #3 enforces); the Cowork
direct-read path is the development fallback. The `{base}` rule is correct in
both contexts. Missing **required** input (charter/profile) → surface the full
resolved path and ask. Missing **optional** input → degrade per the Content
Assembly fallbacks below.

## Deliverable canvas (prerequisite for prose deliverables)

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

This skill builds organic B2B social media campaigns as a systems design problem — not a creative exercise. The goal is to define objectives, editorial architecture, operating rhythms, and measurement so that every post is traceable to business outcomes. Organic social optimizes for compounding: reach via credibility, engagement via relevance, and distribution via employee networks.

The skill is interactive and phase-gated. Each phase produces deliverables and includes a checkpoint where the user confirms direction before proceeding. The user can enter at any phase if they already have prior work to build on.

## Company Data Integration

### Discovery

Resolve `{base}` overlay-first (see **Path resolution** above):

1. If a `companies/` overlay exists → `{base}` = `companies/{client_slug}/`
   (one entry → use; multiple → ask which company; zero → fail loud).
2. Else (Cowork checkout) → `{base}` = `client-data/clients/<slug>/`; if no
   client is in scope, ask, or gather company details manually during intake.

Do not list the central `client-data/clients/` repo and ask as the *primary*
discovery — the overlay-first rule above governs which client is in scope.

### Loading Company Data

```
{base}/profile.json              → Company identity, services, value proposition
{base}/charter.json              → Colors, fonts, logo (for branded output guidance)
{base}/people.json               → SMEs, authors, spokespersons (optional)
{base}/messaging/                → Messaging content library (optional):
  ├── pillars.json         → Reusable messaging pillars (seed editorial pillars)
  ├── proof-points.json    → Evidence library (seed content proof)
  ├── audiences.json       → Audience profiles (seed ICP definition)
  └── narratives.json      → Core narratives, positioning
{base}/voice/                    → L2 voice profile (optional; see voice-integration.md)
{base}/social_media/             → Social media config and content (optional):
  ├── config.json          → Platforms, UTM taxonomy, hashtags, compliance, content_generation
  └── organic/
      ├── pillars.json     → Editorial pillars (if previous run exists)
      ├── series.json      → Repeatable content series
      ├── community-playbook.json → Response SLAs, tone, escalation
      ├── advocacy.json    → Employee advocacy program config
      ├── posts.json       → Frozen per-post objects (Phase 7, if previous run exists)
      └── style-blocks/    → Locked visual prompt blocks (Phase 8, if generated)
```

When `{base}/social_media/organic/` already exists, the skill operates in **resume mode** — read the existing content and offer the user a choice: continue from where they left off, rework a specific phase, or start fresh. Resume can re-enter mid-Phase-8 by edition (see Phase 8).

### Content Assembly

| Component | Source | Fallback |
|-----------|--------|----------|
| Company identity | `{base}/profile.json` → `company` | Ask user |
| Services/sectors | `{base}/profile.json` → `services[]` | Ask user |
| Target audiences | `{base}/messaging/audiences.json` | Ask user to define ICP |
| Messaging pillars | `{base}/messaging/pillars.json` | Build editorial pillars from scratch |
| Proof points | `{base}/messaging/proof-points.json` | Ask user for evidence |
| Platform config | `{base}/social_media/config.json` | Ask user which platforms |
| Existing editorial pillars | `{base}/social_media/organic/pillars.json` | Build new |
| UTM taxonomy | `{base}/social_media/config.json` → `utm` | Propose defaults |
| Compliance posture | `{base}/social_media/config.json` → `compliance` | Default to conservative EU posture |

## Voice (prerequisite for every copy step)

Any step that produces copy — Phase 5 sample copy/hooks, the Phase 7 creative
fields on `posts.json`, Phase 8 captions/hooks/CTAs — runs a **draft → review →
rewrite** pass against the org voice cascade:

1. Load **L1** baseline — `voice://baseline` + `voice://rules.json` from
   `stromy-format-mcp` — and **L2** client voice from `{base}/voice/*`.
2. Draft the copy, self-review against the combined rules (L2 may add bans, never
   relax L1), then rewrite until it passes — only then show the user.
3. Ban engagement-bait, filler openers, antithesis frames, and overused LLM
   vocabulary. Cross-check the platform's tone notes.

If `voice://*` is unreachable (headless), fall back to L2-only + the inline
anti-slop checklist and `log` the degradation — never fail the copy step. This
skill *mentions* the cascade as context; it never invokes another skill. Full
loop, precedence, and checklist: [voice-integration.md](references/voice-integration.md).

**Brand expression layer (additive to voice cascade).** Before any copy step, read `expression` from `{base}/charter.json`. If present, apply as prose guidance alongside the cascade:
- `expression.principles` — inform the register of pillar copy, hook language, and CTAs (e.g., "measured authority" → factual hooks, evidence-first; "evidence before decoration" → data-led captions)
- `expression.signatureElements` — reflect where natural in copy style and series naming
- `expression.antiPatterns` — add to the ban-list alongside voice cascade bans
- `identity.positioning` — anchor the editorial strategy framing and the core message of content pillars
- If `expression` is absent, fall back to the voice profile only with a soft note; no hard failure (output-tier brands may legitimately omit expression)
- **Voice-cascade rule:** `expression` is additive to L1 + L2 bans, never a relaxation. Expression principles may sharpen tone but must not reintroduce a banned construction. Where a Brand Context API narrative is attached (`candidate.context`), treat it as input evidence for expression principles, not a voice source that overrides the cascade.

## Workflow

The workflow has 6 phases. Phases 1-3 happen before any content planning begins — the most common organic social failures stem from posting without a system, not from bad creative.

Every phase is interactive: present options, ask questions, propose directions, and wait for confirmation before proceeding. Pull what you can from company data first, then fill gaps with the user.

### Phase 1 — Intake & Scope

**Step 1: Understand the request and detect entry point**

If `social_media/organic/` exists, summarize what's there and ask:
- **Continue** — Pick up from where the last run left off
- **Rework phase N** — Jump to a specific phase with existing context
- **Start fresh** — Ignore existing and rebuild

If starting new, understand the brief. The user's input could range from "we need a LinkedIn presence" to a detailed brief with audiences and themes.

**Step 2: Gather scope**

Ask (unless already clear from context or company data):
- What is the primary business objective? (thought leadership, lead generation, recruitment, partner visibility)
- Which services or sectors should the content focus on?
- Which platforms? (If `config.json` has platforms defined, confirm; if not, recommend based on B2B context)
- Current state? (Starting from zero vs. optimizing existing presence)
- Any partner constraints or co-marketing requirements?
- Geographic scope and language requirements?
- Audience type? (B2B decision-makers, B2C consumers, or hybrid — where B2B is the primary target but consumer awareness reinforces B2B credibility)

Present 2-3 objective options with rationale. Let the user pick.

**Audience-type calibration**

The audience type selection shapes downstream decisions across all phases:

| Dimension | B2B | B2C | Hybrid |
|-----------|-----|-----|--------|
| Tone | Professional, evidence-led, ROI-focused | Accessible, emotional, benefit-driven | Professional primary, with consumer-friendly proof points |
| Pillar emphasis | Commercial proof, industry authority, thought leadership | Lifestyle, values, social proof | B2B pillars anchored by consumer sentiment as social proof |
| Content formats | LinkedIn articles, case studies, data carousels, whitepapers | Short video, stories, UGC, infographics | LinkedIn-first with select consumer formats for cross-pollination |
| Platform priority | LinkedIn primary, X secondary | Instagram/Facebook primary, TikTok secondary | LinkedIn primary, Instagram/Facebook as B2B-reinforcing channel |
| CTA style | "Book a consultation", "Download the report" | "Shop now", "Learn more", "Join the community" | B2B CTAs on LinkedIn; awareness/credibility CTAs on consumer channels |
| Success metrics | MQLs, pipeline influence, share of voice among decision-makers | Reach, engagement rate, sentiment, conversions | B2B pipeline metrics primary; consumer engagement as leading indicator |

Default to **B2B** when no audience type is specified (consistent with the skill's B2B positioning). The hybrid model is particularly useful when consumer awareness creates market pressure that influences B2B buying decisions — e.g., sustainability campaigns where public sentiment drives corporate procurement.

**Step 3: Confirm scope**

Present a one-paragraph scope summary. Wait for confirmation.

**Phase 1 deliverable**: Campaign brief (organic) — saved to workspace output.

### Phase 2 — Discovery & Audit

**Step 1: Define the ICP**

If `messaging/audiences.json` exists, pull audience profiles and confirm relevance to social. If not, build the ICP interactively:
- Industry/firmographics
- Decision roles and seniority
- "Jobs-to-be-done" themes (what are they trying to accomplish?)

Present the ICP definition. Ask the user to confirm or adjust.

**Step 2: Baseline the current state**

Ask the user about their current social presence:
- Follower count and growth trajectory
- Posting frequency and formats used
- Top-performing content (if known)
- Current engagement patterns
- Traffic from social to website (if tracked)

If they have analytics access, note what to pull. If starting from zero, skip to gap analysis.

**Step 3: Assess governance readiness**

Check whether approval workflows, moderation rules, and escalation paths exist. If `config.json` has compliance settings, reference them. Otherwise, propose governance basics.

Present findings as a brief baseline report with gaps highlighted.

**Phase 2 deliverable**: Baseline report, risk register.

### Phase 3 — Strategy

This is the core architecture phase. Everything here needs user approval before Phase 4.

**Step 1: Propose editorial pillars**

Build 3-5 editorial pillars aligned to the company's services and buyer problems. If `messaging/pillars.json` exists, use those as seeds — editorial pillars should extend messaging pillars into social-native themes, not duplicate them.

For each pillar, propose:
- Theme name (3-5 words)
- What it covers and why it matters to the ICP
- Proof types that support it (case evidence, data, methodology, POV)
- Format affinity (which content formats work best for this theme)

Present as a table. Ask the user to confirm, add, or cut pillars.

**Step 2: Propose cadence and format mix**

Recommend a posting cadence using the walk/run/fly framework:
- **Walk**: 2-3 posts/week (building consistency)
- **Run**: 4-5 posts/week (established rhythm)
- **Fly**: Daily + real-time engagement (mature program)

Recommend a starting level based on the team's capacity. For each post frequency, suggest the format mix (text, image, carousel, video, document, poll). See [content-formats.md](references/content-formats.md) for format guidance.

**Step 3: Propose community management approach**

Define response SLAs, tone rules, and escalation categories. Present for approval.

**Step 4: Propose employee advocacy level**

Options: None (organic Page only) → Pilot (5-10 advocates) → Structured program (team-wide). Recommend based on company size and objectives. See [employee-advocacy.md](references/employee-advocacy.md) for program design.

**Step 5: Cross-channel integration points**

Organic social rarely operates in isolation. Define how the social strategy connects to other channels the client uses or plans to use:

- **Owned media** — website/blog content that social posts can link to or repurpose; email newsletter cross-promotion
- **Offline touchpoints** — events, print materials, conferences where social can amplify or be amplified (e.g., "as featured in our latest report" posts tied to a printed brochure; QR codes on print materials linking to social content)
- **Paid media handoff** — which organic posts should trigger paid amplification (already captured in Phase 5 calendar, but define the threshold criteria here: engagement rate > X%, topic alignment with active campaign)
- **PR/media** — how earned media coverage gets amplified through social; spokesperson visibility strategy

Present integration points as a brief table mapping channel → social touchpoint → direction (social amplifies channel / channel feeds social / bidirectional). This ensures the organic strategy doesn't exist in a vacuum, especially for clients whose business involves non-digital channels.

Present the full strategy package. Wait for approval before proceeding.

**Phase 3 deliverables**: Editorial strategy doc, content pillar map.

### Phase 4 — Creative System

**Step 1: Build the content matrix**

For each editorial pillar, define repeatable content series — the building blocks that make content production predictable and sustainable.

Matrix structure: pillar × format × funnel intent (awareness / consideration / conversion).

For each cell, define 1-2 series with:
- Series name (e.g., "Regulatory Radar," "3-Minute Methodology," "Client Proof")
- Format (carousel, video, text post, document, poll)
- Structure (what each post in the series looks like)
- CTA type (engage, click, subscribe, book)
- Production requirements (who provides input, typical turnaround)

Present the matrix. Ask the user to refine series definitions.

**Step 2: Define template needs**

Based on the series, recommend visual and copy templates to reduce production cycle time. Note which templates need brand assets (logo placement, color application).

**Step 3: Define QA process**

For each content risk tier:
- Tier 1 (low): educational, culture → standard brand review
- Tier 2 (medium): service POVs, outcome claims → SME review + brand
- Tier 3 (high): regulated topics, partner claims → legal + SME + brand

**Phase 4 deliverables**: Content matrix, template specs.

### Phase 5 — Calendar & Execution Plan

**Step 1: Generate the editorial calendar**

Produce an N-week calendar (default: 4 weeks). Each entry includes:

| Week | Pillar | Series | Concept | Format | CTA | Owner | UTM tags | Paid amplification trigger |
|------|--------|--------|---------|--------|-----|-------|----------|---------------------------|

The "paid amplification trigger" column defines when a post's performance warrants boosting — this is the handoff point to paid media. The `paid-social-campaign` skill handles the actual ad buying and optimization.

Present the calendar. Ask the user to adjust assignments, swap concepts, or change cadence.

**Step 2: Build the community management playbook**

Expand Phase 3's community approach into an operational playbook:
- Response time targets by message type
- Tone and voice rules per scenario (praise, question, complaint, crisis)
- Escalation matrix with named owners
- Prohibited engagement topics
- After-hours monitoring approach

**Step 3: Build the employee advocacy plan** (if scoped)

Detailed activation plan following the stepwise framework:
1. Set goals and content strategy for advocates
2. Select employee audience (start small — champions first)
3. Demonstrate value (what's in it for them)
4. Launch with enablement resources
5. Sustain engagement (content queue, recognition, feedback loop)
6. Measure results (shares, engagement, reach, site traffic)

See [employee-advocacy.md](references/employee-advocacy.md) for detailed program design.

**Phase 5 deliverables**: Editorial calendar, community playbook, employee advocacy plan.

### Phase 6 — Measurement & Governance

**Step 1: Define the KPI framework**

Organize KPIs by category. For each, define the metric, measurement source, and baseline target (improvement-based, not absolute).

| Category | Metrics | Source |
|----------|---------|--------|
| Audience growth | Follower growth rate, subscriber growth | Platform analytics |
| Content performance | Impressions, engagement rate, clicks to tagged URLs | Platform analytics + UTMs |
| Community health | Response SLA adherence, sentiment themes | Manual + monitoring tool |
| Employee advocacy | Active advocates, shares, engagement by content type | Advocacy platform or manual |
| Outcome proxies | Consultation requests, event registrations, content downloads | UTMs + site analytics + CRM |

See [measurement-benchmarks.md](references/measurement-benchmarks.md) for directional benchmark ranges — but set targets based on your own baseline, not industry averages.

**Step 2: Define reporting cadence**

- **Weekly**: content performance review (top posts, engagement, clicks)
- **Monthly**: narrative and audience review (which pillars build followers and qualified traffic)
- **Quarterly**: strategic reset (revalidate pillars, refresh templates, feed learnings into paid)

**Step 3: Finalize governance**

Compile the complete governance document:
- Content approval tiers (from Phase 4 QA)
- Escalation matrix (from Phase 5 community playbook)
- Crisis protocol (pre-approved holding responses, legal escalation, monitoring protocol)
- Audit trail requirements (who approved what, retention policy)

**Phase 6 deliverables**: Measurement spec, governance doc.

### Final Output Assembly

After Phase 6, compile all deliverables and present a summary to the user. Then *mention* (never auto-activate) that the user can capture feedback with `asset-feedback`, and file your own `source: agent` retrospective there if the run hit an instruction gap or tool-call failure worth fixing.

**Offer to save reusable config** to `{base}/social_media/`:
- `config.json` — platform + UTM + compliance settings (if new or changed)
- `organic/pillars.json` — editorial pillar definitions
- `organic/series.json` — content series definitions
- `organic/community-playbook.json` — community management rules
- `organic/advocacy.json` — advocacy program config (if scoped)

Write `"schema_version": "1.0"` into **every** file persisted here. The shapes
and the shared contract with `paid-social-campaign` are documented in
[social-data-schema.md](references/social-data-schema.md) — keep additions
additive (consumers ignore unknown keys); never repurpose a key without bumping
the version. On read, a missing `schema_version` is treated as `"1.0"`.

This makes the content available for future runs and for the `paid-social-campaign` skill to reference when designing amplification strategies.

## Optional downstream phases

Phases 7–8 and Export are **optional extensions** — the strategy and editorial
calendar (Phases 1–6) are the product and remain fully valuable on their own.
Run these only when the user wants platform-correct per-post objects (Phase 7),
generated assets (Phase 8), or a published-calendar export.

### Phase 7 — Freeze to post objects

At calendar approval, freeze the approved calendar into a validated,
graph-portable `posts.json` — the COPE expansion where one pillar atom fans out
into N native per-post objects. Three artifacts (full schemas in
[post-object-schema.md](references/post-object-schema.md)):

1. **Emit `calendar.json`** — the structured form of the Phase 5 calendar (rows
   of week / pillar_id / series_id / concept / format / cta / platforms / owner /
   utm).
2. **Run the builder** —
   `uv run python scripts/build_posts.py calendar.json {base}/social_media/config.json -o posts.json`.
   This fills the **structural** fields deterministically (stable `post_id`,
   platform, surface, `media_spec`, utm, schedule) and leaves the **creative**
   fields (`hook`, `body`, `thread_parts`, `hashtags`, `cta`) empty. Builder =
   structure; agent = copy; validator = gate. A malformed row fails with the row
   index and writes no partial output.
3. **Fill the creative fields in chat** — run each through the voice cascade
   (see Voice section).
4. **Validate** — `uv run python scripts/validate_posts.py posts.json`. Rejects
   bad aspect ratios, `producer`↔`type` mismatches, and leftover empty
   placeholders, naming the offending `post_id`. Fix and re-run until it exits 0.
5. **Persist** — write to `{base}/social_media/organic/posts.json` with
   `"schema_version": "1.0"`.

The per-post object is a **superset** of the Phase 5 calendar columns — it
extends, never replaces, the calendar. The same `build_posts.py` /
`validate_posts.py` surfaces are exercised by the eval; the skill never carries
parallel expansion logic.

### Phase 8 — Content generation (optional)

Generate branded, coherent assets **one edition at a time with human review** —
per-platform configurable, consuming the `media-gen` MCP. Full loop, brand-context
construction, and edge cases: [content-generation.md](references/content-generation.md);
config + media taxonomy: [platform-content-config.md](references/platform-content-config.md).

1. **Gate.** Runs only if the user opts in AND `content_generation.enabled`.
   State up front: identity reuse (same recurring subject across posts) requires
   `media-gen` reference conditioning (Track A, `PLAN_reference_conditioning.md`);
   if unavailable, assets are *family-resemblance* (consistent style/palette),
   not identical subjects — get explicit acknowledgement.
2. **Lock the style block once** (campaign-level): derive a verbatim prompt
   string from charter/tokens; persist to
   `{base}/social_media/organic/style-blocks/<ref>.txt`. Reused across editions.
3. **Per edition (default one week), in order:**
   - **Select + partition** — posts where `media_spec.type != none`, capped at
     `max_assets_per_edition` (`log` any deferred — no silent truncation).
     Partition by `media_spec.producer`: media-gen (`image`/`carousel`/`reel`/
     `short`) vs non-media-gen (`infographic`/`document` → `chart`/`diagram`/
     `pdf`/`pptx`).
   - **Anchor-select loop** (media-gen) — build the `brand_context` dict
     (mirror `build_brand_context_from_charter`; call `validate_brand_context`);
     extend the dict with `expression` (resolved from `{base}/charter.json`,
     if present) and `deliverable_genre: "organic-social"` so the renderer
     applies the same compact direction as the authoring side. Then
     `generate_image` for 3–4 candidates → **human picks ONE anchor** → set
     `anchor_asset_ref` on siblings.
   - **Generate siblings & video** (media-gen) — with Track A, pass the anchor as
     a `subject`/`first_frame` reference (true identity); without it, reuse the
     locked prompt block verbatim (family resemblance). `carousel` → N ×
     `generate_image`; `reel`/`short` → `generate_video` at 9:16.
   - **Brief non-media-gen posts** — emit a structured brief into the post and
     flag the producer skill (`chart`/`diagram`/`pdf`/`pptx`) for the user to run
     separately. Phase 8 does not invoke those skills or call `media-gen` here.
   - **Captions** for the edition pass the **voice cascade** (Voice section).
   - **Human reviews the edition** (tiles + briefs + captions) → approve → set
     `status` (`media_ready` / `brief_ready`) → **advance to next edition**.
     Never generate the next edition before this gate.

Asset bytes (base64 + sha256 from the MCP) are written to
`workspace/<client>/output/organic-social-campaign/assets/`.

### Export — Planner / SharePoint / Excel

After Phase 7/8, offer to export `posts.json` (+ asset references) to a
human-publishable surface — an ms365 Planner board, a SharePoint list, or an
Excel calendar (tabular). Mention `m365-manager`'s safety rules (draft / confirm;
never delete) as context; do not invoke it. **No auto-publish** to LinkedIn /
Meta / X / TikTok — the publishing boundary is the exported calendar. (`reepl`
exists for LinkedIn only and is the user's separate choice.)

## Reference Files

Load these as needed — do not read all at once.

| File | When to Load |
|------|-------------|
| [linkedin.md](references/platforms/linkedin.md) | When LinkedIn is a selected platform. Page optimization, analytics, formats, posting guidance. |
| [meta.md](references/platforms/meta.md) | When Meta/Instagram is a selected platform. Page setup, content formats, algorithm notes. |
| [twitter-x.md](references/platforms/twitter-x.md) | When X/Twitter is a selected platform. B2B usage patterns, formats, threads. |
| [youtube.md](references/platforms/youtube.md) | When YouTube is a selected platform. B2B video strategy, Shorts, SEO. |
| [content-formats.md](references/content-formats.md) | Phase 3 — when designing cadence and format mix. Format taxonomy with B2B effectiveness notes. |
| [employee-advocacy.md](references/employee-advocacy.md) | Phase 3/5 — when designing employee advocacy program. Step-by-step program design. |
| [measurement-benchmarks.md](references/measurement-benchmarks.md) | Phase 6 — when setting KPI targets. Directional benchmarks by platform (use cautiously). |
| [community-management.md](references/community-management.md) | Phase 5 — when building community playbook. Response frameworks, crisis protocol, moderation. |
| [editorial-calendar-template.md](references/editorial-calendar-template.md) | Phase 5 — when generating the calendar. Structure and examples. |
| [social-data-schema.md](references/social-data-schema.md) | When persisting to `social_media/` (Final Output, Phase 7/8). `config.json` + `organic/*` shapes, `schema_version`, the paid-social shared contract. |
| [voice-integration.md](references/voice-integration.md) | Any copy-producing step (Phase 5/7/8). The draft→review→rewrite loop, L1/L2 precedence, anti-slop checklist, headless fallback. |
| [post-object-schema.md](references/post-object-schema.md) | Phase 7 — when freezing the calendar. `calendar.json` input + per-post object schema, the builder/validator seam, aspect Literal sets. |
| [platform-content-config.md](references/platform-content-config.md) | Phase 8 — the `content_generation` config block + surface→producer→primitive media taxonomy (what media-gen renders vs what routes to chart/diagram/pdf/pptx). |
| [content-generation.md](references/content-generation.md) | Phase 8 — the edition-batched generation loop, anchor-select, Track A vs family-resemblance, brand_context construction, asset output, edge cases. |

## Output Format Production

**Gate: prose deliverables require the deliverable canvas sign-off gate to have passed** (see "Deliverable canvas" above; tabular XLSX outputs are exempt).

This skill owns organic social campaign architecture — editorial strategy, content systems, community management, and measurement. Prose deliverables on the render path should go through `format-prepare-document`; tabular outputs stay on their direct format skill.

| Output | Routed renderer / skill | Recommended For |
|--------|-------------------------|-----------------|
| DOCX | `format-docx` | Strategy documents, playbooks, governance docs |
| PPTX | `format-pptx-hd` | Strategy presentations, stakeholder decks |
| PDF | `format-pdf-hd` | Distribution-ready strategy documents |
| XLSX | `format-xlsx` | Editorial calendars, content matrices, KPI dashboards |

**Default**: Produce markdown first. If the user wants formatted output, route prose documents through `format-prepare-document`; keep XLSX direct for calendars and matrices.

**Brand context to carry forward** when producing formatted output:
- Brand charter location: `{base}/charter.json`
- Apply heading color from `colors.primary`, body font from `fonts.body`
- Logo from `{base}/logos/` (path in charter `logo` section)
- Include resolved `expression` (if present) and `deliverable_genre: "organic-social"` in the envelope for downstream render direction

### Diagram Integration

Funnel/flow diagrams (content funnel, campaign architecture, editorial workflow) can be generated using the `diagram` skill for branded visual output.

## Output Location

Deliverables follow the standard workspace project structure:

```
workspace/<client>/output/organic-social-campaign/
├── campaign-brief.md
├── editorial-strategy.md
├── content-matrix.md
├── editorial-calendar.md
├── community-playbook.md
├── employee-advocacy-plan.md    # if scoped
├── measurement-spec.md
└── governance.md
```

**Override**: If the prompt specifies a target output directory, use it.



## Error Handling

| Situation | Response |
|-----------|----------|
| No company data available | Gather essentials manually, note that a content library can be created from the output |
| No messaging pillars exist | Build editorial pillars from scratch using company services and audience pain points |
| User wants "just a calendar" | Explain that a calendar without a strategy behind it tends to produce inconsistent content — offer a lightweight strategy (Phase 3 only) as minimum viable structure |
| Too many platforms (4+) | Recommend focusing on 1-2 primary platforms first, then expanding after the system is proven |
| No capacity for community management | Reduce cadence recommendations and skip employee advocacy; flag that engagement drives organic distribution |
| Existing social_media/organic/ data conflicts with new brief | Surface the conflict, ask which takes priority, document the decision |
