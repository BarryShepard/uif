---
name: uif-github-push-summary
description: Use when committing and pushing UIF repository changes to GitHub with a clear summary of what changed since the previous push, including scoped staging, validation, generated artifact handling, and a concise changelog for the user or PR body.
---

# UIF GitHub Push Summary

Use this skill when the user asks to push UIF work to GitHub and wants a useful description of changes since the previous push.

## Goal

Commit and push the intended work safely, without silently staging unrelated files, and produce a compact changelog that explains what changed since the last pushed state.

## Scope First

1. Run `git status -sb`.
2. Inspect changed file groups with:
   - `git diff --stat`
   - `git ls-files --others --exclude-standard`
3. Separate likely scopes:
   - Source changes under `packages/kaspersky-hexa-ui/src`
   - UXPin wrappers/presets under `packages/kaspersky-hexa-ui/uxpin`
   - Repo-local skills/tools/docs
   - Generated `.uxpin-merge/*` artifacts
   - Unrelated local notes or experiments
4. If the worktree is mixed and intent is unclear, ask before staging. If the user clearly asked to push the current project state, stage the coherent project scope and mention exclusions.

## Changelog Since Previous Push

Use the remote tracking branch as the baseline when possible:

```bash
git diff --stat @{u}
git diff --name-only @{u}
```

If there are no local commits yet, summarize staged/uncommitted changes. Group by outcome, not by every file:

- UXPin authoring behavior
- Component runtime fixes
- Layout/frame behavior
- Skills/tooling/docs
- Generated artifacts

For fixes, include the root cause in one sentence when known.

## Validation

Prefer targeted checks:

- `cd packages/kaspersky-hexa-ui && npm run lint-ts` for Hexa UI/UXPin TypeScript changes.
- `git diff --check -- <files>` for whitespace on intended staged files.
- Do not run monorepo-wide checks unless the change spans packages.

If a validator cannot run because a local dependency is missing, report that precisely.

## Commit And Push

1. Stage explicit paths, not `git add -A`, when the worktree has unrelated files.
2. Commit with a terse message, for example:
   - `update uxpin sidebar and skills`
   - `fix uxpin footer layer updates`
3. Push current branch:
   - `git push -u origin $(git branch --show-current)`
4. Report branch, commit SHA, validation, and excluded files.

## Generated UXPin Artifacts

- Do not hand-edit `.uxpin-merge/*`.
- If tracked `.uxpin-merge` files changed because of UXPin build/push flow, include them only when they are part of the intended publishable state.
- If new generated preset/user-upload files appear, mention them explicitly before staging.

## Final Summary Shape

Keep the final response short:

- `Pushed`: branch and commit.
- `Included`: 3-5 bullets grouped by outcome.
- `Checks`: commands run.
- `Not included` or `Risks`: only if relevant.
