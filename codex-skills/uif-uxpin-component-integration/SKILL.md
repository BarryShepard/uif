---
name: uif-uxpin-component-integration
description: Use when adding, adapting, or refining UXPin Merge components in the UIF Hexa UI package, especially components with editable nested layers, presets, slots, default children, frame sizing, or design-system-like prototype behavior.
---

# UIF UXPin Component Integration

Use this skill for UXPin Merge work in `packages/kaspersky-hexa-ui/uxpin`.

## Goal

Build UXPin components that feel editable in the designer, behave correctly in prototype mode, and stay close to production Hexa UI components without fragile one-off hacks.

## First Pass

1. Identify the production component and public API under `packages/kaspersky-hexa-ui/src/<component>`.
2. Inspect the UXPin wrapper, preset, nested child components, and any shared helpers:
   - `uxpin/components/<Component>/<Component>.tsx`
   - `uxpin/components/<Component>/uxpin-presets/*.jsx`
   - `uxpin/uxpinRuntime.ts`
   - `uxpin/preview.tsx`
3. Check similar working components before inventing a pattern. Good references:
   - Layer-driven items: `Toolbar`, `ToolbarLeftItems`, `ToolbarRightItems`, `ToolbarButton`
   - Nested editable items: `Submenu`, `SubmenuItem`, `Tabs`, `TabItem`
   - Frame behavior: `TablePrototype`, wrappers, `Sidebar`

## Core Patterns

- Resolve UXPin runtime props through `resolveUXPinRuntimeProps(rawProps)` when props can come from `codeComponentProps` or `overriddenCodeProps`.
- Resolve UXPin children through `resolveUXPinChildrenFromProps(props)` or `resolveUXPinElementChildren(element)`. UXPin often puts live edited layers in `overriddenCodeProps.children`.
- Do not render UXPin target placeholders directly when they represent child components. Convert them into real components/items, like `toolbarChildrenToItems`.
- Defaults are only for initial/no-children cases. If UXPin supplies an explicit empty/null children prop, treat that as user intent unless there is a known UXPin placeholder bug.
- Filter hidden/deleted layers with `isUXPinHiddenElement` before rendering or converting children.
- Avoid `useMemo` around `children` parsing unless you are certain UXPin updates object identity correctly. Stale layer trees usually come from memoized child resolution.
- Keep nested slot components visible in Layers when the user needs to edit them, but render them into the correct visual area instead of the generic content area.

## Preset Rules

- Presets should include realistic default children for editable containers.
- Child preset ids should be semantic and stable, for example `sidebar-footer-left-items`, `sidebar-footer-save`, `sidebar-tabs`.
- Slot detection should accept several identities: component `uxpinRole`, `displayName`, `name`, `uxpId`, `presetElementId`, `uxpinPresetElementId`, and sometimes shape-based props.
- When adding new nested child components, export/import them in UXPin component registration if needed and include presets.

## Container Components

For containers such as Sidebar, Toolbar, Table, Submenu, Tabs, Dropdown:

- Split children into named zones first, then render remaining children as content.
- Prevent zone components from leaking into the content area.
- If several zone types can appear together, make detection explicit so they do not compete for one slot.
- When a child zone is present but empty, decide deliberately:
  - Empty because the user deleted content: render empty.
  - Empty because UXPin passed a target wrapper without children: use safe defaults or resolve deeper.
- If the visual component accepts data arrays instead of React children, write a converter from UXPin child layers to the production data shape.

## Frame And Sizing

- Default to content-hugging frames for atomic components.
- Use `FrameFill` and `mergeFrameStyle` only when the component should fill available width.
- Use `useAutoHeightMergeFrame` for content-height components, and skip it inside parent containers when the parent owns sizing.
- For full-height/full-width containers, separate stage/frame behavior from the inner panel behavior.
- Preserve UXPin editability: avoid fixed heights unless the user explicitly asks; prefer `height: 100%`, `min-height: 0`, `overflow: auto`, and clear `fit-content` where appropriate.

## Validation

- Run the smallest useful check first:
  - `cd packages/kaspersky-hexa-ui && npm run lint-ts`
  - `git diff --check -- <touched files>`
- Do not edit `.uxpin-merge/*` manually unless the task explicitly requires generated UXPin artifacts.
- If UXPin behavior cannot be proven by tests, name the exact manual checks for the user: insert component, add/remove nested item, hide item in Layers, switch props, prototype click behavior, resize frame.

## Common Implementation Recipe

1. Add or adjust public UXPin props with clear TS comments so UXPin shows usable controls.
2. Add preset children that match the desired default state.
3. Resolve runtime props and children from UXPin helper functions.
4. Detect and split named child zones.
5. Convert target placeholders into real visual components/items.
6. Filter hidden elements.
7. Add frame sizing only after rendering behavior is correct.
8. Validate with `lint-ts` and scoped `diff --check`.
