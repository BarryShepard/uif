# UXPin Backlog

## Field, button, and tag prop audit

Status: pending

Context:
- UXPin `Field`, `ActionButton`, and `Tag` now have prototype-oriented prop layers, but the final prop set should be audited against production public APIs, Storybook controls, and recurring prototype authoring needs.
- The audit should decide which props stay as first-class UXPin controls, which props remain advanced/hidden, and which naming aliases should be preserved for designer ergonomics.

Recommended future work:
1. Review `Field` props for label, validation, placeholder propagation, nested controls, sizing, and help/error states.
2. Review `ActionButton` props for mode naming, icon slots, text/icon variants, and action/prototype event behavior.
3. Review `Tag` props for sizing, mode list, closable behavior, readonly/disabled propagation, and frame hugging.
4. Align prop names with `helpers/propsDictionary.ts` after the final UXPin component set is stable.

## Field validation trigger model

Status: implemented

Context:
- `Field` needs validation states, but prototype authors need a clear way to trigger validation at the right moment: immediately, on blur, on submit, after interaction, or through UXPin interactions.
- Production validation is usually state-driven by form logic, while UXPin prototypes need an authoring model that can be configured without writing application state.

Implemented model:
1. `Field` now supports both `validationMode="manual"` and `validationMode="rule"` for declarative prototype validation.
2. Rule mode supports `required`, `email`, `regex`/`mask`, `length`, `numberRange`, and `selectionCount`, plus `validationTrigger` (`always` / `blur` / `change` / `external`).
3. `validationVisible` covers submit-like and UXPin-interaction-driven flows without adding a separate form controller component.
4. Supported nested controls inherit validation from `Field`: input-like controls receive `validationStatus`, while checkbox/radio groups receive `invalid`.
5. UXPin `Textbox` now exposes declarative input constraints for masked input, allowed charset filtering, max length, and numeric min/max helpers so rule validation can stay close to production control APIs.

Validation checklist:
1. `validationTrigger="blur"` keeps the message hidden until the nested control blurs.
2. `validationTrigger="change"` reveals validation after typing/clicking/changing the field control.
3. `validationTrigger="external"` + `validationVisible={true}` supports submit buttons and UXPin interactions.
4. `validationMode="rule"` covers email, hash/length, numeric range, and multi-select CTA validation without custom code.
5. Error, warning, and success messages match the field validation state, while nested supported controls stay aligned where production APIs allow it.

## Checkbox and radio label component reuse

Status: pending

Context:
- UXPin `Field` now has an editable `FieldLabel` layer for label text, required state, info button, and editable tags.
- Checkbox and radio labels still use their built-in string label paths.
- To keep nested label editing consistent, standalone `Checkbox` and `Radio`/radio option authoring should reuse the same label component model instead of duplicating label behavior.

Recommended future work:
1. Replace checkbox string-label rendering in UXPin with an editable label layer based on the field label component.
2. Add the same label-layer model for radio buttons/options.
3. Preserve existing simple text props as shortcuts for fast authoring.
4. Validate disabled, readonly, required, tooltip/info button, and tag behavior inside checkbox/radio groups.

## Sidebar open trigger model

Status: pending

Reference:
- https://chatgpt.com/share/69e76469-0830-83eb-a9ce-c96d8f7e214f

Context:
- UXPin `Sidebar` currently focuses on the opened panel state, but product prototypes need a reliable authoring model for opening sidebars from buttons, table rows, toolbar actions, and other page controls.
- The model should work in both editor and prototype mode without authors having to manually duplicate open/closed sidebar states for every flow.
- Opening behavior must stay compatible with nested editable sidebar sections: submenu, tabs, footer, and content areas.

Recommended future work:
1. Define the preferred UXPin authoring pattern for sidebar triggers.
2. Decide whether `Sidebar` needs an explicit trigger/action prop, an external controller component, or documented UXPin interactions.
3. Validate opening multiple sidebar variants from a single page, including table row/entity flows.
4. Check close behavior, overlay clicks, and state reset after reopening.

## Sidebar footer button layer updates

Status: implemented

Context:
- `SidebarFooter` is visible in the sidebar, but editable `SidebarFooterLeftItems` and `SidebarFooterRightItems` must reflect layer changes immediately.
- Adding, deleting, hiding, or reordering buttons inside the left/right footer zones should update the canvas and prototype without requiring prop toggles or component reinsertion.
- The likely recurring cause is UXPin target placeholders inside `overriddenCodeProps.children`; they must be converted into real button components instead of rendered as inert placeholders.
- `SidebarFooter` now routes nested `SidebarFooterLeftItems` and `SidebarFooterRightItems` through footer zones, while keeping legacy `leftItem` / `rightItem` slots compatible.

Validation checklist:
1. Add a new button to `SidebarFooterLeftItems`; it appears in the footer left zone.
2. Hide and delete a left-zone button; it disappears from the canvas.
3. Enable `additionalContent`, add a button to `SidebarFooterRightItems`; it appears in the right zone.
4. Hide and delete a right-zone button; it disappears from the canvas.
5. Check that standalone `SidebarFooterLeftItems` and `SidebarFooterRightItems` still hug content.

## Submenu drag-and-drop polish

Status: pending

Context:
- UXPin `Submenu` now supports runtime row reordering with visual drop feedback.
- The current implementation is usable for prototypes, but the interaction still feels rough.
- Drop targets and row spacing need additional visual tuning so the movement feels closer to native design tools and production-quality drag-and-drop.

Recommended future improvements:
1. Add smoother row displacement while dragging across targets.
2. Make the insertion line and spacing match the design system interaction language.
3. Add clearer feedback when dragging over an invalid target or a different nesting level.
4. Decide whether UXPin layer order should remain independent from runtime order, or whether we need a documented authoring pattern for persistent layer-level ordering.
5. Re-test nested submenu drag behavior after tree nesting authoring is finalized.

## Nested item interactions audit

Status: pending

Context:
- UXPin currently allows interactions on the `Tabs`/tab bar layer, but may not expose interactions on individual `TabItem` layers inside the tab bar.
- This can become a prototyping blocker when authors need different click actions per tab, especially for page switching or stateful flows.
- The same risk should be checked for other nested authoring models: menu items, submenu items, toolbar buttons, footer slot buttons, table placeholder buttons, dropdown items, and similar child layers.

Recommended future work:
1. Verify whether interactions can be attached to individual `TabItem` layers inside `Tabs` and inside `Sidebar`.
2. Check the same interaction behavior for `MenuItem`, `SubmenuItem`, `ToolbarButton`, `DropdownItem`, and buttons passed through component slots.
3. Decide whether nested items need explicit action props, event forwarding, or a documented UXPin authoring pattern.
4. Add a small prototype validation page that covers per-child interactions before relying on these components in complex prototypes.

## Table + Toolbar integration

Status: pending

Context:
- `Toolbar` is a standalone component, but in real product flows it is often owned by `Table`.
- Table-related actions depend on table state: selection, filtered rows, visible columns, pagination, grouping, search, and entity actions.
- UXPin needs a clear connection model between toolbar buttons and table rows/entities, so prototype authors can use buttons to delete, open, duplicate, export, or otherwise mutate entities inside the table.
- In production `hexa-ui` this is already modeled through table-side integration rather than by merging `Toolbar` into the base `Table` component.

Decision for future work:
- Keep the base `Toolbar` as a generic standalone component.
- For table scenarios, model the toolbar as a table-owned integration layer in UXPin, not as two unrelated widgets placed side by side.

Why this matters:
- Avoids divergence between prototype behavior and production behavior.
- Prevents duplicating state between `Table` and `Toolbar`.
- Makes bulk actions, export, delete, open entity, filter, and columns/settings work from the same source of truth.

Recommended implementation direction:
1. Add a table-level toolbar mode to the UXPin `Table` prototype.
2. Keep state ownership in `Table`: selection, filtering, search, pagination, visible rows, visible columns.
3. Expose toolbar actions from the table integration layer instead of binding them directly inside standalone `Toolbar`.
4. Reuse the existing production patterns from `src/table/modules/ToolbarIntegration`.
5. Add row/entity mutation actions for prototypes, starting with delete selected rows and open selected entity.
6. Preserve standalone `Toolbar` for page-level scenarios not tied to a table.

Open questions for later:
- Which toolbar actions should be available by default in the table prototype: create, delete, export, filter, search, settings, open entity?
- Should UXPin support both embedded table toolbar and standalone toolbar linked to a table, or only the embedded mode first?
- How should entity actions interact with manual table data in prototype mode?
- How should UXPin authors assign actions to toolbar buttons: action prop presets, event handlers, or binding a `ToolbarButton` to table-owned actions?

## Toolbar collapsible search

Status: pending

Context:
- UXPin `ToolbarSearch` in `collapsible` mode should behave like a toolbar toggle button.
- On click it should open the search input to the left of the toggle button.
- On `Enter` it should apply the query, close the input, release the toggle state, and show an indicator that search is active.

Current state:
- The underlying production `Toolbar.CollapsibleSearch` only partially matches this authoring behavior in UXPin.
- We already fixed some low-level behavior, but the full UXPin interaction model is still incomplete.

Recommended future implementation:
1. Model the trigger as a true toggled toolbar item in UXPin.
2. Keep the search field mounted in the right toolbar section and animate visibility to the left of the trigger.
3. Use applied-query state to drive the indicator after `Enter`.
4. Verify the result against production toolbar layout and states before rolling it out more broadly.

## Reusable Dropdown for UXPin actions

Status: draft, paused

Context:
- Toolbar dropdown buttons, table header sorting/filtering, and future table toolbar actions need the same configurable dropdown model.
- UXPin authors should be able to compose a dropdown from nested `DropdownItem` components, assign interactions to individual items, and reuse the same dropdown as an overlay instance for buttons or table controls.
- The first scaffold exists locally as UXPin `Dropdown` and `DropdownItem`, but the behavior should be validated in UXPin before broad rollout.

Desired component model:
- `Dropdown` owns overlay-level behavior: `variant`, `maxHeight`, sticky header slot, sticky footer slot, and scroll when content exceeds max height.
- `DropdownItem` owns item-level behavior: disabled, selected, before/after slots, text, description, nested subitems, and action click handler.
- `DropdownItem` with `variant="buttons"` should render a horizontal action row without toolbar overflow/More behavior.
- Sticky footer should default to a Reset filter style action, but stay replaceable through a slot.

Variants to support:
- Single choice.
- Multiple choice.
- Tree single choice.
- Tree multiple choice.
- With subitems.

Integration ideas:
- `ToolbarButton` with `variant="dropdown"` should accept a dropdown instance/slot and use its items as the overlay.
- Table column sorting/filtering should later accept the same dropdown instance/slot, so options are authored once and reused.
- Dropdown item actions should be assignable in UXPin, not hardcoded in the component.
- Table filter dropdowns need reset behavior per column, option groups, selected states, and a clear visual distinction between sorting and filtering actions.

Validation needed before continuing:
- Confirm UXPin supports passing a composed `Dropdown` instance into a toolbar button slot reliably.
- Check how UXPin serializes nested item visibility and click interactions inside dropdown overlays.
- Verify sticky header/footer behavior inside portal and non-portal contexts.
- Compare visual spacing and selected/disabled states against Storybook `Dropdown`.

## Table height fallback

Status: reference

Context:
- UXPin table height is sensitive to how nested frames pass height into React.
- The preferred behavior is direct frame drag-resize: the table fills its own UXPin frame, while `PageWrapper` provides page-level scrolling when several tables overflow.
- If UXPin nested frame height propagation regresses again, the previously working fallback is the optional `frameHeight` prop on UXPin `Table`.

Fallback solution to keep:
- `frameHeight` explicitly sets table frame height in px.
- The table then runs in `fillFrameHeight` mode, keeps pagination docked at the bottom, and scrolls rows internally.
- This is less ergonomic than drag-resize, but it is a safe escape hatch if UXPin frame resizing becomes unstable.
- Last checkpoint with the explicit `frameHeight` API: `897e3ac` (`checkpoint: save uxpin layout wrappers and table sizing`).

## Table tree link nesting authoring

Status: pending

Context:
- `treeLink` currently relies on row `children` to render expandable nested rows.
- Generated data can create demo nesting automatically, but UXPin authors need a clear way to define real nested data for prototypes.
- The current manual JSON format can technically express `children`, but it is not documented or optimized for authoring.

Questions to resolve:
- Should nested `treeLink` data be authored only through `dataSourceJson` with recursive `children` arrays?
- Do we need a friendlier UXPin prop or helper format for common one/two-level trees?
- How should nested rows interact with sorting, filtering, pagination, selection, and row count generation?
- Should table columns ever accept nested items directly, or should nesting remain strictly row-data-owned?

Recommended direction:
- Keep row nesting data-owned to stay close to production table behavior.
- Document the JSON shape with examples.
- Later consider a small authoring helper if JSON becomes too painful for designers.

## Menu inside flex layouts

Status: pending

Context:
- UXPin `Menu` currently behaves like a full-width block inside flex containers.
- When placed next to other elements inside a `flex` parent, it tends to share space evenly and stretch horizontally instead of keeping its natural sidebar width.
- When `Menu` is collapsed with its own toggle button, the visual width decreases, but neighboring flex items do not move as if the original width is still reserved in layout.
- The immediate workaround is a custom UXPin prop, but the component behavior itself should be improved.

Likely root cause:
- The UXPin `Menu` wrapper currently forces `width: 100%` on both the preview root and the menu preview shell.
- In flex layouts this makes each `Menu` instance request the full available width, so flexbox shrinks siblings proportionally.
- The collapsed visual state likely does not propagate back to the outer wrapper sizing model, so the wrapper keeps occupying the pre-collapse width in flex layout.

Recommended future implementation:
1. Revisit the UXPin `Menu` wrapper sizing model.
2. Remove unconditional `width: 100%` from the menu wrapper path.
3. Keep `minWidth: 280px` as the default sidebar floor.
4. Make full-width behavior opt-in rather than default.
5. Ensure collapsed width updates the outer layout width, not only the inner visual state.
6. Verify behavior in plain frame layout and inside flexbox containers with multiple siblings.

## Menu-driven page switching

Status: pending

Context:
- UXPin prototypes need a way to switch visible page/content areas when the user clicks menu items.
- Today `Menu` can model navigation structure and active/expanded states, but it does not own or coordinate page-level content visibility.
- Without a shared mechanism, authors have to manually wire every menu item to frame visibility, which is slow and error-prone.

Questions to resolve:
- Should menu page switching be driven by UXPin interactions only, or should `MenuItem` expose a stable page/action key?
- Should `Menu` control sibling `PageWrapper`/section visibility, or should we introduce a higher-level layout/navigation wrapper?
- How should nested menu items map to pages, especially when parent items are expandable but not real pages?
- How should active menu state stay in sync when the page changes from another control?

Recommended direction:
- Start with explicit `pageKey`/`actionKey` style metadata on `MenuItem`.
- Keep the visual menu component independent, but document a recommended UXPin interaction pattern for switching page containers.
- Later consider a page navigation wrapper if manual UXPin wiring remains too expensive.
