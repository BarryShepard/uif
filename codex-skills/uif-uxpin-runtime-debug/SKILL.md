---
name: uif-uxpin-runtime-debug
description: Use when a UIF UXPin Merge component does not update correctly in the editor or prototype, including stale props, added or removed child layers not affecting the canvas, hidden layers still rendering, default placeholders requiring prop changes, slot components appearing in the wrong area, broken frame resizing, or editor/prototype mismatch.
---

# UIF UXPin Runtime Debug

Use this skill for recurring UXPin Merge bugs in `packages/kaspersky-hexa-ui/uxpin`.

## Debug Mindset

Treat UXPin bugs as runtime data-flow bugs first, visual CSS bugs second. The usual chain is:

`UXPin layer tree -> props/codeComponentProps/overriddenCodeProps -> child resolver -> converter -> production component -> frame wrapper`

Find the broken link before patching styles.

## Fast Triage

1. Inspect the live shape in `.uxpin-merge/page.json` when editor behavior is surprising. Search for the component id, `presetElementId`, `codeComponentProps`, `overriddenCodeProps`, and `children`.
2. Compare with a known working pattern:
   - Toolbar item updates: `Toolbar`, `ToolbarLeftItems`, `ToolbarRightItems`, `ToolbarButton`
   - Nested layer conversion: `SubmenuItem`, `TabItem`
   - Sidebar zone routing: `Sidebar`, `SidebarFooter`
3. Confirm whether the issue exists in editor, prototype, or both. Editor-only bugs often involve frame sizing or layer placeholders; prototype bugs often involve state, handlers, or production component data.

## Symptoms And Likely Causes

- Added child does not appear:
  - Reading `props.children` while UXPin writes to `overriddenCodeProps.children`.
  - Rendering UXPin target placeholders instead of converting them to real components/items.
  - Child parsing wrapped in stale `useMemo`.
  - Slot detection fails because the element is a UXPin wrapper, not the concrete React component.

- Deleted or hidden child still appears:
  - Defaults override explicit empty children.
  - Missing `isUXPinHiddenElement` filtering.
  - Converter reads `defaultProps.children` after the user has edited layers.

- Component shows placeholder until a prop is touched:
  - Preset lacks real default children.
  - Wrapper relies on runtime props that UXPin only hydrates after edit.
  - Fallback defaults are in render code but not represented in the layer tree.

- Child appears in the wrong area:
  - Parent did not split children into slots before rendering content.
  - Slot component was not removed from `contentChildren`.
  - Multiple slot components compete for one broad detection rule.

- Footer/header/sidebar/table frame cannot resize correctly:
  - Parent and child both sync `.merge-component` size.
  - Fixed `height`, `minHeight`, or `100vh` fights UXPin frame size.
  - Missing `min-height: 0` on flex children.
  - Scroll belongs on the wrong element.

- Maximum call stack exceeded:
  - Recursive shape detection follows nested props without a guard.
  - Component identity unwrapping has no depth limit.
  - A converter rewraps children and re-enters the same resolver.

## Fix Checklist

- Use `resolveUXPinRuntimeProps` for props that can be edited in UXPin.
- Use `resolveUXPinChildrenFromProps` for editable children.
- If a child is a target placeholder, convert it to the real child component or production data shape.
- Filter `isUXPinHiddenElement` before rendering/converting.
- Make default children conditional. Never let defaults hide user edits.
- Add stable `uxpinRole`/`displayName` and robust slot identity checks.
- Remove slot components from generic content rendering.
- Avoid memoizing child resolution unless necessary and proven safe.
- Keep editor sizing and prototype behavior separate when possible.

## Validation

- Run `cd packages/kaspersky-hexa-ui && npm run lint-ts`.
- Run `git diff --check -- <touched files>`.
- For UXPin-only behavior, ask for or perform these manual checks:
  - Add a child item in Layers.
  - Delete a child item.
  - Hide a child item.
  - Move a child between slots.
  - Toggle the parent prop that shows/hides the slot.
  - Resize the component frame.
  - Test in prototype mode if interactions are involved.

## What To Avoid

- Do not fix stale layer behavior with CSS.
- Do not manually edit `.uxpin-merge/*` as source.
- Do not add broad recursive shape detection without depth limits.
- Do not use defaults as a substitute for editable preset children.
- Do not let generated/UXPin metadata props leak onto DOM nodes.
