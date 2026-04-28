---
name: press-release
description: "Write and manage corporate press releases with full governance lifecycle — from newsworthiness assessment through drafting, legal review, and distribution planning. Produces AP-style, journalist-ready releases with inverted pyramid structure, proper datelines, sourced quotes, and boilerplate from company data. Covers all announcement types: product launches, funding rounds, partnerships, acquisitions, executive hires, milestones, research/reports, and crisis communications. Integrates with company profiles for branded output, spokesperson management, and approval workflows. Use this skill whenever the user asks to write a press release, draft a media announcement, create a news release, prepare a PR statement, write an announcement for the press, handle media communications, or produce journalist-ready content — even if they just say 'announce this' or 'we need to tell the media about X'."
---

# Corporate Press Release

## Overview

This skill produces corporate press releases that are simultaneously newsworthy, journalist-friendly, factually rigorous, digitally discoverable, and legally reviewed for disclosure risk. It owns the full lifecycle — from deciding whether an announcement merits a release through drafting, approval, distribution planning, and post-publication corrections.

Press releases are still valued by journalists (Cision reports 72% prefer receiving them from PR teams), but relevance is the biggest filter. This skill enforces a newsworthiness gate before any drafting begins.

## Company Data Integration

### Discovery

1. List `client-data/clients/` for available company profiles
2. One company → use by default; multiple → ask which company is announcing
3. If none exist → gather company details manually during intake

### Loading Company Data

```
client-data/clients/<name>/profile.json        → Company name, tagline, HQ, contact, services
client-data/clients/<name>/charter.json   → Colors, fonts, logo (for branded PDF/HTML versions)
client-data/clients/<name>/press-releases/      → Press release content library:
  ├── spokespersons.json     → Approved spokespersons with titles, quote style, topics
  ├── boilerplate.json       → Company boilerplate versions (standard, short, product-specific)
  ├── distribution-lists.json → Media lists by beat, region, tier
  └── approval-matrix.json   → Sign-off requirements by announcement classification
```

When no `press-releases/` directory exists, fall back to `profile.json` for company identity and ask the user for spokesperson details, boilerplate text, and approval requirements.

### Content Assembly

| Release Section | Content Source | Fallback |
|----------------|---------------|----------|
| Dateline city | `profile.json` → `company.headquarters.city` | Ask user |
| Boilerplate | `press-releases/boilerplate.json` → match by variant | Ask user for 2-3 sentence company description |
| Spokesperson | `press-releases/spokespersons.json` → match by topic; `people.json` for contact details | Ask user for name, title, quote |
| Media contact | `press-releases/spokespersons.json` → `mediaContact` role; `people.json` for contact details | `profile.json` → `company.email` |
| Approval chain | `press-releases/approval-matrix.json` → match by classification | Default: Comms lead + subject-matter owner |
| Distribution | `press-releases/distribution-lists.json` → match by beat | Recommend wire + targeted list |

## Workflow

The workflow has 8 phases. Phases 1-4 happen before any writing. This is intentional — the most common corporate press release mistakes happen before drafting, not during it.

### Phase 1 — Intake & Classification

**Step 1: Receive the announcement**
User provides the news — could be a brief, bullet points, internal memo, or verbal description.

**Step 2: Classify the announcement**

| Classification | Characteristics | Governance Level |
|---------------|-----------------|-----------------|
| **Ordinary** | Product update, event, hire, partnership | Standard (Comms + owner) |
| **Reputationally sensitive** | Layoffs, legal settlement, controversy response | Elevated (Comms + Legal + Exec) |
| **Market-sensitive** | Earnings, M&A, material contracts, forecasts | Full (Comms + Legal + IR + Board) |
| **Crisis** | Safety issue, data breach, regulatory action | Immediate (Crisis team + Legal + Exec) |

Present the classification to the user for confirmation. The classification determines which governance steps are mandatory.

**Step 3: Newsworthiness gate**

Before drafting, apply the "So what?" test. The announcement should pass at least 2 of these criteria:

- **Timeliness** — Is this happening now or very soon?
- **Impact** — Does this affect customers, markets, or communities?
- **Novelty** — Is this a first, an industry change, or genuinely new?
- **Prominence** — Are notable people, companies, or brands involved?
- **Relevance** — Does this connect to a current trend or public concern?

If the announcement fails the gate, recommend alternatives: blog post, internal memo, social media post, or newsletter item. Explain why — don't just reject it.

**Step 4: Is this actually a press release?**

Some announcements are better served by a different format:

| If the news is... | Consider instead |
|-------------------|-----------------|
| Routine internal update | Internal memo or intranet post |
| Thought leadership / opinion | Blog post or bylined article |
| Regulatory filing | Regulatory submission (not PR-first) |
| Brief factual statement | Media statement (not full release) |
| Product detail for existing users | Product changelog or email |

### Phase 2 — Fact Pack Assembly

Gather and classify every claim that will appear in the release.

**Source hierarchy** (highest trust first):
1. **Company-approved facts** — Board-approved numbers, official stats, verified milestones
2. **Public verifiable facts** — Published financials, regulatory filings, industry reports
3. **Estimates/projections** — Internal forecasts, market sizing (require "forward-looking" disclaimer)
4. **Third-party claims** — Analyst quotes, partner statements (require attribution and permission)

For each key claim, record: the fact, its source, who approved it, and when it was last verified.

**Risk screen** — Flag any of these for legal review:
- Forward-looking statements or financial projections
- Customer names (need permission to reference)
- Competitive claims ("first," "only," "leading," "best")
- Regulated language (healthcare, financial services, defense)
- Inside information (for listed companies)
- Personal data or privacy-sensitive details

### Phase 3 — Governance Review

Load the appropriate review path from `press-releases/approval-matrix.json` based on classification, or use these defaults:

| Classification | Required Sign-offs | Before Drafting | Before Distribution |
|---------------|-------------------|-----------------|-------------------|
| Ordinary | Comms lead, subject-matter owner | Fact pack | Final draft |
| Reputationally sensitive | + Legal counsel, executive sponsor | Fact pack + messaging | Final draft + quotes |
| Market-sensitive | + IR/compliance, disclosure counsel | Fact pack + materiality assessment | Final draft + timing + wire selection |
| Crisis | + Crisis team lead, CEO/delegate | Holding statement first | Every version |

**For listed companies**: Coordinate timing with market hours. Material information must be disclosed broadly and simultaneously — not selectively to favored journalists. See [governance-workflow.md](references/governance-workflow.md) for SEC Reg FD and FCA guidance.

Present the approval requirements to the user. The draft comes next, but the user should know who needs to sign off before writing begins.

### Phase 4 — Release Blueprint

Before drafting, present a structural outline for confirmation. It's much cheaper to adjust the angle or swap a quote strategy now than to rewrite a finished release — especially for reputationally sensitive or market-sensitive announcements where every word gets scrutinized.

**Present to the user:**

1. **News angle** — The core story in one sentence. What makes this newsworthy? (This becomes the lead.)
2. **Headline direction** — 2-3 candidate headlines showing the framing (not final copy — just direction)
3. **Fact selection** — Which facts from the fact pack will carry the story. What's in, what's background, what's cut.
4. **Quote strategy** — Who speaks, about what theme. If two quotes, what each one covers and why. (Match spokesperson to topic using `spokespersons.json` or user input.)
5. **Boilerplate variant** — Which version (standard, short, product-specific) fits this release
6. **Concerns** — Missing facts, weak angles, governance flags, or anything that could stall the draft

**Skip the blueprint when:**
- The user has already provided a near-complete draft for refinement
- The release is a straightforward ordinary announcement with no governance complexity

For all other cases — especially reputationally sensitive and market-sensitive releases — the blueprint saves revision cycles and prevents the common failure of drafting first, then discovering the angle doesn't hold up under legal review.

Wait for confirmation or adjustments before proceeding to Phase 5.

### Phase 5 — Draft the Release

Now write. Follow AP-style conventions and inverted pyramid structure.

**Structure** (every release, in this order):
1. **Headline** — The news in plain language, 6-12 words, under 100 characters
2. **Subheadline** (optional) — Supporting context or key metric
3. **Dateline** — `CITY, Month Day, Year —`
4. **Lead paragraph** — Who, what, when, where, why in 25-30 words
5. **Supporting paragraph(s)** — Context, evidence, business significance
6. **Quote** — Executive perspective, not fact repetition (1-2 quotes max)
7. **Additional detail** — Features, availability, timeline, next steps
8. **Boilerplate** — Company description (from content library or profile)
9. **Media contact** — Name, title, email, direct phone
10. **`###`** — Standard end marker

**Length target**: 300-500 words. Shorter is better. If the release exceeds 500 words, cut — every sentence should either communicate the news, prove it, explain why it matters, or enable follow-up.

For detailed editorial rules (headline formulas, quote patterns, AP style reference, what to avoid), see [editorial-standards.md](references/editorial-standards.md).

For type-specific guidance (what to emphasize for product launches vs. funding vs. crisis), see [announcement-types.md](references/announcement-types.md).

### Phase 6 — Review & Validation

**Editorial checklist:**
- [ ] Headline states the news plainly (no hype, no jargon)
- [ ] Lead answers the 5 Ws in under 35 words
- [ ] Inverted pyramid maintained (most important first)
- [ ] All claims traced to fact pack with approved sources
- [ ] Quotes add perspective, not enthusiasm
- [ ] No unsupported superlatives ("world-leading," "game-changing")
- [ ] AP-style conventions followed (dateline, numbers, titles)
- [ ] Boilerplate current and accurate
- [ ] Media contact has direct details (not a switchboard)
- [ ] Word count 300-500

**Governance checklist** (based on classification):
- [ ] All required sign-offs identified and communicated
- [ ] Forward-looking statements flagged with appropriate disclaimer
- [ ] Customer/partner names cleared for use
- [ ] Competitive claims substantiated
- [ ] Market-sensitive timing coordinated with IR (if applicable)
- [ ] Embargo terms documented (if applicable)

### Phase 7 — Distribution Planning

Recommend a distribution approach based on announcement type and classification. See [distribution-guide.md](references/distribution-guide.md) for the full decision tree.

**Quick reference:**

| Classification | Primary Channel | Supporting |
|---------------|----------------|-----------|
| Ordinary | Targeted outreach by beat | Company newsroom, social |
| Reputationally sensitive | Targeted outreach + newsroom | Social only if positive framing |
| Market-sensitive | Regulatory wire (RNS/DGAP) first, then broad wire | Newsroom after wire clears |
| Crisis | Direct to affected parties, then wire | Newsroom, social, stakeholder email |

**Multimedia**: Include when it materially helps the story — product images, data visualizations, executive headshots, video. 20% of reporters are more likely to pursue a story with multimedia attached.

**SEO**: Include relevant keywords in headline and first paragraph. Link to landing page or newsroom. But the story must read like news first — discoverability is secondary to accuracy.

### Phase 8 — Post-Publication

After the release goes out:

1. **Monitor pickup** — Track media coverage, social shares, journalist inquiries
2. **Correct promptly** — If errors are discovered, issue a correction and update the newsroom version. PRSA ethics standards require prompt correction of inaccuracies.
3. **Archive** — Save the final version with metadata (date, classification, distribution channel, pickup summary)
4. **Debrief** — For major announcements, note what worked and what didn't for future releases

## Reference Files

Load these as needed — do not read all at once.

| File | When to Load |
|------|-------------|
| [editorial-standards.md](references/editorial-standards.md) | When drafting (Phase 5). AP style, headline rules, quote patterns, length guidance, common mistakes. |
| [governance-workflow.md](references/governance-workflow.md) | When handling market-sensitive or crisis announcements (Phases 1-3). Materiality screening, SEC/FCA guidance, approval matrices, correction procedures. |
| [distribution-guide.md](references/distribution-guide.md) | When planning distribution (Phase 7). Wire vs. targeted, SEO, multimedia, embargo protocol, timing by market rules, localization. |
| [announcement-types.md](references/announcement-types.md) | When drafting type-specific content (Phase 5). Detailed guidance per announcement type with examples. |

## Output Format

The primary output is a markdown-formatted press release. After the content is finalized, produce the document in the user's requested format.

### Markdown Template

```markdown
# [HEADLINE IN TITLE CASE]

## [Subheadline — optional]

**[CITY, Month Day, Year]** — [Lead paragraph: the complete story in 25-30 words.]

[Supporting paragraph with context, evidence, and significance.]

"[Executive quote — perspective, not facts]," said [Full Name], [Title] at [Company].

[Additional detail: features, availability, timeline.]

"[Optional second quote from partner/customer/analyst]," said [Full Name], [Title] at [Organization].

[Closing: call to action, where to learn more.]

### About [Company Name]

[2-3 sentence boilerplate from content library or profile.json]

### Media Contact

[Name]
[Title], [Company]
[Email] | [Phone]

###
```

## Output Format Production

This skill owns press release content — structure, editorial quality, governance, and distribution planning. Document production is handled by the appropriate format skill:

| Output | Skill | What it provides |
|--------|-------|-----------------|
| DOCX | `docx` | Word document creation with branded letterhead styling, headers/footers |
| PDF | `pdf` | PDF creation for distribution-ready releases |

**Default**: If the user doesn't specify a format, produce markdown first and ask whether they'd like a formatted DOCX or PDF. Press releases are most commonly distributed as PDF attachments or pasted into wire services — recommend accordingly.

**Brand context to carry forward** when producing formatted output:
- Brand charter location: `client-data/clients/<name>/charter.json`
- Apply heading color from `colors.primary`, body font from `fonts.body`, logo from `brand/logos/` (path in charter `logo` section)
- Use `document` section from charter for margins, headers, footers
- Include company logo on the release header if available

## Output Location

Press releases follow the standard workspace project structure:

```
workspace/<client>/
├── build/<deliverable>/    ← build scripts and intermediates
└── output/<deliverable>/   ← final press release files (docx, pdf)
```

**Override**: If the prompt specifies a target output directory, pass it through to the output format skill.
**Discovery**: Before creating new output, check the project's `output/` folder for existing deliverables. Briefly mention what you find, then proceed with the current task.

## Error Handling

| Situation | Response |
|-----------|----------|
| Announcement fails newsworthiness gate | Recommend alternative format, explain why |
| No company data available | Gather essentials manually, note missing fields |
| Classification unclear | Present options with reasoning, let user decide |
| Quote not provided | Draft a template quote, ask for review/approval |
| Missing media contact | Flag as blocker — every release needs a real contact |
| Legal review flagged but not available | Draft with risk flags visible, note that legal must review before distribution |
| Exceeds 500 words | Cut ruthlessly — highlight what can be moved to a fact sheet |
