# Company Data Schema Reference

This reference documents the complete schema for company data stored in `client-data/clients/<company-name>/`.

## Directory Structure

```
client-data/clients/<company-name>/
├── profile.json          # Company identity, services, pricing, credentials, legal
├── people.json           # People registry — contact details, roles (author/spokesperson/approver)
├── brand/
│   ├── charter.json      # Visual identity
│   ├── logo.png          # Primary logo
│   ├── logo_white.png    # White/reversed logo (optional)
│   └── templates/        # Format-specific templates (optional)
│       ├── pptx/
│       └── docx/
└── proposals/
    ├── case-studies.json
    ├── team-bios.json
    ├── methodologies.json
    ├── boilerplate.json
    ├── testimonials.json
    ├── differentiators.json
    └── partnerships.json
```

## profile.json

Top-level company identity and operational data.

### `company` (required)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Legal or trading name |
| `tagline` | string | One-line value proposition |
| `description` | string | 2-3 sentence company description |
| `founded` | number | Year founded |
| `headquarters.city` | string | City name |
| `headquarters.country` | string | Country name |
| `website` | string | Company website URL |
| `email` | string | Proposals/contact email |
| `phone` | string | Main phone number |

### `services[]` (required)

Array of services the company offers.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., `"svc-001"`) |
| `name` | string | Service name |
| `description` | string | What the service includes |
| `industries` | string[] | Target industries |
| `deliverables` | string[] | Typical outputs |
| `typicalDuration` | string | Expected engagement length |
| `pricingModel` | string | Reference to `pricing.models[].id` |

### `pricing` (required)

| Field | Type | Description |
|-------|------|-------------|
| `models[]` | array | Available pricing models |
| `models[].id` | string | Unique identifier (e.g., `"price-001"`) |
| `models[].name` | string | Model name (e.g., "Time & Materials", "Fixed Fee") |
| `models[].rates[]` | array | Rate card (for T&M models) |
| `models[].rates[].role` | string | Role title |
| `models[].rates[].amount` | number | Rate amount |
| `models[].rates[].currency` | string | Currency code |
| `models[].rates[].per` | string | Rate unit (e.g., "hour", "day") |
| `models[].description` | string | Description for non-rate models |
| `paymentTerms` | string | Payment terms (e.g., "Net 30") |
| `discounts[]` | array | Available discounts |
| `discounts[].type` | string | Discount trigger |
| `discounts[].description` | string | Discount details |

### `credentials` (optional)

| Field | Type | Description |
|-------|------|-------------|
| `certifications[]` | array | Formal certifications |
| `certifications[].name` | string | Certification name |
| `certifications[].issuer` | string | Issuing body |
| `certifications[].validTo` | string | Expiry date (YYYY-MM) |
| `awards[]` | array | Awards and recognitions |
| `awards[].name` | string | Award name |
| `awards[].issuer` | string | Awarding body |
| `awards[].year` | number | Year awarded |
| `memberships[]` | array | Professional memberships |
| `memberships[].organization` | string | Organization name |
| `memberships[].status` | string | Membership status |

### `legal` (optional)

| Field | Type | Description |
|-------|------|-------------|
| `standardTerms.ip` | string | IP ownership terms |
| `standardTerms.confidentiality` | string | Confidentiality provisions |
| `standardTerms.liability` | string | Liability limitations |
| `standardTerms.termination` | string | Termination provisions |
| `insurances[]` | array | Insurance coverage |
| `insurances[].type` | string | Insurance type |
| `insurances[].coverage` | number | Coverage amount |
| `insurances[].currency` | string | Currency code |

---

## brand/charter.json

Unified visual identity covering all output formats.

### `colors` (required)

| Field | Type | Description |
|-------|------|-------------|
| `primary` | string | Primary brand color (hex) — headings, accents |
| `secondary` | string | Secondary color (hex) — subheadings, borders |
| `accent` | string | Accent color (hex) — highlights, CTAs |
| `background` | string | Background color (hex) |
| `backgroundAlt` | string | Alternate background (hex) — tables, cards |
| `text` | string | Primary text color (hex) |
| `textLight` | string | Secondary text color (hex) |
| `success` | string | Success/positive color (hex) |
| `warning` | string | Warning color (hex) |
| `error` | string | Error/negative color (hex) |

### `fonts` (required)

| Field | Type | Description |
|-------|------|-------------|
| `heading.family` | string | Heading font (must be web-safe for PPTX) |
| `heading.fallback` | string | Fallback font stack |
| `heading.weight` | string | Font weight |
| `body.family` | string | Body font |
| `body.fallback` | string | Fallback font stack |
| `body.weight` | string | Font weight |
| `mono.family` | string | Monospace font |
| `mono.fallback` | string | Fallback font stack |
| `mono.weight` | string | Font weight |

### `logo` (required)

| Field | Type | Description |
|-------|------|-------------|
| `primary` | string | Primary logo filename (relative to `brand/`) |
| `white` | string | White/reversed logo filename |
| `icon` | string | Icon/favicon (optional) |
| `maxWidth` | string | Maximum logo width (e.g., "120pt") |
| `maxHeight` | string | Maximum logo height (e.g., "50pt") |

### `document` (optional — DOCX-specific)

| Field | Type | Description |
|-------|------|-------------|
| `margins.top` | string | Top margin (e.g., "1in") |
| `margins.bottom` | string | Bottom margin |
| `margins.left` | string | Left margin |
| `margins.right` | string | Right margin |
| `header.content` | string | Header template (supports `{{company.name}}`, `{{project.title}}`) |
| `header.logo` | boolean | Show logo in header |
| `footer.content` | string | Footer text (e.g., "Confidential") |
| `footer.pageNumbers` | boolean | Show page numbers in footer |
| `headingColor` | string | Key from `colors` to use for headings (e.g., "primary") |
| `tableHeaderColor` | string | Key from `colors` for table headers |

### `presentation` (optional — PPTX-specific)

| Field | Type | Description |
|-------|------|-------------|
| `slideMargin` | string | Slide content margin |
| `titleMargin` | string | Title area margin |
| `contentMargin` | string | Content area margin |
| `aspectRatio` | string | Aspect ratio (e.g., "16:9", "4:3") |

### `video` (optional — Remotion-specific)

| Field | Type | Description |
|-------|------|-------------|
| `resolution` | string | Video resolution (e.g., "1920x1080") |
| `fps` | number | Frames per second |

---

## people.json

Top-level people registry — structured contact and role data for document authoring, spokesperson selection, and approval workflows. Links to `team-bios.json` (rich narrative bios) and `spokespersons.json` (quote style, topic expertise) via shared `id`.

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Shared with `team-bios.json` and `spokespersons.json` |
| `name` | Yes | string | Full name |
| `title` | Yes | string | Job title |
| `email` | Yes | string | Direct email |
| `phone` | No | string | Direct phone |
| `roles` | Yes | string[] | `"author"`, `"spokesperson"`, `"approver"`, `"mediaContact"` |
| `default` | No | boolean | Auto-select for document authoring if `true` |

### Author Discovery

1. Check `people.json` → filter by `roles` containing `"author"`
2. One person with `"default": true` → auto-select, confirm
3. Multiple authors, no default → ask user
4. No `people.json` → fall back to `profile.json`

---

## proposals/case-studies.json

Array of past performance case studies.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., `"CS-001"`) |
| `title` | string | Case study title |
| `client.name` | string | Client name (or "Confidential") |
| `client.industry` | string | Client's industry |
| `client.namePublic` | boolean | Whether the client name can be used publicly |
| `tags` | string[] | Searchable tags for matching |
| `challenge` | string | Client's challenge/problem statement |
| `approach` | string | What the firm did |
| `results.summary` | string | Overall results narrative |
| `results.metrics[]` | array | Quantified outcomes |
| `results.metrics[].measure` | string | What was measured |
| `results.metrics[].value` | number | Numeric value |
| `results.metrics[].unit` | string | Unit of measurement |
| `timeframe.start` | string | Start date (YYYY-MM) |
| `timeframe.end` | string | End date (YYYY-MM) |
| `budget` | string | Engagement budget (free text) |
| `team` | string[] | References to `team-bios.json` → `[].id` |
| `services` | string[] | References to `profile.json` → `services[].id` |
| `short` | string | 50-word version for inline references |
| `long` | string | 500-word version for dedicated sections |
| `lastReviewed` | string | Date last reviewed (YYYY-MM) — optional, for content freshness tracking |

---

## proposals/team-bios.json

Array of key personnel with role-variant biographies.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., `"person-001"`) |
| `name` | string | Full name |
| `title` | string | Job title |
| `photo` | string | Photo path (relative to company dir) |
| `expertise` | string[] | Expertise tags for matching |
| `certifications[]` | array | Professional certifications |
| `certifications[].name` | string | Certification name |
| `certifications[].issuer` | string | Issuing body |
| `certifications[].current` | boolean | Is certification current |
| `education[]` | array | Educational background |
| `education[].degree` | string | Degree name |
| `education[].institution` | string | Institution name |
| `yearsExperience` | number | Total years of relevant experience |
| `executive` | string | Executive-audience bio (2-3 sentences, emphasis on business impact) |
| `technical` | string | Technical-audience bio (2-3 sentences, emphasis on skills and tools) |
| `short` | string | One-line bio for tables and lists |
| `lastReviewed` | string | Date last reviewed (YYYY-MM) — optional, for content freshness tracking |

### Bio Variant Selection

- **Executive audience** → use `executive` bio in Team & Qualifications section
- **Technical audience** → use `technical` bio
- **Condensed format** → use `short` bio

---

## proposals/methodologies.json

Array of standard approaches and frameworks.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., `"meth-001"`) |
| `name` | string | Methodology name |
| `tags` | string[] | Searchable tags |
| `summary` | string | One-sentence description |
| `phases[]` | array | Methodology phases |
| `phases[].name` | string | Phase name |
| `phases[].description` | string | Phase activities and outputs |
| `differentiators` | string[] | What makes this approach unique |
| `applicableServices` | string[] | References to `profile.json` → `services[].id` |
| `lastReviewed` | string | Date last reviewed (YYYY-MM) — optional, for content freshness tracking |

---

## proposals/boilerplate.json

Reusable text blocks for standard proposal sections.

### `assumptions[]`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `category` | string | Category (General, Travel, Technical, etc.) |
| `text` | string | Assumption text |

### `disclaimers[]`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `category` | string | Category (Projection, Scope, Third Party, etc.) |
| `text` | string | Disclaimer text |

### `legalTerms[]`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `category` | string | Category (IP, Confidentiality, Liability, etc.) |
| `title` | string | Term title |
| `text` | string | Full legal text |

---

## proposals/testimonials.json

Array of client quotes and references.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `quote` | string | The testimonial quote |
| `attribution` | string | Who said it (title + company) |
| `caseStudy` | string | Reference to `case-studies.json` → `[].id` |
| `tags` | string[] | Searchable tags |
| `year` | number | Year of testimonial |
| `lastReviewed` | string | Date last reviewed (YYYY-MM) — optional, for content freshness tracking |

---

## proposals/differentiators.json

Array of reusable win themes and competitive positioning statements.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., `"diff-001"`) |
| `theme` | string | Win theme name (e.g., "Speed to Value") |
| `headline` | string | One-sentence positioning statement |
| `evidence` | string[] | References to `case-studies.json` → `[].id` |
| `applicableServices` | string[] | References to `profile.json` → `services[].id` |
| `tags` | string[] | Searchable tags |
| `ghostStatement` | string | Optional competitive positioning (highlights strength without naming competitors) |
| `lastReviewed` | string | Date last reviewed (YYYY-MM) |

---

## proposals/partnerships.json

Array of technology and strategic partnerships.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g., `"part-001"`) |
| `partner` | string | Partner organization name |
| `level` | string | Partnership tier (e.g., "Gold Partner", "Strategic Alliance") |
| `relevantServices` | string[] | References to `profile.json` → `services[].id` |
| `proofPoint` | string | One-sentence credibility statement |
| `tags` | string[] | Searchable tags |
| `lastReviewed` | string | Date last reviewed (YYYY-MM) |

---

## Cross-Reference Map

IDs create a web of references across files:

```
profile.json                    proposals/case-studies.json
  services[].id ──────────────→   [].services[]
  pricing.models[].id              [].team[] ──→ proposals/team-bios.json → [].id

people.json
  [].id ──────────────────────→ proposals/team-bios.json → [].id
  [].id ──────────────────────→ press-releases/spokespersons.json → [].personId

press-releases/spokespersons.json
  [].personId ────────────────→ people.json → [].id

proposals/methodologies.json
  [].applicableServices[] ────→ profile.json → services[].id

proposals/testimonials.json
  [].caseStudy ───────────────→ proposals/case-studies.json → [].id

proposals/differentiators.json
  [].evidence[] ──────────────→ proposals/case-studies.json → [].id
  [].applicableServices[] ────→ profile.json → services[].id

proposals/partnerships.json
  [].relevantServices[] ──────→ profile.json → services[].id
```

When assembling a proposal:
1. Identify relevant services from the brief → `profile.json` → `services[].id`
2. Find case studies that match → `case-studies.json` → filter by `services[]` or `tags[]`
3. Find team members from those case studies → `team-bios.json` → filter by `id` in case study's `team[]`
4. Find applicable methodology → `methodologies.json` → filter by `applicableServices[]`
5. Find testimonials for selected case studies → `testimonials.json` → filter by `caseStudy`
6. Find win themes → `differentiators.json` → filter by `applicableServices[]` or `tags[]`
7. Find partnership proof points → `partnerships.json` → filter by `relevantServices[]`

## Bootstrapping a New Company Profile

1. Copy the example: `cp -r client-data/clients/_example client-data/clients/<name>`
2. Edit `profile.json` — fill in all company identity, services, and pricing
3. Edit `brand/charter.json` — set your colors, fonts, and logo references
4. Add logo files to `brand/`
5. Replace example content in `proposals/`:
   - Add real case studies to `case-studies.json`
   - Add team members to `team-bios.json`
   - Add or modify methodologies in `methodologies.json`
   - Update boilerplate in `boilerplate.json` with your standard terms
   - Add testimonials to `testimonials.json`
   - Add win themes and differentiators to `differentiators.json`
   - Add technology and strategic partnerships to `partnerships.json`
6. Ensure all cross-references are valid (team IDs in case studies, service IDs in methodologies, case study IDs in differentiators)
