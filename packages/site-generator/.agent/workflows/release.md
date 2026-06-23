---
description: Commits current changes, bumps the version, and pushes to the repository. (Global Smart Release)
---

When the user types `/release`, execute the following steps sequentially to create a newly versioned release:

// turbo
1. Staging: Run `git add .` to securely stage any outstanding files or changes.

// turbo
2. Committing: Run `git commit -m "chore: prepare release"` (or intelligently summarize the recent changes in the commit message). It is okay if this step fails due to no new changes existing.

// turbo
3. Version Bump: Run `npm version patch` to increment the patch version and automatically generate a release tag.

// turbo
4. Push Code & Tags: Run `git push origin HEAD --tags` to sync the main codebase and the new version tags to the remote.
