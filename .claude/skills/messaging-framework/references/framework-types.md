# Framework Types Reference

Detailed structural specifications, configuration options, and output templates for each of the five framework types.

## Table of Contents

1. [Message House](#message-house)
2. [Messaging Hierarchy](#messaging-hierarchy)
3. [Messaging Matrix](#messaging-matrix)
4. [Strategic Narrative](#strategic-narrative)
5. [Product Messaging](#product-messaging)
6. [Choosing Between Types](#choosing-between-types)

---

## Message House

The classic communications framework. Visual metaphor: a house with a roof (core message), pillars (supporting themes), and foundation (proof points). Popularized by PR and corporate communications — it's what most agencies mean when they say "messaging framework."

### Structure

```
┌─────────────────────────────────────────────┐
│              CORE MESSAGE                    │
│   (The single thing you want them to know)   │
├──────────────┬──────────────┬───────────────┤
│   PILLAR 1   │   PILLAR 2   │   PILLAR 3    │
│  Supporting  │  Supporting  │  Supporting   │
│  statement   │  statement   │  statement    │
├──────────────┼──────────────┼───────────────┤
│  • Proof 1a  │  • Proof 2a  │  • Proof 3a   │
│  • Proof 1b  │  • Proof 2b  │  • Proof 3b   │
│  • Proof 1c  │  • Proof 2c  │  • Proof 3c   │
├──────────────┴──────────────┴───────────────┤
│              FOUNDATION                      │
│   Voice attributes • Elevator pitch • CTA    │
└─────────────────────────────────────────────┘
```

### Output Template

```markdown
# Message House: [Company/Product/Initiative]

## Core Message
[Single overarching claim — under 25 words]

## Messaging Pillars

### Pillar 1: [Headline]
[1-2 sentence supporting statement]

**Proof points:**
- [Specific, verifiable evidence]
- [Specific, verifiable evidence]
- [Specific, verifiable evidence]

### Pillar 2: [Headline]
[1-2 sentence supporting statement]

**Proof points:**
- [Evidence]
- [Evidence]

### Pillar 3: [Headline]
[1-2 sentence supporting statement]

**Proof points:**
- [Evidence]
- [Evidence]

## Foundation

**Voice:** [3-5 attributes]
**Elevator pitch:** [30-50 words]
**Call to action:** [What you want the audience to do next]

## Audience Adaptations
[Adaptation layers — see audience-adaptation.md]

## When to Revisit
[Review triggers]
```

### Configuration Options

| Option | Values | Default |
|--------|--------|---------|
| Number of pillars | 2-5 | 3 |
| Proof points per pillar | 2-5 | 3 |
| Include audience adaptations | yes/no | yes |
| Include verbal guardrails | yes/no | yes |
| Include elevator pitch | yes/no | yes |

### When to Use

- Spokesperson preparation and media training
- Quick internal alignment on "what we say"
- Campaign messaging that needs to stay on-message
- Client-facing teams who need a one-page reference

### When NOT to Use

- Complex multi-product portfolios (use Messaging Hierarchy)
- Deep audience segmentation (use Messaging Matrix)
- Category creation stories (use Strategic Narrative)

---

## Messaging Hierarchy

A layered pyramid that organizes messaging from the most abstract (brand promise) down to the most specific (proof points and tone). This is the most comprehensive framework type — it covers everything from brand-level positioning to tactical verbal guardrails.

### Structure

```
Layer 1: Brand Promise / Mission
  ↓
Layer 2: Positioning Statement
  ↓
Layer 3: Core Message (primary claim)
  ↓
Layer 4: Messaging Pillars (3-4 themes)
  ↓
Layer 5: Proof Points (per pillar)
  ↓
Layer 6: Audience Adaptations
  ↓
Layer 7: Verbal Guardrails (voice, vocabulary, dos/don'ts)
```

### Output Template

```markdown
# Messaging Hierarchy: [Company/Brand]

## Layer 1: Brand Promise
[The aspirational commitment — why the organization exists beyond profit]

## Layer 2: Positioning Statement
For [target audience], [company] is the [category] that [key differentiator], because [reason to believe].

## Layer 3: Core Message
[Primary claim — under 25 words]

## Layer 4: Messaging Pillars

### [Pillar 1 Headline]
**Statement:** [1-2 sentences]
**Proof:** [Evidence list]

### [Pillar 2 Headline]
**Statement:** [1-2 sentences]
**Proof:** [Evidence list]

### [Pillar 3 Headline]
**Statement:** [1-2 sentences]
**Proof:** [Evidence list]

## Layer 5: Audience Adaptations

### [Audience 1]
- **Role/context:** [Who they are]
- **Primary concern:** [What they care about]
- **Lead pillar:** [Which pillar resonates most]
- **Adapted message:** [Core message reframed]
- **Key proof:** [Most relevant evidence]

### [Audience 2]
[Same structure]

## Layer 6: Verbal Guardrails

### Voice Attributes
[3-5 adjectives with brief definitions]

### Approved Language
| Use | Instead of |
|-----|------------|
| [Preferred term] | [Avoided term] |

### Elevator Pitch
[30-50 words]

### Message Lengths
- **Tweet/headline:** [Under 15 words]
- **Elevator pitch:** [30-50 words]
- **Short description:** [50-100 words]
- **Full description:** [150-250 words]

## When to Revisit
[Review triggers]
```

### Configuration Options

| Option | Values | Default |
|--------|--------|---------|
| Include brand promise layer | yes/no | yes |
| Include positioning statement | yes/no | yes |
| Message length variants | yes/no | yes |
| Depth of audience adaptations | summary/detailed | detailed |

### When to Use

- Brand messaging from scratch or major refresh
- Organizations without existing messaging infrastructure
- When the framework needs to serve as a long-term reference
- Cross-functional teams that need a comprehensive source of truth

---

## Messaging Matrix

An audience-first framework organized as a grid. Rows are audiences (or personas), columns are messaging components. Each cell contains audience-tailored content. This is the most activation-ready format — it maps directly to content creation and channel planning.

### Structure

```
            │ Pain Points │ Core Message │ Pillar 1    │ Pillar 2    │ Pillar 3    │ Key Proof   │ CTA
────────────┼─────────────┼──────────────┼─────────────┼─────────────┼─────────────┼─────────────┼──────
Audience A  │ [Tailored]  │ [Tailored]   │ [Tailored]  │ [Tailored]  │ [Tailored]  │ [Tailored]  │ [...]
Audience B  │ [Tailored]  │ [Tailored]   │ [Tailored]  │ [Tailored]  │ [Tailored]  │ [Tailored]  │ [...]
Audience C  │ [Tailored]  │ [Tailored]   │ [Tailored]  │ [Tailored]  │ [Tailored]  │ [Tailored]  │ [...]
```

### Output Template

```markdown
# Messaging Matrix: [Company/Product/Campaign]

## Universal Foundation
**Core message:** [The overarching claim that holds across all audiences]
**Positioning:** [Category and differentiation]

## Audience Profiles

### [Audience A]: [Name/Role]
- **Who:** [Brief description]
- **Primary pain point:** [What keeps them up at night]
- **Decision criteria:** [What they evaluate]
- **Vocabulary:** [Terms they use — technical, business, consumer]
- **Skepticism:** [What they doubt or push back on]

### [Audience B]: [Name/Role]
[Same structure]

## Message Matrix

| Component | [Audience A] | [Audience B] | [Audience C] |
|-----------|-------------|-------------|-------------|
| **Headline** | [Tailored] | [Tailored] | [Tailored] |
| **Pain point** | [Tailored] | [Tailored] | [Tailored] |
| **Core message** | [Reframed] | [Reframed] | [Reframed] |
| **Lead pillar** | [Pillar X] | [Pillar Y] | [Pillar Z] |
| **Key proof** | [Most relevant] | [Most relevant] | [Most relevant] |
| **Objection** | [Top concern] | [Top concern] | [Top concern] |
| **Response** | [Rebuttal] | [Rebuttal] | [Rebuttal] |
| **CTA** | [Next step] | [Next step] | [Next step] |

## Pillar Detail
[Full pillar descriptions with proof — shared foundation that the matrix draws from]

## Verbal Guardrails
[Voice, vocabulary, dos/don'ts]

## When to Revisit
[Review triggers]
```

### Configuration Options

| Option | Values | Default |
|--------|--------|---------|
| Number of audiences | 2-6 | 3 |
| Include objection handling | yes/no | yes |
| Include channel-specific variants | yes/no | no |
| Matrix density | summary/detailed | summary |

### When to Use

- Sales enablement across multiple buyer personas
- Content planning for multi-audience campaigns
- Organizations with diverse stakeholder groups
- When the question is "what do we say to whom"

---

## Strategic Narrative

A story-driven framework built around a transformation arc. Rather than listing features and benefits, it positions the company as a guide through a market shift. Influenced by Andy Raskin's strategic narrative methodology and Donald Miller's StoryBrand.

### Structure

```
Act 1: The Old World (how things used to work)
  ↓
Act 2: The Shift (what changed — why the old way no longer works)
  ↓
Act 3: The New World (the emerging reality for those who adapt)
  ↓
Act 4: Your Role (how this company/product enables the transition)
  ↓
Act 5: The Proof (evidence that this isn't just a story)
  ↓
Epilogue: The Stakes (what happens if you don't act)
```

### Output Template

```markdown
# Strategic Narrative: [Company/Category]

## The Narrative Arc

### Act 1: The Old World
[2-3 sentences describing how the market/industry/practice used to work. This should be recognizable — the audience should nod along.]

### Act 2: The Shift
[2-3 sentences describing the change that makes the old way unsustainable. This is the "why now" — the external force that creates urgency. Not "our product exists" but "the world changed."]

### Act 3: The New World
[2-3 sentences painting a picture of what winners look like in the new reality. This is aspirational but concrete — not utopian, but achievable.]

### Act 4: Your Role
[2-3 sentences positioning the company as the guide that helps the audience navigate from old to new. Not the hero — the guide. The audience is the hero.]

### Act 5: The Proof
[Evidence that this transformation is real and that the company has enabled it]

**Quantitative:**
- [Data point]
- [Data point]

**Customer stories:**
- [Brief case example]
- [Brief case example]

**Third-party validation:**
- [Analyst quote, award, or recognition]

### The Stakes
[1-2 sentences on what happens to organizations that don't adapt. Not fear-mongering — clear-eyed consequence.]

## Derived Messages

### Core message
[Distilled from the narrative arc — under 25 words]

### Elevator pitch
[30-50 words — the narrative compressed for verbal delivery]

### Pillar extraction
[3-4 pillars derived from the narrative — each maps to a section of the arc]

## Audience Adaptations
[How to tell this story to different audiences — which act to emphasize, which proof to lead with]

## When to Revisit
[Review triggers — especially: when the "shift" is no longer news]
```

### Configuration Options

| Option | Values | Default |
|--------|--------|---------|
| Narrative tone | visionary/pragmatic/urgent | pragmatic |
| Include derived pillars | yes/no | yes |
| Include audience adaptations | yes/no | yes |
| Competitor "old world" framing | explicit/implicit | implicit |

### When to Use

- Category creation ("we're defining a new space")
- Investor presentations and fundraising narratives
- Thought leadership positioning
- Major pivots or rebrand stories
- When the company's value is best understood through a "before and after"

---

## Product Messaging

A feature-benefit-proof structure organized around a specific product or service. More tactical than the other types — it's designed to produce sales-ready messaging that maps directly to product capabilities.

### Structure

```
Product Positioning Statement
  ↓
Feature-Benefit-Proof Table (per capability)
  ↓
Competitive Differentiation Matrix
  ↓
Audience-Specific Emphasis
  ↓
Objection Handling
```

### Output Template

```markdown
# Product Messaging: [Product Name]

## Positioning Statement
For [target audience] who [need/pain point], [product name] is a [category] that [key benefit]. Unlike [primary alternative], [product name] [key differentiator].

## Value Proposition
[2-3 sentences expanding the positioning statement with the "so what" — why this matters to the buyer]

## Feature-Benefit-Proof Table

| Feature | Benefit | Proof |
|---------|---------|-------|
| [Capability 1] | [What it enables for the user] | [Evidence — data, case study, demo] |
| [Capability 2] | [What it enables] | [Evidence] |
| [Capability 3] | [What it enables] | [Evidence] |
| [Capability 4] | [What it enables] | [Evidence] |

## Competitive Differentiation

### Category Alternatives
| Alternative | Their Approach | Our Approach | Why It Matters |
|------------|---------------|-------------|----------------|
| [Competitor/category] | [How they solve it] | [How we solve it] | [Buyer impact] |

### Unique Capabilities
[1-3 capabilities that no direct competitor offers, with proof]

## Audience-Specific Emphasis

### [Buyer Persona 1]
- **Leads with:** [Which features/benefits to highlight]
- **Proof that resonates:** [Specific evidence for this persona]
- **Key message:** [One sentence — product value in their language]

### [Buyer Persona 2]
[Same structure]

## Objection Handling

| Objection | Response | Supporting Proof |
|-----------|----------|-----------------|
| "[Common pushback 1]" | [Reframe + evidence] | [Specific proof point] |
| "[Common pushback 2]" | [Reframe + evidence] | [Specific proof point] |

## Message Variants

- **Headline:** [Under 15 words]
- **Elevator pitch:** [30-50 words]
- **Short description:** [50-100 words]
- **Full description:** [150-250 words]

## When to Revisit
[Review triggers — especially: new features, new competitors, pricing changes]
```

### Configuration Options

| Option | Values | Default |
|--------|--------|---------|
| Include competitive matrix | yes/no | yes |
| Include objection handling | yes/no | yes |
| Number of buyer personas | 1-4 | 2 |
| Include message length variants | yes/no | yes |
| Feature depth | highlights-only/comprehensive | highlights-only |

---

## Choosing Between Types

When the user isn't sure which type they need, use this decision tree:

```
Is this about a specific product or service?
  → Yes: Product Messaging
  → No: Continue

Are you creating or defining a new category?
  → Yes: Strategic Narrative
  → No: Continue

Do you have 3+ distinct audiences who need different messaging?
  → Yes: Messaging Matrix
  → No: Continue

Are you building brand-level messaging from scratch?
  → Yes: Messaging Hierarchy
  → No: Message House (the safe default)
```

**Combining types**: It's common for organizations to maintain multiple framework types simultaneously. A Messaging Hierarchy provides the long-term brand foundation, while a Messaging Matrix activates it for specific audiences, and Product Messaging covers individual offerings. The types are complementary, not exclusive. When a user asks for "comprehensive messaging," consider whether 2-3 types together serve them better than one.
