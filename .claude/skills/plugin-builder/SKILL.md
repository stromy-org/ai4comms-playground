---
name: plugin-builder
description: Build Claude Code plugins in the playground by wrapping the existing scaffold_plugin.py tooling with playground-specific defaults. Scaffolds into plugins/ directory, sources skills from .claude/skills/, and uses companies/ for brand data. Use when the user wants to "build a plugin", "create a plugin", "scaffold a plugin", "package skills into a plugin", or any request to bundle skills for client deployment.
---

# Plugin Builder

Build Claude Code plugins in the playground using the established scaffolding tooling.

## When to Use

- User wants to create a plugin from skills they've built or sourced
- User wants to test plugin packaging before deploying
- User says "build plugin", "create plugin", "scaffold plugin", "package for client"

## How It Works

This skill wraps the existing `scaffold_plugin.py` from stromy-org's plugin-creator tooling. It does NOT reimplement the scaffolding logic — it calls the real script with playground-appropriate defaults.

## Workflow

### Step 1: Intake

Gather plugin details from the user:

1. **Client name**: Who is this plugin for? (e.g., "ai4comms")
2. **Client slug**: kebab-case identifier (e.g., "ai4comms")
3. **Skills to include**: Which skills from `.claude/skills/` should be in the plugin?
   - List available skills: `ls .claude/skills/`
   - Only include skills the user has built or sourced — not the baseline infrastructure skills (conventional-commit, quality-check, instruction-audit, skill-creator, skill-reviewer, source-skill, plugin-builder)
4. **Company data**: Does `companies/<client-slug>/` exist with charter.json and profile.json?
5. **Description**: One-line description of the plugin

### Step 2: Scaffold

Create the plugin structure in `plugins/<client-slug>-plugin/`:

```
plugins/<client-slug>-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/                   # Plugin skills (copied from .claude/skills/)
│   └── <skill-name>/
│       └── SKILL.md
├── companies/                # Company data (copied from companies/)
│   └── <client-slug>/
│       ├── charter.json
│       └── profile.json
├── src/                      # Shared utilities
│   ├── workspace.js
│   ├── workspace.py
│   ├── image-utils.js
│   └── image_utils.py
├── package.json
├── pyproject.toml
└── README.md
```

### Step 3: Copy and Transform Skills

For each selected skill:

1. Copy from `.claude/skills/<skill-name>/` into `plugins/<slug>-plugin/skills/<skill-name>/`
2. Apply plugin path transforms:
   - `companies/` paths stay as `companies/` (same relative structure)
   - `../../src/workspace` → `../../src/workspace` (same depth in plugin)
   - Update any playground-specific paths to plugin-relative paths

### Step 4: Generate Plugin Manifest

Create `.claude-plugin/plugin.json`:

```json
{
  "name": "<client-slug>-plugin",
  "description": "<description>",
  "version": "0.1.0"
}
```

### Step 5: Copy Dependencies

- Copy `package.json` and `pyproject.toml` from playground root (or create minimal versions with only the deps the selected skills need)
- Copy `src/` utilities (workspace.js, workspace.py, image-utils.js, image_utils.py)

### Step 6: Copy Company Data

If `companies/<client-slug>/` exists, copy it into the plugin.

### Step 7: Validate

1. Verify plugin.json is in `.claude-plugin/` (not plugin root)
2. Verify all skill SKILL.md files have valid frontmatter
3. Verify no broken path references
4. Verify company data is valid JSON

### Step 8: Report

```
## Plugin Built: <client-slug>-plugin

- Location: plugins/<client-slug>-plugin/
- Skills included: <list>
- Company data: included / not included
- Dependencies: package.json + pyproject.toml

### Next Steps
- To test locally: Install the plugin in Claude Code
- To distribute: Zip the plugin directory and share, or push to a git repo
- To create a marketplace: (future — not yet supported in playground)
```

## Testing a Plugin

After building, the user can test the plugin by:

1. **Local install**: `claude plugin install ./plugins/<client-slug>-plugin/`
2. **Zip and import**: Zip the plugin directory and import it in the Claude app
3. **Manual testing**: Open a Claude Code session in the plugin directory and test the skills

## Plugin Conventions

- Plugin manifest lives in `.claude-plugin/plugin.json` (not plugin root)
- Skills are namespaced in the plugin: `/<plugin-slug>:<skill-name>`
- Python deps use `pyproject.toml` + `uv sync`
- Node deps use `package.json` + `npm install`
