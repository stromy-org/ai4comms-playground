# Critical Rules for docx-js

Hard-won rules. Violating any of these produces invalid XML, broken layouts, or silently corrupted output. Read before writing a build script.

## Page setup
- **Set page size explicitly** — docx-js defaults to A4; use US Letter (12240 x 15840 DXA) for US documents.
- **Landscape: pass portrait dimensions** — docx-js swaps width/height internally; pass short edge as `width`, long edge as `height`, and set `orientation: PageOrientation.LANDSCAPE`.

## Text & paragraphs
- **Never use `\n`** — use separate Paragraph elements.
- **Never use unicode bullets** — use `LevelFormat.BULLET` with numbering config.
- **PageBreak must be in Paragraph** — standalone creates invalid XML.

## Images & logos
- **ImageRun requires `type`** — always specify png/jpg/etc.
- **SVG logos must be converted** — `ImageRun` does not render SVG. Always use `charter.logo.png` / `charter.logo.whitePng`, or call `loadLogoBufferForDocx()` from `src/image-utils.js` for auto-conversion.
- **Preserve aspect ratio** — use `fitImageInBox()` from `src/image-utils.js`; never hardcode both width and height.
- **Diagram PNGs need print DPI** — generate diagrams with `--scale 3` (or higher). At scale 2 (the old default), diagrams look blurry in print output.

## Tables
- **Always set table `width` with DXA** — never use `WidthType.PERCENTAGE` (breaks in Google Docs).
- **Tables need dual widths** — `columnWidths` array AND cell `width`, both must match.
- **Table width = sum of columnWidths** — for DXA, ensure they add up exactly.
- **Always add cell margins** — use `margins: { top: 80, bottom: 80, left: 120, right: 120 }` for readable padding.
- **Use `ShadingType.CLEAR`** — never SOLID for table shading.
- **Never use tables as dividers/rules** — cells have minimum height and render as empty boxes (including in headers/footers). Use `border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } }` on a Paragraph instead. For two-column footers, use tab stops, not tables.

## Styles & TOC
- **TOC requires HeadingLevel only** — no custom styles on heading paragraphs.
- **Override built-in styles** — use exact IDs: "Heading1", "Heading2", etc.
- **Include `outlineLevel`** — required for TOC (0 for H1, 1 for H2, etc.).

## Build-time pitfalls
- **Avoid spread (`...`) inside nested docx-js constructors** — `...items.map(...)` inside a `children` array that is inside `new TableCell({ children: [...] })` can cause cryptic `SyntaxError: missing ) after argument list` at build time. Instead, build the children array imperatively with `forEach` + `.push()`, then pass it to the constructor. See the Callout Box pattern.

## Output review
- **No empty pages** — after generation, open the file in LibreOffice/Word and check for blank pages. Common causes: (a) a `PageBreak` after a short section, (b) a `SectionType.NEXT_PAGE` break where the previous section was sparse, (c) a trailing empty Paragraph with `pageBreakBefore: true`. Fix by removing the orphan break or adding content. The `pandoc` text extraction will not catch blank pages — always visually review the output.
