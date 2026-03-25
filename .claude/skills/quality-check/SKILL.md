---
name: quality-check
description: Run playground structural validation checks and report findings. Validates skill completeness, symlinks, upstream submodule state, guardrails, and cross-references.
---

# Quality Check

Run the ai4comms-playground quality suite and report findings.

## When to Use

- Before committing changes
- After sourcing or creating new skills
- After modifying company data
- Periodic health checks

## Workflow

### Phase 1: Structural Checks

1. **Symlinks valid** — Verify all symlinks resolve correctly:
   - `.agents/skills` → `.claude/skills`
   - `.github/skills` → `.claude/skills`

2. **SKILL.md frontmatter valid** — For each directory in `.claude/skills/`, verify `SKILL.md` exists and has valid YAML frontmatter with `name` and `description` fields.

3. **Upstream submodules intact** — Verify `upstream/cowork` and `upstream/duke-strategies-plugin` exist and are valid git submodules. Check that no local modifications exist in upstream directories.

4. **Git hooks configured** — Verify `.githooks/pre-commit` exists and `core.hooksPath` is set to `.githooks`.

5. **Company data valid** — For each directory in `companies/`, verify `charter.json` and `profile.json` exist and are valid JSON.

### Phase 2: Cross-Reference Checks

1. **CLAUDE.md skill refs** — Every skill referenced in CLAUDE.md's Skill Workflow section has a corresponding directory in `.claude/skills/`.

2. **Skill dirs in CLAUDE.md** — Every directory in `.claude/skills/` is mentioned in CLAUDE.md.

3. **AGENTS.md self-contained** — Verify AGENTS.md contains no `.claude/rules/` references and no `@` imports.

4. **Source traceability** — For each skill with a `SOURCE.md`, verify it contains: origin repo, origin path, source commit hash, date sourced.

5. **Sandbox safety** — Grep all skills for hardcoded paths to stromy-org or references to upstream/ in outputs. Flag any findings.

### Phase 3: Report

```
## Quality Report — ai4comms-playground

### Structural Checks
- [x] Symlinks: 2/2 valid
- [x] SKILL.md frontmatter: N/N valid
- [x] Upstream submodules: intact, no local modifications
- [x] Git hooks: configured
- [x] Company data: valid

### Cross-Reference Checks
- [x] CLAUDE.md skill refs: N/N exist
- [x] Skill dirs in CLAUDE.md: N/N referenced
- [x] AGENTS.md self-contained: PASS
- [x] Source traceability: N/N sourced skills have valid SOURCE.md
- [x] Sandbox safety: PASS (no stromy-org paths found)

### Summary
Total checks: N passed, N warnings, N failures
```
