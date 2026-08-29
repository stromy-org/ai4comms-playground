---
name: format-docx
description: "Create, read, edit, and manipulate Word documents (.docx files). Triggers on any mention of 'Word doc', 'word document', '.docx', or requests to produce documents with formatting like tables of contents, headings, page numbers, headers/footers, or letterheads. Also use when extracting or reorganizing content from .docx files, inserting or replacing images, performing find-and-replace, working with tracked changes or comments, or converting content into a polished Word document. If the user asks for a 'report', 'memo', 'letter', 'brief', or 'template' as a Word file, use this skill. When a single client overlay resolves, use it automatically for branding unless the user explicitly asks for unbranded output. Do NOT use for PDFs (use the `format-pdf` skill), spreadsheets (use `format-xlsx`), Google Docs, or coding tasks unrelated to document generation."
---

# DOCX creation, editing, and analysis (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-docx/SKILL.md"`.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-docx"` (and `path="skills/format-docx/references"`),
   → call `fs_read` with `path="skills/format-docx/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.

## If the `stromy-format` MCP is slow to respond

This server scales to zero to save cost, so the first call may take ~10–30s to cold-start. If `fs_read` or a tool errors with unavailable/timeout:

1. Tell the user the server is starting, then retry the same `fs_read` call — the call itself wakes the container.
2. Retry with a short backoff up to ~3 times.
3. Only if it is still unreachable after retries, STOP and report. Never downgrade to a local or base skill just to "get something out".
