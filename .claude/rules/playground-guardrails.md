# Playground Guardrails

## Read-Only Upstream (MANDATORY)

The `upstream/` directory contains **read-only** git submodules. These are reference material only.

- **NEVER** edit, create, or delete any file under `upstream/`
- **NEVER** run `git commit` in any `upstream/` subdirectory
- **NEVER** use `upstream/` as a working directory for skill output or workspace builds
- To use a skill from upstream, use the `/source-skill` workflow which safely copies and adapts it

## Where Work Happens

| Action | Location |
|--------|----------|
| Build/modify skills | `.claude/skills/<skill-name>/` |
| Build plugins | `plugins/<client-slug>-plugin/` |
| Company data | `companies/<client-slug>/` |
| Test output | `workspace/` (gitignored) |
| Read reference skills | `upstream/cowork/.claude/skills/` (read-only) |
| Read example plugin | `upstream/duke-strategies-plugin/` (read-only) |

## Path Safety

When writing or modifying skills, ensure paths are playground-relative:

- Company data: `companies/` (NOT `.claude/companies/`)
- Shared utilities: `src/` at repo root
- Skills: `.claude/skills/`
- Never hardcode absolute paths or paths containing `stromy-org`, `Cowork`, or `upstream/`
