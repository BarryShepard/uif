import React, { CSSProperties, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { ActionButton } from '@src/action-button'
import { Button } from '@src/button'
import { Text } from '@src/typography'
import { Toggle as HexaToggle } from '@src/toggle'

import { Placeholder } from '@kaspersky/hexa-ui-icons/16'

import { mergeFrameStyle } from '../../preview'
import {
  getUXPinPropSources,
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'
import SidebarFooter, {
  defaultSidebarFooterChildren,
  UXPinSidebarFooterProps,
  UXPinSidebarFooterRuntimeProps
} from '../SidebarFooter/SidebarFooter'
import {
  resolveSidebarFooterLeftItemsChildren
} from '../SidebarFooterLeftItems/SidebarFooterLeftItems'
import {
  resolveSidebarFooterRightItemsChildren
} from '../SidebarFooterRightItems/SidebarFooterRightItems'
import UXPinSubmenu, {
  defaultSubmenuItemChildren,
  UXPinSubmenuProps
} from '../Submenu/Submenu'
import { hasUXPinSubmenuItemChildren } from '../SubmenuItem/SubmenuItem'
import { defaultTabItemChildren, hasUXPinTabItemChildren } from '../TabItem/TabItem'
import UXPinTabs, {
  UXPinTabsProps
} from '../Tabs/Tabs'

export type UXPinSidebarSize = 'extraSmall' | 'small' | 'medium' | 'large' | 'flex'

export type UXPinSidebarProps = {
  /** Sidebar width preset. */
  size?: UXPinSidebarSize,
  /** Shows the overlay across the whole sidebar frame. */
  overlay?: boolean,
  /** Shows submenu navigation for medium, large, and flex sidebars. */
  submenu?: boolean,
  /** Shows the footer. */
  footer?: boolean,
  /** Shows element before title. */
  headerElementBefore?: boolean,
  /** Slot before title. */
  headerElementBeforeSlot?: React.ReactNode,
  /** Header title text. */
  title?: string,
  /** Shows elements after title. */
  elementsAfter?: boolean,
  /** Slot after title. */
  elementsAfterSlot?: React.ReactNode,
  /** Slot at the right side of the header. */
  contentRight?: React.ReactNode,
  /** Shows subtitle under title. */
  subtitle?: boolean,
  /** Subtitle text. */
  subtitleText?: string,
  /** Shows toggle under the title block. */
  toggle?: boolean,
  /** Toggle label text. */
  toggleText?: string,
  /** Shows tabs at the bottom of the header. */
  tabs?: boolean,
  /** Sidebar body content. */
  children?: React.ReactNode,
  overriddenCodeProps?: Partial<UXPinSidebarProps>,
  style?: CSSProperties
}

const SIDEBAR_WIDTH_BY_SIZE: Record<Exclude<UXPinSidebarSize, 'flex'>, number> = {
  extraSmall: 480,
  small: 640,
  medium: 800,
  large: 1200
}

const SUBMENU_ENABLED_SIZES = new Set<UXPinSidebarSize>(['medium', 'large', 'flex'])
const DEFAULT_SIDEBAR_STAGE_HEIGHT = '100vh'

const SidebarStage = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;

  &[hidden] {
    display: none;
  }
`

const SidebarOverlay = styled.button`
  position: absolute;
  inset: 0;
  padding: 0;
  border: 0;
  background: rgba(9, 30, 66, 0.36);
  cursor: default;
`

const SidebarPanel = styled.aside`
  position: relative;
  z-index: 1;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-left: 1px solid var(--elements--separator, #d5d9e0);
  background: var(--bg--base, #fff);
  box-shadow:
    0 18px 28px rgba(9, 30, 66, 0.15),
    0 0 1px rgba(9, 30, 66, 0.31);
  box-sizing: border-box;
`

const SidebarHeader = styled.header`
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  &:not(.sidebar-header-with-tabs) {
    border-bottom: 1px solid var(--elements--separator, #d5d9e0);
  }

  .sidebar-header-top {
    display: flex;
    align-items: flex-start;
    width: 100%;
    min-width: 0;
    padding: 24px;
    gap: 16px;
    box-sizing: border-box;
  }

  .sidebar-header-main {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    gap: 12px;
  }

  .sidebar-header-title-row {
    display: flex;
    align-items: flex-start;
    min-width: 0;
    gap: 8px;
  }

  .sidebar-title-text {
    min-width: 0;
    margin: 0;
    color: var(--text-icons-elements--primary, #1d1e20);
    font-size: 28px;
    font-weight: 600;
    line-height: 32px;
    overflow-wrap: anywhere;
  }

  .sidebar-header-before,
  .sidebar-header-after,
  .sidebar-header-right {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    min-height: 28px;
  }

  .sidebar-header-before,
  .sidebar-header-after {
    width: 24px;
    min-width: 24px;
    height: 24px;
  }

  .sidebar-header-before > svg,
  .sidebar-header-after > svg {
    width: 24px;
    height: 24px;
  }

  .sidebar-header-right {
    margin-left: auto;
    gap: 12px;
  }

  .sidebar-subtitle {
    max-width: 100%;
    color: var(--text-icons-elements--secondary, #69707d);
  }

  .sidebar-toggle-row {
    display: flex;
    align-items: center;
  }

`

const SidebarTabsBar = styled.div`
  position: relative;
  z-index: 2;
  flex: 0 0 auto;
  width: 100%;
  min-width: 0;
  border-bottom: 1px solid var(--elements--separator, #d5d9e0);
  box-sizing: border-box;
  pointer-events: auto;

  .ant-tabs {
    width: 100%;
  }

  .ant-tabs-nav {
    margin: 0;
    padding: 0 24px;
  }

  .ant-tabs-nav::before {
    display: none;
  }

  .ant-tabs-nav-list::before {
    display: none;
  }

  .ant-tabs-ink-bar {
    bottom: -1px;
  }
`

const SidebarBody = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow: hidden;

  .sidebar-main {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px;
    gap: 24px;
    box-sizing: border-box;
  }

  .sidebar-default-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--text-icons-elements--primary, #1d1e20);
  }
`

type SidebarChildResolution = {
  contentChildren: React.ReactNode[],
  footerElement?: React.ReactElement<UXPinSidebarFooterProps>,
  submenuElement?: React.ReactElement<UXPinSubmenuProps>,
  tabsElement?: React.ReactElement<UXPinTabsProps>
}

const getSidebarPanelWidth = (
  size: UXPinSidebarSize
): string | number => {
  if (size === 'flex') {
    return 'calc(100% - 40px)'
  }

  return SIDEBAR_WIDTH_BY_SIZE[size]
}

const getSidebarStageWidth = (): string | number => '100vw'

const canShowSubmenu = (size: UXPinSidebarSize): boolean => SUBMENU_ENABLED_SIZES.has(size)

const getSidebarStageStyle = (
  size: UXPinSidebarSize,
  panelWidth: string | number,
  stageWidth: string | number,
  style?: CSSProperties
): CSSProperties => mergeFrameStyle({
  ...style,
  width: stageWidth,
  minWidth: size === 'flex' ? undefined : panelWidth,
  height: style?.height ?? DEFAULT_SIDEBAR_STAGE_HEIGHT,
  minHeight: style?.minHeight ?? style?.height ?? DEFAULT_SIDEBAR_STAGE_HEIGHT
})

const getSidebarPanelStyle = (
  panelWidth: string | number
): CSSProperties => ({
  width: panelWidth,
  minWidth: panelWidth
})

const useSyncSidebarFrameSize = (): React.RefObject<HTMLDivElement> => {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const rootElement = rootRef.current
    const mergeComponent = rootElement?.closest('.merge-component') as HTMLDivElement | null

    if (!rootElement || !mergeComponent) {
      return undefined
    }

    const previousHeight = mergeComponent.style.height
    const previousMinHeight = mergeComponent.style.minHeight
    const previousWidth = mergeComponent.style.width
    const previousMinWidth = mergeComponent.style.minWidth

    const syncFrameSize = (): void => {
      const { height, width } = rootElement.getBoundingClientRect()

      if (height > 0) {
        const nextHeight = `${Math.ceil(height)}px`
        mergeComponent.style.height = nextHeight
        mergeComponent.style.minHeight = nextHeight
      }

      if (width > 0) {
        const nextWidth = `${Math.ceil(width)}px`
        mergeComponent.style.width = nextWidth
        mergeComponent.style.minWidth = nextWidth
      }
    }

    syncFrameSize()

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(syncFrameSize)
      : undefined

    resizeObserver?.observe(rootElement)
    window.addEventListener('resize', syncFrameSize)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncFrameSize)
      mergeComponent.style.height = previousHeight
      mergeComponent.style.minHeight = previousMinHeight
      mergeComponent.style.width = previousWidth
      mergeComponent.style.minWidth = previousMinWidth
    }
  }, [])

  return rootRef
}

type UXPinComponentIdentity = {
  displayName?: string,
  name?: string,
  render?: unknown,
  type?: unknown,
  uxpinRole?: string,
  WrappedComponent?: unknown
}

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

const isConcreteSidebarSubmenuElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinSubmenuProps> => (
  isConcreteUXPinElement(node, 'hexa-uxpin-submenu', 'Submenu')
)

const isConcreteSidebarFooterElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinSidebarFooterProps> => (
  isConcreteUXPinElement(node, 'hexa-uxpin-sidebar-footer', 'SidebarFooter')
)

const isConcreteSidebarTabsElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinTabsProps> => (
  isConcreteUXPinElement(node, 'hexa-uxpin-tabs', 'Tabs')
)

const hasUXPinSlotId = (
  node: React.ReactNode,
  slotId: string,
  componentName: string
): boolean => (
  React.isValidElement(node) &&
  (
    (typeof node.key === 'string' && node.key.includes(slotId)) ||
    getUXPinPropSources(node.props).some((props) => (
      (typeof props.uxpId === 'string' && props.uxpId.includes(slotId)) ||
      (typeof props.id === 'string' && props.id.includes(slotId)) ||
      (typeof props.presetElementId === 'string' && props.presetElementId.includes(slotId)) ||
      (typeof props.uxpinPresetElementId === 'string' && props.uxpinPresetElementId.includes(slotId)) ||
      props.name === componentName
    ))
  )
)

const hasSidebarTabsContent = (
  node: React.ReactNode
): boolean => (
  hasUXPinTabItemChildren(resolveElementChildren(node))
)

const hasSidebarSubmenuContent = (
  node: React.ReactNode
): boolean => (
  hasUXPinSubmenuItemChildren(resolveElementChildren(node))
)

const hasSidebarFooterContent = (
  node: React.ReactNode
): boolean => {
  const children = resolveElementChildren(node)

  return Boolean(
    resolveSidebarFooterLeftItemsChildren(children) ||
    resolveSidebarFooterRightItemsChildren(children)
  )
}

const isLikelySidebarSlotWrapper = (
  node: React.ReactNode
): boolean => (
  React.isValidElement(node) &&
  getUXPinPropSources(node.props).some((props) => props.uxpinTargetElementType === 'CodeComponent')
)

const isSidebarSubmenuSlotElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinSubmenuProps> => (
  hasUXPinSlotId(node, 'sidebar-submenu', 'Submenu') ||
  isConcreteSidebarSubmenuElement(node) ||
  (isLikelySidebarSlotWrapper(node) && hasSidebarSubmenuContent(node))
)

const isSidebarFooterSlotElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinSidebarFooterProps> => (
  hasUXPinSlotId(node, 'sidebar-footer', 'SidebarFooter') ||
  isConcreteSidebarFooterElement(node) ||
  (isLikelySidebarSlotWrapper(node) && hasSidebarFooterContent(node))
)

const isSidebarTabsSlotElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinTabsProps> => (
  hasUXPinSlotId(node, 'sidebar-tabs', 'Tabs') ||
  isConcreteSidebarTabsElement(node) ||
  (isLikelySidebarSlotWrapper(node) && hasSidebarTabsContent(node))
)

const resolveElementChildren = (
  element: React.ReactNode
): React.ReactNode | undefined => {
  return resolveUXPinElementChildren(element)
}

const resolveSidebarChildren = (children?: React.ReactNode): SidebarChildResolution => {
  const result: SidebarChildResolution = {
    contentChildren: []
  }

  React.Children.toArray(children).forEach((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isSidebarSubmenuSlotElement(child)) {
      result.submenuElement = child
      return
    }

    if (isSidebarFooterSlotElement(child)) {
      result.footerElement = child
      return
    }

    if (isSidebarTabsSlotElement(child)) {
      result.tabsElement = child
      return
    }

    const nestedChildren = resolveElementChildren(child)

    if (nestedChildren) {
      const nested = resolveSidebarChildren(nestedChildren)
      const hasNestedSlots = Boolean(nested.submenuElement || nested.footerElement || nested.tabsElement)

      if (nested.submenuElement) {
        result.submenuElement = nested.submenuElement
      }

      if (nested.footerElement) {
        result.footerElement = nested.footerElement
      }

      if (nested.tabsElement) {
        result.tabsElement = nested.tabsElement
      }

      if (hasNestedSlots) {
        result.contentChildren.push(...nested.contentChildren)
        return
      }
    }

    result.contentChildren.push(child)
  })

  return result
}

const resolveSidebarRuntimeProps = (rawProps: UXPinSidebarProps): UXPinSidebarProps => (
  resolveUXPinRuntimeProps(rawProps)
)

const DefaultSidebarSubmenu = (): JSX.Element => (
  <UXPinSubmenu
    defaultActiveKey="general"
    truncateText
    {...({ withinSidebar: true } as { withinSidebar: boolean })}
  >
    {defaultSubmenuItemChildren}
  </UXPinSubmenu>
)

const DefaultSidebarContent = (): JSX.Element => (
  <div className="sidebar-default-content">
    <Text type="BTR3">Sidebar content area</Text>
    <Text type="BTR4">
      Place any UXPin components here. Content scrolls when it exceeds the sidebar height.
    </Text>
    <Button mode="secondary" size="medium" text="Secondary action" />
  </div>
)

const SidebarHeaderToggle = ({
  text
}: {
  text: string
}): JSX.Element => {
  const [checked, setChecked] = useState(false)

  return (
    <HexaToggle checked={checked} onChange={setChecked}>
      {text}
    </HexaToggle>
  )
}

const renderSidebarSubmenu = (
  submenuElement: React.ReactElement<UXPinSubmenuProps> | undefined,
  allowDefault: boolean
): React.ReactNode => {
  if (!submenuElement) {
    return allowDefault ? <DefaultSidebarSubmenu /> : null
  }

  const runtimeProps = resolveUXPinRuntimeProps(submenuElement.props)
  const resolvedChildren = hasUXPinChildrenProp(submenuElement.props)
    ? resolveUXPinChildrenFromProps(submenuElement.props)
    : defaultSubmenuItemChildren
  const style = {
    ...runtimeProps.style,
    height: '100%',
    minHeight: 0
  }

  return (
    <UXPinSubmenu
      {...runtimeProps}
      style={style}
      {...({ withinSidebar: true } as { withinSidebar: boolean })}
    >
      {resolvedChildren}
    </UXPinSubmenu>
  )
}

const renderSidebarFooter = (
  footerElement: React.ReactElement<UXPinSidebarFooterProps> | undefined,
  onCancel: () => void,
  allowDefault: boolean
): React.ReactNode => {
  if (footerElement) {
    const runtimeProps = resolveUXPinRuntimeProps(footerElement.props)
    const resolvedChildren = hasUXPinChildrenProp(footerElement.props)
      ? resolveUXPinChildrenFromProps(footerElement.props)
      : defaultSidebarFooterChildren

    return (
      <SidebarFooter
        {...runtimeProps}
        {...({ onCancel } as UXPinSidebarFooterRuntimeProps)}
      >
        {resolvedChildren}
      </SidebarFooter>
    )
  }

  return allowDefault ? <SidebarFooter {...({ onCancel } as UXPinSidebarFooterRuntimeProps)} /> : null
}

const renderSidebarTabs = (
  tabsElement: React.ReactElement<UXPinTabsProps> | undefined,
  allowDefault: boolean
): React.ReactNode => {
  if (!tabsElement) {
    return allowDefault
      ? (
        <UXPinTabs noMargin style={{ width: '100%' }}>
          {defaultTabItemChildren}
        </UXPinTabs>
      )
      : null
  }

  const runtimeProps = resolveUXPinRuntimeProps(tabsElement.props)
  const resolvedChildren = hasUXPinChildrenProp(tabsElement.props)
    ? resolveUXPinChildrenFromProps(tabsElement.props)
    : defaultTabItemChildren
  const style = {
    ...runtimeProps.style,
    width: '100%'
  }

  return (
    <UXPinTabs
      {...runtimeProps}
      noMargin
      style={style}
    >
      {resolvedChildren}
    </UXPinTabs>
  )
}

const Sidebar = (rawProps: UXPinSidebarProps): JSX.Element => {
  const {
    children,
    contentRight,
    elementsAfter = false,
    elementsAfterSlot,
    footer = true,
    headerElementBefore = false,
    headerElementBeforeSlot,
    overlay = true,
    size = 'medium',
    style,
    submenu = true,
    subtitle = false,
    subtitleText = 'Sidebar subtitle',
    tabs = true,
    title = 'Sidebar title',
    toggle = false,
    toggleText = 'Toggle option'
  } = resolveSidebarRuntimeProps(rawProps)
  const rootRef = useSyncSidebarFrameSize()
  const [open, setOpen] = useState(true)
  const panelWidth = getSidebarPanelWidth(size)
  const stageWidth = getSidebarStageWidth()
  const {
    contentChildren,
    footerElement,
    submenuElement,
    tabsElement
  } = resolveSidebarChildren(children)
  const hasExplicitSidebarChildren = React.Children.count(children) > 0
  const shouldShowSubmenu = submenu && canShowSubmenu(size)

  const handleClose = (): void => {
    setOpen(false)
  }

  const showFooter = footer === undefined ? true : footer === true
  const showOverlay = overlay === undefined ? true : overlay === true
  const showTabs = tabs === undefined ? true : tabs === true
  const showSubmenu = submenu === undefined ? true : submenu === true
  const allowLegacyDefaults = !hasExplicitSidebarChildren
  const resolvedFooter = showFooter ? renderSidebarFooter(footerElement, handleClose, allowLegacyDefaults) : null
  const resolvedTabs = showTabs ? renderSidebarTabs(tabsElement, allowLegacyDefaults) : null

  return (
    <SidebarStage
      ref={rootRef}
      data-hexa-uxpin-sidebar="true"
      hidden={!open}
      style={getSidebarStageStyle(size, panelWidth, stageWidth, style)}
    >
      {showOverlay && <SidebarOverlay aria-label="Close sidebar overlay" onClick={handleClose} type="button" />}
      <SidebarPanel style={getSidebarPanelStyle(panelWidth)}>
        <SidebarHeader className={resolvedTabs ? 'sidebar-header-with-tabs' : undefined}>
          <div className="sidebar-header-top">
            <div className="sidebar-header-main">
              <div className="sidebar-header-title-row">
                {headerElementBefore && (
                  <span className="sidebar-header-before">
                    {headerElementBeforeSlot ?? <Placeholder />}
                  </span>
                )}
                <h2 className="sidebar-title-text">{title}</h2>
                {elementsAfter && (
                  <span className="sidebar-header-after">
                    {elementsAfterSlot ?? <Placeholder />}
                  </span>
                )}
              </div>
              {subtitle && (
                <Text className="sidebar-subtitle" type="BTR2">
                  {subtitleText}
                </Text>
              )}
              {toggle && (
                <div className="sidebar-toggle-row">
                  <SidebarHeaderToggle text={toggleText} />
                </div>
              )}
            </div>
            <div className="sidebar-header-right">
              {contentRight}
              <ActionButton onClick={handleClose} size="large" />
            </div>
          </div>
        </SidebarHeader>
        {resolvedTabs && (
          <SidebarTabsBar>
            {resolvedTabs}
          </SidebarTabsBar>
        )}
        <SidebarBody>
          {showSubmenu && shouldShowSubmenu && renderSidebarSubmenu(submenuElement, allowLegacyDefaults)}
          <div className="sidebar-main">
            {contentChildren.length > 0
              ? contentChildren
              : <DefaultSidebarContent />}
          </div>
        </SidebarBody>
        {resolvedFooter}
      </SidebarPanel>
    </SidebarStage>
  )
}

Sidebar.defaultProps = {
  elementsAfter: false,
  footer: true,
  headerElementBefore: false,
  overlay: true,
  size: 'medium',
  submenu: true,
  subtitle: false,
  tabs: true,
  title: 'Sidebar title',
  toggle: false
}

Sidebar.displayName = 'Sidebar'

export default Sidebar
