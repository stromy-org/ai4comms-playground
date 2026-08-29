---
name: format-pptx
description: "DEFAULT PPTX skill for **unbranded deck creation** and **editing / analysis / OOXML / comments / speaker-notes of any existing deck** (branded or not — in-place OOXML edits, not a branded render). For a **net-new branded deck**, use `format-pptx-hd` (server-rendered + brand-gated). This skill does not render a branded deck from scratch. Also supports `render-anchors` mode (materialises brand anchor templates from spec files)."
---

# PPTX creation, editing, and analysis (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-pptx/SKILL.md"`.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-pptx"` (and `path="skills/format-pptx/references"`),
   → call `fs_read` with `path="skills/format-pptx/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.

## If the `stromy-format` MCP is slow to respond

This server scales to zero to save cost, so the first call may take ~10–30s to cold-start. If `fs_read` or a tool errors with unavailable/timeout:

1. Tell the user the server is starting, then retry the same `fs_read` call — the call itself wakes the container.
2. Retry with a short backoff up to ~3 times.
3. Only if it is still unreachable after retries, STOP and report. Never downgrade to a local or base skill just to "get something out".
