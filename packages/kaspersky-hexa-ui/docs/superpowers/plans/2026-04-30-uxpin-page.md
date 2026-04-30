# UXPin Page Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a UXPin-only `Page` container that fills a UXPin frame and composes editable `Menu`, `Submenu`, `PageHeader`, `PageWrapper`, and `SidebarFooter` layers.

**Architecture:** Keep `Page` under `uxpin/components/Page` and do not add a production `src/*` API. The component resolves UXPin runtime children into named zones, renders known child components through existing wrappers, hides toggled zones visually without removing their mounted child trees, and relies on a preset for initial editable nested layers. UXPin registration is provided by the existing dynamic `uxpin.config.js` directory scan, while generated `.uxpin-merge/*` files are not hand-edited.

**Tech Stack:** React 17, TypeScript, styled-components, UXPin Merge runtime helpers, Jest, React Testing Library, `npm run lint-ts`, targeted `npm run test:only`.

---

## File Structure

- Create: `helpers/uxpinPageRuntime.test.tsx`
  - Tests runtime child routing, frame layout, visual toggles, and deleted-layer behavior.
- Create: `uxpin/components/Page/Page.tsx`
  - Owns the UXPin-only `Page` layout and child zone routing.
- Create: `uxpin/components/Page/uxpin-presets/Page.jsx`
  - Provides the initial editable nested layers for UXPin authors.
- No change: `src/*`
  - `Page` is UXPin-only for this increment.
- No hand edit: `.uxpin-merge/*`
  - Generated artifacts are updated only by UXPin Merge tooling when publishing or explicitly requested.

## Task 1: Add Failing Runtime Coverage

**Files:**
- Create: `helpers/uxpinPageRuntime.test.tsx`

- [ ] **Step 1: Create the failing runtime test**

Create `helpers/uxpinPageRuntime.test.tsx`:

```tsx
import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React from 'react'

import Page from '../uxpin/components/Page/Page'

const PageRuntime = Page as React.ComponentType<Record<string, unknown>>

const pageSlotDescriptor = (
  name: string,
  presetElementId: string,
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  name,
  overriddenCodeProps,
  presetElementId,
  uxpId: presetElementId,
  uxpinPresetElementId: presetElementId,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const childDescriptor = (
  name: string,
  presetElementId: string,
  overriddenCodeProps: Record<string, unknown> = {}
): React.ReactNode => ({
  name,
  overriddenCodeProps,
  presetElementId,
  uxpId: presetElementId,
  uxpinPresetElementId: presetElementId,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const pageChildren = (): React.ReactNode[] => [
  pageSlotDescriptor('Menu', 'page-menu', {
    children: [
      childDescriptor('MenuItem', 'page-menu-item-1', {
        elementBefore: false,
        label: 'Security dashboard',
        state: 'enabled'
      })
    ],
    footer: false,
    header: false
  }),
  pageSlotDescriptor('Submenu', 'page-submenu', {
    children: [
      childDescriptor('SubmenuItem', 'page-submenu-item-1', {
        selected: true,
        text: 'Assets',
        variant: 'item'
      })
    ]
  }),
  pageSlotDescriptor('PageHeader', 'page-header', {
    title: 'Custom page title'
  }),
  pageSlotDescriptor('PageWrapper', 'page-wrapper', {
    children: <div>Page body content</div>
  }),
  pageSlotDescriptor('SidebarFooter', 'page-footer', {
    additionalContent: false,
    leftItem: <button type="button">Footer action</button>
  })
]

describe('UXPin Page runtime', () => {
  it('routes known UXPin child descriptors into the full page layout', () => {
    const { container } = render(
      <PageRuntime
        codeComponentProps={{
          children: pageChildren()
        }}
      />
    )

    const pageRoot = container.querySelector('[data-hexa-uxpin-page="true"]') as HTMLDivElement
    const pageContent = screen.getByTestId('hexa-uxpin-page-content')
    const pageWrapperZone = screen.getByTestId('hexa-uxpin-page-wrapper-zone')

    expect(pageRoot).toBeInTheDocument()
    expect(pageRoot).toHaveStyle({
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      width: '100%'
    })
    expect(pageContent).toHaveStyle({
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'column'
    })
    expect(pageWrapperZone).toHaveStyle({
      flex: '1 1 auto',
      minHeight: '0'
    })

    expect(screen.getByText('Security dashboard')).toBeInTheDocument()
    expect(screen.getByText('Assets')).toBeInTheDocument()
    expect(screen.getByText('Custom page title')).toBeInTheDocument()
    expect(screen.getByText('Page body content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Footer action' })).toBeInTheDocument()
  })

  it('visually hides toggled zones while keeping their child trees mounted', () => {
    render(
      <PageRuntime
        menu={false}
        submenu={false}
        pageHeader={false}
        pageFooter={false}
        codeComponentProps={{
          children: pageChildren()
        }}
      />
    )

    expect(screen.getByTestId('hexa-uxpin-page-menu-zone')).not.toBeVisible()
    expect(screen.getByTestId('hexa-uxpin-page-submenu-zone')).not.toBeVisible()
    expect(screen.getByTestId('hexa-uxpin-page-header-zone')).not.toBeVisible()
    expect(screen.getByTestId('hexa-uxpin-page-footer-zone')).not.toBeVisible()

    expect(screen.getByText('Security dashboard')).not.toBeVisible()
    expect(screen.getByText('Assets')).not.toBeVisible()
    expect(screen.getByText('Custom page title')).not.toBeVisible()
    expect(screen.getByRole('button', { name: 'Footer action' })).not.toBeVisible()

    expect(screen.getByTestId('hexa-uxpin-page-wrapper-zone')).toBeVisible()
    expect(screen.getByText('Page body content')).toBeVisible()
  })

  it('does not recreate default zones when UXPin children are deleted', () => {
    render(
      <PageRuntime
        codeComponentProps={{
          children: [
            pageSlotDescriptor('PageWrapper', 'page-wrapper', {
              children: <div>Only body remains</div>
            })
          ]
        }}
      />
    )

    expect(screen.getByText('Only body remains')).toBeVisible()
    expect(screen.queryByText('Security dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Assets')).not.toBeInTheDocument()
    expect(screen.queryByText('Custom page title')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Footer action' })).not.toBeInTheDocument()
    expect(screen.queryByText('Administration server')).not.toBeInTheDocument()
    expect(screen.queryByText('Page title')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
npm run test:only -- helpers/uxpinPageRuntime.test.tsx
```

Expected result:

```text
FAIL helpers/uxpinPageRuntime.test.tsx
Cannot find module '../uxpin/components/Page/Page'
```

## Task 2: Implement the UXPin Page Component

**Files:**
- Create: `uxpin/components/Page/Page.tsx`
- Test: `helpers/uxpinPageRuntime.test.tsx`

- [ ] **Step 1: Create the Page component**

Create `uxpin/components/Page/Page.tsx`:

```tsx
import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import {
  getUXPinChildrenArray,
  getUXPinElementPropSources,
  getUXPinElementProps,
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../../visibility'
import Menu, { UXPinMenuProps } from '../Menu/Menu'
import PageHeader, { UXPinPageHeaderProps } from '../PageHeader/PageHeader'
import PageWrapper, { UXPinPageWrapperProps } from '../PageWrapper/PageWrapper'
import SidebarFooter, { UXPinSidebarFooterProps } from '../SidebarFooter/SidebarFooter'
import Submenu, { UXPinSubmenuProps } from '../Submenu/Submenu'

export type UXPinPageProps = {
  /** Shows the left product menu zone. */
  menu?: boolean,
  /** Shows the secondary submenu zone. */
  submenu?: boolean,
  /** Shows the page header zone. */
  pageHeader?: boolean,
  /** Shows the page footer zone. */
  pageFooter?: boolean,
  /** Page zones. Place Menu, Submenu, PageHeader, PageWrapper, and SidebarFooter here. */
  children?: React.ReactNode,
  style?: CSSProperties,
  codeComponentProps?: Partial<UXPinPageProps>,
  overriddenCodeProps?: Partial<UXPinPageProps> & {
    codeComponentProps?: Partial<UXPinPageProps>
  }
}

type UXPinComponentIdentity = {
  displayName?: string,
  name?: string,
  render?: unknown,
  type?: unknown,
  uxpinRole?: string,
  WrappedComponent?: unknown
}

type PageChildResolution = {
  footerElement?: React.ReactNode,
  headerElement?: React.ReactNode,
  menuElement?: React.ReactNode,
  pageWrapperElement?: React.ReactNode,
  submenuElement?: React.ReactNode
}

type PageComponent = React.FC<UXPinPageProps> & {
  defaultProps?: Partial<UXPinPageProps>,
  uxpinRole?: string
}

const PAGE_ROLE = 'hexa-uxpin-page'

const PageRoot = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--bg--base, #fff);
  box-sizing: border-box;
`

const PageRailZone = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex: 0 0 auto;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
`

const PageContent = styled.main`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
`

const PageContentSlot = styled.div<{ $visible: boolean, $fill?: boolean }>`
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex: ${({ $fill }) => ($fill ? '1 1 auto' : '0 0 auto')};
  flex-direction: column;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: ${({ $fill }) => ($fill ? 'hidden' : 'visible')};
  box-sizing: border-box;
`

const collectUXPinComponentIdentity = (
  type: unknown,
  result: UXPinComponentIdentity[] = [],
  depth = 0
): UXPinComponentIdentity[] => {
  if (!type || depth > 4) {
    return result
  }

  const identity = type as UXPinComponentIdentity

  result.push(identity)
  collectUXPinComponentIdentity(identity.type, result, depth + 1)
  collectUXPinComponentIdentity(identity.render, result, depth + 1)
  collectUXPinComponentIdentity(identity.WrappedComponent, result, depth + 1)

  return result
}

const isConcreteUXPinElement = (
  node: React.ReactNode,
  role: string,
  componentName: string
): boolean => (
  React.isValidElement(node) &&
  collectUXPinComponentIdentity(node.type).some((identity) => (
    identity.uxpinRole === role ||
    identity.displayName === componentName ||
    identity.name === componentName
  ))
)

const hasUXPinSlotIdentity = (
  node: React.ReactNode,
  slotId: string,
  componentName: string
): boolean => (
  (
    (React.isValidElement(node) && typeof node.key === 'string' && node.key.includes(slotId)) ||
    getUXPinElementPropSources(node).some((props) => (
      (typeof props.uxpId === 'string' && props.uxpId.includes(slotId)) ||
      (typeof props.id === 'string' && props.id.includes(slotId)) ||
      (typeof props.presetElementId === 'string' && props.presetElementId.includes(slotId)) ||
      (typeof props.uxpinPresetElementId === 'string' && props.uxpinPresetElementId.includes(slotId)) ||
      props.name === componentName
    ))
  )
)

const isMenuSlotElement = (node: React.ReactNode): boolean => (
  hasUXPinSlotIdentity(node, 'page-menu', 'Menu') ||
  isConcreteUXPinElement(node, 'hexa-uxpin-menu', 'Menu')
)

const isSubmenuSlotElement = (node: React.ReactNode): boolean => (
  hasUXPinSlotIdentity(node, 'page-submenu', 'Submenu') ||
  isConcreteUXPinElement(node, 'hexa-uxpin-submenu', 'Submenu')
)

const isPageHeaderSlotElement = (node: React.ReactNode): boolean => (
  hasUXPinSlotIdentity(node, 'page-header', 'PageHeader') ||
  isConcreteUXPinElement(node, 'hexa-uxpin-page-header', 'PageHeader')
)

const isPageWrapperSlotElement = (node: React.ReactNode): boolean => (
  hasUXPinSlotIdentity(node, 'page-wrapper', 'PageWrapper') ||
  isConcreteUXPinElement(node, 'hexa-uxpin-page-wrapper', 'PageWrapper')
)

const isSidebarFooterSlotElement = (node: React.ReactNode): boolean => (
  hasUXPinSlotIdentity(node, 'page-footer', 'SidebarFooter') ||
  isConcreteUXPinElement(node, 'hexa-uxpin-sidebar-footer', 'SidebarFooter')
)

const resolveSlotChildren = (
  props: Record<string, unknown> | undefined,
  runtimeChildren: React.ReactNode
): React.ReactNode => (
  hasUXPinChildrenProp(props)
    ? resolveUXPinChildrenFromProps(props)
    : runtimeChildren
)

const resolvePageChildren = (
  children: React.ReactNode
): PageChildResolution => {
  const result: PageChildResolution = {}

  getUXPinChildrenArray(children).forEach((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isMenuSlotElement(child)) {
      result.menuElement = child
      return
    }

    if (isSubmenuSlotElement(child)) {
      result.submenuElement = child
      return
    }

    if (isPageHeaderSlotElement(child)) {
      result.headerElement = child
      return
    }

    if (isPageWrapperSlotElement(child)) {
      result.pageWrapperElement = child
      return
    }

    if (isSidebarFooterSlotElement(child)) {
      result.footerElement = child
    }
  })

  return result
}

const renderMenu = (element: React.ReactNode | undefined): React.ReactNode => {
  const props = getUXPinElementProps(element) as UXPinMenuProps | undefined

  if (!props) {
    return null
  }

  const runtimeProps = resolveUXPinRuntimeProps(props)
  const {
    children,
    style,
    ...menuProps
  } = runtimeProps

  return (
    <Menu
      {...menuProps}
      style={{
        ...style,
        height: '100%',
        minHeight: '100%'
      }}
    >
      {resolveSlotChildren(props, children)}
    </Menu>
  )
}

const renderSubmenu = (element: React.ReactNode | undefined): React.ReactNode => {
  const props = getUXPinElementProps(element) as UXPinSubmenuProps | undefined

  if (!props) {
    return null
  }

  const runtimeProps = resolveUXPinRuntimeProps(props)
  const {
    children,
    style,
    ...submenuProps
  } = runtimeProps

  return (
    <Submenu
      {...submenuProps}
      style={{
        ...style,
        height: '100%',
        minHeight: 0
      }}
    >
      {resolveSlotChildren(props, children)}
    </Submenu>
  )
}

const renderPageHeader = (element: React.ReactNode | undefined): React.ReactNode => {
  const props = getUXPinElementProps(element) as UXPinPageHeaderProps | undefined

  if (!props) {
    return null
  }

  const runtimeProps = resolveUXPinRuntimeProps(props)
  const {
    children,
    ...pageHeaderProps
  } = runtimeProps

  return (
    <PageHeader {...pageHeaderProps}>
      {resolveSlotChildren(props, children)}
    </PageHeader>
  )
}

const renderPageWrapper = (element: React.ReactNode | undefined): React.ReactNode => {
  const props = getUXPinElementProps(element) as UXPinPageWrapperProps | undefined

  if (!props) {
    return null
  }

  const runtimeProps = resolveUXPinRuntimeProps(props)
  const {
    children,
    flexWidth,
    style,
    ...pageWrapperProps
  } = runtimeProps

  return (
    <PageWrapper
      {...pageWrapperProps}
      flexWidth={flexWidth ?? true}
      style={{
        ...style,
        height: '100%',
        minHeight: 0
      }}
    >
      {resolveSlotChildren(props, children)}
    </PageWrapper>
  )
}

const renderSidebarFooter = (element: React.ReactNode | undefined): React.ReactNode => {
  const props = getUXPinElementProps(element) as UXPinSidebarFooterProps | undefined

  if (!props) {
    return null
  }

  const runtimeProps = resolveUXPinRuntimeProps(props)
  const {
    children,
    style,
    ...footerProps
  } = runtimeProps

  return (
    <SidebarFooter
      {...footerProps}
      style={{
        ...style,
        width: '100%'
      }}
    >
      {resolveSlotChildren(props, children)}
    </SidebarFooter>
  )
}

const Page: PageComponent = (rawProps: UXPinPageProps): JSX.Element => {
  const {
    children,
    codeComponentProps: _codeComponentProps,
    menu = true,
    overriddenCodeProps: _overriddenCodeProps,
    pageFooter = true,
    pageHeader = true,
    style,
    submenu = true
  } = resolveUXPinRuntimeProps(rawProps)
  const rootRef = useAutoHeightMergeFrame({
    containWidth: true,
    disabled: true,
    markFillShell: true
  })
  const {
    footerElement,
    headerElement,
    menuElement,
    pageWrapperElement,
    submenuElement
  } = resolvePageChildren(children)

  return (
    <PageRoot
      ref={rootRef}
      data-hexa-uxpin-page="true"
      style={mergeFrameStyle(style)}
    >
      {menuElement && (
        <PageRailZone
          $visible={menu}
          data-testid="hexa-uxpin-page-menu-zone"
        >
          {renderMenu(menuElement)}
        </PageRailZone>
      )}
      {submenuElement && (
        <PageRailZone
          $visible={submenu}
          data-testid="hexa-uxpin-page-submenu-zone"
        >
          {renderSubmenu(submenuElement)}
        </PageRailZone>
      )}
      <PageContent data-testid="hexa-uxpin-page-content">
        {headerElement && (
          <PageContentSlot
            $visible={pageHeader}
            data-testid="hexa-uxpin-page-header-zone"
          >
            {renderPageHeader(headerElement)}
          </PageContentSlot>
        )}
        {pageWrapperElement && (
          <PageContentSlot
            $fill
            $visible
            data-testid="hexa-uxpin-page-wrapper-zone"
          >
            {renderPageWrapper(pageWrapperElement)}
          </PageContentSlot>
        )}
        {footerElement && (
          <PageContentSlot
            $visible={pageFooter}
            data-testid="hexa-uxpin-page-footer-zone"
          >
            {renderSidebarFooter(footerElement)}
          </PageContentSlot>
        )}
      </PageContent>
    </PageRoot>
  )
}

Page.uxpinRole = PAGE_ROLE
Page.displayName = 'Page'
Page.defaultProps = {
  menu: true,
  pageFooter: true,
  pageHeader: true,
  submenu: true
}

export default Page
```

- [ ] **Step 2: Run the Page runtime test**

Run:

```bash
npm run test:only -- helpers/uxpinPageRuntime.test.tsx
```

Expected result:

```text
PASS helpers/uxpinPageRuntime.test.tsx
```

If the test fails because Ant Design renders duplicate hidden text nodes, keep the assertions on the zone wrappers and use `getAllByText(...).every((node) => !node.checkVisibility?.() || !node.offsetParent)` only inside the hidden-zone test. Do not remove the visibility behavior assertion.

## Task 3: Add the Editable UXPin Preset

**Files:**
- Create: `uxpin/components/Page/uxpin-presets/Page.jsx`

- [ ] **Step 1: Create the Page preset**

Create `uxpin/components/Page/uxpin-presets/Page.jsx`:

```jsx
import React from 'react';

import Button from '../../Button/Button';
import BreadcrumbItem from '../../BreadcrumbItem/BreadcrumbItem';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';
import GroupWrapper from '../../GroupWrapper/GroupWrapper';
import Menu from '../../Menu/Menu';
import MenuItem from '../../MenuItem/MenuItem';
import PageHeader from '../../PageHeader/PageHeader';
import PageWrapper from '../../PageWrapper/PageWrapper';
import SectionWrapper from '../../SectionWrapper/SectionWrapper';
import SidebarFooter from '../../SidebarFooter/SidebarFooter';
import SidebarFooterLeftItems from '../../SidebarFooterLeftItems/SidebarFooterLeftItems';
import SidebarFooterRightItems from '../../SidebarFooterRightItems/SidebarFooterRightItems';
import Submenu from '../../Submenu/Submenu';
import SubmenuItem from '../../SubmenuItem/SubmenuItem';
import Page from '../Page';

export default (
  <Page
    uxpId="page-1"
    menu={true}
    submenu={true}
    pageHeader={true}
    pageFooter={true}
  >
    <Menu
      uxpId="page-menu"
      minimized={false}
      header={true}
      footer={true}
      title="Configuration Service"
      description="Kaspersky Next"
    >
      <MenuItem
        uxpId="page-menu-item-1"
        label="Administration server"
        elementBefore={true}
        elementBeforeIcon="StorageServer"
        state="enabled"
      />
      <MenuItem
        uxpId="page-menu-item-2"
        label="Console navigation"
        elementBefore={true}
        elementBeforeIcon="Map"
        state="enabled"
      />
      <MenuItem
        uxpId="page-menu-item-3"
        label="Monitoring"
        elementBefore={true}
        elementBeforeIcon="EngineeringStation"
        state="enabled"
      />
    </Menu>
    <Submenu
      uxpId="page-submenu"
      draggable={false}
      truncateText={true}
    >
      <SubmenuItem
        uxpId="page-submenu-item-1"
        variant="item"
        text="Overview"
        selected={true}
        iconBefore={true}
        iconBeforeSlot="Browser"
      />
      <SubmenuItem
        uxpId="page-submenu-item-2"
        variant="item"
        text="Assets"
        iconBefore={true}
        iconBeforeSlot="StorageServer"
      />
      <SubmenuItem
        uxpId="page-submenu-item-3"
        variant="item"
        text="Policies"
        iconBefore={true}
        iconBeforeSlot="Shield"
      />
    </Submenu>
    <PageHeader
      uxpId="page-header"
      title="Page title"
      description={false}
      descriptionText="Page description"
      iconBefore={false}
      breadcrumbs={false}
      tagsAfter={false}
      elementAfter={false}
    >
      <Breadcrumbs
        uxpId="page-header-breadcrumbs"
        size="small"
      >
        <BreadcrumbItem
          uxpId="page-header-breadcrumb-current"
          text="Current page"
          current={false}
          disabled={false}
        />
      </Breadcrumbs>
    </PageHeader>
    <PageWrapper
      uxpId="page-wrapper"
      flexWidth={true}
    >
      <SectionWrapper
        uxpId="page-section-wrapper-1"
        flexHeight={false}
      >
        <GroupWrapper
          uxpId="page-group-wrapper-1"
          flexHeight={false}
          flexWidth={true}
        />
      </SectionWrapper>
    </PageWrapper>
    <SidebarFooter
      uxpId="page-footer"
      additionalContent={false}
    >
      <SidebarFooterLeftItems uxpId="page-footer-left-items">
        <Button
          uxpId="page-footer-save"
          mode="primary"
          size="medium"
          text="Save"
          style={{ width: 'fit-content' }}
        />
        <Button
          uxpId="page-footer-cancel"
          mode="secondary"
          size="medium"
          text="Cancel"
          style={{ width: 'fit-content' }}
        />
      </SidebarFooterLeftItems>
      <SidebarFooterRightItems uxpId="page-footer-right-items">
        <Button
          uxpId="page-footer-delete"
          mode="dangerOutlined"
          size="medium"
          text="Delete"
          style={{ width: 'fit-content' }}
        />
      </SidebarFooterRightItems>
    </SidebarFooter>
  </Page>
);
```

- [ ] **Step 2: Verify UXPin config discovers the new component source**

Run:

```bash
node -e "const config = require('./uxpin.config.js'); const include = config.components.categories[0].include; console.log(include.includes('uxpin/components/Page/Page.tsx') ? 'PAGE_INCLUDED' : 'PAGE_MISSING')"
```

Expected result:

```text
PAGE_INCLUDED
```

## Task 4: Run Validation

**Files:**
- Test: `helpers/uxpinPageRuntime.test.tsx`
- Check: `uxpin/components/Page/Page.tsx`
- Check: `uxpin/components/Page/uxpin-presets/Page.jsx`

- [ ] **Step 1: Run targeted runtime tests**

Run:

```bash
npm run test:only -- helpers/uxpinPageRuntime.test.tsx
```

Expected result:

```text
PASS helpers/uxpinPageRuntime.test.tsx
```

- [ ] **Step 2: Run TypeScript validation**

Run:

```bash
npm run lint-ts
```

Expected result:

```text
tsc --noEmit
```

The command exits with code `0`.

- [ ] **Step 3: Run whitespace validation for touched files**

Run:

```bash
git diff --check -- helpers/uxpinPageRuntime.test.tsx uxpin/components/Page/Page.tsx uxpin/components/Page/uxpin-presets/Page.jsx
```

Expected result:

```text
```

The command exits with code `0` and prints no whitespace errors.

- [ ] **Step 4: Confirm generated UXPin artifacts were not hand-edited**

Run:

```bash
git status --short -- .uxpin-merge
```

Expected result:

```text
```

The command exits with code `0` and prints no `.uxpin-merge` changes.

## Task 5: Manual UXPin Smoke Checks and Commit

**Files:**
- Create: `helpers/uxpinPageRuntime.test.tsx`
- Create: `uxpin/components/Page/Page.tsx`
- Create: `uxpin/components/Page/uxpin-presets/Page.jsx`

- [ ] **Step 1: Start UXPin local preview only when manual verification is available**

Run:

```bash
npm run uxpin:dev
```

Expected result:

```text
uxpin-merge
```

The command starts the local UXPin Merge preview server. Stop it after manual checks.

- [ ] **Step 2: Perform manual UXPin checks**

In UXPin editor or local preview, verify:

```text
1. Insert Page into a frame.
2. Resize the frame; Page fills available width and height.
3. Confirm first-level layout is Menu, Submenu, pageContent horizontally.
4. Confirm pageContent layout is PageHeader, PageWrapper, SidebarFooter vertically.
5. Edit a nested MenuItem label and confirm it updates visually.
6. Edit a nested SubmenuItem text and confirm it updates visually.
7. Edit PageHeader title and confirm it updates visually.
8. Add content inside PageWrapper and confirm PageWrapper owns scrolling.
9. Edit SidebarFooter button text and confirm it updates visually.
10. Toggle menu, submenu, pageHeader, and pageFooter off and on; hidden layers reappear with edits intact.
11. Delete a nested Menu layer and confirm Page does not recreate default Menu.
```

- [ ] **Step 3: Commit the implementation**

Run:

```bash
git add helpers/uxpinPageRuntime.test.tsx uxpin/components/Page/Page.tsx uxpin/components/Page/uxpin-presets/Page.jsx
git commit -m "feat(uxpin): add page layout component"
```

Expected result:

```text
feat(uxpin): add page layout component
```

The commit includes only the new test, `Page` component, and `Page` preset.
