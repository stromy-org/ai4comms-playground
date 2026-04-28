# Audience Adaptation Reference

Techniques for building audience-specific messaging layers while maintaining core message coherence. Load this during Phase 4, Step 4.

## Table of Contents

1. [Core Principle](#core-principle)
2. [What Changes Per Audience](#what-changes-per-audience)
3. [Audience Profile Template](#audience-profile-template)
4. [Adaptation Techniques](#adaptation-techniques)
5. [Common Audience Types](#common-audience-types)
6. [Multi-Audience Conflicts](#multi-audience-conflicts)

---

## Core Principle

One core story, many audience-specific expressions. The fundamental claim stays stable — you are not creating separate messaging for each audience. You are adjusting emphasis, vocabulary, proof selection, and framing so that each audience hears the same truth in a way that connects to their priorities.

Think of it like a prism: one beam of white light enters, multiple colors emerge. The light source (core message) doesn't change — the angle of reception does.

**When adaptation works:** A CFO and a developer both hear "we reduce deployment risk." The CFO's version emphasizes the financial impact of production incidents; the developer's version emphasizes automated testing and rollback capabilities. Same claim, different lens.

**When adaptation breaks:** If the CFO version says "we save money" and the developer version says "we increase velocity" and these are actually different claims — you don't have audience adaptation, you have two competing messages. Go back to the core message and find the claim that holds for both.

---

## What Changes Per Audience

| Element | What Stays Stable | What Changes |
|---------|------------------|-------------|
| **Core message** | The fundamental claim | The framing and emphasis |
| **Pillars** | The themes themselves | Which pillar leads (priority order) |
| **Proof** | The evidence base | Which proof points are selected for this audience |
| **Vocabulary** | The meaning | The words used — technical vs. business vs. consumer |
| **Objections** | The fact that skepticism exists | What specifically this audience doubts |
| **CTA** | The general direction | The specific next step for this audience |

---

## Audience Profile Template

For each audience, build a profile before writing adapted messaging. This ensures the adaptation is grounded in understanding, not assumption.

```markdown
### [Audience Name]

**Who they are:** [Role, context, decision-making authority]
**What they care about:** [Top 2-3 priorities in their professional life]
**Pain points:** [What frustrates them about the current state]
**Decision criteria:** [How they evaluate solutions — what tips the scale]
**Vocabulary:** [Terms they use, jargon they expect or reject]
**Information sources:** [Where they go for trusted information]
**Skepticism:** [What they're most likely to doubt or push back on]
**Success metric:** [How they personally measure whether this was a good decision]
```

### Building Profiles from Company Data

When company data is available, construct profiles from:

- `messaging/audiences.json` → Pre-built audience profiles (if they exist)
- `profile.json` → `services[].industries` → Suggests audience industries
- `messaging/proof-points.json` → `tags` → Shows which industries have evidence
- `messaging/audiences.json` → existing audience profiles (if available)

When data is sparse, build a minimal profile with the user: just "who, what they care about, and what makes them skeptical" is enough to start.

---

## Adaptation Techniques

### Technique 1: Pillar Priority Reordering

The same 3-4 pillars apply to all audiences, but the lead pillar shifts. The pillar that addresses this audience's primary concern goes first.

**Example:**
- Pillars: Speed, Security, Scalability
- For developers → Lead with Speed ("deploy 10x faster")
- For CISOs → Lead with Security ("zero-trust architecture")
- For CTOs → Lead with Scalability ("handles 10M concurrent users")

### Technique 2: Vocabulary Translation

Rewrite the same claim using the audience's native language. This isn't dumbing down — it's precision.

| Claim | Technical Audience | Business Audience | Consumer Audience |
|-------|-------------------|-------------------|-------------------|
| "We reduce risk" | "Automated rollback on failed deployments" | "85% fewer production incidents = lower incident cost" | "Your app just works, every time" |
| "We save time" | "CI/CD pipeline runs in 3 minutes" | "Teams ship features 3x faster" | "Get what you need, faster" |

### Technique 3: Proof Selection

Each audience trusts different evidence. Don't show all proof to all audiences — select the 2-3 most relevant proof points per pillar per audience.

**Selection criteria:**
1. **Context match** — Proof from a similar industry, company size, or role
2. **Type match** — Technical audiences trust capability proof; executives trust quantitative proof (see proof-taxonomy.md)
3. **Recency** — More recent evidence is more credible across all audiences

### Technique 4: "So What" Reframing

The same proof point can be framed differently for different audiences by answering a different "so what."

**Same proof:** "NordBank AG reduced onboarding from 72 hours to 4 hours"
- **For operations leaders:** "So your team handles 18x more customers without adding headcount"
- **For the CEO:** "So you capture revenue faster and reduce customer churn during onboarding"
- **For IT leaders:** "So your legacy system consolidation delivers measurable ROI within 6 months"

### Technique 5: Objection-Specific Messaging

Each audience has different objections. Address the top 1-2 per audience — not all objections for all audiences.

**Format:**
```
Objection: "[What they say or think]"
Response: [Acknowledge the concern, reframe, provide proof]
Supporting proof: [The specific evidence that addresses this objection]
```

---

## Common Audience Types

Pre-built adaptation patterns for frequently encountered audience segments. Use these as starting points — adjust based on actual audience research.

### External Audiences

**Customers / Prospects**
- Care about: Solving their problem, ROI, risk reduction, ease of adoption
- Lead with: Benefits and customer evidence
- Vocabulary: Outcome-oriented, industry-specific
- Skepticism: "Is this really different from what we have?" "What's the switching cost?"

**Investors / Board**
- Care about: Market size, competitive moat, unit economics, growth trajectory
- Lead with: Strategic narrative and quantitative proof
- Vocabulary: Financial, market-oriented
- Skepticism: "Is this a big enough market?" "Can you defend this position?"

**Media / Analysts**
- Care about: Newsworthiness, trend connection, credible data, unique angle
- Lead with: Third-party validation and quantitative proof
- Vocabulary: Clear, jargon-free, quotable
- Skepticism: "Why should anyone care?" "Is this actually new?"

**Partners / Channels**
- Care about: Joint value creation, ease of integration, revenue opportunity
- Lead with: Capability proof and quantitative (joint outcomes)
- Vocabulary: Partnership-oriented, integration-focused
- Skepticism: "How much effort to integrate?" "What's in it for our customers?"

### Internal Audiences

**Employees / All-hands**
- Care about: Purpose, impact, job security, pride in the company
- Lead with: Narrative (why we exist, what we've achieved) and customer evidence
- Vocabulary: Inclusive, human, purpose-driven
- Skepticism: "Is leadership being straight with us?" "How does this affect my job?"

**Sales Team**
- Care about: Language they can use in conversations, objection responses, competitive positioning
- Lead with: Feature-benefit-proof tables and objection handling
- Vocabulary: Buyer-focused, conversational, specific
- Skepticism: "Will customers actually respond to this?" "What about [competitor]?"

**Executive Sponsors / Leadership**
- Care about: Strategic alignment, competitive differentiation, talent and brand impact
- Lead with: Positioning and strategic narrative
- Vocabulary: Strategic, concise, decision-oriented
- Skepticism: "Is this differentiated enough?" "How do we know it's working?"

---

## Multi-Audience Conflicts

Sometimes audiences have competing interests that create tension in messaging. These are common scenarios and how to handle them.

### Employees vs. Investors (during cost-cutting)
- **Tension:** Investors want efficiency gains; employees fear layoffs
- **Resolution:** Shared pillar of "sustainable growth" with audience-specific proof — investor version emphasizes margin improvement, employee version emphasizes reinvestment in capability building

### Technical vs. Business Buyers (in B2B)
- **Tension:** Technical buyers want depth and specifics; business buyers want outcomes and simplicity
- **Resolution:** Core message stays at the outcome level. Technical details live in supporting proof, not in the core framework. Audience adaptation gives technical buyers permission to go deeper without overwhelming business buyers.

### Existing vs. New Customers
- **Tension:** New customers need "why choose us"; existing customers need "why stay / upgrade"
- **Resolution:** Shared pillar of core value. New customer adaptation emphasizes switching benefits; existing customer adaptation emphasizes continuous improvement and loyalty recognition.

### General Public vs. Regulators
- **Tension:** Public messaging aims for inspiration; regulatory messaging requires precision and caution
- **Resolution:** Core message is factual and defensible. Public adaptation adds narrative and aspiration; regulatory adaptation strips to verifiable claims only. Flag any language that works for public but creates regulatory risk.

### When Conflicts Can't Be Resolved

If audience adaptations create genuine contradictions (not just different emphasis), the core message needs work. A message that requires opposite claims for different audiences isn't a coherent message — it's two messages pretending to be one. Surface this conflict in Phase 3 (architecture proposal) so the user can make a strategic decision about which audience to prioritize.
