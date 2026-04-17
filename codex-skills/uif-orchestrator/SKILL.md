---
name: uif-orchestrator
description: Use when working in the UIF monorepo and you want Codex to act as a repo-aware orchestrator, audit Hexa UI component contracts, align props/docs/stories, and keep changes small and verifiable.
---

# UIF Orchestrator

Use this skill for UIF tasks where the user wants less prompting overhead and more repository-aware execution.

## Quick Start

- Treat the repository as package-oriented. Identify the owner package before proposing work.
- For component API, Storybook, or design-system sync work in `packages/kaspersky-hexa-ui`, run `npm run audit:contracts` early.
- Read `references/uif-hexa-contract.md` before changing component contract files, Storybook metadata, or docs completeness.
- For UXPin Merge component setup, nested editable layers, presets, slots, or frame sizing, use `uif-uxpin-component-integration`.
- For stale UXPin editor/prototype behavior, hidden layers still rendering, added/removed children not updating, or frame bugs, use `uif-uxpin-runtime-debug`.
- For UXPin publishing, revision errors, token checks, or a UXPin changelog since the previous push, use `uif-uxpin-push`.
- For GitHub push/commit work with a changelog since the previous push, use `uif-github-push-summary`.
- Prefer additive changes first: audits, exports, metadata, docs, and safe typing improvements before behavioral refactors.

## Working Rules

1. Preserve current runtime behavior unless the task explicitly asks for a functional change.
2. When touching a public component, inspect:
   - `src/<component>/index.ts`
   - local or nested `types.ts`
   - stories
   - `meta.json`
   - tests
3. Do not duplicate props manually across TypeScript, Storybook, and docs if one source of truth can drive the others.
4. Prefer targeted checks such as `npm run lint`, `npm run test:only`, or `npm run audit:contracts` over package-wide rebuilds.
5. If the component contract is incomplete and cannot be fully fixed in one task, report the remaining gaps explicitly.

## Useful Commands

- `cd packages/kaspersky-hexa-ui && npm run audit:contracts`
- `cd packages/kaspersky-hexa-ui && npm run audit:contracts:strict`
- `cd packages/kaspersky-hexa-ui && npm run lint`
- `cd packages/kaspersky-hexa-ui && npm run test:only`

## References

- Contract map and audit rules: `references/uif-hexa-contract.md`
