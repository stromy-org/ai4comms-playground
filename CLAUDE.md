# CLAUDE.md

This file provides guidance to Claude Code when working in the ai4comms-playground. Development patterns and guardrails are in `.claude/rules/` and load automatically.

## Project Overview

ai4comms-playground is a **skill development sandbox** for ai4comms. It provides a structured workspace to build, test, and package skills and plugins, with shared skills automatically synced from Cowork.

## Repository Structure

```
ai4comms-playground/
├── .claude/
│   ├── skills/                    # All skills live here (discoverable)
│   │   ├── quality-check/         # Structural validation
│   │   ├── skill-reviewer/        # Review skill quality
│   │   ├── plugin-builder/        # Build plugins from skills
│   │   └── <shared-skills>/       # 14 skills synced from Cowork (see below)
│   ├── rules/                     # Always-on rules
│   └── bootstrap-version.json
├── upstream/                      # READ-ONLY submodules
│   ├── duke-strategies-plugin/    # Example deployed plugin
│   └── global-skills/             # Global skills (conventional-commit, skill-creator)
├── scripts/
│   └── setup.sh                   # One-time setup (submodules, symlinks, deps)
├── plugins/                       # Plugin builds (zip + import)
├── companies/                     # Company data for clients
│   └── ai4comms/
├── src/                           # Shared utilities
├── workspace/                     # Test output (gitignored)
├── CLAUDE.md                      # This file
├── AGENTS.md                      # Self-contained Codex instructions
└── README.md                      # Onboarding guide
```

## First-Time Setup

After cloning the repo, run the setup script:

```bash
bash scripts/setup.sh
```

This does four things:
1. Initializes submodules (global-skills, duke-strategies-plugin)
2. Symlinks `~/.claude/skills` → `upstream/global-skills/` (installs conventional-commit + skill-creator)
3. Configures git hooks
4. Installs Node and Python dependencies

If you already have `~/.claude/skills` set up differently, the script will warn you and show manual steps.

## Commands

```bash
# Setup (first time only)
bash scripts/setup.sh                    # Full setup

# Submodule operations
git submodule update --init --recursive   # Initialize submodules

# Dependencies
npm install                               # Install Node dependencies
uv sync                                   # Install Python dependencies

# Validation
python -m json.tool companies/ai4comms/charter.json   # Validate JSON
```

## Skill Workflow

### Global Skills (from upstream/global-skills/, symlinked to ~/.claude/skills/)
- **conventional-commit** — Git commit workflow with Conventional Commits + gitmoji
- **skill-creator** — Create new skills with eval framework

### Infrastructure Skills (local)
- **quality-check** — Validate playground structural integrity

### Shared Skills (synced from Cowork — read-only)

These 14 skills are automatically synced from Cowork via GitHub Actions. **Do not modify them directly** — the sync pipeline will overwrite changes. To customize a synced skill, duplicate it with a `-custom` suffix (e.g., `pptx-hd/` → `pptx-hd-custom/`).

| Skill | Purpose |
|-------|---------|
| docx | Document creation and editing |
| messaging-framework | Structured messaging frameworks |
| notebooklm | Google NotebookLM content generation |
| organic-social-campaign | Organic social media campaigns |
| paid-social-campaign | Paid social media campaigns |
| pdf | PDF manipulation and creation |
| pptx | Presentation creation and editing |
| pptx-hd | High-fidelity branded presentations |
| press-release | Corporate press releases |
| proposal | Consulting proposals and bid documents |
| quality-check | Structural validation |
| remotion-video | Animated videos with Remotion |
| skill-reviewer | Skill quality review |
| xlsx | Spreadsheet creation and analysis |

### How Sync Works

1. When shared skills change in Cowork, a GitHub Action copies them into this repo's `.claude/skills/`
2. The update merges directly to `main`
3. Portability transforms are applied automatically (path adjustments for the playground structure)
4. Since synced skills are never edited locally, there are no merge conflicts

## Key Workflows

### Branch Workflow

| Branch | Purpose |
|--------|---------|
| `main` | Stable, reviewed code + sync pipeline target (PR only) |
| `dev/emma` | Working branch — commit freely, experiment |
| `feat/<name>` | Clean single-feature branches for PRs (via `/cherry-pick-pr`) |

1. Work on `dev/emma` — commit freely
2. Periodically merge `main` to stay current: `git merge main`
3. When a feature is ready, use `/cherry-pick-pr` to extract a clean PR
4. After merge, pull `main` and merge into `dev/emma`

### Develop → Review → Test

1. Create or duplicate a skill in `.claude/skills/` (duplicate synced skills with `-custom` suffix)
2. Edit the skill in `.claude/skills/<name>/SKILL.md`
3. `/skill-reviewer` — Check quality and architecture
4. Test the skill by running it on sample prompts

### Contribute Back (optional)

1. Fork the Cowork repo on GitHub
2. Apply your changes to the fork
3. Open a PR — the stromy team reviews and merges

## Upstream Access

| Repo | Location | Purpose |
|------|----------|---------|
| duke-strategies-plugin | `upstream/duke-strategies-plugin/` | Example of a deployed client plugin |
| global-skills | `upstream/global-skills/` | Global skills (conventional-commit, skill-creator) |

## Key Requirements

- **Commits**: Always use the `conventional-commit` skill (global, inherited from ~/.claude/skills/)
- **New skills**: Use `skill-creator` (global) to scaffold new skills
- **Company data**: Always check `charter.json` before choosing colors/fonts
- **Synced skills**: NEVER modify synced skills directly — duplicate with `-custom` suffix to customize
- **Upstream**: NEVER edit files in `upstream/` — these are read-only submodules
- **Quality checks**: Run `/quality-check` to verify structural integrity

## Context Management

When compacting, preserve: current skill being developed, any error messages being debugged.
