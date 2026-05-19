# Brand Data Integration

When creating a document for a **specific company or brand**, check for a brand charter before choosing colors and fonts manually. This is optional — when no brand is specified, produce an unbranded document with default styling.

## Discovering brand data

Look for a charter file at `client-data/clients/<name>/charter.json` where `<name>` matches the company the user mentions. If a charter exists, it provides:

- **Colors**: `primary`, `secondary`, `accent`, `background`, `backgroundAlt`, `text`, `textLight`, plus semantic colors (`success`, `warning`, `error`)
- **Fonts**: `heading` (family + weight + fallback), `body` (family + weight + fallback), `mono` (family + fallback)
- **Logo**: filename(s) in `client-data/clients/<name>/` (e.g. `logos/logo.png`) — fields: `primary` (SVG), `png` (raster, preferred for DOCX), `white`/`whitePng` (on dark backgrounds), with `maxWidth`/`maxHeight` bounding box and `"sizing": "contain"`
- **Document settings**: `document.margins` (top/bottom/left/right), `document.header`, `document.footer`, `document.headingColor`, `document.tableHeaderColor`
- **Formatting rules**: `formatting.headingThreshold`, `formatting.accentCycleColors`, `formatting.autoContrastText`

## Applying brand data in docx-js

When a charter exists, read it and map fields to docx-js parameters:

```javascript
const clientDir = path.resolve('client-data/clients/<name>');
const charter = JSON.parse(fs.readFileSync(path.join(clientDir, 'charter.json'), 'utf-8'));

// Margins → Document sections
const margins = charter.document?.margins;
const sectionMargins = margins ? {
  top: convertToTwip(margins.top),
  bottom: convertToTwip(margins.bottom),
  left: convertToTwip(margins.left),
  right: convertToTwip(margins.right),
} : undefined;

// Colors → Heading styles, table headers, accent elements
const primaryColor = charter.colors.primary.replace('#', '');    // e.g. "FF7F66"
const textColor = charter.colors.text.replace('#', '');          // e.g. "807F83"

// Fonts → Paragraph and TextRun font properties
const headingFont = charter.fonts.heading.family;    // e.g. "Tahoma"
const headingFallback = charter.fonts.heading.fallback; // e.g. "Arial, sans-serif"
const bodyFont = charter.fonts.body.family;          // e.g. "Verdana"
const bodyFallback = charter.fonts.body.fallback;    // e.g. "Arial, sans-serif"

// Logo → use png/whitePng fields; loadLogoBufferForDocx handles SVG fallback
// See "SVG Logos — Always Convert to PNG" section below
```

Key mappings:

| Charter field | docx-js usage |
|--------------|---------------|
| `colors.primary` | Heading color, table header background, accent lines |
| `colors.text` | Body text color |
| `fonts.heading.family` | `font` property on heading Paragraphs/TextRuns |
| `fonts.body.family` | `font` property on body Paragraphs/TextRuns |
| `document.margins` | `SectionProperties.page.margin` |
| `document.headingColor` | Color for `Heading1`-`Heading6` styles |
| `document.tableHeaderColor` | Background color for table header rows |
| `logo.png` / `logo.whitePng` | `Header` image via `ImageRun` — use PNG fields (raster); call `loadLogoBufferForDocx` if only SVG is available |
| `fonts.*.fallback` | CSS-style fallback stack for font substitution |
| `formatting.headingThreshold` | Apply heading font to text >= this pt size |
| `formatting.accentCycleColors` | Cycle charter color keys for accent borders, callout boxes |
| `formatting.autoContrastText` | Auto-pick text color on colored backgrounds |

## Image Sizing Rule — Preserve Aspect Ratio

**All images and logos must preserve their natural aspect ratio.** Never set both width and height independently to arbitrary values — this causes visible stretching/squashing.

The charter's `logo.maxWidth` / `logo.maxHeight` define a **bounding box**, not a target size. Fit the image within the box while keeping its proportions.

> **Helper**: Use `src/image-utils.js` (Node) or `src/image_utils.py` (Python) to compute aspect-ratio-preserving dimensions from the charter bounding box. Never hardcode both width and height.

## SVG Logos — Always Convert to PNG

**docx-js `ImageRun` cannot embed SVG.** Many charters point to SVG logos. Always resolve to a raster PNG before embedding. The resolution priority:

1. `charter.logo.png` / `charter.logo.whitePng` — pre-generated PNG (preferred, no conversion needed)
2. Fallback: use `loadLogoBufferForDocx` to convert the SVG in memory via sharp

```javascript
const { loadLogoBufferForDocx } = require('../../../../src/image-utils');
const path = require('path');

const clientDir = path.resolve('client-data/clients/<name>');
const charterPath = path.join(clientDir, 'charter.json');
const charter = JSON.parse(fs.readFileSync(charterPath, 'utf-8'));

// Prefer pre-generated PNG fields; fall back to SVG (auto-converted)
const logoFile = charter.logo.png || charter.logo.primary;
const logoPath = path.join(clientDir, logoFile);

const logo = await loadLogoBufferForDocx(logoPath, charter.logo);
// logo = { buffer: Buffer, type: 'png', width: 110, height: 41, unit: 'pt' }

new ImageRun({
  type: logo.type,           // always 'png'
  data: logo.buffer,
  transformation: { width: logo.width, height: logo.height },
  altText: { title: "Logo", description: "Company logo", name: "logo" }
})

// White variant on dark backgrounds:
const whiteFile = charter.logo.whitePng || charter.logo.white;
const whitePath = path.join(clientDir, whiteFile);
const whiteLogo = await loadLogoBufferForDocx(whitePath, charter.logo);
```

This rule applies to **all images**, not just logos — cover page photos, section images, diagrams, etc. When inserting any image via `ImageRun` or OOXML, always read the actual file dimensions and compute proportional width/height.

For OOXML image insertion, the same principle applies to `cx`/`cy` EMU values — always derive one from the other using the source image's aspect ratio.

## Brand photography — default document structure

When the charter has an `images` block (`charter.images.catalog`), use brand photographs for cover pages and section dividers **by default**:

| Page type | Purpose | Image role |
|-----------|---------|------------|
| Cover page | Full-width header/background image on page 1 | `"cover"` |
| Section divider | Visual break between major sections | `"divider"` |
| Closing page | Final page with contact info / CTA | `"closing"` |

**Image selection rules:**
1. Match the `roles` array — pick images whose `roles` include the current page type
2. Rotate images — avoid repeating the same photo on consecutive image pages
3. Use `description` for topical relevance — prefer images whose description fits the section's content

**Overlay technique** (required for text legibility on photos):
- The charter provides `images.overlay.color` (a key like `"primary"` referencing `charter.colors`) and `images.overlay.opacity` (0–1 float)
- Pre-composite the photo + semi-transparent color overlay as a single PNG using Sharp before inserting via `ImageRun`
- This ensures the overlay survives the DOCX format (CSS blend modes are not available)

**Logo on image pages**: Use `charter.images.logoVariantOnImage` (e.g. `"white"`) to resolve the white logo variant for dark photo backgrounds.

**Fallback**: When no `charter.images` block exists, skip brand photography and use solid-color headers/accents only.

## Diagram Integration

**Never use ASCII art, Courier New text boxes, or monospace text for diagrams.** These break alignment across renderers and look unprofessional. Always generate a real diagram PNG.

When a page would benefit from a process flow, architecture diagram, org chart, timeline, or other structural visual, use the `diagram` skill to generate a branded PNG, then embed it using `ImageRun`. The diagram skill reads the same charter and produces images that match brand colors and typography.

**Concrete workflow:**

```bash
# Step 1 — generate diagram (from the diagram skill)
node .claude/skills/diagram/scripts/render-diagram.js diagrams/process-flow.excalidraw output/process-flow.png --client stromy --scale 3

# scale 3 = ~300 DPI at typical 6-inch display width — required for print quality
```

```javascript
// Step 2 — size for the document body
// A4 with 2.5 cm margins: usable width = 16 cm = 9072 DXA
// US Letter with 1" margins: usable width = 9360 DXA
const BODY_WIDTH_DXA = 9072; // A4

// Read diagram dimensions for aspect-correct height
const { fitImageInBox } = require('../../../../src/image-utils');
const dims = await fitImageInBox('output/process-flow.png', BODY_WIDTH_DXA, 99999);
const aspectHeight = Math.round(dims.height);

// Step 3 — embed
new Paragraph({
  children: [new ImageRun({
    type: 'png',
    data: fs.readFileSync('output/process-flow.png'),
    transformation: { width: BODY_WIDTH_DXA, height: aspectHeight },
    altText: { title: 'Process flow', description: 'Workflow diagram', name: 'diagram' },
  })],
  spacing: { before: 160, after: 160 },
})
```

**Sizing reference (DXA units):**

| Paper | Margins | Body width (DXA) |
|-------|---------|-----------------|
| A4 | 2.5 cm each | 9072 |
| US Letter | 1 in each | 9360 |

Keep diagram height ≤ 50% of usable page height to avoid orphaned captions. For tall diagrams, split into multiple focused diagrams.

**Alternative: Mermaid via Playwright** — when the diagram skill is not available or the diagram is specified as Mermaid syntax, render it in-browser and screenshot:

1. Write an HTML file with Mermaid CDN + `<pre class="mermaid">` containing the diagram code and brand-colored `style` directives
2. Navigate Playwright to the HTML (via data URI if file:// is blocked)
3. Wait for rendering: `document.querySelector('.mermaid svg')` must be truthy
4. Screenshot the `.mermaid` element to PNG
5. **Crop whitespace** — Mermaid renders leave large margins. Use `sharp(png).trim({ threshold: 5 })` then `.extend({ top: 30, bottom: 30, left: 30, right: 30, background: white })` to produce a tight crop with minimal padding
6. Embed the cropped PNG via `ImageRun` with `fitImageInBox` sizing

## Company identity data

When a company directory exists, also check for `profile.json` at `client-data/clients/<name>/profile.json`. If present, use company identity fields:

- **`company.name`** — document headers, footers, title pages
- **`company.tagline`** — subtitle text on cover pages

Load only the `company` block — other profile fields (services, pricing, legal) are not relevant for document generation.

## Author & contact metadata

When a company directory exists, check for `people.json` at `client-data/clients/<name>/people.json`. If present, use it for author metadata in footers, contact blocks, and document file properties. Filter by `roles` containing `"author"` — if one person has `"default": true`, auto-select them.

## Applying formatting rules

If the charter has a `formatting` section, apply these rules:

- **`headingThreshold`** (default 24): Apply the heading font to any text element >= this pt size. Text below the threshold uses the body font.
- **`accentCycleColors`** (e.g. `["accent", "secondary", "primary"]`): Cycle through these charter color keys when coloring accent borders, callout box backgrounds, or decorative elements.
- **`autoContrastText`**: Rarely needed in DOCX (text and background are usually separate), but apply when placing text on colored table headers or callout boxes.

## When there is no brand charter

If no charter exists for the company (or no company is specified), skip charter mapping entirely and use default styling. Do not invent brand colors — produce a clean, unbranded document.

## Template Auto-Discovery

When creating a branded document, check for an existing DOCX template before generating from scratch. Templates produce more stable, pixel-perfect output than programmatic generation **for fixed-layout assets** (letterhead, business letter). For long-form reports, prefer generation with charter-driven styling.

### Resolution chain
1. **Charter manifest**: `charter.templates.docx.<variant>` → exact path from charter (relative to brand dir)
2. **Filesystem convention**: `brand/templates/docx/default.docx` → format-organized template directory
3. **No template found** → programmatic generation (see `creating-new-documents.md`)

### Discovery code pattern
```javascript
const charter = JSON.parse(fs.readFileSync(charterPath, 'utf-8'));
const brandDir = path.dirname(charterPath);

// 1. Charter manifest
let templatePath = charter.templates?.docx?.default
  ? path.join(brandDir, charter.templates.docx.default)
  : null;

// 2. Filesystem convention
if (!templatePath || !fs.existsSync(templatePath)) {
  const conventionPath = path.join(brandDir, 'templates/docx/default.docx');
  if (fs.existsSync(conventionPath)) templatePath = conventionPath;
}
```

### When to use template vs. generate from scratch

| Scenario | Approach |
|----------|----------|
| Letterhead / formal letter / fax cover | **Use template** — unpack OOXML, edit body, repack |
| Long-form report (5+ pages) | **Generate from scratch** with charter-driven styling |
| Highly custom one-off layout | **Generate from scratch** — template constrains creativity |
| Style inheritance only (no fixed layout) | Use `styles.docx` as base — see "Inheriting styles" below |
| No template exists | **Generate from scratch** |

When a fixed-layout template is found, use the OOXML editing workflow: copy template → unpack → edit XML → validate → repack. See `editing-existing-documents.md`.

### Inheriting styles from a `styles.docx`

A `styles.docx` is an **empty** .docx whose only purpose is to define heading styles, table styles, fonts, and page setup matching the charter. When present at `brand/templates/docx/styles.docx`, use it as the base for generated documents so brand styling is consistent without forcing a fixed layout.

Pattern: copy `styles.docx` to the output path, unpack, replace `word/document.xml` body content with generated paragraphs, repack. Header/footer XML from the template is preserved automatically.
