# Interactive Intake Workflow

This reference provides detailed guidance for the conversational intake process that precedes proposal creation. The goal is to gather all necessary inputs through a structured but natural conversation — asking only questions that genuinely add value.

## Principles

1. **Don't ask what you already know** — if the brief/RFP states the budget, don't ask about budget
2. **Don't ask what you can deduce** — if the company profile has one pricing model, don't ask which model to use
3. **Minimize cognitive load** — present options rather than open-ended questions where possible
4. **Adapt to context** — a 2-page brief needs more questions than a 50-page RFP
5. **Confirm, don't interrogate** — for items you can infer, confirm your inference rather than asking from scratch

## Phase 1 — Signal

### What the user provides

The user initiates with one of:
- A client brief or RFP document (file path or pasted text)
- A verbal description of the opportunity
- A reference to a previous proposal to update

### What the agent does

1. **Read and analyze the input** — extract:
   - Client name, industry, size
   - Stated needs, challenges, goals
   - Required services, deliverables, timeline
   - Budget indicators or constraints
   - Submission requirements (format, deadline, page limits)
   - Evaluation criteria (if RFP)

2. **Load company data** — discover and read from `client-data/clients/`:
   - `profile.json` for services, pricing, credentials
   - `proposals/case-studies.json` for relevant past performance
   - `proposals/team-bios.json` for available team members
   - `proposals/methodologies.json` for applicable approaches

3. **Identify what's known vs. unknown** — categorize inputs as:
   - **Known** — explicitly stated in brief/RFP or deducible
   - **Assumed** — reasonable inference that should be confirmed
   - **Unknown** — must be asked

## Quick Setup Path (Optional)

For common B2B proposals, offer a shortcut before the full Smart Interview:

1. "What type of client?" → Enterprise / SMB / Startup / Agency / Quick Quote
2. "Formality?" → Formal / Conversational / Bold
3. "Depth?" → Executive brief / Standard / Full

Auto-select archetype from answers (see [archetypes.md](archetypes.md)). Pre-populate: section list, tone, depth, default case study selection criteria. The user can override any defaults in Phase 3 (Strategy).

Skip this path when: a detailed brief/RFP is provided (proceed directly to Smart Interview).

---

## Phase 2 — Smart Interview

### Question Selection Logic

Only ask questions where the answer would **materially change the proposal output**. For each potential question, apply this filter:

> "If I don't ask this, will the proposal be wrong or significantly suboptimal?"
> If no → skip it. If yes → ask it.

### Core Questions (always ask)

**1. Depth / Format**
> "What depth are you looking for?"
> Options: Executive brief (2-4 pages), Standard proposal (8-15 pages), Full proposal (15-25+ pages)

This determines which sections to include (full skeleton vs. condensed mapping).

**2. Pricing Model**
> "Which pricing approach should we use?"
> Present options from `profile.json` → `pricing.models[]`

Only skip if the brief specifies a pricing format or the company has only one model.

### Contextual Questions (ask if not clear from brief)

**Pain Point Emphasis**
> "What's the primary pain point we should lead with?"

Ask when: The brief mentions multiple challenges and it's unclear which is most important to the client.
Skip when: The brief clearly prioritizes one challenge, or the RFP has explicit evaluation criteria.

**Team Composition**
> "Are there specific team members you want to highlight — or anyone to exclude?"

Ask when: Company has 4+ team members. The choice affects credibility for this specific opportunity.
Skip when: Company has ≤3 team members (include all), or the RFP specifies required roles.

**Section Emphasis**
> "Any sections you'd like to emphasize or skip?"

Ask when: The proposal is for a repeat client (some sections may be unnecessary) or for a non-standard format.
Skip when: RFP specifies required sections, or this is a standard competitive proposal.

**Target Audience**
> "Who will be evaluating this — technical experts, executives, or a mixed panel?"

Ask when: Not stated in RFP and the distinction would change writing style (executive summary vs. technical detail).
Skip when: RFP states the evaluation panel composition.

**Competitive Context**
> "Is this a competitive bid or a sole-source opportunity?"

Ask when: Not clear from context. Competitive bids need sharper differentiation and win themes.
Skip when: RFP is clearly competitive (multiple vendors invited) or user states the context.

### Questions to NEVER Ask

- "What is your company's name?" → It's in `profile.json`
- "What services do you offer?" → It's in `profile.json`
- "What are your rates?" → It's in `profile.json`
- "Tell me about your past projects" → It's in `case-studies.json`
- "What's your methodology?" → It's in `methodologies.json`
- "What are your standard terms?" → It's in `boilerplate.json`
- Generic filler questions that don't change the output
- Questions already answered in the brief/RFP

### Formatting the Interview

Present questions as a focused batch (not one at a time) using `AskUserQuestion` or inline questions:

```
Based on the brief, I have a few questions before drafting:

1. **Depth**: Executive brief (2-4 pages) or full proposal (15-25 pages)?
2. **Pricing**: Time & Materials or Fixed Fee? (both available in your pricing models)
3. **Team lead**: I'd suggest Elena Müller (transformation expertise) — confirm or change?
4. **Case studies**: CS-001 (NordBank) and CS-003 (TechParts) seem most relevant — agree?
```

This approach:
- Shows the user you've already done the thinking
- Reduces back-and-forth
- Lets the user override with minimal effort

## Phase 3 — Strategy

### Content Plan Structure

Present a strategy summary for approval before any writing begins:

```
## Proposal Strategy

**Client**: [Name] | **Industry**: [Industry]
**Format**: Full proposal (~18 pages, DOCX)
**Audience**: Executive + technical panel

### Sections Included
1. Cover Page
2. Executive Summary (written last)
3. Client Context — [brief summary of what we'll emphasize]
4. Objectives — [3-4 objectives identified from brief]
5. Approach & Methodology — Using [methodology name]
6. Work Plan & Timeline — [X] phases over [Y] months
7. Deliverables — [list key deliverables]
8. Team — [names and roles]
9. Relevant Experience — [case study titles]
10. Pricing — [model] at [summary]
11. Terms & Conditions — Standard terms
12. Next Steps

### Win Themes
1. [Theme 1] — supported by [evidence]
2. [Theme 2] — supported by [evidence]
3. [Theme 3] — supported by [evidence]

### Content Selections
- **Case studies**: CS-001, CS-003 (industry + service match)
- **Team**: person-001 (lead), person-003 (specialist)
- **Methodology**: meth-001 (ATF)
- **Pricing**: T&M model (price-001), estimated EUR X

Shall I proceed with this plan?
```

### Decision Points

The user can:
- **Approve** → proceed to Phase 4 (Production)
- **Modify** → adjust sections, team, case studies, or themes
- **Reject** → restart from Phase 2 with new direction

## Handling Edge Cases

### No company data exists
Fall back to manual input gathering:
1. Ask for company name, services, and key differentiators
2. Ask for team bios and case studies (or accept rough descriptions)
3. Ask for pricing structure
4. Proceed with manually provided inputs

### Brief is very short (1-2 sentences)
Ask more questions to fill gaps:
- What industry is the client in?
- What's the approximate engagement scope (duration, budget range)?
- What specific outcomes are they looking for?

### Brief is very detailed (50+ page RFP)
Ask fewer questions — most inputs are in the document:
- Focus on strategic choices: win themes, competitive positioning
- Confirm team and case study selections
- Confirm pricing approach

### Revision of existing proposal
Skip most intake — focus on:
- What needs to change? (scope, pricing, team, dates)
- Any new information from the client?
- Should unchanged sections be refreshed or left as-is?
