---
name: skill-reviewer
description: Review skill quality with playground-specific dimensions including source traceability and sandbox safety. Produces a scored report with maturity band. Use when reviewing a skill before committing, after modifications, or for periodic quality sweeps. Triggers on "review skill", "check skill quality", "skill review", "audit skill".
---

# Skill Reviewer

Review skills for quality, safety, and traceability in the playground context.

## When to Use

- After sourcing a skill from upstream (verify portability)
- After modifying a skill (verify nothing broke)
- Before committing a skill change
- Periodic quality sweeps across all skills

## Dimensions

| # | Dimension | What It Measures | Max Score |
|---|-----------|-----------------|-----------|
| 1 | Frontmatter & Triggering | Name conventions, description clarity, trigger accuracy | 3 |
| 2 | Source Traceability | Has SOURCE.md? Origin documented? Delta from upstream tracked? | 3 |
| 3 | Sandbox Safety | No hardcoded stromy-org paths? No upstream/ refs in outputs? No broken paths? | 3 |
| 4 | Progressive Disclosure | Line count, references/ usage, load triggers | 3 |
| 5 | Self-Containment | No cross-skill activation commands, naming, directory structure | 3 |
| 6 | Documentation & Instruction Craft | Workflows, decision trees, reasoning, freedom vs. rigidity | 3 |
| 7 | Evaluation Readiness | Eval prompts, testable outputs, feedback loops | 3 |

### Dimension Details

#### D1: Frontmatter & Triggering (3 pts)

- 3: Name matches directory, description is specific with trigger phrases, "pushy" enough to fire
- 2: Name matches, description present but vague or missing triggers
- 1: Missing fields or name doesn't match directory

#### D2: Source Traceability (3 pts)

- 3: SOURCE.md present with origin repo, path, commit hash, date, and transforms list
- 2: SOURCE.md present but incomplete (missing commit hash or transforms)
- 1: No SOURCE.md for a skill that was clearly sourced from upstream
- N/A: Skill was created from scratch in the playground (note this in report)

#### D3: Sandbox Safety (3 pts)

- 3: No hardcoded paths to stromy-org, Cowork internals, or upstream/. All paths are playground-relative.
- 2: Minor path issues (e.g., comments reference Cowork but executable paths are clean)
- 1: Executable paths reference Cowork or stromy-org directories — skill will break

Check for:
- `stromy-org` in any path
- `/Cowork/` in any path
- `upstream/` referenced as an output or working directory
- `.claude/companies/` (should be `companies/` in playground)
- `../../../../` depth patterns that assume Cowork's directory structure

#### D4: Progressive Disclosure (3 pts)

- 3: SKILL.md under 500 lines, large reference material in references/, clear pointers
- 2: SKILL.md 500-700 lines, or references exist but aren't well-signposted
- 1: SKILL.md over 700 lines with no references/ offloading

#### D5: Self-Containment (3 pts)

- 3: No cross-skill activation commands. May mention other skills as context only.
- 2: Mentions other skills but borderline directing (e.g., "consider using X")
- 1: Explicitly commands activation of another skill ("run /X", "use the X skill's workflow")

#### D6: Documentation & Instruction Craft (3 pts)

- 3: Clear workflows, decision trees where needed, explains "why" not just "what", good balance of freedom and structure
- 2: Functional instructions but missing rationale or overly rigid
- 1: Vague or contradictory instructions

#### D7: Evaluation Readiness (3 pts)

- 3: Has evals/evals.json with ≥2 test cases, expectations defined
- 2: Has eval structure but incomplete (1 case, or no expectations)
- 1: No eval infrastructure
- N/A: Maintenance/meta skill where evals aren't applicable

## Report Format

```markdown
## Skill Review: <skill-name>

### Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Frontmatter & Triggering | ?/3 | ... |
| Source Traceability | ?/3 or N/A | ... |
| Sandbox Safety | ?/3 | ... |
| Progressive Disclosure | ?/3 | ... |
| Self-Containment | ?/3 | ... |
| Documentation & Instruction Craft | ?/3 | ... |
| Evaluation Readiness | ?/3 or N/A | ... |
| **Total** | **?/?** | **<Band>** |
```

## Maturity Bands

Bands scale proportionally when dimensions are N/A:

| Band | Range | Meaning |
|------|-------|---------|
| Nascent | 0–33% | Missing fundamentals, needs significant rework |
| Developing | 34–66% | Functional but inconsistent, clear improvement path |
| Mature | 67–85% | Solid architecture, minor gaps remain |
| Gold Standard | 86–100% | Exemplary, suitable as a pattern reference |

## Sweep Mode

When reviewing all skills:

```markdown
## Skill Maturity Matrix

| Skill | D1 | D2 | D3 | D4 | D5 | D6 | D7 | Total | Band |
|-------|----|----|----|----|----|----|-----|-------|------|
| ...   | ...| ...| ...| ...| ...| ...| ... | .../? | ...  |

### Top 3 Improvement Priorities
1. <skill> — <reason> — <suggested action>
```
