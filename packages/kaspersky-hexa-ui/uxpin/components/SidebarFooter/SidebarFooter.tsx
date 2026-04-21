import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'
import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import SidebarFooterLeftItems, {
  DEFAULT_SIDEBAR_FOOTER_LEFT_ITEMS_CHILDREN,
  renderSidebarFooterButtonChildren,
  resolveSidebarFooterLeftItemsChildren
} from '../SidebarFooterLeftItems/SidebarFooterLeftItems'
import SidebarFooterRightItems, {
  DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN,
  resolveSidebarFooterRightItemsChildren
} from '../SidebarFooterRightItems/SidebarFooterRightItems'

export type UXPinSidebarFooterProps = {
  /** Shows the right footer zone even when the right slot is empty. */
  additionalContent?: boolean,
  /** Footer zones. Place SidebarFooterLeftItems and SidebarFooterRightItems here. */
  children?: React.ReactNode,
  /** Left footer slot. */
  leftItem?: React.ReactNode,
  /** Right footer slot. */
  rightItem?: React.ReactNode,
  overriddenCodeProps?: Partial<UXPinSidebarFooterProps>,
  style?: CSSProperties
}

type SidebarFooterRuntimeProps = UXPinSidebarFooterProps & {
  onCancel?: () => void
}

export type UXPinSidebarFooterRuntimeProps = SidebarFooterRuntimeProps

const SidebarFooterRoot = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  padding: 16px 24px;
  gap: 16px;
  border-top: 1px solid var(--elements--separator, #d5d9e0);
  background: var(--bg--base, #fff);
  box-sizing: border-box;

  .sidebar-footer-left,
  .sidebar-footer-right {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing--gap_related, 8px);
    min-width: 0;
  }

  .sidebar-footer-left {
    flex: 1 1 auto;
  }

  .sidebar-footer-right {
    flex: 0 0 auto;
    justify-content: flex-end;
    margin-left: auto;
  }
`

const SIDEBAR_FOOTER_ROLE = 'hexa-uxpin-sidebar-footer'

const isRenderableReactNode = (
  node: React.ReactNode
): boolean => (
  React.isValidElement(node) ||
  typeof node === 'string' ||
  typeof node === 'number'
)

const isEmptyChildrenList = (
  children: React.ReactNode
): boolean => getUXPinChildrenArray(children).length === 0

const hasSlotContent = (
  slotItem: React.ReactNode
): boolean => (
  slotItem !== undefined &&
  slotItem !== null &&
  slotItem !== false
)

const resolveFooterSlotItem = (
  slotItem: React.ReactNode,
  slot: 'left' | 'right'
): React.ReactNode => {
  if (slotItem === null || slotItem === false) {
    return slotItem
  }

  const resolvedSlotItems = slot === 'left'
    ? resolveSidebarFooterLeftItemsChildren(slotItem)
    : resolveSidebarFooterRightItemsChildren(slotItem)

  if (resolvedSlotItems !== undefined) {
    return resolvedSlotItems
  }

  if (isRenderableReactNode(slotItem)) {
    return slotItem
  }

  const slotProps = getUXPinElementProps(slotItem)

  if (hasUXPinChildrenProp(slotProps)) {
    return renderSidebarFooterButtonChildren(
      resolveUXPinChildrenFromProps(slotProps),
      `sidebar-footer-${slot}-slot`
    )
  }

  const renderedButtons = renderSidebarFooterButtonChildren(
    slotItem,
    `sidebar-footer-${slot}-slot`
  )

  return renderedButtons.length ? renderedButtons : undefined
}

type SidebarFooterComponent = React.FC<UXPinSidebarFooterProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinSidebarFooterProps>
}

export const isUXPinSidebarFooterElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinSidebarFooterProps> => (
  React.isValidElement(node) &&
  (
    (node.type as SidebarFooterComponent)?.uxpinRole === SIDEBAR_FOOTER_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'SidebarFooter' ||
    (node.type as { name?: string })?.name === 'SidebarFooter'
  )
)

const SidebarFooter = (rawProps: UXPinSidebarFooterProps): JSX.Element => {
  const {
    additionalContent = false,
    children,
    leftItem,
    rightItem,
    style
  } = resolveUXPinRuntimeProps(rawProps)
  const runtimeChildren = resolveUXPinChildrenFromProps(rawProps)
  const resolvedChildren = runtimeChildren === undefined ? children : runtimeChildren
  const hasLeftSlotContent = hasSlotContent(leftItem)
  const hasRightSlotContent = hasSlotContent(rightItem)
  const hasAnySlotContent = hasLeftSlotContent || hasRightSlotContent
  const shouldUseDefaultChildren = (
    resolvedChildren === undefined ||
    (!hasAnySlotContent && resolvedChildren !== null && isEmptyChildrenList(resolvedChildren))
  )
  const footerChildren = shouldUseDefaultChildren ? null : resolvedChildren
  const nestedLeftItem = resolveSidebarFooterLeftItemsChildren(footerChildren)
  const nestedRightItem = resolveSidebarFooterRightItemsChildren(footerChildren)
  const defaultLeftItem = shouldUseDefaultChildren
    ? renderSidebarFooterButtonChildren(DEFAULT_SIDEBAR_FOOTER_LEFT_ITEMS_CHILDREN, 'sidebar-footer-left-default')
    : undefined
  const defaultRightItem = shouldUseDefaultChildren
    ? renderSidebarFooterButtonChildren(DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN, 'sidebar-footer-right-default')
    : undefined
  const resolvedLeftItem = hasLeftSlotContent
    ? resolveFooterSlotItem(leftItem, 'left')
    : nestedLeftItem ?? defaultLeftItem
  const resolvedRightItem = hasRightSlotContent
    ? resolveFooterSlotItem(rightItem, 'right')
    : nestedRightItem ?? defaultRightItem
  const rootRef = useAutoHeightMergeFrame({
    skipIfWithinSelector: '[data-hexa-uxpin-sidebar="true"]'
  })
  const showRightItem = (
    additionalContent ||
    (resolvedRightItem !== undefined && resolvedRightItem !== null && resolvedRightItem !== false)
  )

  return (
    <SidebarFooterRoot ref={rootRef} style={mergeFrameStyle(style)}>
      <div className="sidebar-footer-left">
        {resolvedLeftItem}
      </div>
      {showRightItem && (
        <div className="sidebar-footer-right">
          {resolvedRightItem}
        </div>
      )}
    </SidebarFooterRoot>
  )
}

SidebarFooter.uxpinRole = SIDEBAR_FOOTER_ROLE
SidebarFooter.defaultProps = {
  additionalContent: false
}

SidebarFooter.displayName = 'SidebarFooter'

export default SidebarFooter
