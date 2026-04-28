# AGENTS.md

Self-contained instructions for Codex CLI and other agents working in ai4comms-playground.

## Project Overview

ai4comms-playground is a skill development sandbox for ai4comms. It provides a structured workspace to build, test, and package skills and plugins. Shared skills are automatically synced from Cowork via GitHub Actions.

## Repository Structure

```
ai4comms-playground/
├── .claude/skills/          # All skills (discoverable by agents)
├── rules/                   # Always-on rules (under .claude/)
├── upstream/                # READ-ONLY submodules (duke-strategies-plugin, global-skills)
├── scripts/                 # Setup script
├── plugins/                 # Plugin builds
├── companies/               # Company data
├── src/                     # Shared utilities (workspace.js/py, image-utils)
├── workspace/               # Test output (gitignored)
├── CLAUDE.md, AGENTS.md, README.md
```

## Critical Rules

### Upstream is Read-Only

The `upstream/` directory contains git submodules. NEVER edit, create, or delete files there.

### Shared Skills (Read-Only)

14 skills are synced automatically from Cowork: docx, messaging-framework, notebooklm, organic-social-campaign, paid-social-campaign, pdf, pptx, pptx-hd, press-release, proposal, quality-check, remotion-video, skill-reviewer, xlsx.

**Do not modify synced skills directly** — the sync pipeline will overwrite changes. To customize a synced skill, duplicate it with a `-custom` suffix (e.g., copy `pptx-hd/` → `pptx-hd-custom/`) and modify the copy only. This applies on all branches, not just main.

### Where Work Happens

- Build/modify skills: `.claude/skills/<skill-name>/`
- Build plugins: `plugins/<client-slug>-plugin/`
- Company data: `companies/<client-slug>/`
- Test output: `workspace/` (gitignored)

### Path Safety

- Company data: `companies/` (NOT `.claude/companies/`)
- Shared utilities: `src/` at repo root
- Never hardcode paths containing `stromy-org`, `Cowork`, or `upstream/`

## Commit Standards

All commits use Conventional Commits 1.0.0 with gitmoji.

### Header Format

```
<type>(<scope>): <gitmoji> <subject>
```

### Types

| Type | Gitmoji | When |
|------|---------|------|
| feat | ✨ | New feature |
| fix | 🐛 | Bug fix |
| docs | 📝 | Documentation |
| refactor | ♻️ | Code restructure |
| chore | 🔧 | Configuration, tooling |

Priority: feat > fix > perf > refactor > build/ci/chore > docs/test/style

### Branch Workflow

| Branch | Purpose |
|--------|---------|
| `main` | Stable, reviewed code + sync pipeline target (PR only) |
| `dev/emma` | Working branch — commit freely, experiment |
| `feat/<name>` | Clean single-feature branches for PRs (via cherry-pick-pr skill) |

Work on `dev/emma`. Periodically merge `main` to stay current. When a feature is ready, use the cherry-pick-pr skill to extract a clean PR from `dev/emma` into a `feat/<name>` branch.

### Main Branch Protection

On main: PRs required with CODEOWNERS review. No direct pushes.

## Skill Architecture

- Skills live in `.claude/skills/<skill-name>/SKILL.md`
- YAML frontmatter: `name`, `description` required
- Self-contained: may name other skills as context, never command activation
- Progressive disclosure: frontmatter always → SKILL.md on trigger → references/ on demand
- Keep SKILL.md under 700 lines; detail goes in `references/`

## Available Skills

### Global (from upstream/global-skills/, symlinked to ~/.claude/skills/ via scripts/setup.sh)
- **conventional-commit** — Commit workflow
- **skill-creator** — Create/improve skills with evals

### Infrastructure (local)
- **quality-check** — Structural validation

### Shared (synced from Cowork)
docx, messaging-framework, notebooklm, organic-social-campaign, paid-social-campaign, pdf, pptx, pptx-hd, press-release, proposal, quality-check, remotion-video, skill-reviewer, xlsx

## Company Data

```
companies/<client-slug>/
├── charter.json     # Colors, fonts, logo paths
├── profile.json     # Identity, services, credentials
└── brand/           # Logo files (optional)
```

Always check charter.json before selecting colors/fonts.

## Commands

```bash
bash scripts/setup.sh                     # First-time setup (submodules, global skills, hooks, deps)
git submodule update --init --recursive   # Init submodules
npm install                               # Node deps
uv sync                                   # Python deps
```
