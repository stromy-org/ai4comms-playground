# Development Patterns

Patterns for skill development, workspace builds, and company data in the playground.

## Skill Development

- **Location**: `.claude/skills/<skill-name>/SKILL.md` (required), plus optional `references/`, `scripts/`, `assets/`
- **Frontmatter**: `name` and `description` are required on every SKILL.md
- **Self-containment**: Skills never programmatically invoke another skill. May mention as guidance; never command activation.
- **Progressive disclosure**: Frontmatter always loaded → SKILL.md on trigger → `references/` on demand
- **Size limit**: Keep SKILL.md under 700 lines. Move detail to `references/`
- **New skills**: Use the `skill-creator` skill for scaffolding

## Workspace Conventions

Test output goes in `workspace/` (gitignored). Organize per-client:

```
workspace/<client>/
├── build/<deliverable>/     # Build scripts and intermediates
└── output/<deliverable>/    # Final deliverables
```

- Use ROOT `node_modules` — never create workspace-level `package.json`
- Use `src/workspace.js` (Node) or `src/workspace.py` (Python) for output path resolution

## Company Data

Company profiles in `companies/` power branded deliverable skills.

```
companies/<client-slug>/
├── charter.json     # Colors, fonts, logo paths, spacing
├── profile.json     # Identity, services, credentials
└── brand/           # Logo files, brand imagery (optional)
```

Always check `charter.json` before manually selecting colors or fonts.

## Branch Workflow

The playground uses a simple branch model for collaboration:

| Branch | Purpose | Who pushes |
|--------|---------|------------|
| `main` | Stable, reviewed code + sync pipeline target | PRs only (branch protection) |
| `dev/emma` | Emma's working branch | Emma |
| `feat/<name>` | Clean single-feature branches for PRs | Created via `cherry-pick-pr` skill |

### Daily workflow

1. Work on `dev/emma` — commit freely, experiment, iterate
2. Periodically merge `main` into `dev/emma` to stay current with sync updates: `git merge main`
3. When a feature is ready for review, use `/cherry-pick-pr` to extract a clean PR
4. After PR is merged, pull `main` and merge into `dev/emma`

### Why not work directly on feature branches?

Dev branches accumulate mixed changes — WIP commits, unrelated experiments, debug leftovers. The `cherry-pick-pr` skill extracts only the files that belong to a specific feature into a clean branch, making PRs easy to review.

## Code Standards

- **Python**: ruff linting, type hints, `uv` for dependency management
- **Node.js**: Use root `node_modules`, require with relative paths
- **Commits**: Always use the `conventional-commit` skill
