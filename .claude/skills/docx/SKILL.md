---
name: docx
description: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. When Claude needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"
license: Proprietary. LICENSE.txt has complete terms
---

# DOCX creation, editing, and analysis

## Overview

A .docx file is a ZIP archive containing XML files.

> **Logo & Image Sizing**: Never hardcode both width and height. Use `src/image-utils.js` (Node) or `src/image_utils.py` (Python) to compute aspect-ratio-preserving dimensions from the charter bounding box.

## Brand Data Integration

When creating a document for a **specific company or brand**, check for a brand charter before choosing colors and fonts manually. This is optional — when no brand is specified, produce an unbranded document with default styling.

### Discovering brand data
Look for a charter file at `client-data/clients/<name>/charter.json` where `<name>` matches the company the user mentions. If a charter exists, it provides:

- **Colors**: `primary`, `secondary`, `accent`, `background`, `backgroundAlt`, `text`, `textLight`, plus semantic colors (`success`, `warning`, `error`)
- **Fonts**: `heading` (family + weight + fallback), `body` (family + weight + fallback), `mono` (family + fallback)
- **Logo**: filename(s) in `client-data/clients/<name>/` (e.g. `logos/logo.png`) — fields: `primary` (SVG), `png` (raster, preferred for DOCX), `white`/`whitePng` (on dark backgrounds), with `maxWidth`/`maxHeight` bounding box and `"sizing": "contain"`
- **Document settings**: `document.margins` (top/bottom/left/right), `document.header`, `document.footer`, `document.headingColor`, `document.tableHeaderColor`
- **Formatting rules**: `formatting.headingThreshold`, `formatting.accentCycleColors`, `formatting.autoContrastText`

### Applying brand data in docx-js

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

### Image Sizing Rule — Preserve Aspect Ratio

**All images and logos must preserve their natural aspect ratio.** Never set both width and height independently to arbitrary values — this causes visible stretching/squashing.

The charter's `logo.maxWidth` / `logo.maxHeight` define a **bounding box**, not a target size. Fit the image within the box while keeping its proportions.

### SVG Logos — Always Convert to PNG

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

### Brand photography — default document structure

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

### Diagram Integration

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

### Company identity data
When a company directory exists, also check for `profile.json` at `client-data/clients/<name>/profile.json`. If present, use company identity fields:

- **`company.name`** — document headers, footers, title pages
- **`company.tagline`** — subtitle text on cover pages

Load only the `company` block — other profile fields (services, pricing, legal) are not relevant for document generation.

### Author & contact metadata
When a company directory exists, check for `people.json` at `client-data/clients/<name>/people.json`. If present, use it for author metadata in footers, contact blocks, and document file properties. Filter by `roles` containing `"author"` — if one person has `"default": true`, auto-select them.

### Applying formatting rules
If the charter has a `formatting` section, apply these rules:

- **`headingThreshold`** (default 24): Apply the heading font to any text element >= this pt size. Text below the threshold uses the body font.
- **`accentCycleColors`** (e.g. `["accent", "secondary", "primary"]`): Cycle through these charter color keys when coloring accent borders, callout box backgrounds, or decorative elements.
- **`autoContrastText`**: Rarely needed in DOCX (text and background are usually separate), but apply when placing text on colored table headers or callout boxes.

### When there is no brand charter
If no charter exists for the company (or no company is specified), skip this section entirely and use default styling. Do not invent brand colors — produce a clean, unbranded document.

## Template Auto-Discovery

When creating a branded document, check for an existing DOCX template before generating from scratch. Templates produce more stable, pixel-perfect output than programmatic generation.

### Resolution chain
1. **Charter manifest**: `charter.templates.docx.<variant>` → exact path from charter (relative to brand dir)
2. **Filesystem convention**: `brand/templates/docx/default.docx` → format-organized template directory
3. **No template found** → programmatic generation (docx-js workflow below)

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
| Brand has a template + user wants standard report | **Use template** — unpack OOXML, edit, repack |
| Brand has a template + user wants custom layout | **Generate from scratch** — template constrains creativity |
| No template exists | **Generate from scratch** — docx-js workflow |
| Letterhead needed | Check `charter.templates.docx.letterhead` or `brand/templates/docx/letterhead.docx` |

When a template is found, use the OOXML editing workflow: copy template → unpack → edit XML → validate → repack.

---

## Output Location

**Default**: `<projectRoot>/output/<deliverable>/` — auto-detected from build script location using `src/workspace.js`.
**Override**: If the prompt specifies a target output directory, pass it as `{ outputDir: '<path>' }`.


**Iteration**: When asked to edit/rework an existing file, work on it in place (overwrite). Unpack to `build/<deliverable>/unpacked/`.

### Build script output setup

```javascript
const { ensureOutputDir } = require('../../../../src/workspace');
const outputDir = ensureOutputDir(__dirname);
// → workspace/<client>/output/<deliverable>/
```

## Quick Reference

| Task | Approach |
|------|----------|
| Read/analyze content | `pandoc` or unpack for raw XML |
| Create new document | Use `docx-js` - see Creating New Documents below |
| Edit existing document | Unpack → edit XML → repack - see Editing Existing Documents below |

### Converting .doc to .docx

Legacy `.doc` files must be converted before editing:

```bash
python scripts/office/soffice.py --headless --convert-to docx document.doc
```

### Reading Content

```bash
# Text extraction with tracked changes
pandoc --track-changes=all document.docx -o output.md

# Raw XML access
python scripts/office/unpack.py document.docx unpacked/
```

### Converting to Images

```bash
python scripts/office/soffice.py --headless --convert-to pdf document.docx
pdftoppm -jpeg -r 150 document.pdf page
```

### Accepting Tracked Changes

To produce a clean document with all tracked changes accepted (requires LibreOffice):

```bash
python scripts/accept_changes.py input.docx output.docx
```

---

## Creating New Documents

Generate .docx files with JavaScript, then validate. Install: `npm install -g docx`

### Setup
```javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
        Header, Footer, AlignmentType, PageOrientation, LevelFormat, ExternalHyperlink,
        InternalHyperlink, Bookmark, FootnoteReferenceRun, PositionalTab,
        PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
        TabStopType, TabStopPosition, Column, SectionType,
        TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
        VerticalAlign, PageNumber, PageBreak } = require('docx');

const doc = new Document({ sections: [{ children: [/* content */] }] });
Packer.toBuffer(doc).then(buffer => fs.writeFileSync("doc.docx", buffer));
```

### Large Document Structure (5+ pages)

For documents with many sections, build content as a flat array and pass it to `sections[0].children`. Define reusable helper functions at the top of the build script to keep the content assembly readable:

```javascript
// Helper functions — define once, reuse throughout
function heading(text, level) { /* returns Paragraph with HeadingLevel */ }
function para(text) { /* returns body Paragraph */ }
function bullet(text) { /* returns numbered Paragraph */ }
function calloutBox(title, items) { /* returns Table — see Callout pattern */ }
function dataTable(headers, rows, colWidths) { /* returns Table */ }

// Content assembly — flat array, one section
const children = [];
children.push(heading('1. Introduction'));
children.push(para('Opening text...'));
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(heading('2. Analysis'));
// ... continue building

const doc = new Document({ sections: [{ properties: { /* page config */ }, children }] });
```

**Page break hygiene**: Only insert `PageBreak` when you are certain the preceding content fills most of the page. Inserting a page break after short content (e.g. a heading + one paragraph + a small table) creates a visible empty gap. When in doubt, let content flow naturally and only force breaks before major new sections that should clearly start on a fresh page.

### Validation
After creating the file, validate it. If validation fails, unpack, fix the XML, and repack.
```bash
python scripts/office/validate.py doc.docx
```

### Page Size

```javascript
// CRITICAL: docx-js defaults to A4, not US Letter
// Always set page size explicitly for consistent results
sections: [{
  properties: {
    page: {
      size: {
        width: 12240,   // 8.5 inches in DXA
        height: 15840   // 11 inches in DXA
      },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins
    }
  },
  children: [/* content */]
}]
```

**Common page sizes (DXA units, 1440 DXA = 1 inch):**

| Paper | Width | Height | Content Width (1" margins) |
|-------|-------|--------|---------------------------|
| US Letter | 12,240 | 15,840 | 9,360 |
| A4 (default) | 11,906 | 16,838 | 9,026 |

**Landscape orientation:** docx-js swaps width/height internally, so pass portrait dimensions and let it handle the swap:
```javascript
size: {
  width: 12240,   // Pass SHORT edge as width
  height: 15840,  // Pass LONG edge as height
  orientation: PageOrientation.LANDSCAPE  // docx-js swaps them in the XML
},
// Content width = 15840 - left margin - right margin (uses the long edge)
```

### Styles (Override Built-in Headings)

Use Arial as the default font (universally supported). Keep titles black for readability.

```javascript
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } }, // 12pt default
    paragraphStyles: [
      // IMPORTANT: Use exact IDs to override built-in styles
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } }, // outlineLevel required for TOC
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Title")] }),
    ]
  }]
});
```

### Lists (NEVER use unicode bullets)

```javascript
// ❌ WRONG - never manually insert bullet characters
new Paragraph({ children: [new TextRun("• Item")] })  // BAD
new Paragraph({ children: [new TextRun("\u2022 Item")] })  // BAD

// ✅ CORRECT - use numbering config with LevelFormat.BULLET
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    children: [
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Bullet item")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [new TextRun("Numbered item")] }),
    ]
  }]
});

// ⚠️ Each reference creates INDEPENDENT numbering
// Same reference = continues (1,2,3 then 4,5,6)
// Different reference = restarts (1,2,3 then 1,2,3)
```

### Tables

**CRITICAL: Tables need dual widths** - set both `columnWidths` on the table AND `width` on each cell. Without both, tables render incorrectly on some platforms.

```javascript
// CRITICAL: Always set table width for consistent rendering
// CRITICAL: Use ShadingType.CLEAR (not SOLID) to prevent black backgrounds
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

new Table({
  width: { size: 9360, type: WidthType.DXA }, // Always use DXA (percentages break in Google Docs)
  columnWidths: [4680, 4680], // Must sum to table width (DXA: 1440 = 1 inch)
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 4680, type: WidthType.DXA }, // Also set on each cell
          shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, // CLEAR not SOLID
          margins: { top: 80, bottom: 80, left: 120, right: 120 }, // Cell padding (internal, not added to width)
          children: [new Paragraph({ children: [new TextRun("Cell")] })]
        })
      ]
    })
  ]
})
```

**Table width calculation:**

Always use `WidthType.DXA` — `WidthType.PERCENTAGE` breaks in Google Docs.

```javascript
// Table width = sum of columnWidths = content width
// US Letter with 1" margins: 12240 - 2880 = 9360 DXA
width: { size: 9360, type: WidthType.DXA },
columnWidths: [7000, 2360]  // Must sum to table width
```

**Width rules:**
- **Always use `WidthType.DXA`** — never `WidthType.PERCENTAGE` (incompatible with Google Docs)
- Table width must equal the sum of `columnWidths`
- Cell `width` must match corresponding `columnWidth`
- Cell `margins` are internal padding - they reduce content area, not add to cell width
- For full-width tables: use content width (page width minus left and right margins)

### Callout / Aside Boxes

Use a single-cell table with a thick colored left border and light shading. This is the standard pattern for "Questions for…", "Note", "Important", or any visually distinct aside block.

```javascript
function calloutBox(title, items, charter) {
  const accentColor = charter.colors.accent.replace('#', '');
  const bgColor = charter.colors.backgroundAlt.replace('#', '');
  const accentBorder = { style: BorderStyle.SINGLE, size: 12, color: accentColor };
  const noBorder = { style: BorderStyle.NONE };

  // Build children array imperatively — avoid spread inside nested constructors (see Critical Rules)
  const cellChildren = [
    new Paragraph({ spacing: { after: 120 }, children: [
      new TextRun({ text: title, font: "Arial", size: 22, bold: true, color: accentColor })] })
  ];
  items.forEach(function(item, i) {
    cellChildren.push(new Paragraph({ spacing: { after: 80 }, children: [
      new TextRun({ text: (i + 1) + '. ' + item, font: "Arial", size: 21 })] }));
  });

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: noBorder, bottom: noBorder, right: noBorder, left: accentBorder },
      shading: { fill: bgColor, type: ShadingType.CLEAR },
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      children: cellChildren,
    })] })],
  });
}
```

Use `charter.formatting.accentCycleColors` to vary the left-border color when multiple callout boxes appear in one document.

### Images

```javascript
// CRITICAL: type parameter is REQUIRED
new Paragraph({
  children: [new ImageRun({
    type: "png", // Required: png, jpg, jpeg, gif, bmp, svg
    data: fs.readFileSync("image.png"),
    transformation: { width: 200, height: 150 },
    altText: { title: "Title", description: "Desc", name: "Name" } // All three required
  })]
})
```

### Page Breaks

```javascript
// CRITICAL: PageBreak must be inside a Paragraph
new Paragraph({ children: [new PageBreak()] })

// Or use pageBreakBefore
new Paragraph({ pageBreakBefore: true, children: [new TextRun("New page")] })
```

### Hyperlinks

```javascript
// External link
new Paragraph({
  children: [new ExternalHyperlink({
    children: [new TextRun({ text: "Click here", style: "Hyperlink" })],
    link: "https://example.com",
  })]
})

// Internal link (bookmark + reference)
// 1. Create bookmark at destination
new Paragraph({ heading: HeadingLevel.HEADING_1, children: [
  new Bookmark({ id: "chapter1", children: [new TextRun("Chapter 1")] }),
]})
// 2. Link to it
new Paragraph({ children: [new InternalHyperlink({
  children: [new TextRun({ text: "See Chapter 1", style: "Hyperlink" })],
  anchor: "chapter1",
})]})
```

### Footnotes

```javascript
const doc = new Document({
  footnotes: {
    1: { children: [new Paragraph("Source: Annual Report 2024")] },
    2: { children: [new Paragraph("See appendix for methodology")] },
  },
  sections: [{
    children: [new Paragraph({
      children: [
        new TextRun("Revenue grew 15%"),
        new FootnoteReferenceRun(1),
        new TextRun(" using adjusted metrics"),
        new FootnoteReferenceRun(2),
      ],
    })]
  }]
});
```

### Tab Stops

```javascript
// Right-align text on same line (e.g., date opposite a title)
new Paragraph({
  children: [
    new TextRun("Company Name"),
    new TextRun("\tJanuary 2025"),
  ],
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
})

// Dot leader (e.g., TOC-style)
new Paragraph({
  children: [
    new TextRun("Introduction"),
    new TextRun({ children: [
      new PositionalTab({
        alignment: PositionalTabAlignment.RIGHT,
        relativeTo: PositionalTabRelativeTo.MARGIN,
        leader: PositionalTabLeader.DOT,
      }),
      "3",
    ]}),
  ],
})
```

### Multi-Column Layouts

```javascript
// Equal-width columns
sections: [{
  properties: {
    column: {
      count: 2,          // number of columns
      space: 720,        // gap between columns in DXA (720 = 0.5 inch)
      equalWidth: true,
      separate: true,    // vertical line between columns
    },
  },
  children: [/* content flows naturally across columns */]
}]

// Custom-width columns (equalWidth must be false)
sections: [{
  properties: {
    column: {
      equalWidth: false,
      children: [
        new Column({ width: 5400, space: 720 }),
        new Column({ width: 3240 }),
      ],
    },
  },
  children: [/* content */]
}]
```

Force a column break with a new section using `type: SectionType.NEXT_COLUMN`.

### Table of Contents

```javascript
// CRITICAL: Headings must use HeadingLevel ONLY - no custom styles
new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" })
```

### Headers/Footers

```javascript
sections: [{
  properties: {
    page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } // 1440 = 1 inch
  },
  headers: {
    default: new Header({ children: [new Paragraph({ children: [new TextRun("Header")] })] })
  },
  footers: {
    default: new Footer({ children: [new Paragraph({
      children: [new TextRun("Page "), new TextRun({ children: [PageNumber.CURRENT] })]
    })] })
  },
  children: [/* content */]
}]
```

### Critical Rules for docx-js

- **Set page size explicitly** - docx-js defaults to A4; use US Letter (12240 x 15840 DXA) for US documents
- **Landscape: pass portrait dimensions** - docx-js swaps width/height internally; pass short edge as `width`, long edge as `height`, and set `orientation: PageOrientation.LANDSCAPE`
- **Never use `\n`** - use separate Paragraph elements
- **Never use unicode bullets** - use `LevelFormat.BULLET` with numbering config
- **PageBreak must be in Paragraph** - standalone creates invalid XML
- **ImageRun requires `type`** - always specify png/jpg/etc
- **Always set table `width` with DXA** - never use `WidthType.PERCENTAGE` (breaks in Google Docs)
- **Tables need dual widths** - `columnWidths` array AND cell `width`, both must match
- **Table width = sum of columnWidths** - for DXA, ensure they add up exactly
- **Always add cell margins** - use `margins: { top: 80, bottom: 80, left: 120, right: 120 }` for readable padding
- **Use `ShadingType.CLEAR`** - never SOLID for table shading
- **Never use tables as dividers/rules** - cells have minimum height and render as empty boxes (including in headers/footers); use `border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } }` on a Paragraph instead. For two-column footers, use tab stops (see Tab Stops section), not tables
- **TOC requires HeadingLevel only** - no custom styles on heading paragraphs
- **Override built-in styles** - use exact IDs: "Heading1", "Heading2", etc.
- **Include `outlineLevel`** - required for TOC (0 for H1, 1 for H2, etc.)
- **Avoid spread (`...`) inside nested docx-js constructors** - `...items.map(...)` inside a `children` array that is inside `new TableCell({ children: [...] })` can cause cryptic `SyntaxError: missing ) after argument list` at build time. Instead, build the children array imperatively with `forEach` + `.push()`, then pass it to the constructor. See the Callout Box pattern for an example.
- **No empty pages** — after generation, open the file in LibreOffice/Word and check for blank pages. Common causes: (a) a `PageBreak` after a short section, (b) a `SectionType.NEXT_PAGE` break where the previous section was sparse, (c) a trailing empty Paragraph with `pageBreakBefore: true`. Fix by removing the orphan break or adding content. The `pandoc` text extraction will not catch blank pages — always visually review the output.
- **SVG logos must be converted** — `ImageRun` does not render SVG. Always use `charter.logo.png` / `charter.logo.whitePng`, or call `loadLogoBufferForDocx()` from `src/image-utils.js` for auto-conversion.
- **Diagram PNGs need print DPI** — generate diagrams with `--scale 3` (or higher) in the diagram skill render script. At scale 2 (the old default), diagrams look blurry in print output.

---

## Editing Existing Documents

Unpack → edit XML → repack. Full workflow with smart-quote entities, `comment.py` usage, auto-repair behavior, and common pitfalls: **`references/editing-existing-documents.md`**

Quick reference:
```bash
python scripts/office/unpack.py document.docx unpacked/   # Step 1: Unpack
# Step 2: Edit XML in unpacked/word/ using the Edit tool (not scripts)
python scripts/office/pack.py unpacked/ output.docx --original document.docx  # Step 3: Pack
```

---

## XML Reference

Schema compliance rules, tracked changes (insert/delete/nested), comment markers, and OOXML image embedding: **`references/xml-reference.md`**

## Code Style Guidelines
**IMPORTANT**: When generating code for DOCX operations:
- Write concise code
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

---

## Dependencies

- **pandoc**: Text extraction
- **docx**: `npm install -g docx` (new documents)
- **LibreOffice**: PDF conversion (auto-configured for sandboxed environments via `scripts/office/soffice.py`)
- **Poppler**: `pdftoppm` for images
