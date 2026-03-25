# AGENTS.md

Self-contained instructions for Codex CLI and other agents working in ai4comms-playground.

## Project Overview

ai4comms-playground is a skill development sandbox for ai4comms. It provides read-only access to upstream skill libraries (Cowork, duke-strategies-plugin) and a structured workspace to build, test, and package skills and plugins.

## Repository Structure

```
ai4comms-playground/
├── .claude/skills/          # All skills (discoverable by agents)
├── rules/                   # Always-on rules (under .claude/)
├── upstream/                # READ-ONLY submodules (Cowork, duke-strategies-plugin)
├── plugins/                 # Plugin builds
├── companies/               # Company data
├── src/                     # Shared utilities (workspace.js/py, image-utils)
├── workspace/               # Test output (gitignored)
├── CLAUDE.md, AGENTS.md, README.md
```

## Critical Rules

### Upstream is Read-Only

The `upstream/` directory contains git submodules. NEVER edit, create, or delete files there. To use a skill from upstream, copy it manually into `.claude/skills/`.

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

### Main Branch Protection

On main/master: auto-create feature branch → commit(s) → checkout main → merge --no-ff → delete branch.

## Skill Architecture

- Skills live in `.claude/skills/<skill-name>/SKILL.md`
- YAML frontmatter: `name`, `description` required
- Self-contained: may name other skills as context, never command activation
- Progressive disclosure: frontmatter always → SKILL.md on trigger → references/ on demand
- Keep SKILL.md under 700 lines; detail goes in `references/`

## Available Skills

### Infrastructure
- **conventional-commit** — Commit workflow
- **skill-creator** — Create/improve skills with evals
- **quality-check** — Structural validation
- **instruction-audit** — Instruction system maintenance

### Playground
- **source-skill** — Copy and adapt skills from upstream
- **skill-reviewer** — Review quality with source traceability
- **plugin-builder** — Package skills into plugins

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
git submodule update --init --recursive   # Init submodules
git submodule update --remote             # Pull latest
npm install                               # Node deps
uv sync                                   # Python deps
```
