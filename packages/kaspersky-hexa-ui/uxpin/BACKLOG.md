# UXPin Backlog

## Table + Toolbar integration

Status: pending

Context:
- `Toolbar` is a standalone component, but in real product flows it is often owned by `Table`.
- Table-related actions depend on table state: selection, filtered rows, visible columns, pagination, grouping, search, and entity actions.
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
5. Preserve standalone `Toolbar` for page-level scenarios not tied to a table.

Open questions for later:
- Which toolbar actions should be available by default in the table prototype: create, delete, export, filter, search, settings, open entity?
- Should UXPin support both embedded table toolbar and standalone toolbar linked to a table, or only the embedded mode first?
- How should entity actions interact with manual table data in prototype mode?

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
