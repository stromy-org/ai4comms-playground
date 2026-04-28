# Playground Guardrails

## Read-Only Upstream (MANDATORY)

The `upstream/` directory contains **read-only** git submodules (duke-strategies-plugin, global-skills). These are reference material only.

- **NEVER** edit, create, or delete any file under `upstream/`
- **NEVER** run `git commit` in any `upstream/` subdirectory
- **NEVER** use `upstream/` as a working directory for skill output or workspace builds

## Shared Skills (Read-Only)

14 skills in `.claude/skills/` are synced automatically from Cowork: docx, messaging-framework, notebooklm, organic-social-campaign, paid-social-campaign, pdf, pptx, pptx-hd, press-release, proposal, quality-check, remotion-video, skill-reviewer, xlsx.

- **NEVER modify synced skill files directly** — the sync pipeline will overwrite your changes on the next push
- This applies on **all branches**, not just `main`
- To customize a synced skill, **duplicate it** with a `-custom` suffix:
  1. Copy the skill directory (e.g., `pptx-hd/` → `pptx-hd-custom/`)
  2. Rename the skill in the copy's SKILL.md frontmatter
  3. Make your changes in the copy only
- The original stays untouched, so the sync pipeline never conflicts with your work

## Where Work Happens

| Action | Location |
|--------|----------|
| Build/modify skills | `.claude/skills/<skill-name>/` |
| Build plugins | `plugins/<client-slug>-plugin/` |
| Company data | `companies/<client-slug>/` |
| Test output | `workspace/` (gitignored) |
| Read example plugin | `upstream/duke-strategies-plugin/` (read-only) |

## Path Safety

When writing or modifying skills, ensure paths are playground-relative:

- Company data: `companies/` (NOT `.claude/companies/`)
- Shared utilities: `src/` at repo root
- Skills: `.claude/skills/`
- Never hardcode absolute paths or paths containing `stromy-org`, `Cowork`, or `upstream/`
