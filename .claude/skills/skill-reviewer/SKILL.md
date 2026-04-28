---
name: skill-reviewer
description: "Review and score skill architecture quality against an 8-dimension rubric, or adapt externally-authored skills to match ClaudeCowork conventions. Two modes: Review & Maintain (audit existing skills) and Adapt External Skills (restructure imports). Triggers on: review skill, audit skill quality, score skill, adapt skill, import skill, skill modularity, improve skill, skill maturity."
---

# Skill Reviewer

Evaluate skill architecture quality and adapt external skills to ClaudeCowork conventions.

## Scope Boundary

This skill reviews **individual skill design** — architecture, modularity, company data integration, templates, and documentation quality.

**This skill** answers: "Is this skill well-designed? How can it improve?"
**instruction-audit** answers: "Is the instruction system wired correctly?" (file existence, symlinks, frontmatter presence, AGENTS.md sync)
**quality-check** answers: "Is the repo healthy?" (linting, validation, symlinks, coverage)

No overlap — these three complement each other.

## Mode 1: Review & Maintain

Score one or more skills against the 8-dimension rubric.

### Single Skill Review

1. **Select skill** — User names a skill or asks "review X"
2. **Read skill files** — Read `SKILL.md`, list `scripts/`, `references/`, `assets/`
3. **Domain research** (recommended) — Research current best practices for the skill's domain via web search. Skip only when the domain is highly specific with no meaningful external best-practice body. See [domain-research.md](references/domain-research.md) for methodology and skip criteria. Produces a **Best Practice Insights** section in the report and informs scoring of D4 (Templates), D7 (Documentation & Instruction Craft), and D3 (Modularity).
4. **Load rubric** — Read [review-rubric.md](references/review-rubric.md) for scoring criteria
5. **Score each dimension** (0-3):

| # | Dimension | What It Measures |
|---|-----------|-----------------|
| 1 | Frontmatter & Triggering Quality | Name conventions, description clarity, trigger accuracy, false-trigger rate |
| 2 | Company Data Integration | Charter discovery, profile reads, content library assembly |
| 3 | Modularity & Layer Separation | Hardcoded values, extracted utilities, layer split |
| 4 | Template Maturity | Parameterized templates, rendering scripts, variants |
| 5 | Progressive Disclosure | Line count, references/ usage, load triggers |
| 6 | Self-Containment & Conventions | No cross-skill calls, workspace pattern, naming, output format coverage |
| 7 | Documentation & Instruction Craft | Workflows, decision trees, instruction reasoning, freedom vs. rigidity |
| 8 | Evaluation Readiness | Eval prompts, testable outputs, feedback loops, benchmarks |

Mark dimensions **N/A** when they don't apply to the skill type (e.g., utility skills skip Company Data, Template Maturity).

6. **Produce report** using the format below

### Report Format

```markdown
## Skill Review: <skill-name>

### Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Frontmatter & Triggering | ?/3 | ... |
| Company Data | ?/3 or N/A | ... |
| Modularity | ?/3 or N/A | ... |
| Templates | ?/3 or N/A | ... |
| Progressive Disclosure | ?/3 | ... |
| Self-Containment | ?/3 | ... |
| Documentation & Instruction Craft | ?/3 | ... |
| Evaluation Readiness | ?/3 or N/A | ... |
| **Total** | **?/?** | **<Band>** |

Maturity bands: Nascent (0-33%), Developing (34-66%), Mature (67-85%), Gold Standard (86-100%)

### Best Practice Insights
_From domain research (Step 3). Tag each finding._

| Finding | Source | Applicability |
|---------|--------|---------------|
| <best practice> | <source URL or name> | ✅ Directly applicable / 🔄 Needs adaptation / ⬜ Not relevant |
| ... | ... | ... |

**Gaps identified:** <practices the skill should adopt>
**Already strong:** <where the skill aligns with or exceeds industry norms>

### Key Findings
- <what the skill does well>
- <architectural gaps>

### Integration Opportunities
- <company data fields the skill could use>
- <content library items that could be mapped>
- <template patterns that could be extracted>

### Prioritized Recommendations
1. <highest impact, lowest effort change>
2. <next priority>
3. <nice to have>
```

### Review All (Sweep Mode)

When the user asks to review all skills or produce a maturity matrix:

1. List all skills in `.claude/skills/`
2. For each skill, perform a quick review (read SKILL.md, score dimensions)
3. **Skip domain research** by default (too slow for full sweep). Flag skills that would benefit from a deep review with domain research in the matrix.
4. Load baseline scores from [review-rubric.md](references/review-rubric.md) for reference
5. Produce a **maturity matrix**:

```markdown
## Skill Maturity Matrix

| Skill | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | Total | Band |
|-------|----|----|----|----|----|----|----|----|-------|------|
| ... | ... | ... | ... | ... | ... | ... | ... | ... | .../... | ... |

### Summary
- Gold Standard: N skills
- Mature: N skills
- Developing: N skills
- Nascent: N skills

### Top 3 Improvement Priorities
1. <skill> — <reason> — <suggested action>
2. ...
3. ...
```

---

## Maintenance Cadence

### When to Re-Review
- After a Claude model update (Sonnet/Opus version bump)
- After significant skill edits (>20% of SKILL.md changed)
- After convention changes (CLAUDE.md, dev-patterns.md updates)
- Quarterly sweep recommended for the full portfolio

### Drift Signals
- Users report the skill "feels worse" or triggers incorrectly
- Eval pass rates drop compared to previous benchmark
- New skills create triggering conflicts with existing ones

---

## Mode 2: Adapt External Skills

Restructure an imported or externally-authored skill to match ClaudeCowork conventions.

### When to Use

- User imports a skill from another repo or skill marketplace
- User has a SKILL.md that doesn't follow conventions
- User asks to "adapt", "import", or "restructure" a skill

### Procedure

1. **Intake** — Read the skill, inventory all files, classify type (format/domain/utility/integration/reference). See [adaptation-workflow.md](references/adaptation-workflow.md) Phase 1.

2. **Convention mapping** — Check each convention against the adaptation checklist:
   - Frontmatter: name + description with triggers
   - Self-containment: no cross-skill invocation
   - Workspace pattern: root node_modules, no workspace package.json
   - Naming: directory = name field, kebab-case
   - Progressive disclosure: under 700 lines, detail in references/
   - No hardcoded brand values

3. **Company data integration design** — Based on skill type:
   - **Format/Domain skills**: Add full charter discovery + content library assembly. See [gold-standard-patterns.md](references/gold-standard-patterns.md) for the three-layer pattern.
   - **Integration skills**: Add profile discovery only
   - **Utility/Reference skills**: Skip (mark as N/A)

4. **Template extraction** — Identify repeated output patterns, parameterize with CSS variables or template literals, create rendering mechanism.

5. **Restructure & package** — Create directory structure, write SKILL.md, organize resources, validate with `quick_validate.py`.

6. **Gap report** — Document changes, remaining manual work, and before/after scores. See [adaptation-workflow.md](references/adaptation-workflow.md) Phase 6.

### Quick Convention Checklist

| Convention | Required | Check |
|------------|----------|-------|
| SKILL.md exists | Yes | File present in skill directory |
| Frontmatter has name + description | Yes | YAML block with required fields |
| Name is kebab-case | Yes | Lowercase, hyphens, no spaces |
| Name matches directory | Yes | `name: foo-bar` in `foo-bar/SKILL.md` |
| Description has triggers | Recommended | Includes when/how the skill activates |
| Body under 700 lines | Yes | Count lines after frontmatter |
| No cross-skill invocation | Yes | No "run /other-skill" patterns |
| Root node_modules | Yes (if scripts) | `require('../../node_modules/...')` |
| No workspace package.json | Yes (if scripts) | Scripts use root dependencies |
| Output to workspace/\<project\>/output/ | Recommended | Standard output location |
| Standard subdirectory names | Yes | Use `references/` (not `rules/`), `scripts/`, `assets/`, `templates/` |

---

## Reference Files

Load these on demand — do not read all at once.

| File | When to Load |
|------|-------------|
| [domain-research.md](references/domain-research.md) | When performing domain research (Mode 1, Step 3). Contains research methodology, query strategy, and applicability classification guide. |
| [review-rubric.md](references/review-rubric.md) | When scoring a skill (Mode 1). Contains full criteria for all 8 dimensions, baseline scores, and cross-model notes. |
| [gold-standard-patterns.md](references/gold-standard-patterns.md) | When assessing modularity/integration or designing adaptations (Mode 2). Contains three-layer architecture, charter discovery, content library assembly, and consulting deliverable quality patterns. |
| [adaptation-workflow.md](references/adaptation-workflow.md) | When adapting an external skill (Mode 2). Contains triage (Phase 0) plus 6-phase procedure with checklists and report template. |
