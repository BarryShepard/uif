# uxpin-prototype-agent

Use for UXPin interactive prototyping rollout in Hexa UI.

## Mission

- Make `packages/kaspersky-hexa-ui` usable for full interactive UXPin prototypes, not just isolated component previews.
- Treat prototype blockers as system behavior problems first: navigation, triggers, state ownership, nested interactions, and validation.
- Measure progress by completed prototype scenarios, not by raw wrapper count.

## Owns

- `packages/kaspersky-hexa-ui/uxpin`
- `packages/kaspersky-hexa-ui/helpers/*uxpin*.test.tsx`
- `packages/kaspersky-hexa-ui/src/table/preview`
- supporting Hexa UI preview/runtime files needed to keep UXPin behavior close to production APIs

## Success Criteria

- A non-code author can assemble a realistic end-to-end UXPin prototype with:
  - menu-driven page switching
  - sidebars opened from external controls
  - table-driven actions and stateful flows
  - clickable nested child actions
  - form validation flows
- Editor behavior and prototype behavior stay aligned for add/remove/hide/reorder child-layer changes.

## Priority Order

1. Build the behavior platform first:
   - `Field` validation trigger model
   - `Sidebar` open trigger model
   - nested item interactions for `TabItem`, `MenuItem`, `ToolbarButton`, `DropdownItem`, and slot-passed buttons
   - menu-driven page switching
2. Then close container-level prototype flows:
   - `Table + Toolbar` integration with table-owned state
   - collapsible `ToolbarSearch`
   - reusable `Dropdown` for actions and filters
   - keep table height fallback and tree authoring as supporting UXPin infrastructure
3. Then tighten authoring consistency:
   - prop audit for `Field`, `ActionButton`, and `Tag`
   - reuse `FieldLabel` model for `Checkbox` and `Radio`
   - align naming with `helpers/propsDictionary.ts` only after behavior stabilizes
4. Only after the above, spend time on remaining coverage gaps such as `anchor-links`, `field-set`, and `scrollbar`.

## Working Rules

- Do not treat UXPin work as a wrapper-count project. Prefer scenario-driven progress.
- When the incoming brief is short, shape it with `.agents/uxpin-task-brief.md` before implementation.
- Stay close to production component contracts. When sources disagree, prefer:
  1. public TypeScript API
  2. runtime/story/meta behavior
  3. `helpers/propsDictionary.ts`
- Keep state in the owning container when a production pattern already exists.
  Example: table-related toolbar actions should be modeled as table-owned behavior, not as two loosely coupled widgets.
- Prefer shared UXPin runtime helpers over one-off parsing:
  - `resolveUXPinRuntimeProps`
  - `resolveUXPinChildrenFromProps`
  - hidden-layer filtering
  - stable child/slot identity checks
- Prefer explicit authoring patterns over fragile magic props when prototype authors need predictable behavior.
- Do not hand-edit `.uxpin-merge/*` unless the task explicitly requires generated UXPin output.
- Use `npm run uxpin:sync-components` for simple wrapper/preset scaffolding; spend manual effort on behavior-rich components.

## Required Validation

- Start with the smallest useful package-local checks:
  - `cd packages/kaspersky-hexa-ui && npm run lint-ts`
  - `cd packages/kaspersky-hexa-ui && npm run test:only`
  - `git diff --check -- <touched files>`
- For behavior-heavy UXPin work, always name manual checks explicitly:
  - insert component
  - add/remove nested child
  - hide child in Layers
  - attach interaction to nested item
  - trigger sidebar/dropdown/modal from another control
  - switch visible page/content area
  - resize frame
  - compare editor behavior vs prototype behavior

## Handoff Notes

- Report which prototype scenario became possible after the change.
- Call out which UXPin behaviors were proven by automated checks and which still need manual verification in UXPin.
- Mention generated or synced artifacts separately from source changes.
