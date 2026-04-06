# UIF Agent Guide

This repository is a Lerna/Yarn monorepo for UIF. Treat it as a package-oriented codebase: first identify the affected package, then choose the smallest useful validation for that package.

## Default Working Mode

- Work as a lightweight orchestrator even for small tasks: restate the goal, identify the owner package, and keep scope tight.
- If the user explicitly asks for delegation, subagents, or parallel work, split work by package or concern and use the role cards in `.agents/roles/`.
- If the user does not explicitly ask for subagents, keep the work local, but still reason with the same package ownership model.
- Prefer minimal, task-specific verification over monorepo-wide checks unless the task is cross-cutting.

## Monorepo Map

- `packages/kaspersky-hexa-ui` — main UI kit, React components, styles, Storybook, UXPin, screenshot tests.
- `packages/kaspersky-hexa-ui-core` — design tokens, colors, typography, theme artifacts.
- `packages/kaspersky-hexa-ui-icons` — icon pipeline, SVG to TSX generation, icon Storybook.
- `packages/kaspersky-hexa-ui-charts` — chart and widget components built on top of Hexa UI.
- `packages/kaspersky-runtime` — runtime/application bus.
- `packages/kaspersky-ui-builder` — HTML forms builder.
- `packages/kaspersky-dev-tools` — shared lint/test/tooling config.
- `examples/quick-start` — Vite example app.
- `docs/hexa-ui` — Vite docs site.

## Routing Heuristics

- Component behavior, styles, Storybook stories, UXPin sync, visual regressions:
  see `.agents/roles/hexa-ui-agent.md`
- Tokens, themes, colors, typography:
  see `.agents/roles/tokens-agent.md`
- SVG intake, icon generation, icon exports:
  see `.agents/roles/icons-agent.md`
- Runtime layer, form builder, internal platform behavior:
  see `.agents/roles/runtime-builder-agent.md`
- Docs site, examples, root docs, DX polish:
  see `.agents/roles/docs-example-agent.md`
- Tooling, lint/test/build failures, release/publish flow:
  see `.agents/roles/release-ci-agent.md`

## Common Commands

- Root:
  - `yarn install:all`
  - `yarn test`
  - `yarn test:all`
  - `yarn lint:all`
  - `yarn lint:all:fix`
- `packages/kaspersky-hexa-ui`:
  - `npm run lint`
  - `npm run test`
  - `npm run test:screenshots`
  - `npm run storybook`
- `packages/kaspersky-hexa-ui-core`:
  - `npm run lint`
  - `npm run test`
  - `npm run update-colors`
  - `npm run update-typography`
- `packages/kaspersky-hexa-ui-icons`:
  - `npm run lint`
  - `npm run test`
  - `npm run icons:create`
  - `npm run storybook`
- `packages/kaspersky-hexa-ui-charts`:
  - `npm run lint`
  - `npm run build`
  - `npm run storybook`
- `packages/kaspersky-runtime`:
  - `npm run lint`
  - `npm run test`
- `packages/kaspersky-ui-builder`:
  - `npm run lint`
  - `npm run build`
- `examples/quick-start` and `docs/hexa-ui`:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`

## Working Agreements

- Root package management is Yarn/Lerna; package-level scripts are often run with `npm run ...`.
- Avoid editing generated or synced artifacts unless the task requires it.
  This includes UXPin merge outputs, generated icon files, built bundles, and incidental lockfile churn.
- Do not update `package-lock.json` unless the task explicitly requires npm lockfiles. The repo is primarily Yarn-based.
- Dirty worktrees are normal here. Never revert unrelated user changes.
- Prefer targeted package checks first; run cross-repo checks only when the change genuinely spans multiple areas.

## Fast Intake

When the user gives a short brief, infer the rest from repository context. The most useful brief format is:

```text
Task:
Area:
Constraints:
Checks:
```

Examples:

```text
Task: fix MenuItem hover regression
Area: packages/kaspersky-hexa-ui
Constraints: do not touch UXPin artifacts
Checks: npm run lint, npm run test:only
```

```text
Task: add new icon and wire exports
Area: packages/kaspersky-hexa-ui-icons
Constraints: keep public API backward compatible
Checks: npm run test
```

## Orchestrator Assets

- Start a dedicated orchestrator chat from `.agents/orchestrator-chat.md`
- Use the compact task template from `.agents/task-brief.md`
- Pick role cards from `.agents/roles/`
- Repo-local skill source: `codex-skills/uif-orchestrator/`
- Skill install helper: `codex-tools/install-uif-orchestrator-skill.sh`
- Hexa UI contract audit: `cd packages/kaspersky-hexa-ui && npm run audit:contracts`
