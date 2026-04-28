# Company Data Schema: Messaging Library

Schema reference for the `messaging/` content library directory. This library stores reusable messaging assets that the skill produces and that downstream comms skills (talking-points, media-pitch, campaign-narrative, etc.) can consume.

## Directory Structure

```
client-data/clients/<company-name>/
├── profile.json              # Company identity (shared — all skills)
├── brand/                    # Visual identity (shared — all branded skills)
│   └── charter.json
├── proposals/                # Proposal content library (proposal skill)
│   ├── case-studies.json
│   ├── testimonials.json
│   └── ...
└── messaging/                # Messaging content library (this skill)
    ├── pillars.json          # Reusable messaging pillars with proof attachments
    ├── proof-points.json     # Evidence library organized by type and topic
    ├── audiences.json        # Audience profiles with adaptation parameters
    └── narratives.json       # Core narratives, positioning, elevator pitches
```

---

## pillars.json

Array of messaging pillars with their supporting statements and proof point references.

```json
[
  {
    "id": "pillar-001",
    "headline": "Short headline (3-7 words)",
    "shortStatement": "Single sentence, under 20 words — derivative-ready for battlecards, social, cheat sheets",
    "statement": "1-2 sentence supporting statement expanding the headline",
    "messageLengths": {
      "headline": "Under 10 words",
      "short": "1 sentence",
      "full": "2-3 sentences"
    },
    "proofPointIds": ["proof-001", "proof-002", "proof-003"],
    "scope": "brand",
    "tags": ["digital-transformation", "enterprise"],
    "created": "2026-03-21",
    "lastReviewed": "2026-03-21"
  }
]
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique identifier (e.g., `"pillar-001"`) |
| `headline` | string | yes | Short pillar headline (3-7 words) |
| `shortStatement` | string | yes | Single sentence under 20 words — derivative-ready for battlecards, social posts, cheat sheets |
| `statement` | string | yes | Supporting statement (1-2 sentences) |
| `messageLengths` | object | no | Pre-written message variants: `headline` (under 10 words), `short` (1 sentence), `full` (2-3 sentences) |
| `proofPointIds` | string[] | yes | References to `proof-points.json` entries |
| `scope` | string | yes | `"brand"`, `"product"`, `"campaign"`, or `"initiative"` |
| `tags` | string[] | no | Topic tags for filtering and matching |
| `created` | string | no | ISO date when the pillar was created |
| `lastReviewed` | string | no | ISO date when last reviewed for accuracy |

**`scope` values:**
- `"brand"` — Applies across the entire organization
- `"product"` — Specific to a product or service line
- `"campaign"` — Created for a specific campaign (may be time-limited)
- `"initiative"` — Tied to a strategic initiative

---

## proof-points.json

Array of evidence items, each categorized by type and linked to the pillars they support.

```json
[
  {
    "id": "proof-001",
    "type": "quantitative",
    "claim": "94% reduction in customer onboarding time",
    "source": "NordBank AG engagement, 2024",
    "verified": true,
    "tier": 1,
    "tags": ["digital-transformation", "financial-services", "efficiency"],
    "lastVerified": "2026-01-15"
  }
]
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique identifier (e.g., `"proof-001"`) |
| `type` | string | yes | One of: `"quantitative"`, `"customer"`, `"third-party"`, `"capability"`, `"credibility"`, `"narrative"` |
| `claim` | string | yes | The proof point statement |
| `source` | string | yes | Where this evidence comes from |
| `source` | string | yes | Human-readable origin (e.g., "NordBank AG engagement, 2024") |
| `verified` | boolean | no | Whether this has been fact-checked |
| `tier` | number | no | Evidence strength: 1 (strongest) to 5 (weakest) — see proof-taxonomy.md |
| `tags` | string[] | no | Topic tags for filtering |
| `lastVerified` | string | no | ISO date when last fact-checked |

Proof points are self-contained within the messaging library. When curating evidence that also appears elsewhere in the company data (e.g., a case study used in proposals), copy the relevant claim and source into `proof-points.json` rather than cross-referencing other skills' files.

---

## audiences.json

Array of audience profiles with their adaptation parameters.

```json
[
  {
    "id": "aud-001",
    "name": "Enterprise CTO",
    "type": "external",
    "description": "Chief Technology Officer at enterprise organizations (1000+ employees)",
    "priority": "primary",
    "painPoints": [
      "Legacy system maintenance consuming 60%+ of IT budget",
      "Pressure to deliver digital initiatives faster"
    ],
    "decisionCriteria": [
      "Technical architecture quality",
      "Integration with existing systems",
      "Vendor stability and track record"
    ],
    "vocabulary": {
      "use": ["architecture", "scalability", "integration", "roadmap"],
      "avoid": ["synergy", "leverage", "disrupt"]
    },
    "skepticism": "Concerned about implementation risk and vendor lock-in",
    "pillarPriority": ["pillar-002", "pillar-001", "pillar-003"],
    "preferredProofTypes": ["capability", "quantitative"],
    "adaptedMessage": "Modernize your technology stack without disrupting operations",
    "topObjection": {
      "objection": "We've been burned by transformation projects before",
      "response": "Our phased approach limits risk — 85% of our implementations are delivered on time and on budget",
      "proofId": "proof-005"
    },
    "channels": ["LinkedIn", "tech conferences", "analyst briefings", "direct email"],
    "tags": ["enterprise", "technology", "B2B"]
  }
]
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique identifier |
| `name` | string | yes | Short audience label |
| `type` | string | yes | `"external"` or `"internal"` |
| `description` | string | yes | Who this audience is |
| `priority` | string | yes | `"primary"`, `"secondary"`, or `"tertiary"` |
| `painPoints` | string[] | yes | Top 2-4 pain points |
| `decisionCriteria` | string[] | no | How they evaluate (for external audiences) |
| `vocabulary` | object | no | `use` (preferred terms) and `avoid` (terms to skip) |
| `skepticism` | string | no | Primary source of doubt |
| `pillarPriority` | string[] | no | Ordered list of pillar IDs — which pillar leads for this audience |
| `preferredProofTypes` | string[] | no | Which proof types resonate most |
| `adaptedMessage` | string | no | Core message reframed for this audience |
| `topObjection` | object | no | Primary objection with response and supporting proof |
| `channels` | string[] | no | Preferred channels for reaching this audience (e.g., `"LinkedIn"`, `"conferences"`, `"email"`, `"trade press"`) |
| `tags` | string[] | no | For filtering and matching |

---

## narratives.json

Core narratives, positioning statements, and distilled message variants.

```json
{
  "positioning": {
    "statement": "For [audience], [company] is the [category] that [differentiator], because [reason to believe].",
    "category": "digital transformation advisory",
    "differentiator": "combines strategy depth with implementation follow-through",
    "lastUpdated": "2026-03-21"
  },
  "coreMessage": {
    "full": "The core message — under 25 words",
    "lastUpdated": "2026-03-21"
  },
  "elevatorPitch": {
    "text": "30-50 word version for verbal delivery",
    "lastUpdated": "2026-03-21"
  },
  "tagline": {
    "primary": "Under 10 words",
    "alternatives": ["Alternative 1", "Alternative 2"],
    "lastUpdated": "2026-03-21"
  },
  "messageLengths": {
    "headline": "Under 15 words — for slides, ads, headers",
    "short": "50-100 words — for bios, directory listings, social profiles",
    "full": "150-250 words — for website, brochures, about pages"
  },
  "voice": {
    "attributes": ["confident", "precise", "human"],
    "use": ["proven", "measurable", "accelerate"],
    "avoid": ["revolutionary", "disruptive", "synergy", "best-in-class"],
    "tone": "Authoritative but approachable — we know our domain deeply and explain it clearly"
  },
  "strategicNarrative": {
    "oldWorld": "Description of how things used to work",
    "shift": "What changed — the external force creating urgency",
    "newWorld": "What winners look like in the new reality",
    "yourRole": "How the company enables the transition",
    "stakes": "What happens to those who don't adapt"
  },
  "competitiveContext": {
    "primaryAlternatives": ["Competitor A", "Competitor B"],
    "positioningGaps": ["Speed-to-market", "Regulatory expertise"],
    "competitiveAdvantages": ["Implementation continuity", "European market depth"],
    "lastUpdated": "2026-03-21"
  },
  "frameworkType": "messaging-hierarchy",
  "scope": "brand",
  "version": "1.0",
  "status": "approved",
  "lastFullReview": "2026-03-21",
  "reviewTriggers": [
    "Major product launch or pivot",
    "New competitor enters market",
    "Quarterly review (recommended cadence)"
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `positioning` | object | yes | Positioning statement and its components |
| `coreMessage` | object | yes | The primary message |
| `elevatorPitch` | object | no | 30-50 word verbal version |
| `tagline` | object | no | Short-form distillation |
| `messageLengths` | object | no | Headline, short, and full-length variants |
| `voice` | object | no | Voice attributes and vocabulary guidance |
| `strategicNarrative` | object | no | Transformation arc (populated when Strategic Narrative type is used) |
| `competitiveContext` | object | no | Competitive landscape: `primaryAlternatives`, `positioningGaps`, `competitiveAdvantages`, `lastUpdated` — consumed by battlecard and thought leadership skills |
| `frameworkType` | string | no | Which framework type produced this narrative |
| `scope` | string | no | `"brand"`, `"product"`, `"campaign"`, `"initiative"` |
| `version` | string | no | Semantic version of the messaging framework (e.g., `"1.0"`, `"2.1"`) |
| `status` | string | no | `"draft"`, `"under-review"`, or `"approved"` — downstream skills check this to know if they're building on approved messaging |
| `lastFullReview` | string | no | When the framework was last comprehensively reviewed |
| `reviewTriggers` | string[] | no | Conditions that should trigger a review |

---

## Cross-Reference Map

How files within the messaging library connect to each other and to `profile.json`:

```
profile.json (read-only — shared company identity)
  └── services[].id ──────────────→ pillars.json → tags (match by service area)
  └── credentials.awards ─────────→ proof-points.json (type: "third-party")
  └── credentials.certifications ─→ proof-points.json (type: "third-party")

messaging/pillars.json
  └── [].proofPointIds ───────────→ messaging/proof-points.json → [].id

messaging/audiences.json
  └── [].pillarPriority ──────────→ messaging/pillars.json → [].id
  └── [].topObjection.proofId ────→ messaging/proof-points.json → [].id
```

The messaging library is self-contained — it does not read from or depend on other skills' data directories (`proposals/`, `press-releases/`, etc.). When evidence from those sources is relevant, the user should curate it into `messaging/proof-points.json` during framework creation.
