---
name: quality-check
description: Run the full quality suite (Python linting, skill validation, company data, symlink integrity, bootstrap version) and report findings in a structured format. Triggers on "quality check", "run checks", "validate repo", "check quality".
---

# Quality Check

Run the ClaudeCowork quality suite and report findings with structured categorization.

## When to Use

- Before committing significant changes
- After adding new skills or company profiles
- Periodic repository health checks
- When something feels broken

## Workflow

### Phase 1: Run All Checks

Run each check independently and capture results:

#### 1. Python Linting
```bash
uv run ruff check
```

#### 2. Python Tests (if they exist)
```bash
uv run pytest tests/ -v
```
Skip if `tests/` is empty or doesn't exist.

#### 3. Skill Validation

For every directory in `.claude/skills/`:

**Existence**: `SKILL.md` exists in each skill directory.

**Frontmatter**: Each SKILL.md starts with `---` and has `name` and `description` fields.

**Size**: Body (after frontmatter) is under 700 lines.
```bash
# Count body lines (after frontmatter) for each skill
for skill in .claude/skills/*/; do
  if [ -f "$skill/SKILL.md" ]; then
    end_fm=$(awk '/^---$/{c++;if(c==2){print NR;exit}}' "$skill/SKILL.md")
    total=$(wc -l < "$skill/SKILL.md")
    body=$((total - end_fm))
    echo "$skill: $body body lines"
  else
    echo "$skill: MISSING SKILL.md"
  fi
done
```

**Self-containment**: No skill commands activation of another skill. Search for patterns like:
- `run /` or `use /` followed by a skill name
- "Use the X skill's workflow" or "delegate to the X skill" — commands that direct Claude to activate a specific skill
- **Not violations**: Naming a skill as informational guidance ("the `docx` skill handles Word documents", "for PPTX output, the `pptx` skill provides branded presentations") or informational scope boundaries ("X handles Y, this skill handles Z"). Mentioning is context; directing is coupling.
- Exception: references to `skill-creator` for guidance are acceptable

#### 4. Company Data Validation

For every directory in `client-data/clients/`:

**Required files**:
- `profile.json` exists
- `charter.json` exists

**Charter schema**: `charter.json` contains `colors` and `fonts` keys.

**Template completeness**: `_example/` has all required files:
- `profile.json`
- `charter.json`
- `proposals/case-studies.json`
- `proposals/team-bios.json`
- `proposals/methodologies.json`
- `proposals/boilerplate.json`
- `proposals/testimonials.json`

#### 5. Symlink Integrity
```bash
ls -la .agents/skills .github/skills
```
Both must be symlinks pointing to `../.claude/skills`.

#### 6. Output Format Cross-Reference

For each skill that mentions producing files in a specific format (PDF, DOCX, PPTX, XLSX):
- If the skill has an "Output Capabilities" or "Output Format" section, verify each listed format skill actually exists in `.claude/skills/` with a valid SKILL.md
- If the skill mentions producing PDF/DOCX/PPTX/XLSX in its body without an Output Capabilities section, check it references the format skill inline
- Flag as advisory if missing (not CI-blocking, but should be addressed)

#### 7. Instruction Coverage

Verify every `.claude/skills/*/` directory name appears in:
- CLAUDE.md "Skill Workflow" section
- AGENTS.md "Available Skills" section

#### 8. Bootstrap Version
```bash
python -m json.tool .claude/bootstrap-version.json
```
- `.claude/bootstrap-version.json` exists and is valid JSON
- `skills_generated` list matches actual `.claude/skills/` directories

### Phase 2: Report Results

```
## Quality Report

### CI-Blocking Issues
- [ ] Ruff: N violations
- [ ] Skill validation: N issues (missing SKILL.md, missing frontmatter, oversized)
- [ ] Company data: N issues (missing files, invalid schema)
- [ ] Symlinks: PASS/FAIL
- [ ] Tests: N failures

### Instruction Issues
- [ ] Instruction coverage: PASS/FAIL
- [ ] AGENTS.md self-containment: PASS/FAIL
- [ ] Bootstrap version: VALID/INVALID/MISSING

### Advisory Issues
- [ ] Skill self-containment: N potential violations
- [ ] Skill size: N skills over 600 lines (approaching limit)
- [ ] Output format coverage: N skills mention formats without referencing format skills

### Recommendations
1. ...
```

### Phase 3: Recommendations

Based on findings, suggest:
- Which issues are blocking (must fix)
- Which are advisory (should fix but not urgent)
- Priority order for fixes
- Specific remediation steps for each failure
