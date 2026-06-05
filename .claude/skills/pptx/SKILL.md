---
name: pptx
description: "DEFAULT PPTX skill — presentation creation, editing, analysis. Use for any .pptx work that isn't an explicit high-stakes/premium/HD pitch deck (which goes to `pptx-hd`). Handles: (1) creating new presentations, (2) modifying/editing content, (3) working with layouts, (4) adding comments/speaker notes, (5) analysing existing decks. Consumes brand data from charter.json + tokens.css + boilerplate.json + templates/pptx/ HTML shells when present. Also supports `render-anchors` mode (materialises brand anchor templates from spec files)."
---

# PPTX creation, editing, and analysis (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/pptx/SKILL.md"`.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/pptx"` (and `path="skills/pptx/references"`),
   → call `fs_read` with `path="skills/pptx/references/<file>"`.

Follow the instructions returned by the MCP exactly.
