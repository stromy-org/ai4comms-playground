# Branch Freshness

When working on a `dev/*` branch, check how far behind `main` the branch is at the start of the session:

```bash
git fetch origin main
git rev-list --count HEAD..origin/main
```

- **If 0 commits behind**: Branch is up to date — continue normally.
- **If 1-5 commits behind**: Mention it once: "Your branch is N commits behind main. Want me to merge the latest updates?"
- **If 6+ commits behind**: Flag it more prominently and recommend merging before doing other work. Show a summary of what changed on main (skill updates, infrastructure changes, etc.):
  ```bash
  git log --oneline HEAD..origin/main
  ```

If the user agrees to merge, run:

```bash
git merge origin/main
```

If there are merge conflicts, help resolve them. Synced skill conflicts should always be resolved by taking the `main` version (since synced skills are read-only).

Do not nag — check once at session start, then only mention it again if the user is about to create a PR.
