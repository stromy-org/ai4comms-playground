#!/bin/bash
# One-time setup for the playground environment.
# Run this after cloning the repo.
#
# Usage: bash scripts/setup.sh

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Playground Setup ==="
echo ""

# 1. Initialize submodules
echo "1. Initializing submodules..."
cd "$REPO_ROOT"
git submodule update --init --recursive
echo "   Done."

# 2. Install global skills (conventional-commit, skill-creator)
echo ""
echo "2. Installing global Claude Code skills..."
GLOBAL_SKILLS_SOURCE="$REPO_ROOT/upstream/global-skills"
CLAUDE_SKILLS_DIR="$HOME/.claude/skills"

if [ ! -d "$GLOBAL_SKILLS_SOURCE" ]; then
  echo "   ERROR: upstream/global-skills not found. Run 'git submodule update --init' first."
  exit 1
fi

if [ -L "$CLAUDE_SKILLS_DIR" ]; then
  EXISTING_TARGET="$(readlink "$CLAUDE_SKILLS_DIR")"
  if [ "$EXISTING_TARGET" = "$GLOBAL_SKILLS_SOURCE" ]; then
    echo "   Already linked: ~/.claude/skills -> $GLOBAL_SKILLS_SOURCE"
  else
    echo "   WARNING: ~/.claude/skills already points to: $EXISTING_TARGET"
    echo "   Skipping symlink. If you want to use playground skills, update manually:"
    echo "     rm ~/.claude/skills && ln -s $GLOBAL_SKILLS_SOURCE ~/.claude/skills"
  fi
elif [ -d "$CLAUDE_SKILLS_DIR" ]; then
  echo "   WARNING: ~/.claude/skills/ already exists as a directory."
  echo "   Skipping symlink. If you want to use playground skills, back up and replace:"
  echo "     mv ~/.claude/skills ~/.claude/skills.bak"
  echo "     ln -s $GLOBAL_SKILLS_SOURCE ~/.claude/skills"
else
  mkdir -p "$HOME/.claude"
  ln -s "$GLOBAL_SKILLS_SOURCE" "$CLAUDE_SKILLS_DIR"
  echo "   Linked: ~/.claude/skills -> $GLOBAL_SKILLS_SOURCE"
  echo "   Skills available: conventional-commit, skill-creator"
fi

# 3. Configure git hooks
echo ""
echo "3. Configuring git hooks..."
git config core.hooksPath .githooks
echo "   Done. Upstream guard hook is active."

# 4. Install dependencies
echo ""
echo "4. Installing dependencies..."
if command -v npm &> /dev/null; then
  npm install
  echo "   Node dependencies installed."
else
  echo "   WARNING: npm not found — skip 'npm install' or install Node.js first."
fi

if command -v uv &> /dev/null; then
  uv sync
  echo "   Python dependencies installed."
else
  echo "   WARNING: uv not found — skip 'uv sync' or install uv first."
  echo "   Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "You now have:"
echo "  - Upstream submodules initialized (Cowork, global-skills)"
echo "  - Global skills available (conventional-commit, skill-creator)"
echo "  - Git hooks configured (upstream/ write protection)"
echo "  - Dependencies installed"
echo ""
echo "Get started:"
echo "  - Browse available skills:  ls upstream/cowork/.claude/skills/"
echo "  - Source a skill:           /source-skill <name>"
echo "  - Create a new skill:       /skill-creator"
echo ""
