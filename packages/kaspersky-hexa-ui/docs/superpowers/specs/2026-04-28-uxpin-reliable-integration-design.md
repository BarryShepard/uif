# UXPin Reliable Component Integration Design

Date: 2026-04-28

Owner package: `packages/kaspersky-hexa-ui`

## Goal

Build a reliable UXPin Merge integration process for Hexa UI components. The process optimizes for production correctness, not raw component count.

The main risk is that a component can work in local `npm run uxpin:dev` but fail or behave differently in UXPin cloud, editor mode, prototype mode, serialized layer overrides, or frame resizing. The integration process must therefore validate the UXPin runtime contract, not only the React render path.

## Non-Goals

- Do not mass-generate production-ready wrappers without a component contract.
- Do not manually edit `.uxpin-merge/*` as source.
- Do not replace the public production TypeScript API with UXPin-specific props.
- Do not run monorepo-wide checks by default for package-scoped UXPin work.
- Do not treat local Merge dev mode as sufficient proof of production behavior.

## Source Of Truth

When sources disagree, use this order:

1. Public production component TypeScript API under `src/<component>`.
2. Storybook, runtime behavior, and existing package tests.
3. UXPin wrapper behavior under `uxpin/components/<Component>`.
4. `helpers/propsDictionary.ts` as a secondary glossary/mapping layer.

UXPin-only props are allowed only when they model prototype authoring needs that the production component does not own, such as demo data generation, prototype actions, or frame behavior. They must stay explicit and minimal.

## Component Tiers

### Tier 1: Atomic Components

Examples: `Text`, `Tag`, `Badge`, `Button`, `Toggle`.

Expected integration:

- Thin wrapper around the production component.
- Props resolved through `resolveUXPinRuntimeProps` when UXPin can override them.
- Preset with realistic initial props.
- Content-hugging frame behavior unless the production component is naturally full-width.

Required validation:

- `npm run lint-ts`
- `git diff --check -- <touched files>`
- Local insert/edit smoke in `npm run uxpin:dev`
- Short production branch smoke after push

### Tier 2: Editable Composite Components

Examples: `Tabs`, `Submenu`, `Toolbar`, `Dropdown`, `Field`, `Menu`.

Expected integration:

- Explicit editable children or named slots in presets.
- Runtime children resolved with `resolveUXPinChildrenFromProps`.
- Hidden and deleted layers filtered with `isUXPinHiddenElement`.
- UXPin target placeholders converted into real visual components or production data shapes.
- Slot children routed into the correct visual areas and removed from generic content rendering.
- Defaults applied only when no explicit UXPin children exist.

Required validation:

- `npm run lint-ts`
- `git diff --check -- <touched files>`
- Runtime tests for serialized `codeComponentProps` and `overriddenCodeProps`
- Manual checks for add, delete, hide, and reorder child layers
- Editor mode smoke
- Prototype mode smoke when interactions are involved
- Production branch smoke after push

### Tier 3: Stateful Product-Flow Components

Examples: `Table`, `Sidebar`, table-owned toolbar actions, menu-driven page switching.

Expected integration:

- State ownership documented before implementation.
- Prototype actions modeled through a stable authoring API.
- Frame behavior separated from inner production panel behavior.
- Escape hatches kept for known unstable UXPin frame propagation cases, for example table frame-height fallback.
- Product flows validated as scenarios, not only as isolated component renders.

Required validation:

- `npm run lint-ts`
- `git diff --check -- <touched files>`
- Runtime tests for serialized state, children, and restored data
- Scenario smoke in local Merge dev mode
- Scenario smoke in UXPin cloud editor
- Scenario smoke in UXPin prototype mode
- Backlog entry for known limitations or deferred behavior

## Runtime Contract

Every non-trivial UXPin component must be designed against this data flow:

```text
UXPin layer tree
-> props / codeComponentProps / overriddenCodeProps
-> child resolver
-> converter
-> production component
-> frame wrapper
```

Implementation rules:

- Resolve editable props with `resolveUXPinRuntimeProps`.
- Resolve editable children with `resolveUXPinChildrenFromProps`.
- Treat explicit empty children as user intent unless there is a known UXPin placeholder bug.
- Filter hidden and deleted layers before rendering or converting children.
- Do not render target placeholders directly when they represent nested component items.
- Do not use fallback defaults as a substitute for real preset children.
- Avoid `useMemo` around child parsing unless UXPin object identity has been proven stable.
- Keep editor sizing concerns separate from prototype interaction concerns.
- Add stable identity signals such as `uxpinRole`, `displayName`, `uxpId`, `presetElementId`, or shape-based checks for nested components that need slot detection.

## Preset Contract

Presets must represent the intended editable layer model.

Rules:

- Atomic presets may be simple.
- Composite presets must include real editable child layers.
- Child preset ids must be semantic and stable.
- Slot presets must make the layer tree clear to designers.
- Presets must not depend on a later prop touch to become fully hydrated.
- If a default visual item should be editable, it belongs in the preset, not only in render fallback code.

## Frame And Sizing Contract

Frame behavior must be deliberate per component.

Rules:

- Atomic components should usually hug content.
- Inputs and width-based controls may use `FrameFill` and `mergeFrameStyle`.
- Content-height components may use `useAutoHeightMergeFrame`.
- Full-height components must separate outer UXPin frame behavior from inner production scrolling behavior.
- Parent containers should own child fill behavior when possible.
- Avoid fixed heights unless the component explicitly models a fixed-height prototype frame.
- Prefer `height: 100%`, `min-height: 0`, `overflow: auto`, and clear `fit-content` behavior for frame-fill containers.

## Production Canary

Reliability requires a small UXPin canary set that is checked after branch pushes.

Minimum canary coverage:

- Atomic component page.
- Nested editable components page.
- Frame, flex, and full-height page.
- Prototype interaction page.
- Stateful product-flow page for table, sidebar, or menu flows.

Production smoke checklist:

- Insert component.
- Edit common props.
- Add child layer where supported.
- Delete child layer where supported.
- Hide child layer where supported.
- Reorder child layers where supported.
- Resize the component frame.
- Check editor mode.
- Check prototype mode.
- Record any production-only limitation in `uxpin/BACKLOG.md` or the task notes.

## Integration Workflow

For each component or small component batch:

1. Classify the component tier.
2. Read the production component API and behavior.
3. Define the UXPin authoring contract.
4. Create or update wrapper and preset using existing UXPin patterns.
5. Add runtime conversion for children, slots, or data when needed.
6. Add targeted runtime tests for serialized UXPin payloads when the component is Tier 2 or Tier 3.
7. Run the smallest useful package validation.
8. Run local Merge smoke.
9. Push to a UXPin branch only after local validation passes.
10. Run production canary smoke before marking the component ready.

## Recommended Rollout

Start with reference components instead of broad rollout:

- `Tag` as the Tier 1 atomic reference.
- `Toolbar` or `Tabs` as the Tier 2 editable children reference.
- `Table` or `Sidebar` as the Tier 3 stateful product-flow reference.

After the reference patterns are stable, integrate the remaining components by tier. Do not mix simple wrapper rollout with stateful prototype-flow work in the same batch unless the components share a runtime contract.

## Definition Of Done

A UXPin component is ready when:

- Its production API mapping is explicit.
- UXPin-only props are justified and minimal.
- Preset children match the intended editable layer model.
- Runtime props and children are resolved through shared helpers where needed.
- Hidden, deleted, and explicitly empty child states behave correctly.
- Frame behavior is validated locally and in UXPin cloud for the component tier.
- Tier 2 and Tier 3 serialized runtime tests cover the risky data paths.
- Production editor and prototype smoke checks pass or limitations are documented.
- Only source files and intentional generated artifacts are changed.

## Open Decisions Before Implementation Planning

- Which component becomes the first Tier 2 reference: `Toolbar` or `Tabs`.
- Which component becomes the first Tier 3 reference: `Table` or `Sidebar`.
- Where to keep the production canary checklist long-term: `uxpin/BACKLOG.md`, a dedicated docs page, or per-task notes.
- Whether production smoke evidence should be recorded manually in task summaries or encoded into a reusable release checklist.
