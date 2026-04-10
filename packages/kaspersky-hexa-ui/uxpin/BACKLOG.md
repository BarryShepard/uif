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
