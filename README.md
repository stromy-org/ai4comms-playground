# ai4comms Playground

Skill development sandbox for ai4comms. Explore, build, test, and package Claude Code skills and plugins in a safe, isolated environment.

## Getting Started

### 1. Clone and initialize

```bash
git clone https://github.com/stromy-org/ai4comms-playground.git
cd ai4comms-playground
git submodule update --init --recursive
```

### 2. Install dependencies

```bash
npm install        # Node.js dependencies
uv sync            # Python dependencies
```

### 3. Verify setup

Open Claude Code in the repo and run `/quality-check` to validate everything is wired correctly.

## What's Inside

| Directory | Purpose |
|-----------|---------|
| `.claude/skills/` | Your working skills — discoverable by Claude as `/skill-name` |
| `upstream/cowork/` | Read-only reference: full Cowork skill library |
| `upstream/duke-strategies-plugin/` | Read-only reference: example deployed plugin |
| `plugins/` | Plugins you build (for zip + import) |
| `companies/ai4comms/` | Your brand and company data |
| `src/` | Shared utilities (workspace helpers, image utils) |
| `workspace/` | Test output directory (gitignored) |

## Key Workflows

### Source a skill from Cowork

```
/source-skill pdf
```

This copies the `pdf` skill from `upstream/cowork/` into `.claude/skills/pdf/`, applying path transforms so it works in the playground. A `SOURCE.md` tracks where it came from.

### Create a new skill

```
/skill-creator
```

Walk through the guided skill creation process with evals and testing.

### Review a skill

```
/skill-reviewer
```

Get a scored quality report covering source traceability, sandbox safety, and more.

### Build a plugin

```
/plugin-builder
```

Package selected skills into a deployable plugin in `plugins/`.

## Rules

1. **Never edit files in `upstream/`** — they are read-only references
2. **All skills go in `.claude/skills/`** — this is where Claude discovers them
3. **Use `/source-skill` to copy from upstream** — it handles path transforms
4. **Commit with `/conventional-commit`** — follows org commit standards

## Updating Upstream References

```bash
git submodule update --remote   # Pull latest from Cowork and duke-strategies-plugin
```

## Contributing Back

If you build something worth sharing upstream:

1. Fork the source repo (e.g., Cowork) on GitHub
2. Apply your changes to the fork
3. Open a PR — include `SOURCE.md` showing the delta from original
4. The stromy team reviews and merges
