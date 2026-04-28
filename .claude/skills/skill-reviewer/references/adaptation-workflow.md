# External Skill Adaptation Workflow

Triage plus 6-phase procedure for restructuring imported or externally-authored skills to match ClaudeCowork conventions.

---

## Phase 0: Triage

Determine the adaptation depth needed before diving in.

| Scenario | Path | Phases | Estimated Time |
|----------|------|--------|----------------|
| Well-structured skill, just needs frontmatter fixes | Quick fix | Phase 2 only | 5 min |
| Good skill, needs convention alignment | Standard | Phases 1-3, 5-6 | 30 min |
| Major restructure needed (monolithic, hardcoded, no disclosure) | Full | All phases | 1-2 hr |
| Skill is fundamentally incompatible (different paradigm) | Rewrite | Use skill-creator instead | Varies |

**How to triage:** Quickly scan SKILL.md for frontmatter, line count, cross-skill references, and hardcoded values. If all conventions pass except frontmatter, take the quick-fix path. If the skill is a single 1000+ line file with no references directory, it needs the full treatment.

---

## Phase 1: Intake

Receive the skill and build an inventory.

1. **Receive** — The user provides a skill (directory, zip, or single SKILL.md)
2. **Read** — Read SKILL.md top to bottom; note frontmatter, sections, resource references
3. **Inventory resources** — List all files in the skill directory:
   - Scripts (`.py`, `.js`, `.sh`)
   - References (`.md` in `references/`)
   - Assets (templates, images, fonts, data files)
   - Any other files
4. **Classify skill type** — Determines integration depth:

| Type | Description | Company Data Level | Examples |
|------|-------------|--------------------|----------|
| **Format** | Produces a file format (pptx, docx, pdf, xlsx) | Full (charter + content) | pptx, docx, xlsx |
| **Domain** | Owns a business domain (proposals, RFPs) | Full (profile + content) | proposal, rfp-response |
| **Utility** | Provides a reusable capability | None typically | mermaid, conventional-commit |
| **Integration** | Connects to external service/API | Partial (profile only) | reepl, vitepress-dev |
| **Reference** | Provides guidelines/standards | None | _(none currently)_ |

---

## Phase 2: Convention Mapping

Check each ClaudeCowork convention and plan adaptations.

### Checklist

| Convention | Check | Adaptation If Failing |
|------------|-------|-----------------------|
| **Frontmatter** | Has `name` + `description`? Name is kebab-case? Description has trigger phrases? | Add/fix frontmatter. Write description with use cases and triggers. |
| **Self-containment** | References other skills? | Remove cross-references. Duplicate any needed content from other skills. |
| **Workspace pattern** | Uses root `node_modules`? No workspace `package.json`? Output to `workspace/<project>/output/`? (Remotion exception: local `package.json` allowed with `.remotion-project` marker; output to `out/`) | Rewrite require paths. Remove workspace package.json (unless Remotion). Fix output paths. |
| **Naming** | Directory = frontmatter name? Kebab-case? Gerund or noun? | Rename directory and/or frontmatter name to match. |
| **Progressive disclosure** | SKILL.md under 700 lines? Detail in `references/`? | Extract detailed content to `references/` files. Add pointers from SKILL.md. |
| **File organization** | Scripts in `scripts/`, docs in `references/`, assets in `assets/`? | Reorganize files into correct directories. |
| **No hardcoded brand** | Colors, fonts, logos hardcoded? | Extract to charter discovery pattern. |
| **Path references** | Paths use relative resolution? Reference `../../node_modules/`? | Fix paths to match repo structure. |

### Common Adaptation Patterns

**External skill uses npm packages:**
```
Before: const pptx = require('pptxgenjs');
After:  const pptx = require('../../node_modules/pptxgenjs');
```

**External skill references its own directory:**
```
Before: path.join(__dirname, 'templates/default.html')
After:  path.join(__dirname, '../../.claude/skills/<name>/assets/default.html')
```

**External skill has its own config file:**
```
Before: const config = require('./config.json');
After:  Inline config into SKILL.md or move to references/
```

---

## Phase 3: Company Data Integration Design

Decide the integration level based on skill type (from Phase 1).

### No Integration (Utility / Reference skills)
- Skip this phase entirely
- Document in the review that company data is not applicable

### Partial Integration (Integration skills)
Add only profile discovery:
```
1. List client-data/clients/ to find available profiles
2. If one company → use by default
3. Read profile.json for company name, contact info
4. Use in API calls, headers, or connection context
```

### Full Integration (Format / Domain skills)
Add the complete three-layer pattern:

**Charter Discovery Section** — Add to SKILL.md:
```markdown
## Brand Data Integration

### Discovering brand data
Look for a charter file at `client-data/clients/<name>/charter.json`.
If a charter exists, it provides:
- Colors: primary, secondary, accent, background, text
- Fonts: heading, body, mono
- Logo: filename(s) with max dimensions
- Format-specific settings

### When there is no brand charter
Skip brand integration and use generic defaults.
```

**Content Library Section** — Add to SKILL.md or `references/`:
```markdown
### Content Library Assembly
Map library items to output sections by matching tags:
| Output Section | Content Source | Selection Criteria |
|...|...|...|
```

**Build Script Integration** — Modify scripts to accept `BRAND_DIR`:
```javascript
const BRAND_DIR = path.resolve(__dirname, '../../client-data/clients/<name>/brand');
const charter = JSON.parse(fs.readFileSync(path.join(BRAND_DIR, 'charter.json')));
```

---

## Phase 4: Template Extraction

Identify repeated output patterns and parameterize them.

1. **Scan** — Read all output-generating code. Identify repeated HTML/XML/text patterns.
2. **Abstract** — Extract patterns into templates with placeholders:
   - Use CSS variables for brand values: `var(--color-primary)`
   - Use template literals for content: `${slide.title}`
   - Use conditionals for optional sections: `${section.content ? '...' : ''}`
3. **Create rendering mechanism** — Build script that:
   - Reads template
   - Injects brand data (from charter) as CSS variables or config
   - Fills content placeholders from input data
   - Produces output file
4. **Document variants** — If multiple templates exist, add a selection guide:
   ```markdown
   | Template | Best For | Sections |
   |----------|----------|----------|
   | executive | C-suite audience | Summary, Key Metrics, Recommendation |
   | detailed | Technical audience | Full analysis, Methodology, Data |
   ```

---

## Phase 5: Restructure & Package

Create the final skill directory.

### Directory Structure
```
.claude/skills/<skill-name>/
├── SKILL.md              # Main file (under 700 lines)
├── references/           # Detailed docs (optional)
│   ├── <topic>.md
│   └── <schema>.md
├── scripts/              # Executable code (optional)
│   ├── build.js
│   └── helpers.py
└── assets/               # Templates, images (optional)
    ├── template.html
    └── logo.png
```

### Writing SKILL.md
1. Write frontmatter with `name` (matching directory) and `description` (with triggers)
2. Write Overview section (1-2 sentences)
3. Add Brand Data Integration section (if applicable)
4. Write main workflow sections (numbered steps or decision tree)
5. Add pointers to `references/` for detailed content
6. Ensure body is under 700 lines

### Validation
Run the validator:
```bash
uv run python .claude/skills/skill-creator/scripts/quick_validate.py .claude/skills/<skill-name>
```

Check:
- [ ] Frontmatter valid (name, description)
- [ ] Name matches directory
- [ ] Body under 700 lines
- [ ] No cross-skill invocation
- [ ] All file references resolve correctly
- [ ] Scripts use root `node_modules/` paths

---

## Phase 6: Gap Report

Document what changed and what remains.

### Report Template

```markdown
## Adaptation Report: <skill-name>

### Changes Made
- [ ] Frontmatter: <added/fixed/unchanged>
- [ ] Structure: <reorganized/unchanged>
- [ ] Brand integration: <added/not applicable>
- [ ] Content library: <added/not applicable>
- [ ] Templates: <extracted/parameterized/none>
- [ ] Scripts: <paths fixed/rewritten/none>
- [ ] References: <extracted from SKILL.md/added/none>

### Files Added
- <list new files>

### Files Removed
- <list removed files>

### Files Modified
- <list changed files with summary of changes>

### Remaining Manual Work
- <anything that couldn't be automated>
- <content that needs human review>
- <tests that should be run>

### Post-Adaptation Score
| Dimension | Before | After | Change |
|-----------|--------|-------|--------|
| Frontmatter & Triggering | ? | ? | +? |
| Company Data | ? | ? | +? |
| Modularity | ? | ? | +? |
| Templates | ? | ? | +? |
| Prog. Disclosure | ? | ? | +? |
| Self-Containment | ? | ? | +? |
| Documentation & Instruction Craft | ? | ? | +? |
| Evaluation Readiness | ? | ? | +? |
| **Total** | **?/?** | **?/?** | **+?** |
```
