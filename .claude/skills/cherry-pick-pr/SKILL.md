---
name: cherry-pick-pr
description: Extract clean, single-feature pull requests from a messy development branch. Analyzes diffs, groups changes by skill/area, and creates a focused PR branch with only the selected files.
---

# Cherry-Pick PR

Extract a clean PR from your development branch by selecting which changes belong to a specific feature.

## When to Use

- You've been working on `dev/emma` (or another dev branch) and accumulated mixed changes
- You want to submit a focused PR for one feature without the surrounding noise
- You need to separate interleaved work into distinct, reviewable PRs

## Workflow

### Phase 0: Branch Freshness Check

Before anything else, check if the source branch is up to date with the target:

```bash
git fetch origin main
git rev-list --count HEAD..origin/main
```

- **If behind**: Show how many commits behind, summarize what changed (`git log --oneline HEAD..origin/main`), and recommend merging first: "Your branch is N commits behind main. I'd recommend merging main first to avoid conflicts. Want me to run `git merge origin/main`?"
- **If up to date**: Continue to Phase 1.
- **If the user skips the merge**: Proceed but warn that the PR may have avoidable conflicts.

### Phase 1: Diff Analysis

1. Confirm the **source branch** (default: current branch) and **target branch** (default: `main`)
2. Run `git diff --name-status <target>...<source>` to get all changed files
3. Categorize each file:
   - **A** (Added) — new file, not on target
   - **M** (Modified) — exists on both branches
   - **D** (Deleted) — removed from target
   - **R** (Renamed) — detect renames
4. Group files by area:
   - **Skill changes**: `.claude/skills/<skill-name>/` — group by skill
   - **Company data**: `companies/<client>/` — group by client
   - **Plugin changes**: `plugins/<name>/` — group by plugin
   - **Infrastructure**: root files, `.claude/rules/`, `scripts/`, `src/`
   - **Other**: anything else

### Phase 2: Feature Selection

Present the grouped changes as a numbered list:

```
Changes on dev/emma vs main:

Skills:
  [1] .claude/skills/pptx-hd-custom/SKILL.md (A)
  [2] .claude/skills/pptx-hd-custom/references/layouts.md (A)

Company data:
  [3] companies/ai4comms/charter.json (M)

Infrastructure:
  [4] src/workspace.py (M)
  [5] package.json (M)
```

Ask the user:
- Which files belong to this feature? (e.g., "1, 2, 3" or "all skills")
- What should the feature be called? (used for branch name and PR title)
- Brief description of what the feature does (used for PR body)

### Phase 3: Clean Branch Creation

1. **Verify clean state**: Ensure no uncommitted changes (`git status --porcelain`)
   - If dirty, ask user to commit or stash first
2. **Create feature branch** from target:
   ```
   git checkout <target>
   git pull origin <target>
   git checkout -b feat/<feature-name>
   ```
3. **Apply selected files** from source branch:
   - For added/modified files: `git checkout <source> -- <file-path>`
   - For deleted files: `git rm <file-path>`
   - For renames: checkout new path from source, rm old path
4. **Commit** using the `conventional-commit` skill
5. **Push** the feature branch: `git push -u origin feat/<feature-name>`

### Phase 4: PR Creation

Create a PR using `gh pr create`:

```bash
gh pr create \
  --base <target> \
  --head feat/<feature-name> \
  --title "<type>(<scope>): <description>" \
  --body "## Summary
<user-provided description>

## Files included
<list of files with their change type>

## Source branch
Cherry-picked from \`<source>\` at $(git rev-parse --short <source>)

---
Created with cherry-pick-pr skill"
```

### Phase 5: Cleanup (Optional)

Ask the user if they want to:
1. **Return to source branch**: `git checkout <source>`
2. **Remove cherry-picked files from source** (advanced — skip unless user asks):
   - This is rarely needed; the source branch keeps its history
   - Only useful if the user wants to avoid re-selecting the same files later

Always return the user to their original branch at the end.

## Rules

- **Never force-push** — always create new branches from target
- **Never modify the source branch** unless explicitly asked
- **Always use conventional-commit** for the commit on the feature branch
- **Verify the PR base** — must be the target branch, not the source branch
- **Handle edge cases**:
  - If a selected file has been modified on both branches, warn about potential conflicts
  - If `gh` CLI is not available, provide manual PR creation instructions
  - If the feature branch name already exists, ask for an alternative

## Example Session

```
User: /cherry-pick-pr

Claude: I'll help you extract a clean PR. Let me analyze your branch.

Source: dev/emma
Target: main

Changes (12 files):

Skills:
  [1] .claude/skills/notebooklm-custom/SKILL.md (A)
  [2] .claude/skills/notebooklm-custom/references/prompts.md (A)
  [3] .claude/skills/notebooklm-custom/LICENSE.txt (A)

Company data:
  [4] companies/ai4comms/charter.json (M)

Infrastructure:
  [5] src/workspace.py (M)
  [6] .claude/rules/dev-patterns.md (M)

Other:
  [7-12] workspace files (gitignored, skipped)

Which files belong to the feature you want to PR?

User: 1, 2, 3 — it's the custom NotebookLM skill

Claude: Got it. I'll create a PR for the custom NotebookLM skill.
- Feature name: notebooklm-custom
- Branch: feat/notebooklm-custom
- Files: 3 new files

[creates branch, applies files, commits, pushes, opens PR]

PR created: https://github.com/stromy-org/ai4comms-playground/pull/5
Returned to dev/emma.
```
