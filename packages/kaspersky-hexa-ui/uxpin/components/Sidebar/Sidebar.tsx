import React, { CSSProperties, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ActionButton } from '@src/action-button'
import { Button } from '@src/button'
import { Submenu as HexaSubmenu } from '@src/submenu'
import { SubmenuItemProps as HexaSubmenuItemProps } from '@src/submenu/types'
import { Tabs as HexaTabs } from '@src/tabs'
import { Text } from '@src/typography'

import { Placeholder } from '@kaspersky/hexa-ui-icons/16'

import { mergeFrameStyle } from '../../preview'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'
import SidebarFooter, {
  isUXPinSidebarFooterElement,
  UXPinSidebarFooterProps
} from '../SidebarFooter/SidebarFooter'

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
  style?: CSSProperties
}

const SIDEBAR_WIDTH_BY_SIZE: Record<Exclude<UXPinSidebarSize, 'flex'>, number> = {
  extraSmall: 480,
  small: 640,
  medium: 800,
  large: 1200
}

const SUBMENU_ENABLED_SIZES: UXPinSidebarSize[] = ['medium', 'large', 'flex']

const sidebarSubmenuItems: HexaSubmenuItemProps[] = [
  {
    type: 'row',
    key: 'general',
    text: 'General'
  },
  {
    type: 'row',
    key: 'details',
    text: 'Details',
    description: 'Additional settings'
  },
  {
    type: 'row',
    key: 'activity',
    text: 'Activity'
  },
  {
    type: 'row',
    key: 'permissions',
    text: 'Permissions'
  },
  {
    type: 'row',
    key: 'advanced',
    text: 'Advanced'
  }
]

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
  border-bottom: 1px solid var(--elements--separator, #d5d9e0);
  box-sizing: border-box;

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
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
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

  .sidebar-header-tabs {
    width: 100%;
    min-width: 0;
    padding: 0 24px;
    box-sizing: border-box;
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

const ToggleMock = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0;
  gap: 8px;
  border: 0;
  background: transparent;
  color: var(--text-icons-elements--primary, #1d1e20);
  cursor: pointer;
  font: inherit;

  &::before {
    content: '';
    display: inline-block;
    width: 32px;
    height: 18px;
    border-radius: 999px;
    background: var(--main-interact--primary, #1d84ff);
  }

  &::after {
    content: '';
    position: absolute;
    left: 16px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
  }
`

type SidebarChildResolution = {
  contentChildren: React.ReactNode[],
  footerElement?: React.ReactElement<UXPinSidebarFooterProps>,
  submenuElement?: React.ReactElement
}

const isUXPinSubmenuElement = (node: React.ReactNode): node is React.ReactElement => (
  React.isValidElement(node) &&
  (
    (node.type as { displayName?: string })?.displayName === 'Submenu' ||
    (node.type as { name?: string })?.name === 'Submenu'
  )
)

const getSidebarPanelWidth = (size: UXPinSidebarSize): string | number => {
  if (size === 'flex') {
    return 'calc(100% - 40px)'
  }

  return SIDEBAR_WIDTH_BY_SIZE[size]
}

const getSidebarStageWidth = (
  size: UXPinSidebarSize,
  panelWidth: string | number,
  style?: CSSProperties
): string | number => {
  if (style?.width !== undefined) {
    return style.width
  }

  return size === 'flex' ? '100%' : panelWidth
}

const resolveSidebarChildren = (children?: React.ReactNode): SidebarChildResolution => {
  const result: SidebarChildResolution = {
    contentChildren: []
  }

  React.Children.toArray(children).forEach((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (!result.submenuElement && isUXPinSubmenuElement(child)) {
      result.submenuElement = child
      return
    }

    if (!result.footerElement && isUXPinSidebarFooterElement(child)) {
      result.footerElement = child
      return
    }

    result.contentChildren.push(child)
  })

  return result
}

const renderDefaultSubmenu = (): React.ReactNode => (
  <HexaSubmenu
    defaultActiveKey="general"
    items={sidebarSubmenuItems}
    truncateText
  />
)

const renderDefaultTabs = (): React.ReactNode => (
  <HexaTabs defaultActiveKey="overview" noMargin>
    <HexaTabs.TabPane tab="Overview" key="overview">
      <span />
    </HexaTabs.TabPane>
    <HexaTabs.TabPane tab="Details" key="details">
      <span />
    </HexaTabs.TabPane>
  </HexaTabs>
)

const Sidebar = ({
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
}: UXPinSidebarProps): JSX.Element => {
  const [open, setOpen] = useState(true)
  const panelWidth = getSidebarPanelWidth(size)
  const stageWidth = getSidebarStageWidth(size, panelWidth, style)
  const {
    contentChildren,
    footerElement,
    submenuElement
  } = useMemo(() => resolveSidebarChildren(children), [children])
  const shouldShowSubmenu = submenu && SUBMENU_ENABLED_SIZES.includes(size)

  const handleClose = (): void => {
    setOpen(false)
  }

  const resolvedFooter = footer
    ? footerElement
      ? React.cloneElement(footerElement, { onCancel: handleClose } as Partial<UXPinSidebarFooterProps>)
      : <SidebarFooter {...({ onCancel: handleClose } as UXPinSidebarFooterProps & { onCancel: () => void })} />
    : null

  return (
    <SidebarStage
      data-hexa-uxpin-sidebar="true"
      hidden={!open}
      style={mergeFrameStyle({
        ...style,
        width: stageWidth,
        minWidth: size === 'flex' ? undefined : panelWidth,
        height: style?.height ?? 720
      })}
    >
      {overlay && <SidebarOverlay aria-label="Close sidebar overlay" onClick={handleClose} type="button" />}
      <SidebarPanel style={{ width: panelWidth, minWidth: panelWidth }}>
        <SidebarHeader>
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
                  <ToggleMock type="button">{toggleText}</ToggleMock>
                </div>
              )}
            </div>
            <div className="sidebar-header-right">
              {contentRight}
              <ActionButton onClick={handleClose} size="large" />
            </div>
          </div>
          {tabs && (
            <div className="sidebar-header-tabs">
              {renderDefaultTabs()}
            </div>
          )}
        </SidebarHeader>
        <SidebarBody>
          {shouldShowSubmenu && (submenuElement ?? renderDefaultSubmenu())}
          <div className="sidebar-main">
            {contentChildren.length > 0
              ? contentChildren
              : (
                  <div className="sidebar-default-content">
                    <Text type="BTR3">Sidebar content area</Text>
                    <Text type="BTR4">
                      Place any UXPin components here. Content scrolls when it exceeds the sidebar height.
                    </Text>
                    <Button mode="secondary" size="medium" text="Secondary action" />
                  </div>
                )}
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
