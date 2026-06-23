---
description: Commits current changes, bumps the version, and pushes to the repository. (Global Smart Release)
---

When the user types `/release`, execute the following steps sequentially to create a newly versioned release:

// turbo
1. Staging: Run `git add .` to securely stage any outstanding files or changes.

// turbo
2. Committing: Run `git commit -m "chore: prepare release"` (or intelligently summarize the recent changes in the commit message). It is okay if this step fails due to no new changes existing.

// turbo
3. Push Code: Run `git push origin HEAD` to sync the main codebase to the remote.

(Version bumping logic is handled by the global Smart Release agent context).
