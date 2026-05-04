import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'
import { useSyncMergeFrameSize } from '../../useSyncMergeFrameSize'
import {
  getUXPinChildrenArray,
  getUXPinElementPropSources,
  getUXPinElementProps,
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinMergedChildrenFromProps,
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
const DEFAULT_PAGE_FRAME_WIDTH = '100vw'
const DEFAULT_PAGE_FRAME_HEIGHT = '100vh'

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

const getPageFrameStyle = (
  style?: CSSProperties
): CSSProperties => mergeFrameStyle({
  ...style,
  width: DEFAULT_PAGE_FRAME_WIDTH,
  height: DEFAULT_PAGE_FRAME_HEIGHT,
  minHeight: DEFAULT_PAGE_FRAME_HEIGHT
})

const PageRailZone = styled.div.attrs<{ $testId: string, $visible: boolean }>(({ $testId }) => ({
  'data-testid': $testId
}))<{ $testId: string, $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex: 0 0 auto;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
`

const PageContent = styled.main.attrs({
  'data-testid': 'hexa-uxpin-page-content'
})`
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

const PageContentSlot = styled.div.attrs<{ $testId: string, $visible: boolean, $fill?: boolean }>(({ $testId }) => ({
  'data-testid': $testId
}))<{ $testId: string, $visible: boolean, $fill?: boolean }>`
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

const hasPageHeaderSlotProps = (
  node: React.ReactNode
): boolean => (
  getUXPinElementPropSources(node).some((props) => (
    typeof props.title === 'string' &&
    (
      'breadcrumbs' in props ||
      'descriptionText' in props ||
      'elementAfter' in props ||
      'iconBefore' in props ||
      'tagsAfter' in props
    )
  ))
)

const isLikelyCodeComponentSlotWrapper = (
  node: React.ReactNode
): boolean => (
  getUXPinElementPropSources(node).some((props) => (
    props.uxpinTargetElementType === 'CodeComponent' ||
    'codeComponentProps' in props ||
    'overriddenCodeProps' in props
  ))
)

const isLikelyPageHeaderSlotWrapper = (
  node: React.ReactNode
): boolean => (
  isLikelyCodeComponentSlotWrapper(node) &&
  hasPageHeaderSlotProps(node)
)

const isPageHeaderSlotElement = (node: React.ReactNode): boolean => (
  hasUXPinSlotIdentity(node, 'page-header', 'PageHeader') ||
  isConcreteUXPinElement(node, 'hexa-uxpin-page-header', 'PageHeader') ||
  isLikelyPageHeaderSlotWrapper(node)
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
  const resolvedChildren = resolveUXPinMergedChildrenFromProps(rawProps)
  const {
    codeComponentProps: _codeComponentProps,
    menu = true,
    overriddenCodeProps: _overriddenCodeProps,
    pageFooter = true,
    pageHeader = true,
    style,
    submenu = true
  } = resolveUXPinRuntimeProps(rawProps)
  const rootRef = useSyncMergeFrameSize()
  const {
    footerElement,
    headerElement,
    menuElement,
    pageWrapperElement,
    submenuElement
  } = resolvePageChildren(resolvedChildren)

  return (
    <PageRoot
      ref={rootRef}
      data-hexa-uxpin-page="true"
      style={getPageFrameStyle(style)}
    >
      {menuElement && (
        <PageRailZone
          $testId="hexa-uxpin-page-menu-zone"
          $visible={menu}
        >
          {renderMenu(menuElement)}
        </PageRailZone>
      )}
      {submenuElement && (
        <PageRailZone
          $testId="hexa-uxpin-page-submenu-zone"
          $visible={submenu}
        >
          {renderSubmenu(submenuElement)}
        </PageRailZone>
      )}
      <PageContent>
        {headerElement && (
          <PageContentSlot
            $testId="hexa-uxpin-page-header-zone"
            $visible={pageHeader}
          >
            {renderPageHeader(headerElement)}
          </PageContentSlot>
        )}
        {pageWrapperElement && (
          <PageContentSlot
            $fill
            $testId="hexa-uxpin-page-wrapper-zone"
            $visible
          >
            {renderPageWrapper(pageWrapperElement)}
          </PageContentSlot>
        )}
        {footerElement && (
          <PageContentSlot
            $testId="hexa-uxpin-page-footer-zone"
            $visible={pageFooter}
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
