# Contributing to ai4comms Playground

Welcome! This guide covers how we work together in this repo.

## Branch Workflow

We use a simple branch model:

| Branch | Purpose |
|--------|---------|
| `main` | Stable code. Updated via PRs and the skill sync pipeline. |
| `dev/emma` | Your working branch — commit freely, experiment, iterate. |
| `feat/<name>` | Clean single-feature branches for PRs. |

### Day-to-day

1. Work on `dev/emma` — commit as often as you like
2. Periodically pull in updates: `git checkout dev/emma && git merge main`
3. When something is ready for review, use `/cherry-pick-pr` — it extracts just the files for one feature into a clean PR
4. After the PR is merged, pull `main` and merge into `dev/emma`

## Working with Skills

### Using shared skills

14 skills are synced automatically from Cowork (see README for the full list). Use them freely — just run `/skill-name` in Claude Code.

### Customizing a shared skill

Shared skills update automatically, so edits to them would get overwritten. To customize one:

1. Copy the skill directory (e.g., `pptx-hd/` → `pptx-hd-custom/`)
2. Update the `name` in the copy's SKILL.md frontmatter
3. Make your changes in the copy — the original stays in sync

### Creating new skills

Use `/skill-creator` to scaffold a new skill in `.claude/skills/`. Skills you create independently are your own work.

## Commits

Use `/conventional-commit` for all commits — it handles formatting and commit messages automatically.

## Quick Reference

- **Skills**: `.claude/skills/`
- **Company data**: `companies/ai4comms/`
- **Test output**: `workspace/` (gitignored, safe to experiment)
- **Plugins**: `plugins/`
- **Reference plugin**: `upstream/duke-strategies-plugin/` (read-only)

## License

See [LICENSE](LICENSE) for full terms.
