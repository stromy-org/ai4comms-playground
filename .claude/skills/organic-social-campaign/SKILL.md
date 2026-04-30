---
name: organic-social-campaign
description: "Build organic B2B social media campaigns — editorial strategy, content pillars, editorial calendars, content matrices, community management playbooks, employee advocacy plans, and measurement specs. Interactive multi-phase process from discovery through governance. Integrates with company profiles, messaging libraries, and brand data for consistent voice and positioning. Use this skill whenever the user asks to build an organic social strategy, create a content calendar, plan social media content, develop editorial pillars, build a community management playbook, set up employee advocacy, plan organic LinkedIn content, create a social content program, or anything involving 'what should we post and how do we build an audience' — even if they just say 'we need a social presence' or 'help me plan our LinkedIn content.'"
---

# Organic Social Campaign

## Overview

This skill builds organic B2B social media campaigns as a systems design problem — not a creative exercise. The goal is to define objectives, editorial architecture, operating rhythms, and measurement so that every post is traceable to business outcomes. Organic social optimizes for compounding: reach via credibility, engagement via relevance, and distribution via employee networks.

The skill is interactive and phase-gated. Each phase produces deliverables and includes a checkpoint where the user confirms direction before proceeding. The user can enter at any phase if they already have prior work to build on.

## Company Data Integration

### Discovery

1. List `client-data/clients/` for available company profiles
2. One company → use by default; multiple → ask which company this campaign is for
3. If none exist → gather company details manually during intake

### Loading Company Data

```
client-data/clients/<name>/profile.json              → Company identity, services, value proposition
client-data/clients/<name>/charter.json         → Colors, fonts, logo (for branded output guidance)
client-data/clients/<name>/people.json                → SMEs, authors, spokespersons
client-data/clients/<name>/messaging/                 → Messaging content library:
  ├── pillars.json         → Reusable messaging pillars (seed editorial pillars)
  ├── proof-points.json    → Evidence library (seed content proof)
  ├── audiences.json       → Audience profiles (seed ICP definition)
  └── narratives.json      → Core narratives, positioning
client-data/clients/<name>/social_media/              → Social media config and content:
  ├── config.json          → Platforms, UTM taxonomy, hashtags, compliance posture
  └── organic/
      ├── pillars.json     → Editorial pillars (if previous run exists)
      ├── series.json      → Repeatable content series
      ├── community-playbook.json → Response SLAs, tone, escalation
      └── advocacy.json    → Employee advocacy program config
```

When `social_media/organic/` already exists, the skill operates in **resume mode** — read the existing content and offer the user a choice: continue from where they left off, rework a specific phase, or start fresh.

### Content Assembly

| Component | Source | Fallback |
|-----------|--------|----------|
| Company identity | `profile.json` → `company` | Ask user |
| Services/sectors | `profile.json` → `services[]` | Ask user |
| Target audiences | `messaging/audiences.json` | Ask user to define ICP |
| Messaging pillars | `messaging/pillars.json` | Build editorial pillars from scratch |
| Proof points | `messaging/proof-points.json` | Ask user for evidence |
| Platform config | `social_media/config.json` | Ask user which platforms |
| Existing editorial pillars | `social_media/organic/pillars.json` | Build new |
| UTM taxonomy | `social_media/config.json` → `utm` | Propose defaults |
| Compliance posture | `social_media/config.json` → `compliance` | Default to conservative EU posture |

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

After Phase 6, compile all deliverables and present a summary to the user.

**Offer to save reusable config** to the company's `social_media/` directory:
- `config.json` — platform + UTM + compliance settings (if new or changed)
- `organic/pillars.json` — editorial pillar definitions
- `organic/series.json` — content series definitions
- `organic/community-playbook.json` — community management rules
- `organic/advocacy.json` — advocacy program config (if scoped)

This makes the content available for future runs and for the `paid-social-campaign` skill to reference when designing amplification strategies.

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

## Output Format Production

This skill owns organic social campaign architecture — editorial strategy, content systems, community management, and measurement. Document production is handled by the appropriate format skill:

| Output | Skill | Recommended For |
|--------|-------|-----------------|
| DOCX | `docx` | Strategy documents, playbooks, governance docs |
| PPTX | `pptx` | Strategy presentations, stakeholder decks |
| PDF | `pdf` | Distribution-ready strategy documents |
| XLSX | `xlsx` | Editorial calendars, content matrices, KPI dashboards |

**Default**: Produce markdown first. If the user wants formatted output, recommend XLSX for the editorial calendar and content matrix (tabular data), DOCX for the strategy and playbook documents.

**Brand context to carry forward** when producing formatted output:
- Brand charter location: `client-data/clients/<name>/charter.json`
- Apply heading color from `colors.primary`, body font from `fonts.body`
- Logo from `brand/logos/` (path in charter `logo` section)

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
**Discovery**: Before creating new output, check the project's `output/` folder for existing deliverables. Briefly mention what you find, then proceed with the current task.

## Error Handling

| Situation | Response |
|-----------|----------|
| No company data available | Gather essentials manually, note that a content library can be created from the output |
| No messaging pillars exist | Build editorial pillars from scratch using company services and audience pain points |
| User wants "just a calendar" | Explain that a calendar without a strategy behind it tends to produce inconsistent content — offer a lightweight strategy (Phase 3 only) as minimum viable structure |
| Too many platforms (4+) | Recommend focusing on 1-2 primary platforms first, then expanding after the system is proven |
| No capacity for community management | Reduce cadence recommendations and skip employee advocacy; flag that engagement drives organic distribution |
| Existing social_media/organic/ data conflicts with new brief | Surface the conflict, ask which takes priority, document the decision |
