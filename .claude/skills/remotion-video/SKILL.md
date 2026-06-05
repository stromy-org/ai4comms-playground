---
name: remotion-video
description: "Create animated videos using Remotion (React-based video framework) with optional company branding from charter.json. Provides branded components, animation utilities, chart/diagram primitives, and a scaffold-to-render workflow. Use when creating videos, explainer animations, data visualizations, or corporate presentations in video format."
---

# Remotion Video (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/remotion-video/SKILL.md"`.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/remotion-video"` (and `path="skills/remotion-video/references"`),
   → call `fs_read` with `path="skills/remotion-video/references/<file>"`.

Follow the instructions returned by the MCP exactly.
