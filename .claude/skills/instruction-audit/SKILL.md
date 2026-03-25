---
name: instruction-audit
description: Maintain the playground's AI instruction system (CLAUDE.md, AGENTS.md, .claude/rules/, skills). Three modes — "update" for targeted doc changes, "sync" to rebuild AGENTS.md from current rules, "drift" to detect undocumented changes. Triggers on "audit instructions", "check rules", "check for drift", "sync AGENTS.md", "update instructions".
---

# Instruction Audit

Maintain the AI instruction system. Three modes for different situations.

## Instruction Architecture

| Layer | File(s) | Loaded by | When loaded |
|-------|---------|-----------|-------------|
| Always-on | `CLAUDE.md` | Claude Code | Every session |
| Always-on | `AGENTS.md` | Codex CLI | Every Codex session |
| Path-scoped | `.claude/rules/*.md` | Claude Code | Session start (all rules) |
| On-trigger | `.claude/skills/*/SKILL.md` | Claude Code | When skill triggers |

### Agent Wiring

| Agent | Skills path | Target |
|-------|-------------|--------|
| Codex | `.agents/skills` | → `.claude/skills` |
| GitHub Copilot | `.github/skills` | → `.claude/skills` |

Only maintain skills under `.claude/skills/<skill-name>/` — the symlinks ensure every agent picks up changes automatically.

**Design constraints:**
- `AGENTS.md` must be self-contained (Codex can't resolve `.claude/rules/` or `@` refs)
- Skills must be self-contained — may name other skills as guidance, never command activation
- `.claude/rules/` all load at session start regardless of `paths:` frontmatter

## Mode 1: Update (targeted)

**When**: After adding a skill, modifying rules, or updating patterns.

1. Identify which instruction layers are affected
2. Update only the affected files
3. If the change affects `.claude/rules/`, also update AGENTS.md
4. If adding a new skill, update Skill Workflow in both CLAUDE.md and AGENTS.md
5. Check whether the change impacts other skills

## Mode 2: Sync AGENTS.md

**When**: After multiple rule changes have accumulated.

1. Read current CLAUDE.md and all `.claude/rules/*.md` files
2. Rebuild AGENTS.md by consolidating into a single self-contained file
3. Verify no `@` references, no `.claude/rules/` dependencies

## Mode 3: Drift (manual audit)

**When**: Periodically, or when instruction behavior seems outdated.

1. **Symlink validity** — `.agents/skills`, `.github/skills` resolve to `.claude/skills/`
2. **AGENTS.md self-containment** — No `.claude/rules/` references, no `@` imports
3. **Skill completeness** — Every directory in `.claude/skills/` has a `SKILL.md` with valid frontmatter
4. **CLAUDE.md skill workflow** — Every skill directory is referenced in CLAUDE.md
5. **Upstream integrity** — No local modifications in `upstream/`
6. **Context budget** — Count always-on lines (CLAUDE.md + all rules) — report as informational

Report findings:
```
## Drift Report

### Passing
- AGENTS.md self-contained: PASS
- Symlinks valid: PASS
- Skills complete: PASS (N/N with valid SKILL.md)
- Upstream integrity: PASS

### Warnings
- Context budget: N always-on lines (CLAUDE.md) + N (rules) = N total

### Failures
- (none)

### Verdict: CLEAN / DRIFT DETECTED
```

## Skill Conventions

- **Naming**: Gerund form preferred, noun phrases acceptable
- **Descriptions**: Third person, include trigger phrases
- **Self-containment**: May name other skills as guidance; never command activation
- **Size**: Keep SKILL.md under 700 lines; use `references/` for detail
- **Progressive disclosure**: Metadata always → SKILL.md on trigger → references on demand
