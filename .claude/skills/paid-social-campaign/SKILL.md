---
name: paid-social-campaign
description: "Build paid B2B social media campaigns — campaign briefs, audience plans, tracking implementation, creative matrices, media plans, experiment frameworks, and compliance checklists. Interactive multi-phase process from discovery through optimization governance. Integrates with company profiles, messaging libraries, and brand data. Covers LinkedIn, Meta, Google, and X with platform-specific guidance for targeting, bidding, ad formats, and conversion tracking. Use this skill whenever the user asks to set up paid social ads, build a LinkedIn or Meta ad campaign, create a media plan, plan social ad spend, set up conversion tracking, design an ABM campaign, run lead gen ads, or anything involving 'how do we run paid social to generate leads' — even if they just say 'we need to run some LinkedIn ads' or 'help me set up paid social.'"
---

# Paid Social Campaign

## Overview

This skill builds paid B2B social media campaigns as an experimental system — structured targeting, controlled reach, measurable demand capture. Paid social in B2B does three jobs: prospecting at scale with precision, account-based prioritization, and demand capture with clean measurement.

The skill is interactive and phase-gated. Each phase produces deliverables and includes a checkpoint where the user confirms direction before proceeding. The user can enter at any phase if they already have prior work to build on.

A key principle: paid media depends on reliable measurement signals. The skill enforces tracking readiness before recommending spend, and builds in experiment discipline so every campaign produces learnings — not just leads.

## Company Data Integration

### Discovery

1. List `client-data/clients/` for available company profiles
2. One company → use by default; multiple → ask which company this campaign is for
3. If none exist → gather company details manually during intake

### Loading Company Data

```
client-data/clients/<name>/profile.json              → Company identity, services, value proposition
client-data/clients/<name>/charter.json         → Colors, fonts, logo (for ad creative guidance)
client-data/clients/<name>/people.json                → Sales/BD contacts for lead routing
client-data/clients/<name>/messaging/                 → Messaging content library:
  ├── pillars.json         → Value propositions (seed ad messaging)
  ├── proof-points.json    → Evidence for ad copy claims
  ├── audiences.json       → Audience profiles (seed targeting definitions)
  └── narratives.json      → Core positioning
client-data/clients/<name>/social_media/              → Social media config and content:
  ├── config.json          → Platforms, UTM taxonomy, hashtags, compliance posture
  └── paid/
      ├── audiences.json   → Targeting definitions (prospecting, retargeting, ABM)
      ├── campaigns.json   → Campaign briefs registry (hypothesis, status, learnings)
      └── experiments.json → Experiment log (hypothesis → change → outcome → decision)
```

When `social_media/paid/` already exists, the skill operates in **resume mode** — read existing content and offer the user: continue from where they left off, rework a specific phase, or start fresh.

### Content Assembly

| Component | Source | Fallback |
|-----------|--------|----------|
| Company identity | `profile.json` → `company` | Ask user |
| Value propositions | `messaging/pillars.json` | Ask user |
| Target audiences | `messaging/audiences.json` | Ask user to define ICP |
| Proof points | `messaging/proof-points.json` | Ask user for evidence |
| Platform config | `social_media/config.json` | Ask user which platforms |
| UTM taxonomy | `social_media/config.json` → `utm` | Propose defaults |
| Compliance posture | `social_media/config.json` → `compliance` | Default to conservative EU posture |
| Existing targeting | `social_media/paid/audiences.json` | Build new |
| Past campaign learnings | `social_media/paid/campaigns.json` | None — first campaign |

## Workflow

The workflow has 6 phases. Phases 1-2 must establish tracking readiness and compliance before any spend recommendations. This is intentional — the most expensive paid social mistakes are campaigns optimized against unreliable conversion data.

Every phase is interactive: present options, ask questions, propose directions, and wait for confirmation before proceeding. Pull what you can from company data first, then fill gaps with the user.

### Phase 1 — Intake & Scope

**Step 1: Understand the request and detect entry point**

If `social_media/paid/` exists, summarize what's there and ask:
- **Continue** — Pick up from where the last run left off
- **Rework phase N** — Jump to a specific phase with existing context
- **Start fresh** — Ignore existing and rebuild

If starting new, understand the brief.

**Step 2: Gather scope**

Ask (unless already clear from context or company data):
- What is the business goal? (lead generation, brand awareness, event registrations, ABM, content distribution)
- What is the offer? (what are you putting in front of the audience — webinar, report, diagnostic call, demo, free trial?)
- Funnel stage focus? (prospecting cold audiences, retargeting warm audiences, converting high-intent, or full-funnel?)
- Budget posture? (pilot/test budget, scaling existing campaigns, aggressive growth)
- Timeline? (campaign flight length — typically 4-12 weeks for B2B)
- Geographic scope and language requirements?

Present 2-3 campaign architecture options with trade-offs. Let the user pick.

**Step 3: Confirm scope**

Present a campaign brief summary: goal, offer, audience hypothesis, budget posture, timeline. Wait for confirmation.

**Phase 1 deliverable**: Paid campaign brief.

### Phase 2 — Discovery & Readiness

This phase gates spend recommendations on actual readiness. Three assessments run in sequence.

**Step 1: Tracking readiness assessment**

Check what's in place and what's missing:

| Requirement | Status check | If missing |
|-------------|-------------|------------|
| UTM taxonomy | `config.json` → `utm` or ask | Propose standard taxonomy |
| Platform pixel/tag | Ask user | Flag as blocker — tracking must be in place before launch |
| Conversion definitions | Ask what counts as a conversion at each funnel stage | Propose definitions based on offer type |
| CRM routing | Ask how leads get from ad platform to sales | Propose routing if CRM is known |
| Consent mechanism | `config.json` → `compliance` or ask | Flag as blocker for EU campaigns |

See [tracking-implementation.md](references/tracking-implementation.md) for cross-platform tracking setup guidance.

**Step 2: Data asset inventory**

Assess what audience data exists for targeting:
- Company/account lists (for ABM)
- Contact/email lists (for matched audiences)
- Website visitor audiences (requires pixel)
- Engagement audiences (video viewers, lead form openers, page engagers)
- CRM segments (for lookalike/similar audiences)

Present as a data asset scorecard. Rich data assets enable sophisticated targeting; thin data means starting with attribute-based prospecting.

**Step 3: Compliance assessment**

For EU campaigns, verify:
- Cookie/tracker consent handling (ePrivacy Directive compliance)
- Platform advertising policy awareness (each platform has prohibited categories and restrictions)
- Sensitive category targeting restrictions
- Data processing agreements with ad platforms

See [compliance-eu.md](references/compliance-eu.md) for EU-specific privacy requirements.

Present a readiness scorecard with a clear pass/fail for each requirement. Flag blockers — the skill should not recommend spending money without reliable tracking and compliant data practices.

**Phase 2 deliverables**: Readiness assessment, compliance checklist.

### Phase 3 — Strategy

**Step 1: Platform selection**

Recommend 1-2 platforms based on goals and audience. Present the reasoning:

| Factor | LinkedIn | Meta | Google | X |
|--------|---------|------|--------|---|
| B2B targeting depth | Strong (job title, company, skills) | Moderate (interest, behavior) | Keyword intent | Limited B2B |
| Lead gen forms | Native Lead Gen Forms | Instant Forms | Extensions | Lead Gen Cards |
| ABM capability | Company targeting, lists | Custom audiences | Customer Match | Tailored audiences |
| Cost profile | Higher CPL, higher quality | Lower CPL, variable quality | Intent-based pricing | Variable |

Let the user confirm or override. Load the relevant platform reference file for detailed guidance.

**Step 2: Campaign architecture**

Design the funnel structure. For each stage:
- Objective (platform-specific objective mapping)
- Target audience definition
- Ad format recommendations
- Budget allocation (% of total)
- Success metrics

Present as a table. The architecture should map cleanly to how the platform organizes campaigns (campaign → ad set/group → ad).

**Step 3: Targeting design**

For each campaign stage, define targeting:

- **Prospecting**: attribute-based (job title, industry, company size, skills) or interest-based
- **Retargeting**: engagement audiences (video viewers, page engagers, lead form openers) + website visitors
- **ABM**: company lists (recommend 1,000+ companies for platform matching) + contact lists

See [audience-targeting.md](references/audience-targeting.md) for platform-specific targeting options and constraints.

**Step 4: Budget and bidding**

Propose budget allocation across campaigns and bidding strategy per campaign:

| Strategy | When to use | Platform support |
|----------|-------------|-----------------|
| Automated / maximize delivery | Starting out, no CPA target yet | All platforms |
| Cost cap / target CPA | Known CPA target from historical data | LinkedIn, Meta, Google |
| Manual bidding | Niche audiences, need tight cost control | LinkedIn, Google |

See [bidding-strategies.md](references/bidding-strategies.md) for detailed platform-by-platform guidance.

Present the full strategy package. Wait for approval before proceeding.

**Phase 3 deliverables**: Audience plan, media plan.

### Phase 4 — Creative System

**Step 1: Build the creative matrix**

Structure: funnel stage × audience segment × value proposition × CTA.

For each cell:
- Recommended ad format (single image, video, carousel, document, lead form)
- Copy direction (headline angle, body copy theme, CTA text)
- Visual direction (what the image/video should convey)
- Landing page or lead form alignment (what the destination must contain)

Present the matrix. Ask the user to prioritize which cells to produce first (not everything needs to launch simultaneously).

**Step 2: Production specs**

For each selected ad format, pull platform-specific specs from the relevant reference file:
- File types and sizes
- Aspect ratios and dimensions
- Character limits (headline, description, CTA)
- Video duration limits
- Carousel card limits

See [ad-specs.md](references/ad-specs.md) for cross-platform specification reference.

**Step 3: A/B test plan**

For each campaign, define the initial creative test:
- What's being tested (headline angle, image style, CTA, value prop)
- Control vs. variant definition
- Minimum sample size before declaring a winner
- Decision criteria (CTR, conversion rate, or downstream quality)

**Phase 4 deliverables**: Creative matrix, production specs.

### Phase 5 — Tracking & QA

**Step 1: Tracking implementation plan**

For each platform, document the tracking setup:

| Component | LinkedIn | Meta | Google |
|-----------|---------|------|--------|
| Browser tag | Insight Tag | Meta Pixel | Google Tag |
| Server-side | Conversions API | Conversions API | Offline conversion import |
| Deduplication | Event ID matching | Event ID matching | Transaction ID |
| Consent handling | Conditional tag loading | Conditional tag loading | Consent mode |

For each conversion event, document:
- Event name and definition
- Where it fires (which page/action)
- Attribution window (click-through and view-through)
- How it connects to CRM (if applicable)

See [tracking-implementation.md](references/tracking-implementation.md) for detailed setup guidance.

**Step 2: UTM assignments**

Define UTM parameters for every campaign/ad set combination using the taxonomy from `config.json`:

```
?utm_source=linkedin
&utm_medium=paid-social
&utm_campaign=q2_regulatory-readiness_prospecting
&utm_content=carousel-v1
```

**Step 3: Pre-launch QA checklist**

Present the checklist for user sign-off:

- [ ] All destination URLs resolve and load correctly
- [ ] UTM parameters are correctly appended to every URL
- [ ] Platform pixel/tag fires on all conversion pages
- [ ] Test conversion events register in the platform
- [ ] Lead form submissions route correctly to CRM
- [ ] Conversion counting is set to the right model (one-per-click vs. every)
- [ ] Attribution windows are set appropriately
- [ ] Frequency caps are configured (if applicable)
- [ ] Ad copy and creative comply with platform policies
- [ ] Consent mechanism works for tracking scripts
- [ ] Budget and schedule are set correctly
- [ ] Negative audience exclusions are applied (e.g., existing customers if prospecting)

**Phase 5 deliverables**: Tracking plan, QA checklist.

### Phase 6 — Optimization & Governance

**Step 1: Experiment framework**

Define the ongoing experimentation approach:

| Element | Definition |
|---------|-----------|
| Experiment cadence | How often new tests are introduced (recommend: 1-2 per month) |
| Hypothesis template | "If we [change], then [metric] will [direction] because [reasoning]" |
| Minimum run time | Time before evaluating results (recommend: 7-14 days for B2B) |
| Decision criteria | What constitutes a winner (statistical significance or practical significance threshold) |
| Documentation | Every experiment logged: hypothesis, change, outcome, decision |

**Step 2: Optimization priority order**

When campaigns underperform, diagnose in this order — each layer depends on the ones below it:

1. **Tracking integrity** — Are conversions being counted correctly? (Fix this first — everything else is noise if tracking is broken)
2. **Audience and offer fit** — Is the offer relevant to the target audience? Are we reaching the right people?
3. **Creative** — Is the ad compelling? Does the landing page deliver on the ad's promise?
4. **Bidding and budget** — Is the bid strategy appropriate? Is budget sufficient for the audience size?

**Step 3: Stop/scale rules**

Define clear decision rules:

| Condition | Action |
|-----------|--------|
| Tracking broken or unreliable | Pause immediately, fix, re-launch |
| CPL > threshold for 2+ weeks | Diagnose per priority order, then pause or restructure |
| CPL stable + SQL rate acceptable | Scale budget 20-30% increments weekly |
| Creative fatigue (rising CPL + falling CTR) | Refresh creative, maintain budget |
| Frequency > cap for 2+ weeks | Expand audience or reduce budget |

**Step 4: Reporting cadence**

- **Weekly**: campaign performance review (spend, impressions, clicks, conversions, CPL, frequency)
- **Monthly**: budget governance + experiment review + creative refresh assessment
- **Quarterly**: strategic reset (revalidate targeting, update audience lists, review platform mix, feed learnings into organic editorial)

The quarterly reset is the integration point with organic — validated value propositions and proof points from paid tests should inform the organic editorial strategy. The `organic-social-campaign` skill handles editorial planning.

**Step 5: Policy compliance maintenance**

Document ongoing compliance responsibilities:
- Regular review of platform policy updates
- Creative pre-review for regulated claims
- Tracker consent state verification
- Data processing agreement currency

**Phase 6 deliverables**: Experiment framework, optimization playbook, governance doc.

### Final Output Assembly

After Phase 6, compile all deliverables and present a summary to the user.

**Offer to save reusable config** to the company's `social_media/` directory:
- `config.json` — platform + UTM + compliance settings (if new or changed)
- `paid/audiences.json` — targeting definitions with segment metadata
- `paid/campaigns.json` — campaign brief with hypothesis and status
- `paid/experiments.json` — experiment log (to be populated during campaign execution)

## Reference Files

Load these as needed — do not read all at once.

| File | When to Load |
|------|-------------|
| [linkedin-ads.md](references/platforms/linkedin-ads.md) | When LinkedIn is a selected platform. Campaign Manager, objectives, formats, Matched Audiences, bidding. |
| [meta-ads.md](references/platforms/meta-ads.md) | When Meta is a selected platform. Business Suite, objectives, formats, pixel, Conversions API, lead ads. |
| [google-ads.md](references/platforms/google-ads.md) | When Google is a selected platform. Search/Display/YouTube, Smart Bidding, conversion setup, GTM. |
| [twitter-x-ads.md](references/platforms/twitter-x-ads.md) | When X is a selected platform. Ad formats, targeting, measurement. |
| [tracking-implementation.md](references/tracking-implementation.md) | Phase 2/5 — cross-platform tracking setup guide (tags, pixels, CAPI, UTMs, consent). |
| [bidding-strategies.md](references/bidding-strategies.md) | Phase 3 — platform-by-platform bidding options and selection criteria. |
| [audience-targeting.md](references/audience-targeting.md) | Phase 3 — targeting taxonomy: prospecting, retargeting, ABM, lookalike. |
| [compliance-eu.md](references/compliance-eu.md) | Phase 2 — EU privacy posture: ePrivacy, EDPB consent guidelines, GDPR, DSA. |
| [ad-specs.md](references/ad-specs.md) | Phase 4 — creative specifications by platform and format. |
| [measurement-benchmarks.md](references/measurement-benchmarks.md) | Phase 6 — directional CPL/CPA/CTR benchmarks by platform (use cautiously). |

## Output Format Production

This skill owns paid social campaign architecture — targeting, bidding, creative planning, tracking, and optimization. Document production is handled by the appropriate format skill:

| Output | Skill | Recommended For |
|--------|-------|-----------------|
| DOCX | `docx` | Campaign briefs, strategy documents, governance docs |
| PPTX | `pptx` | Strategy presentations, stakeholder approval decks |
| PDF | `pdf` | Distribution-ready briefs and checklists |
| XLSX | `xlsx` | Media plans, creative matrices, experiment logs, KPI dashboards |

**Default**: Produce markdown first. If the user wants formatted output, recommend XLSX for media plans, creative matrices, and experiment logs (tabular data), DOCX for campaign briefs and governance documents.

**Brand context to carry forward** when producing formatted output:
- Brand charter location: `client-data/clients/<name>/charter.json`
- Apply heading color from `colors.primary`, body font from `fonts.body`
- Logo from `brand/logos/` (path in charter `logo` section)

### Diagram Integration

Funnel/flow diagrams (campaign architecture, A/B decision tree, conversion funnel) can be generated using the `diagram` skill for branded visual output.

## Output Location

Deliverables follow the standard workspace project structure:

```
workspace/<client>/output/paid-social-campaign/
├── campaign-brief.md
├── readiness-assessment.md
├── audience-plan.md
├── media-plan.md
├── creative-matrix.md
├── tracking-plan.md
├── qa-checklist.md
├── experiment-framework.md
├── optimization-playbook.md
└── governance.md
```

**Override**: If the prompt specifies a target output directory, use it.



## Error Handling

| Situation | Response |
|-----------|----------|
| No tracking in place | Flag as blocker — do not recommend spend without conversion tracking |
| No company data available | Gather essentials manually, note that a content library can be created from the output |
| Budget too small for platform minimums | Advise on minimum viable budget per platform, recommend focusing on one platform |
| No offer defined | Help the user define a low-friction offer appropriate to their funnel stage — the offer is the campaign, not the ad |
| Compliance unclear | Default to conservative EU posture, document assumptions, flag for legal review |
| User wants "just run some ads" | Explain that paid without tracking and offer readiness burns budget — offer a lightweight readiness check (Phase 2 only) as minimum viable starting point |
| ABM list too small (<500 companies) | Warn about match rate attrition, recommend supplementing with attribute-based targeting |
| Existing social_media/paid/ data conflicts with new brief | Surface the conflict, ask which takes priority, document the decision |
