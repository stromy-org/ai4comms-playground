# Development Patterns

Patterns for skill development, workspace builds, and company data in the playground.

## Skill Development

- **Location**: `.claude/skills/<skill-name>/SKILL.md` (required), plus optional `references/`, `scripts/`, `assets/`
- **Frontmatter**: `name` and `description` are required on every SKILL.md
- **Self-containment**: Skills never programmatically invoke another skill. May mention as guidance; never command activation.
- **Progressive disclosure**: Frontmatter always loaded → SKILL.md on trigger → `references/` on demand
- **Size limit**: Keep SKILL.md under 700 lines. Move detail to `references/`
- **New skills**: Use the `skill-creator` skill for scaffolding
- **Sourced skills**: Use the `source-skill` skill to safely copy from upstream

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

## Code Standards

- **Python**: ruff linting, type hints, `uv` for dependency management
- **Node.js**: Use root `node_modules`, require with relative paths
- **Commits**: Always use the `conventional-commit` skill
