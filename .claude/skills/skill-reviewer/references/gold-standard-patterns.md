# Gold Standard Patterns

Architectural patterns extracted from the highest-scoring skills (pptx, proposal, docx). Use these as blueprints when reviewing or adapting skills.

---

## Three-Layer Architecture

The pptx chain demonstrates the ideal modularity pattern:

```
Layer 1: Base Skill (generic logic)
  └── pptx/SKILL.md — reading, creating, editing workflows
  └── pptx/scripts/ — generic build tools (html2pptx, unpack)
  └── pptx/ooxml/ — raw XML manipulation utilities

Layer 2: Branded Layer (templates + rendering)
  └── pptx/scripts/build-branded.js — brand-aware build scaffold
  └── CSS variables injected from charter: var(--color-primary), var(--font-heading)
  └── brandedSlide() helper wraps HTML with brand CSS
  └── Template selection based on use case

Layer 3: Company Data (client-data/clients/)
  └── charter.json — colors, fonts, logo paths, spacing
  └── images/ — photography for cover/divider slides
  └── profile.json — company identity (used for title slides, footers)
  └── proposals/*.json — case studies, bios, etc. (used by proposal layer)
```

**Key insight:** Each layer adds specialization without modifying the layer below. A generic pptx build works without any brand data. Adding a charter adds brand consistency. Adding content library adds automated content selection.

---

## Charter Discovery Pattern

Standard procedure for finding and loading brand data:

```
1. CHECK: Does client-data/clients/ exist?
   └── No → Skip brand integration, use generic defaults
   └── Yes → Continue

2. DISCOVER: List companies in client-data/clients/
   └── One company → Use it by default
   └── Multiple → Ask user which company (or infer from context)
   └── None (only _example/) → Skip brand integration

3. READ: Load client-data/clients/<name>/charter.json
   └── Extract colors: primary, secondary, accent, background, text
   └── Extract fonts: heading (family + weight), body (family + weight)
   └── Extract logo: path(s), max dimensions
   └── Extract format-specific settings (presentation.slideMargin, document.margins, etc.)

4. FALLBACK: If any charter field is missing
   └── Use sensible defaults (dark text, system fonts, no logo)
   └── Never fail — missing data degrades gracefully
```

**Implementation in build scripts:**
```javascript
const BRAND_DIR = path.resolve(__dirname, '../../client-data/clients/<name>/brand');
const charter = JSON.parse(fs.readFileSync(path.join(BRAND_DIR, 'charter.json'), 'utf-8'));
const logoPath = path.resolve(BRAND_DIR, charter.logo.primary);
```

---

## Content Library Assembly Pattern

How `proposal` maps content library items to output sections:

```
1. READ: Load all content files
   └── case-studies.json → past performance
   └── team-bios.json → key personnel
   └── methodologies.json → approaches/frameworks
   └── boilerplate.json → assumptions, disclaimers, legal
   └── testimonials.json → client quotes

2. MATCH: Select items by tags, service IDs, industry
   └── case-studies: filter by tags (industry, service type)
   └── team-bios: filter by expertise tags
   └── methodologies: filter by applicableServices
   └── testimonials: filter by tags and caseStudy reference

3. SELECT VARIANT: Choose appropriate depth/format
   └── case-studies: use short or long variant
   └── team-bios: use executive, technical, or short variant
   └── boilerplate: select by category (assumptions, disclaimers, legalTerms)

4. MAP: Assign selected items to output sections
   └── Approach → matched methodology
   └── Team → matched bios (variant by audience)
   └── Experience → matched case studies (variant by depth)
   └── Terms → standard legal terms + engagement-specific assumptions
   └── Proof Points → matched testimonials (inline throughout)
```

**Key design:** Content selection is tag-driven, not hardcoded. The same content library serves proposals, RFPs, presentations, and capability statements — each skill selects what it needs.

---

## Build Script Scaffold Pattern

Standard approach for workspace builds with brand integration:

```
1. COPY scaffold to workspace:
   mkdir -p workspace/<project>
   cp .claude/skills/<skill>/scripts/build-branded.js workspace/<project>/build.js

2. SET brand directory:
   const BRAND_DIR = path.resolve(__dirname, '../../client-data/clients/<name>/brand');

3. DEFINE content (slides, sections, pages):
   const slides = [
     { title: 'Executive Summary', content: '...', layout: 'title-content' },
     { title: 'Our Approach', content: '...', layout: 'two-column' },
   ];

4. RUN build:
   node workspace/<project>/build.js
   # Output: workspace/<project>/output/<filename>.pptx

5. VERIFY output exists and is non-empty

6. ITERATE (optional): To refine a generated deliverable:
   # Unpack the file from output/
   python ooxml/scripts/unpack.py workspace/<project>/output/<file>.pptx workspace/<project>/unpacked/
   # Edit XML, validate, repack to the same output/ path
```

**Conventions:**
- Use root `node_modules/` via `require('../../node_modules/<pkg>')`
- Never create `package.json` in workspace subdirectories (exception: Remotion projects with `.remotion-project` marker)
- Output always to `workspace/<project>/output/` (Remotion uses `out/`)
- All of `workspace/` is gitignored

---

## Template Placeholder Pattern

How templates accept dynamic values:

### CSS Variables (presentations, HTML output)
```css
:root {
  --color-primary: {{charter.colors.primary}};
  --color-secondary: {{charter.colors.secondary}};
  --font-heading: {{charter.fonts.heading.family}};
  --font-body: {{charter.fonts.body.family}};
}
```

### JavaScript injection
```javascript
// brandedSlide() wraps HTML with brand CSS variables
const html = brandedSlide(`
  <h1 style="color: var(--color-primary); font-family: var(--font-heading)">
    ${slide.title}
  </h1>
  <p style="font-family: var(--font-body)">${slide.content}</p>
`);
```

### Path resolution
```javascript
// Logo and images resolve relative to BRAND_DIR
const logoPath = path.resolve(BRAND_DIR, charter.logo.primary);
const images = fs.readdirSync(path.join(BRAND_DIR, 'images'));
```

---

## Company Data Schema Summary

Quick reference for what's available in each company data file.

### profile.json
- `company` — name, tagline, description, founded, headquarters, contact (email, phone, website)
- `services[]` — id, name, description, industries, deliverables, duration, pricingModel
- `pricing.models[]` — id, name, rates or description
- `credentials` — certifications, awards, memberships
- `legal` — standardTerms (IP, confidentiality, liability, termination), insurances

### charter.json
- `colors` — primary, secondary, accent, background, backgroundAlt, text, textLight, success, warning, error
- `fonts` — heading, body, mono (each: family, fallback, weight)
- `logo` — primary, white (filenames), maxWidth, maxHeight
- `document` — margins, header, footer, headingColor, tableHeaderColor
- `presentation` — slideMargin, titleMargin, contentMargin, aspectRatio
- `video` — resolution, fps

### proposals/case-studies.json
- `id`, `title`, `client` (name, industry, namePublic), `tags`, `challenge`, `approach`, `results` (summary, metrics[]), `timeframe`, `budget`, `team`, `services`, `short`, `long`

### proposals/team-bios.json
- `id`, `name`, `title`, `photo`, `expertise`, `certifications`, `education`, `yearsExperience`, bio variants: `executive`, `technical`, `short`

### proposals/methodologies.json
- `id`, `name`, `tags`, `summary`, `phases[]` (name, description), `differentiators`, `applicableServices`

### proposals/boilerplate.json
- `assumptions[]` — id, category, text
- `disclaimers[]` — id, category, text
- `legalTerms[]` — id, title, text

### proposals/testimonials.json
- `id`, `quote`, `attribution`, `caseStudy` (reference), `tags`, `year`

---

## Consulting Deliverable Quality Patterns

Patterns for skills that produce client-facing consulting deliverables. These deepen the B2B consulting integration beyond brand and content library mechanics.

### Client Lifecycle Integration

Skills that produce client-facing deliverables should be aware of the engagement lifecycle:

| Stage | Purpose | Typical Deliverables | Content Sources |
|-------|---------|---------------------|-----------------|
| **Pre-engagement** | Win the work | Proposals, capability statements, RFP responses | case-studies, team-bios, methodologies, testimonials |
| **Engagement** | Manage the work | SOWs, project plans, status reports, presentations | boilerplate (assumptions, terms), profile (services) |
| **Delivery** | Complete the work | Final reports, handoff documents, training materials | methodologies, case-studies (as examples) |
| **Follow-up** | Extend the relationship | Case studies, testimonials, lessons learned | (new content generated from engagement outcomes) |

The content library (`proposals/*.json`) maps to these stages — skills should document which stage(s) they serve. For example, the `proposal` skill serves pre-engagement; a future `status-report` skill would serve the engagement stage.

### Deliverable Quality Gates

Format and domain skills that produce client-facing output should include validation checks. These can be documented as a checklist in the skill's workflow or implemented as a validation step in build scripts.

**Brand compliance:**
- Charter colors and fonts used consistently (no hardcoded alternatives)
- Logo present where expected (cover pages, headers, footers)
- Document/slide margins match charter specifications

**Scope alignment:**
- Deliverable content addresses the stated engagement scope
- Service offerings referenced match those in `profile.json`
- Team members listed are relevant to the engagement type

**Professional polish:**
- Consistent formatting throughout (heading levels, spacing, alignment)
- No placeholder text remaining (`[TODO]`, `Lorem ipsum`, `XXX`)
- Page/slide numbers present where appropriate
- Date and version information current

**Client-readiness:**
- No internal notes or draft comments visible
- Draft watermarks removed from final versions
- File naming follows a professional convention (e.g., `DukeStrategies-Proposal-ProjectName-v1.0.pdf`)
- Metadata cleaned (author fields, track changes accepted)
