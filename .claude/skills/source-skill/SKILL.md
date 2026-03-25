---
name: source-skill
description: Safely copy and adapt a skill from upstream references (Cowork or duke-strategies-plugin) into the playground's .claude/skills/ directory. Handles portability transforms so the sourced skill works in the playground context. Use when the user wants to "source a skill", "copy a skill from Cowork", "bring in the pdf skill", "port a skill", or any request to use an existing skill as a starting point.
---

# Source Skill

Copy a skill from upstream references into the playground, applying portability transforms so it works locally.

## When to Use

- User wants to work with an existing skill from Cowork or the duke-strategies-plugin
- User wants to modify or customize a Cowork skill
- User says "source", "copy", "bring in", "port" a skill by name

## Prerequisites

- Upstream submodules must be initialized: `git submodule update --init --recursive`
- Target skill must exist in one of the upstream repos

## Workflow

### Step 1: Locate the Skill

Search for the named skill in this order:
1. `upstream/cowork/.claude/skills/<skill-name>/`
2. `upstream/duke-strategies-plugin/skills/<skill-name>/`

If not found in either location, list available skills from both repos and ask the user to pick one.

### Step 2: Check for Conflicts

Before copying, check if `.claude/skills/<skill-name>/` already exists in the playground.

- If it exists and has a `SOURCE.md`, show the user the existing source info and ask if they want to overwrite
- If it exists without `SOURCE.md`, warn that it may be a manually created skill and ask for confirmation

### Step 3: Copy the Skill

Copy the entire skill directory (SKILL.md, references/, scripts/, assets/, templates/, ooxml/) into `.claude/skills/<skill-name>/`.

### Step 4: Apply Portability Transforms

These transforms adapt Cowork-specific paths to work in the playground:

| Pattern | Cowork Path | Playground Path |
|---------|-------------|-----------------|
| Company data | `.claude/companies/` | `companies/` |
| Skills reference | `.claude/skills/` | `skills/` (only in cross-references) |
| Node require (modules) | `require('../../../../node_modules/<pkg>')` | `require('<pkg>')` |
| Node require (workspace) | `require('../../../../src/workspace')` | `require('../../src/workspace')` |
| Python path (workspace) | `Path(__file__).resolve().parents[3] / 'src'` | `Path(__file__).resolve().parents[2] / 'src'` |
| Path resolve | `path.resolve(skillDir, "../../..")` | `path.resolve(skillDir, "../..")` |

**Important**: Only transform paths in scripts and code files. Do not transform descriptive text in SKILL.md that explains Cowork's architecture — those are documentation, not executable paths.

Apply transforms to:
- All `.js` files in `scripts/`
- All `.py` files in `scripts/`
- Any `build.js` or `build.py` files
- Template files that contain path references

### Step 5: Create SOURCE.md

Create `SOURCE.md` in the skill directory with traceability info:

```markdown
# Source Information

- **Origin repo**: Cowork (or duke-strategies-plugin)
- **Origin path**: .claude/skills/<skill-name>/
- **Source commit**: <commit hash from submodule>
- **Date sourced**: <YYYY-MM-DD>
- **Transforms applied**:
  - .claude/companies/ → companies/
  - Node require paths adjusted for playground depth
  - Python sys.path adjusted for playground depth
```

### Step 6: Verify

After sourcing:
1. Check that SKILL.md has valid frontmatter
2. Run a quick grep for any remaining Cowork-specific paths that weren't transformed
3. Report what was copied and any manual steps needed (e.g., "This skill requires `python-pptx` — run `uv sync` to install dependencies")

### Step 7: Report

```
## Sourced: <skill-name>

- Origin: upstream/cowork/.claude/skills/<skill-name>/
- Commit: <hash>
- Files copied: N
- Transforms applied: N
- Ready at: .claude/skills/<skill-name>/

### Manual Steps Needed
- (list any dependency installs or config needed)
```

## Available Skills

To see what's available for sourcing:

```bash
# List Cowork skills
ls upstream/cowork/.claude/skills/

# List duke-strategies-plugin skills
ls upstream/duke-strategies-plugin/skills/
```

## Updating a Sourced Skill

To pull the latest version from upstream:

1. Update the submodule: `git submodule update --remote upstream/cowork`
2. Re-run `/source-skill <skill-name>` — it will detect the existing skill and offer to overwrite
3. The new SOURCE.md will reflect the updated commit hash
