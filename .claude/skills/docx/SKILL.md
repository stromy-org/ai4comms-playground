---
name: docx
description: "Create, read, edit, and manipulate Word documents (.docx files). Triggers on any mention of 'Word doc', 'word document', '.docx', or requests to produce documents with formatting like tables of contents, headings, page numbers, headers/footers, or letterheads. Also use when extracting or reorganizing content from .docx files, inserting or replacing images, performing find-and-replace, working with tracked changes or comments, or converting content into a polished Word document. If the user asks for a 'report', 'memo', 'letter', 'brief', or 'template' as a Word file, use this skill. Reads brand data from `client-data/clients/<name>/charter.json` when a company is specified. Do NOT use for PDFs (use the `pdf` skill), spreadsheets (use `xlsx`), Google Docs, or coding tasks unrelated to document generation."
license: Proprietary. LICENSE.txt has complete terms
---

# DOCX creation, editing, and analysis

A .docx file is a ZIP archive containing XML files. This skill covers three workflows: **reading/extracting** content, **creating new documents** via `docx-js`, and **editing existing documents** via OOXML unpack/edit/repack.

## Workflow checklist

Copy this checklist and check off items as you work:

```
DOCX Task Progress:
- [ ] Step 1: Identify the task type — Read / Create / Edit / Accept-changes
- [ ] Step 2: Branded? — If a company is named, locate charter at client-data/clients/<name>/charter.json
- [ ] Step 3: Template vs scratch? — Fixed-layout (letterhead, formal letter) → template; long-form report → scratch with charter styling
- [ ] Step 4: Resolve assets — logo PNG (not SVG), brand fonts, cover image, diagrams
- [ ] Step 5: Build (docx-js) OR Unpack→edit XML→repack
- [ ] Step 6: Validate (scripts/office/validate.py)
- [ ] Step 7: Visual review — open output and check for blank pages, broken images, stretched logos
```

**Decision tree:**

1. **What is the task?**
   - Extract text → `pandoc` (skip to Reading Content)
   - Create new → continue to step 2
   - Edit existing .docx → see `references/editing-existing-documents.md`
   - Accept tracked changes → `python scripts/accept_changes.py input.docx output.docx`

2. **Is a company/brand specified?**
   - Yes → read `client-data/clients/<name>/charter.json`; see `references/brand-integration.md`
   - No → use default styling (Arial 12pt, US Letter or A4 by user preference)

3. **Template or generate from scratch?**
   - Fixed-layout (letterhead, formal letter, fax cover) → look for `charter.templates.docx.<variant>` or `brand/templates/docx/<name>.docx`; if found, unpack → edit body → repack (see editing reference)
   - Long-form report, custom layout, or no template → generate with `docx-js`; see `references/creating-new-documents.md`
   - If a `brand/templates/docx/styles.docx` exists, use it as a style base (inherit headings/fonts/page setup) — described in brand-integration reference

4. **Iteration mode (user references an existing output file)?** — Work on it in place. Unpack to `build/<deliverable>/unpacked/`, edit, repack to the same output path.

## Quick Reference

| Task | Approach | Where |
|------|----------|-------|
| Read/analyze content | `pandoc` or unpack for raw XML | This file (Reading Content) |
| Create new document | `docx-js` | `references/creating-new-documents.md` |
| Edit existing document | Unpack → edit XML → repack | `references/editing-existing-documents.md` |
| Apply brand (logo, colors, fonts) | Read charter, map to docx-js | `references/brand-integration.md` |
| Critical docx-js pitfalls | — | `references/critical-rules.md` |
| OOXML schema, tracked changes, comments | — | `references/xml-reference.md` |

## Reading Content

```bash
# Text extraction with tracked changes
pandoc --track-changes=all document.docx -o output.md

# Raw XML access
python scripts/office/unpack.py document.docx unpacked/
```

### Converting .doc to .docx

Legacy `.doc` files must be converted before editing:

```bash
python scripts/office/soffice.py --headless --convert-to docx document.doc
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

## Creating New Documents — Quickstart

Full setup, page sizing, styles, lists, tables, callouts, images, page breaks, hyperlinks, footnotes, tab stops, columns, TOC, and headers/footers are in **`references/creating-new-documents.md`**. Read it before writing a build script for a non-trivial document.

Minimal example:

```javascript
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Title")] }),
      new Paragraph({ children: [new TextRun("Body text.")] }),
    ],
  }],
});
Packer.toBuffer(doc).then(buf => fs.writeFileSync("doc.docx", buf));
```

### Validation

After creating the file, validate. If validation fails, unpack, fix the XML, and repack.

```bash
python scripts/office/validate.py doc.docx
```

### Critical rules

A condensed list of hard-won docx-js pitfalls (page setup, tables, lists, images, build-time gotchas) lives in **`references/critical-rules.md`**. Read it before non-trivial work — violating any of these produces invalid XML, broken layouts, or silently corrupted output.

## Editing Existing Documents

Unpack → edit XML → repack. Full workflow with smart-quote entities, `comment.py` usage, auto-repair behavior, and common pitfalls: **`references/editing-existing-documents.md`**.

Quick reference:
```bash
python scripts/office/unpack.py document.docx unpacked/         # Step 1: Unpack
# Step 2: Edit XML in unpacked/word/ using the Edit tool (not scripts)
python scripts/office/pack.py unpacked/ output.docx --original document.docx  # Step 3: Pack
```

## Brand Integration

When the user names a company, read `client-data/clients/<name>/charter.json` and map fields (colors, fonts, logo, margins, header/footer, image catalog) to docx-js. **Full mapping table, code patterns, and the `images.catalog` overlay technique are in `references/brand-integration.md`.** Read that reference whenever a branded document is being produced.

**Key rules** (always apply when a charter is present):

- Prefer `charter.logo.png` / `charter.logo.whitePng` over SVG — `ImageRun` cannot embed SVG; fall back to `loadLogoBufferForDocx()` from `src/image-utils.js` for in-memory conversion.
- Preserve aspect ratio for all images and logos — use `fitImageInBox()` from `src/image-utils.js`. Charter `logo.maxWidth`/`logo.maxHeight` define a bounding box, not target dimensions.
- Use brand photography (`charter.images.catalog`) for cover and section divider pages by default, with the charter-specified overlay pre-composited via Sharp.
- Check for `charter.templates.docx.*` and `brand/templates/docx/*.docx` before generating from scratch — see the Template Auto-Discovery section in the brand-integration reference.

## XML Reference

Schema compliance rules, tracked changes (insert/delete/nested), comment markers, and OOXML image embedding: **`references/xml-reference.md`**.

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

## Code Style Guidelines

When generating code for DOCX operations:
- Write concise code
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

## Dependencies

- **pandoc**: Text extraction
- **docx**: `npm install -g docx` (new documents)
- **LibreOffice**: PDF conversion (auto-configured for sandboxed environments via `scripts/office/soffice.py`)
- **Poppler**: `pdftoppm` for images
