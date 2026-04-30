# UXPin Page Component Design

## Goal

Add a UXPin-only `Page` component for assembling a full application screen inside a UXPin frame. `Page` should compose the existing UXPin `Menu`, `Submenu`, `PageHeader`, `PageWrapper`, and `SidebarFooter` components without replacing or changing their standalone behavior.

## Owner Package

`packages/kaspersky-hexa-ui`

## Scope

- Add a new UXPin component under `uxpin/components/Page`.
- Keep the implementation out of production `src/*` APIs.
- Do not reintroduce `ContentArea`.
- Do not change the existing standalone behavior of `Menu`, `Submenu`, `PageWrapper`, `PageHeader`, or `SidebarFooter`.

## Layout

`Page` fills the available width and height of its UXPin frame.

The first layout level is horizontal:

```text
Page
  Menu
  Submenu
  pageContent
```

The `pageContent` area is vertical:

```text
pageContent
  PageHeader
  PageWrapper
  SidebarFooter
```

`PageHeader` and `SidebarFooter` use their natural height. `PageWrapper` takes the remaining page content space and owns page scrolling. The outer `Page` frame hides overflow.

## Props

```ts
type UXPinPageProps = {
  menu?: boolean,
  submenu?: boolean,
  pageHeader?: boolean,
  pageFooter?: boolean,
  children?: React.ReactNode,
  style?: React.CSSProperties
}
```

All toggles default to `true`.

Toggle behavior:

- `menu={false}` visually hides the `Menu` zone.
- `submenu={false}` visually hides the `Submenu` zone.
- `pageHeader={false}` visually hides the `PageHeader` zone.
- `pageFooter={false}` visually hides the `SidebarFooter` zone.

Hidden zones remain in UXPin Layers and can still be edited. If the toggle is turned back on, the edited nested component becomes visible again.

## Editable Children

The `Page` preset should include real nested UXPin components:

- `Menu` with editable `MenuItem` children.
- `Submenu` with editable `SubmenuItem` children.
- `PageHeader` with its editable props and breadcrumb children.
- `PageWrapper` with editable page content.
- `SidebarFooter` with editable footer item zones.

`Page` should resolve UXPin runtime children from current layer state. Default children are only for the initial preset. If a designer deletes a nested layer, `Page` must not recreate it from defaults.

## Slot Detection

`Page` should split its children into named zones by component identity and stable preset IDs:

- `page-menu` for `Menu`.
- `page-submenu` for `Submenu`.
- `page-header` for `PageHeader`.
- `page-wrapper` for `PageWrapper`.
- `page-footer` for `SidebarFooter`.

Detection should tolerate UXPin wrappers by checking component `uxpinRole`, `displayName`, `name`, `uxpId`, `presetElementId`, and `uxpinPresetElementId`, matching the existing Sidebar slot-detection style.

Unknown direct children are unsupported in the first version. Designers should place arbitrary page content inside the nested `PageWrapper`, where it remains editable through the existing `PageWrapper` behavior.

## UXPin Runtime Rules

- Use `resolveUXPinRuntimeProps` and UXPin child-resolution helpers rather than reading only raw `props.children`.
- Filter hidden/deleted layers with existing visibility helpers.
- Avoid memoizing child parsing in a way that can make UXPin layer edits stale.
- Do not render hidden-by-toggle zones visually, but keep the layer tree editable.
- Do not hand-edit `.uxpin-merge/*`; use existing sync/build commands when generated artifacts are required.

## Validation

Automated checks:

- `npm run lint-ts`
- `git diff --check -- <touched files>`

Manual UXPin checks:

- Insert `Page` into a frame and confirm it fills the frame.
- Resize the frame and confirm `Menu`, `Submenu`, and `pageContent` keep the intended layout.
- Toggle `menu`, `submenu`, `pageHeader`, and `pageFooter` off and on; edited nested layers should stay editable and reappear with edits intact.
- Edit nested `MenuItem`, `SubmenuItem`, `PageHeader`, `PageWrapper`, and `SidebarFooter` content from Layers.
- Delete a nested layer and confirm `Page` does not recreate it automatically.
