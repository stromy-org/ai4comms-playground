# Discovery Workflow Reference

Interview question bank and research inputs checklist for Phase 2 of the messaging framework workflow.

## Table of Contents

1. [Question Filtering Principle](#question-filtering-principle)
2. [Universal Questions](#universal-questions)
3. [Framework-Specific Questions](#framework-specific-questions)
4. [Research Inputs Checklist](#research-inputs-checklist)
5. [Discovery Anti-Patterns](#discovery-anti-patterns)

---

## Question Filtering Principle

Before asking any question, apply this filter:

> "If I don't ask this, will the framework be materially wrong or significantly suboptimal?"

If the answer is no, skip the question. Pull from company data or infer from context. The goal is a focused conversation, not a comprehensive survey. Most users lose patience after 5-7 questions — make each one count.

**Inference over asking**: When you can deduce an answer from company data or context, confirm the deduction rather than asking from scratch. "Based on your profile, your primary audiences are financial services and healthcare enterprises — is that right?" is better than "Who are your target audiences?"

---

## Universal Questions

These apply regardless of framework type. Ask only those where the answer isn't already clear.

### Always Ask (unless already answered)

| Question | Why It Matters | What Changes If You Skip |
|----------|---------------|--------------------------|
| Who is the primary audience? | Determines vocabulary, proof selection, and framing | Framework may address the wrong reader |
| What makes you meaningfully different? | Drives the core message and pillar selection | Messages will be generic — passable for any competitor |
| What should the audience think, feel, or do? | Sets the framework's success criterion | No way to validate whether the messaging works |

### Ask If Unclear

| Question | When to Ask | What It Informs |
|----------|-------------|----------------|
| What are the top 2-3 alternatives your audience considers? | When competitive context is missing | Differentiation framing, competitive positioning |
| Is there existing positioning or brand strategy? | When no `messaging/narratives.json` exists | Whether to build from scratch or extend |
| What tone fits? (formal, conversational, bold, measured) | When voice preferences aren't established | Verbal guardrails, word choice |
| What objections or skepticism do you encounter? | When audience resistance is unknown | Objection handling, proof selection |
| What proof do you have? (data, case studies, awards) | When `proof-points.json` is empty | Whether pillars can be substantiated |
| Is this for one team or cross-functional adoption? | When the audience for the framework itself is unclear | Document structure, level of detail, governance |

### Never Ask (Pull from Data)

| Information | Source |
|-------------|--------|
| Company name, description, services | `profile.json` |
| Existing messaging pillars | `messaging/pillars.json` |
| Past case studies and results | `messaging/proof-points.json` (type: `"customer"`) |
| Testimonials | `messaging/proof-points.json` (type: `"customer"`) |
| Credentials, awards, certifications | `profile.json` → `credentials` |
| Brand voice/tone (if established) | `charter.json` or existing voice guide |

---

## Framework-Specific Questions

Additional questions that become important for specific framework types.

### Message House

| Question | Purpose |
|----------|---------|
| What are the 3 things you most want people to remember? | Seeds pillar themes |
| Is this for spokespeople, internal teams, or both? | Determines depth and format |
| Are there existing talking points this should align with? | Avoids conflicting messages |

### Messaging Hierarchy

| Question | Purpose |
|----------|---------|
| What is the brand's mission or purpose beyond profit? | Feeds Layer 1 (brand promise) |
| How do you define your market category? | Feeds Layer 2 (positioning) |
| What message lengths do teams need? (headline, pitch, full) | Determines Layer 7 depth |

### Messaging Matrix

| Question | Purpose |
|----------|---------|
| List all audiences who need distinct messaging | Defines matrix rows |
| For each audience: what's their #1 pain point? | Fills the pain point column |
| For each audience: what's their decision process? | Informs proof and CTA selection |
| Do any audiences conflict? (e.g., investors vs. employees during layoffs) | Flags adaptation risks |

### Strategic Narrative

| Question | Purpose |
|----------|---------|
| What changed in the market that makes the old way obsolete? | Seeds Act 2 (the shift) |
| What do winners in the new reality look like? | Seeds Act 3 (new world) |
| What happens to organizations that don't adapt? | Seeds the stakes |
| Is the shift already well-understood or does it need explaining? | Determines how much setup Act 1-2 need |

### Product Messaging

| Question | Purpose |
|----------|---------|
| What are the top 3-5 features that matter most to buyers? | Defines the feature-benefit-proof table |
| What's the primary alternative buyers evaluate? | Seeds competitive differentiation |
| What's the most common reason prospects say no? | Seeds objection handling |
| What pricing model? (this affects how value is framed) | Influences ROI framing |

---

## Research Inputs Checklist

Before or during discovery, gather these inputs. Check off what's available vs. what needs to be created or asked for.

### From Company Data (Automated)

- [ ] Company profile (`profile.json`)
- [ ] Brand identity (`charter.json`)
- [ ] Existing messaging (`messaging/` directory)
- [ ] Existing proof points (`messaging/proof-points.json`)
- [ ] Credentials and awards (`profile.json` → `credentials`)
- [ ] Service descriptions (`profile.json` → `services[]`)

### From User (Conversational)

- [ ] Brief, RFP, or context document (if one exists)
- [ ] Target audiences with priorities
- [ ] Core differentiator(s)
- [ ] Competitive landscape
- [ ] Known objections or audience skepticism
- [ ] Tone/voice preferences
- [ ] Success criteria (what does "good messaging" look like to them?)

### From Research (If Gaps Remain)

- [ ] Competitor messaging analysis (what competitors claim publicly)
- [ ] Industry/category language (how the market talks about this space)
- [ ] Analyst or media framing (how third parties describe the category)

---

## Discovery Anti-Patterns

Common mistakes to avoid during the interview phase.

### Asking questions you can answer yourself
If `profile.json` says the company serves "Financial Services, Healthcare, Manufacturing" and has won "Best Mid-Market Consultancy" — don't ask "what industries do you serve?" or "do you have any awards?" Pull the data, confirm it, move on.

### Asking too many questions at once
Batch questions overwhelm. Ask 2-3 at a time, grouped by theme. Let the user respond, then follow up based on their answers.

### Asking abstract questions
"What's your brand essence?" rarely produces useful answers. Ask concrete questions: "If a customer had to describe you in one sentence to a friend, what would they say?" "What's the #1 reason deals close — and the #1 reason they don't?"

### Assuming you need all inputs before starting
Many inputs can be filled in during assembly. If you have the core differentiator, primary audience, and 2-3 proof points, you have enough to draft an architecture proposal (Phase 3). Fill gaps as they surface.

### Confusing the framework audience with the messaging audience
The *framework* is used by internal teams (marketing, sales, comms, executives). The *messaging* speaks to external audiences. Questions about format, length, and governance are about the framework; questions about pain points, vocabulary, and objections are about the messaging audiences. Don't conflate them.
