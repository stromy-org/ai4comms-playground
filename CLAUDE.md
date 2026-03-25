# CLAUDE.md

This file provides guidance to Claude Code when working in the ai4comms-playground. Development patterns and guardrails are in `.claude/rules/` and load automatically.

## Project Overview

ai4comms-playground is a **skill development sandbox** for ai4comms. It provides read-only access to upstream skill libraries (Cowork, duke-strategies-plugin) and a structured workspace to build, test, and package skills and plugins.

**Hard rule**: The `upstream/` directory is READ-ONLY. Never edit files there. Use `/source-skill` to safely copy skills into `.claude/skills/` for modification.

## Repository Structure

```
ai4comms-playground/
├── .claude/
│   ├── skills/                    # All skills live here (discoverable)
│   │   ├── conventional-commit/   # Standard commit workflow
│   │   ├── skill-creator/         # Create and iterate on skills
│   │   ├── quality-check/         # Structural validation
│   │   ├── instruction-audit/     # Instruction system maintenance
│   │   ├── skill-reviewer/        # Review skill quality
│   │   ├── source-skill/          # Copy skills from upstream
│   │   ├── plugin-builder/        # Build plugins from skills
│   │   └── <sourced-skills>/      # Skills sourced from upstream
│   ├── rules/                     # Always-on rules
│   └── settings.json
├── upstream/                      # READ-ONLY submodules
│   ├── cowork/                    # Skill source library
│   └── duke-strategies-plugin/    # Example deployed plugin
├── plugins/                       # Plugin builds (zip + import)
├── companies/                     # Company data for clients
│   └── ai4comms/
├── src/                           # Shared utilities
├── workspace/                     # Test output (gitignored)
├── CLAUDE.md                      # This file
├── AGENTS.md                      # Self-contained Codex instructions
└── README.md                      # Onboarding guide
```

## Commands

```bash
# Submodule operations
git submodule update --init --recursive   # Initialize submodules
git submodule update --remote             # Pull latest from upstream

# Dependencies
npm install                               # Install Node dependencies
uv sync                                   # Install Python dependencies

# Validation
python -m json.tool companies/ai4comms/charter.json   # Validate JSON
```

## Skill Workflow

### Infrastructure Skills
- **conventional-commit** — Git commit workflow with Conventional Commits + gitmoji
- **skill-creator** — Create new skills with eval framework
- **quality-check** — Validate playground structural integrity
- **instruction-audit** — Maintain instruction system consistency

### Playground Skills
- **source-skill** — Copy and adapt skills from upstream references
- **skill-reviewer** — Review skill quality with source traceability
- **plugin-builder** — Package skills into deployable plugins

### Sourced Skills
Skills copied from upstream via `/source-skill` appear here and are immediately discoverable as `/<skill-name>`.

## Key Workflows

### Source → Modify → Review

1. `/source-skill <name>` — Copy a skill from Cowork into `.claude/skills/`
2. Edit the skill in `.claude/skills/<name>/SKILL.md`
3. `/skill-reviewer` — Check quality, safety, and traceability
4. Test the skill by running it on sample prompts

### Build a Plugin

1. Source and customize skills as above
2. `/plugin-builder` — Package selected skills into `plugins/<client>-plugin/`
3. Test by installing the plugin locally or zipping for import

### Contribute Back (optional)

1. Fork the source repo (e.g., Cowork) on GitHub
2. Apply your changes to the fork
3. Open a PR with `SOURCE.md` showing the delta
4. The stromy team reviews and merges

## Upstream Access

| Repo | Location | Purpose |
|------|----------|---------|
| Cowork | `upstream/cowork/` | Full skill source library with all skills, utilities, and patterns |
| duke-strategies-plugin | `upstream/duke-strategies-plugin/` | Example of a deployed client plugin |

To browse available skills: `ls upstream/cowork/.claude/skills/`

## Key Requirements

- **Commits**: Always use the `conventional-commit` skill
- **New skills**: Use `skill-creator` or `/source-skill` from upstream
- **Company data**: Always check `charter.json` before choosing colors/fonts
- **Upstream**: NEVER edit files in `upstream/` — use `/source-skill` instead
- **Instruction changes**: Run `/instruction-audit` to verify consistency
