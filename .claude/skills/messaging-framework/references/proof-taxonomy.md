# Proof Taxonomy Reference

How to categorize, select, and attach proof points to messaging pillars. Load this during Phase 4, Step 3 (proof mapping).

## Table of Contents

1. [The Six Proof Types](#the-six-proof-types)
2. [Proof Strength and Selection](#proof-strength-and-selection)
3. [Mapping Proof to Pillars](#mapping-proof-to-pillars)
4. [Proof by Audience](#proof-by-audience)
5. [Proof by Funnel Stage](#proof-by-funnel-stage)
6. [Gap Analysis](#gap-analysis)

---

## The Six Proof Types

Every piece of evidence falls into one of six categories. A strong framework uses at least 3 different types across its pillars — relying on only one type (e.g., all customer quotes) creates a one-dimensional case.

### 1. Quantitative

Hard numbers that can be verified independently.

**Examples:**
- "94% reduction in onboarding time"
- "3.2M EUR annual cost savings"
- "Serving 200+ clinicians across 12 hospitals"
- "NPS score of 72 (industry average: 45)"

**Strength:** Strongest when specific, recent, and independently verifiable. Weak when vague ("significant improvement"), undated, or self-reported without methodology.

**Where to find:** `messaging/proof-points.json` (type: `"quantitative"`), company analytics, product usage data, customer surveys.

### 2. Customer Evidence

Stories and quotes from actual customers or users.

**Examples:**
- Named case studies with before/after results
- Direct customer quotes with attribution
- User reviews from verified platforms
- Net Promoter Score data with sample size

**Strength:** Strongest when named (not anonymous), from a recognizable organization, and from a context similar to the reader's. Testimonials from dissimilar industries or contexts have limited persuasive power.

**Where to find:** `messaging/proof-points.json` (type: `"customer"`), review platforms, customer advisory board feedback.

### 3. Third-Party Validation

Recognition or endorsement from independent authorities.

**Examples:**
- Industry awards ("Best Mid-Market Consultancy, European Consulting Awards 2024")
- Analyst rankings (Gartner, Forrester, IDC)
- Certifications (ISO, SOC2, HIPAA)
- Media coverage or journalist quotes
- Academic research citations

**Strength:** Strong for credibility but weak for differentiation (competitors may hold the same certifications). Most impactful when the validating body is recognized by the target audience.

**Where to find:** `profile.json` → `credentials.certifications`, `credentials.awards`, press coverage archives.

### 4. Capability

Evidence of unique methods, technology, or expertise that competitors cannot easily replicate.

**Examples:**
- Patented technology or proprietary methodology
- Unique team composition or expertise depth
- Architectural or process advantages
- First-mover status in a specific area

**Strength:** Strong for answering "how do you do it differently?" Weak when the capability is common or easily replicable. Most impactful when connected to a specific customer outcome.

**Where to find:** `profile.json` → `services[]`, product documentation, internal methodology descriptions.

### 5. Credibility Markers

Background signals that establish baseline trust.

**Examples:**
- Years in business, company age
- Number of customers served
- Client logos (with permission)
- Market position or share
- Team size, geographic presence

**Strength:** Useful for establishing baseline credibility but rarely persuasive on their own. "20 years in business" is a credibility marker, not a differentiator — competitors have their own version. Use sparingly as supporting context, not as primary proof.

**Where to find:** `profile.json` → `company`, general company facts.

### 6. Narrative

Stories that illustrate transformation or impact through specific examples.

**Examples:**
- Before/after transformation stories
- Customer journey examples ("When they came to us, they were struggling with X. Now they...")
- Founder origin stories that explain the "why"
- Day-in-the-life scenarios showing the product in use

**Strength:** Strong for emotional resonance and memorability. Weaker as standalone evidence — best when paired with quantitative proof. A story without numbers feels anecdotal; numbers without a story feel abstract.

**Where to find:** `messaging/proof-points.json` (type: `"narrative"`), customer interviews, internal knowledge.

---

## Proof Strength and Selection

Not all proof is equal. When selecting which proof points to attach to a pillar, prefer stronger evidence.

### Evidence Strength Hierarchy

| Tier | Description | Example |
|------|-------------|---------|
| **Tier 1** | Named source + specific metric + recent | "NordBank AG reduced onboarding from 72h to 4h (2024)" |
| **Tier 2** | Named source + qualitative outcome | "NordBank AG's CTO calls it 'the most impactful transformation in our history'" |
| **Tier 3** | Anonymous/aggregated + specific metric | "Clients see an average 40% cost reduction" |
| **Tier 4** | Third-party validation without specifics | "Named a Leader by Gartner in the 2024 Magic Quadrant" |
| **Tier 5** | Self-reported claim without evidence | "We deliver industry-leading results" |

**Rule of thumb:** Every pillar should have at least one Tier 1 or Tier 2 proof point. Tier 5 claims should be flagged and either substantiated or removed.

### Selection Criteria

When multiple proof points are available for a pillar, select based on:

1. **Relevance to the audience** — A healthcare case study for a healthcare prospect beats a financial services one
2. **Recency** — More recent evidence is more credible
3. **Specificity** — Specific metrics beat general claims
4. **Variety** — Mix proof types (don't use 3 testimonials — use a metric, a case study, and a certification)
5. **Verifiability** — Evidence the audience could check independently is more trusted

---

## Mapping Proof to Pillars

Each pillar needs a minimum of 2 proof points, ideally from at least 2 different proof types. Here's the mapping process:

### Step 1: Inventory available proof

List all available evidence from company data:
- Scan `messaging/proof-points.json` (if it exists)
- Check `profile.json` → `credentials` for awards and certifications

### Step 2: Categorize by type

Assign each proof point its type (quantitative, customer, third-party, capability, credibility, narrative).

### Step 3: Map to pillars

For each pillar, select the 2-4 most relevant proof points. Prioritize:
- Direct evidence (the proof explicitly demonstrates the pillar's claim)
- Audience-relevant evidence (matches the primary audience's context)
- Type diversity (at least 2 different types per pillar)

### Step 4: Identify gaps

After mapping, check:
- Does any pillar have fewer than 2 proof points? → Flag as weak
- Does any pillar rely on only one proof type? → Suggest diversification
- Are any proof points Tier 5 (unsubstantiated claims)? → Flag for substantiation or removal
- Is any proof shared across 3+ pillars? → It may be doing too much work — or the pillars overlap

---

## Proof by Audience

Different audiences trust different proof types. When building audience adaptations, lead with the proof type that resonates most with each audience.

| Audience | Highest-Impact Proof Types | Lower-Impact |
|----------|---------------------------|-------------|
| **C-suite / executives** | Quantitative (ROI, TCO), Narrative (transformation stories) | Capability details, credibility markers |
| **Technical evaluators** | Capability (architecture, methodology), Quantitative (performance data) | Narrative, credibility markers |
| **End users / practitioners** | Customer evidence (peer stories), Narrative (day-in-the-life) | Third-party validation, quantitative |
| **Investors / board** | Quantitative (market size, growth, unit economics), Third-party validation | Capability, customer evidence |
| **Media / analysts** | Third-party validation, Quantitative (market data), Narrative (trend stories) | Capability details |
| **Internal teams / employees** | Narrative (purpose, impact), Customer evidence (pride in outcomes) | Quantitative, third-party |
| **Partners / channels** | Quantitative (joint outcomes), Capability (integration, ease of partnership) | Narrative, credibility |

---

## Proof by Funnel Stage

The depth and type of proof should escalate as the audience moves through the decision process.

| Stage | Proof Depth | Best Types | Example |
|-------|------------|------------|---------|
| **Awareness** | Light — establish credibility | Credibility markers, third-party validation | "Trusted by 500+ enterprises" |
| **Consideration** | Moderate — demonstrate value | Quantitative (headline metrics), customer evidence (short) | "Clients see 40% cost reduction on average" |
| **Decision** | Heavy — reduce risk | Customer evidence (named, detailed), quantitative (ROI, TCO), capability (how it works) | "NordBank AG reduced onboarding by 94% — here's how" |
| **Retention** | Reinforcing — validate the choice | Narrative (ongoing success), quantitative (continued results) | "Two years later, NordBank continues to..." |

---

## Gap Analysis

After mapping proof to pillars, produce a gap analysis summary for the user.

### Format

```markdown
## Proof Gap Analysis

### Pillar 1: [Name]
- Proof points: 3 ✓
- Type diversity: Quantitative + Customer + Third-party ✓
- Strongest: [Description — Tier 1]
- Gaps: None

### Pillar 2: [Name]
- Proof points: 1 ⚠️ (minimum 2)
- Type diversity: Customer only ⚠️
- Strongest: [Description — Tier 2]
- Gaps: Needs quantitative evidence. Suggested: [specific recommendation]

### Pillar 3: [Name]
- Proof points: 2 ✓
- Type diversity: Quantitative + Credibility markers ⚠️ (credibility markers are weak)
- Strongest: [Description — Tier 3]
- Gaps: Would benefit from named customer evidence. Suggested: [specific recommendation]
```

### Recommendations for Filling Gaps

When proof is missing, suggest concrete next steps rather than generic advice:

- **Missing quantitative proof:** "Do you have data on [specific metric]? Even internal benchmarks or before/after measurements would work."
- **Missing customer evidence:** "Could you share a specific client outcome — even anonymized? A 2-sentence story with a concrete result is more useful than a generic testimonial."
- **Missing third-party validation:** "Have you received any industry recognition, analyst mentions, or media coverage related to this pillar?"
- **Missing capability proof:** "What's unique about your methodology or technology for this area? What would a competitor struggle to replicate?"
