# ai4comms Playground

Skill development sandbox for ai4comms. Build, test, and package Claude Code skills and plugins in a structured environment with 14 shared skills that update automatically.

## Getting Started

### 1. Clone and set up

```bash
git clone https://github.com/stromy-org/ai4comms-playground.git
cd ai4comms-playground
bash scripts/setup.sh
```

The setup script initializes submodules, installs global skills, configures git hooks, and installs dependencies.

### 2. Verify setup

Open Claude Code in the repo and run `/quality-check` to validate everything is wired correctly.

## What's Inside

| Directory | Purpose |
|-----------|---------|
| `.claude/skills/` | Your working skills — discoverable by Claude as `/skill-name` |
| `upstream/duke-strategies-plugin/` | Read-only reference: example deployed plugin |
| `upstream/global-skills/` | Global skills (conventional-commit, skill-creator) |
| `plugins/` | Plugins you build (for zip + import) |
| `companies/ai4comms/` | Your brand and company data |
| `src/` | Shared utilities (workspace helpers, image utils) |
| `workspace/` | Test output directory (gitignored) |

## Shared Skills (Read-Only)

14 skills are synced automatically from Cowork via GitHub Actions:

| Skill | Purpose |
|-------|---------|
| docx | Document creation and editing |
| messaging-framework | Structured messaging frameworks |
| notebooklm | Google NotebookLM content generation |
| organic-social-campaign | Organic social media campaigns |
| paid-social-campaign | Paid social media campaigns |
| pdf | PDF manipulation and creation |
| pptx | Presentation creation and editing |
| pptx-hd | High-fidelity branded presentations |
| press-release | Corporate press releases |
| proposal | Consulting proposals and bid documents |
| quality-check | Structural validation |
| remotion-video | Animated videos with Remotion |
| skill-reviewer | Skill quality review |
| xlsx | Spreadsheet creation and analysis |

### How sync works

- When shared skills change in Cowork, a GitHub Action copies them into `.claude/skills/`
- Updates merge directly to `main` — no conflicts because synced skills are never edited locally
- Portability transforms are applied automatically

### Customizing synced skills

**Do not modify synced skills directly** — the sync pipeline will overwrite your changes. Instead:

1. Copy the skill directory (e.g., `pptx-hd/` → `pptx-hd-custom/`)
2. Rename the skill in the copy's SKILL.md frontmatter
3. Make your changes in the copy only

## Branch Workflow

| Branch | Purpose |
|--------|---------|
| `main` | Stable, reviewed code. PRs only (branch protection). |
| `dev/emma` | Working branch — commit freely, experiment, iterate. |
| `feat/<name>` | Clean single-feature branches for PRs. |

### Daily workflow

1. Work on `dev/emma` — commit freely
2. Periodically merge `main` to stay current: `git merge main`
3. When a feature is ready, use `/cherry-pick-pr` to extract a clean PR
4. After PR is merged, pull `main` and merge into `dev/emma`

## Key Workflows

### Create a new skill

```
/skill-creator
```

Walk through the guided skill creation process with evals and testing.

### Review a skill

```
/skill-reviewer
```

Get a scored quality report covering architecture, documentation, and more.

### Build a plugin

```
/plugin-builder
```

Package selected skills into a deployable plugin in `plugins/`.

## Quick Rules

1. **Never edit files in `upstream/`** — they are read-only references
2. **Never modify synced skills directly** — duplicate with `-custom` suffix to customize
3. **All skills go in `.claude/skills/`** — this is where Claude discovers them
4. **Commit with `/conventional-commit`** — follows org commit standards
5. **Check `charter.json` before choosing colors/fonts** — brand consistency matters

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full collaboration guide.

## License

See [LICENSE](LICENSE) for terms of use. Skills you create independently in this playground are yours.
