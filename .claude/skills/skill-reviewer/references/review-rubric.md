# Skill Review Rubric

8-dimension scoring rubric for evaluating skill architecture quality. Each dimension is scored 0-3.

> **Cross-model awareness:** Skills score differently on Haiku vs. Sonnet vs. Opus. Haiku needs more explicit guidance; Opus can handle higher-freedom instructions. When reviewing, note if the skill's instruction density is appropriate for its likely model target.

**Maturity bands** (total 0-24):
- **Nascent** (0-8): Missing fundamentals, needs significant rework
- **Developing** (9-15): Functional but inconsistent, clear improvement path
- **Mature** (16-20): Solid architecture, minor gaps remain
- **Gold Standard** (21-24): Exemplary, suitable as a pattern reference

---

## Dimension 1: Frontmatter & Triggering Quality

| Level | Score | Criteria |
|-------|-------|----------|
| Missing | 0 | No frontmatter, or missing `name`/`description` |
| Basic | 1 | Has `name` and `description`, but description is vague or too short |
| Good | 2 | Clear description with usage scenarios; kebab-case name matches directory |
| Excellent | 3 | Description includes tested trigger phrases; false-trigger rate below 20% against competing skills; trigger coverage is assertive enough to combat undertriggering without being so broad it captures adjacent skills |

**Checks:**
- `name` present, kebab-case, matches directory name
- `description` present, under 1024 characters, no angle brackets
- Description explains *when* to use the skill (scenarios, file types, tasks)
- Trigger phrases included (e.g., "create proposal", "edit spreadsheet")
- Third-person voice preferred ("This skill..." not "I will...")
- No TODO placeholders remaining
- Description is "pushy" enough to combat undertriggering (per skill-creator guidance) without false-triggering on adjacent skills
- Trigger accuracy tested via `run_eval.py` or equivalent (for score 3)

---

## Dimension 2: Company Data Integration

| Level | Score | Criteria |
|-------|-------|----------|
| None | 0 | No company data awareness; hardcoded colors/fonts/company info |
| Awareness | 1 | Mentions checking `client-data/clients/` but no structured workflow |
| Discovery | 2 | Has charter discovery pattern with fallback; reads profile.json or charter.json |
| Full Integration | 3 | Discovers company, reads charter + profile, uses all company data fields relevant to the skill's domain, provides fallbacks when no data exists |

**Checks:**
- References `client-data/clients/<name>/` discovery pattern
- Reads `charter.json` before selecting colors/fonts
- Reads `profile.json` for company identity when relevant (name, tagline, contact info)
- Provides explicit fallback behavior when no company data exists
- **Content-centric skills only** (proposal, RFP): Assembles content from `proposals/*.json` by tag/service matching; uses content variants (e.g., `executive` vs `technical` bio)
- **Format/output skills** (pptx, docx, xlsx, pdf): Charter + profile identity is sufficient for full integration — content library assembly is not expected

**Note:** Not all skills need company data. Score N/A for pure utility skills (mermaid, conventional-commit, quality-check, instruction-audit, skill-creator, sync-skills, frontend-design, web-artifacts-builder). For these, this dimension is excluded from the total and the max becomes 18.

---

## Dimension 3: Modularity & Layer Separation

| Level | Score | Criteria |
|-------|-------|----------|
| Monolithic | 0 | All logic in one flat file; hardcoded values throughout |
| Extracted | 1 | Some values parameterized; helper scripts exist but tightly coupled |
| Layered | 2 | Clear separation between generic logic and brand/company customization; reusable utilities |
| Three-Layer | 3 | Full base → branded → company data architecture; base skill provides generic logic, branded layer adds templates/rendering, company data provides customization |

**Checks:**
- No hardcoded brand values (colors, fonts, logos) in SKILL.md body
- Reusable scripts/utilities extracted to `scripts/`
- Templates parameterized (accept variables, not hardcoded content)
- Clear boundary between "what the skill does" and "how it looks"
- Build scripts accept a `BRAND_DIR` or equivalent configuration point
- If a branded variant exists, base skill provides the generic workflow

---

## Dimension 4: Template Maturity

| Level | Score | Criteria |
|-------|-------|----------|
| None | 0 | No templates; all output generated inline |
| Static | 1 | Fixed templates with no parameterization |
| Parameterized | 2 | Templates accept variables; rendering scripts transform data into output |
| Comprehensive | 3 | Multiple template variants with selection guide; rendering pipeline with validation; template customization documented |

**Checks:**
- Templates exist in `assets/` or `templates/` (or inline if simple)
- Templates use placeholder syntax (mustache `{{var}}`, CSS variables, or equivalent)
- Rendering script transforms data + template into output
- Multiple variants available for different use cases
- Template selection criteria documented
- Output validation or preview step exists

**Note:** Not all skills produce templated output. Score N/A for reference/guideline skills (conventional-commit, instruction-audit, quality-check, skill-creator). For these, exclude from total.

**Creative flexibility note:** Skills that intentionally prioritize creative freedom over rigid template variants (e.g., pptx's freeform HTML approach) can achieve score 3 through: a parameterized scaffold with brand injection, documented customization points, and a validation pipeline — without requiring multiple fixed template variants. The goal is output quality, not template quantity.

---

## Dimension 5: Progressive Disclosure

| Level | Score | Criteria |
|-------|-------|----------|
| Overloaded | 0 | SKILL.md over 700 lines; all detail in one file |
| Trimmed | 1 | SKILL.md under 700 lines but no `references/` usage |
| Structured | 2 | SKILL.md under 700 lines; detailed content moved to `references/`; clear pointers to reference files |
| Optimal | 3 | Lean SKILL.md with summary + decision tree; `references/` for deep content; explicit load triggers ("read X when Y"); table of contents for large reference files |

**Checks:**
- SKILL.md body under 700 lines (hard requirement)
- SKILL.md body under 300 lines (aspirational for complex skills)
- Detailed workflows, schemas, and examples in `references/`
- SKILL.md contains pointers like "see [file](references/file.md)" or "load references/file.md when..."
- Reference files have clear scope (one topic per file)
- No redundant content between SKILL.md and references

---

## Dimension 6: Self-Containment & Conventions

| Level | Score | Criteria |
|-------|-------|----------|
| Broken | 0 | Invokes other skills; creates workspace package.json; broken paths |
| Partial | 1 | Self-contained but ignores workspace conventions (wrong node_modules path, no output directory pattern); or mentions output formats without any format skill references |
| Compliant | 2 | Self-contained; follows workspace conventions; uses root node_modules; correct output paths; most output formats referenced, at most one gap |
| Exemplary | 3 | All conventions followed; naming matches pattern (gerund/noun); directory structure clean; no dead files; all mentioned output formats have corresponding format skill references |

**Checks:**
- No cross-skill invocation (no "run `/other-skill`" or "use the X skill")
- Exception: references to skill-creator for guidance are acceptable
- Workspace builds use root `node_modules/` via relative paths
- No workspace-level `package.json` created (exception: Remotion projects identified by `.remotion-project` marker — these require a local `package.json` for the bundler/Chrome binary)
- Output goes to `workspace/<project>/output/` (Remotion uses `out/`)
- Directory name matches `name` field in frontmatter
- No orphaned or dead files in skill directory
- References use relative paths that resolve correctly
- Subdirectories follow naming conventions: `references/` (not `rules/`), `scripts/`, `assets/`, `templates/`

#### Output Format Coverage (within D6)

When reviewing a skill, scan for output format mentions:
- Keywords: "PDF", "DOCX", "Word", "PPTX", "PowerPoint", "XLSX", "Excel", "spreadsheet"
- If found, verify the skill references the corresponding format skill (`pdf`, `docx`, `pptx`, `xlsx`)
- Reference can be: Output Capabilities table, inline mention, or "handled by X skill"
- Missing reference = unstable: Claude may attempt to produce the format without
  the format skill's critical rules (DXA units, OOXML quirks, brand integration, etc.)

Severity:
- Domain skill missing format reference → HIGH risk (content + format are separated by design)
- Utility skill mentioning format in passing → LOW risk (likely just describing, not producing)

---

## Dimension 7: Documentation & Instruction Craft

| Level | Score | Criteria |
|-------|-------|----------|
| Minimal | 0 | No workflow description; unclear when/how to use |
| Basic | 1 | Has overview and basic steps; missing edge cases |
| Thorough | 2 | Clear workflow with decision trees; edge cases covered; instructions explain reasoning, not just commands; no excessive MUST/NEVER without justification |
| Comprehensive | 3 | Decision trees for all paths; examples for common scenarios; instructions are lean and well-reasoned; uses theory of mind (explains "why" behind constraints); balances freedom vs. rigidity appropriately for the skill's domain; no dead-weight instructions |

**Checks:**
- Overview explains what the skill does and when to use it
- Workflow steps are numbered or clearly sequenced
- Decision tree or conditional logic for branching paths
- Edge cases and error handling documented
- Validation or quality gate steps included
- "When to use" and "when NOT to use" boundaries clear
- Examples with realistic inputs and expected outputs
- Customization guidance for advanced users
- "Does Claude really need this explanation?" test applied — no superfluous instructions
- No unexplained ALWAYS/NEVER/MUST in all-caps without reasoning
- Instruction specificity matches task fragility (high freedom for creative tasks, low for destructive operations)
- Repeated patterns extracted to scripts rather than described verbosely

---

## Dimension 8: Evaluation Readiness

| Level | Score | Criteria |
|-------|-------|----------|
| None | 0 | No evals, no testable outputs, no feedback loops |
| Awareness | 1 | Output is verifiable; skill mentions validation steps; eval tier assigned (see `dev-patterns.md` Eval Tiers) |
| Testable | 2 | Has eval prompts in `evals/evals.json`; assertions test structure not subjective quality; no non-discriminating assertions; includes validate-fix-repeat feedback loops |
| Evaluated | 3 | Evals run with holdout split; benchmarks tagged with model + date; eval cases rotated within last 2 quarters; description optimized via trigger eval |

**Checks:**
- Does the skill produce verifiable output (files, structured text, measurable results)?
- Is an eval tier assigned per `dev-patterns.md` Skill Evaluation Patterns?
- Are there eval prompts that test the skill against realistic user requests?
- Do assertions test structure/format, not subjective content quality (anti-Goodhart)?
- Are there any non-discriminating assertions (pass in both with-skill and without-skill)?
- Does the skill include a feedback loop (validate output → fix issues → retry)?
- Has the description been tested for trigger accuracy (false positives/negatives)?
- Are benchmark scores tagged with `executor_model` and `eval_version`?
- Have eval cases been rotated within the last 2 quarters?
- Has adversarial human review been performed (outputs reviewed without seeing scores)?

**Note:** Score N/A for pure reference skills that produce no actionable output and cannot meaningfully be evaluated. Most skills — even guideline-heavy ones like conventional-commit — have testable behavior (correct commit format, branch checks) and should be scored.

---

## Baseline Scores (Current Skills)

Reference scores based on current skill state. These inform reviews and track improvement.

| Skill | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 | Total | Band |
|-------|----|----|----|----|----|----|----|----|-------|------|
| pptx | 2 | 3 | 3 | 2 | 3 | 3 | 3 | 0 | 19/24 | Mature |
| proposal | 3 | 3 | 2 | N/A | 3 | 3 | 3 | 0 | 17/21 | Mature |
| docx | 2 | 2 | 2 | 2 | 2 | 3 | 2 | 0 | 15/24 | Developing |
| pdf | 2 | 1 | 2 | 1 | 2 | 3 | 2 | 0 | 13/24 | Developing |
| xlsx | 2 | 0 | 1 | 0 | 1 | 2 | 2 | 0 | 8/24 | Nascent |
| remotion-video | 3 | 2 | 2 | 2 | 3 | 3 | 3 | 0 | 18/24 | Mature |
| conventional-commit | 3 | N/A | N/A | N/A | 2 | 3 | 3 | 1 | 12/15 | Mature |
| instruction-audit | 3 | N/A | N/A | N/A | 2 | 3 | 3 | 1 | 12/15 | Mature |
| quality-check | 2 | N/A | N/A | N/A | 1 | 3 | 2 | 1 | 9/15 | Developing |
| skill-creator | 3 | N/A | N/A | N/A | 3 | 3 | 3 | 3 | 15/15 | Gold Standard |
| mermaid | 2 | N/A | N/A | N/A | 1 | 3 | 2 | 0 | 8/15 | Developing |
| frontend-design | 2 | N/A | 2 | 1 | 2 | 3 | 2 | 0 | 12/21 | Developing |
| web-artifacts-builder | 2 | N/A | 2 | 2 | 2 | 3 | 2 | 0 | 13/21 | Developing |
| vitepress-dev | 2 | 1 | 2 | 1 | 2 | 3 | 2 | 0 | 13/24 | Developing |
| reepl | 2 | N/A | N/A | N/A | 1 | 3 | 2 | 0 | 8/15 | Developing |
| claude-api | 2 | N/A | N/A | N/A | 2 | 3 | 2 | 0 | 9/15 | Developing |

**Reading the table:**
- N/A dimensions are excluded from both score and max (e.g., 12/15 means 5 dimensions scored)
- Band thresholds scale proportionally when dimensions are excluded
- Scores reflect architectural quality, not content usefulness
- These baselines should be updated after each review cycle
- D8 (Evaluation Readiness): Target high-tier skills at D8≥2, medium-tier at D8≥1 by next quarterly review

### Priority Improvement Targets

Skills with the highest impact-to-effort ratio for improvement:

1. **xlsx** (8/24 Nascent) — No brand integration, no templates, no evals. Quick win: add charter discovery for branded spreadsheets.
2. **pdf** (13/24 Developing) — Has scripts but limited brand/content integration. Medium effort: add charter discovery + template parameterization.
3. **Eval bootstrapping** — Most skills score 0 on D8. Adding basic eval prompts to high-value skills (pptx, proposal, docx) would lift scores across the board.
