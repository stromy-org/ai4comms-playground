# Commit Enforcement

**MANDATORY**: Every `git commit` in this repository MUST go through the `conventional-commit` skill.

- NEVER run `git commit` directly — always invoke the `conventional-commit` skill first using the Skill tool
- This applies to ALL commit scenarios: explicit user requests, post-task commits, PR-related commits, and any other situation where a commit would be created
- If the user says "commit", "commit this", "yes commit", "stage and commit", or anything implying a git commit → invoke the `conventional-commit` skill
- The skill handles staging, message formatting, branch checks, and commit execution — do not replicate this logic manually
