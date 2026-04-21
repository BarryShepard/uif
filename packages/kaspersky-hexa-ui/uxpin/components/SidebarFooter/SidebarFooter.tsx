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

import {
  DEFAULT_SIDEBAR_FOOTER_LEFT_ITEMS_CHILDREN,
  isUXPinSidebarFooterLeftItemsElement,
  renderSidebarFooterButtonChildren,
  resolveSidebarFooterLeftItemsChildren
} from '../SidebarFooterLeftItems/SidebarFooterLeftItems'
import {
  DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN,
  isUXPinSidebarFooterRightItemsElement,
  resolveSidebarFooterRightItemsChildren
} from '../SidebarFooterRightItems/SidebarFooterRightItems'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'

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
    flex: 1 1 0;
    width: auto;
  }

  .sidebar-footer-right {
    flex: 0 0 auto;
    flex-wrap: nowrap;
    justify-content: flex-end;
    margin-left: auto;
    width: max-content;
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

const isUXPinUndefinedSlot = (
  slotItem: React.ReactNode
): boolean => slotItem === '__UXPIN_UNDEFINED__'

const normalizeSlotItem = (
  slotItem: React.ReactNode
): React.ReactNode | undefined => (
  isUXPinUndefinedSlot(slotItem) ? undefined : slotItem
)

const hasSlotContent = (
  slotItem: React.ReactNode
): boolean => (
  slotItem !== undefined &&
  slotItem !== null &&
  slotItem !== false &&
  !isUXPinUndefinedSlot(slotItem)
)

const combineFooterItems = (
  ...items: React.ReactNode[]
): React.ReactNode | undefined => {
  const resolvedItems = items.filter((item) => (
    item !== undefined &&
    item !== null &&
    item !== false &&
    !(Array.isArray(item) && item.length === 0)
  ))

  if (!resolvedItems.length) {
    return undefined
  }

  return (
    <>
      {resolvedItems.map((item, index) => (
        <React.Fragment key={`sidebar-footer-combined-${index + 1}`}>
          {item}
        </React.Fragment>
      ))}
    </>
  )
}

const resolveDirectFooterChildren = (
  children: React.ReactNode
): React.ReactNode | undefined => {
  const directChildren = getUXPinChildrenArray(children).filter((child) => (
    child &&
    !isUXPinHiddenElement(child) &&
    !isUXPinSidebarFooterLeftItemsElement(child) &&
    !isUXPinSidebarFooterRightItemsElement(child)
  ))

  if (!directChildren.length) {
    return undefined
  }

  const renderedChildren = renderSidebarFooterButtonChildren(
    directChildren,
    'sidebar-footer-left-direct'
  )

  return renderedChildren.length ? renderedChildren : undefined
}

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
    leftItem: rawLeftItem,
    rightItem: rawRightItem,
    style
  } = resolveUXPinRuntimeProps(rawProps)
  const leftItem = normalizeSlotItem(rawLeftItem)
  const rightItem = normalizeSlotItem(rawRightItem)
  const runtimeChildren = resolveUXPinChildrenFromProps(rawProps)
  const resolvedChildren = runtimeChildren === undefined ? children : runtimeChildren
  const hasLeftSlotContent = hasSlotContent(leftItem)
  const hasRightSlotContent = hasSlotContent(rightItem)
  const hasAnySlotContent = hasLeftSlotContent || hasRightSlotContent
  const shouldUseDefaultChildren = (
    !hasAnySlotContent &&
    resolvedChildren === undefined
  )
  const footerChildren = shouldUseDefaultChildren ? null : resolvedChildren
  const nestedLeftItem = resolveSidebarFooterLeftItemsChildren(footerChildren)
  const nestedRightItem = resolveSidebarFooterRightItemsChildren(footerChildren)
  const directLeftItem = isEmptyChildrenList(footerChildren)
    ? undefined
    : resolveDirectFooterChildren(footerChildren)
  const defaultLeftItem = shouldUseDefaultChildren
    ? renderSidebarFooterButtonChildren(DEFAULT_SIDEBAR_FOOTER_LEFT_ITEMS_CHILDREN, 'sidebar-footer-left-default')
    : undefined
  const defaultRightItem = shouldUseDefaultChildren
    ? renderSidebarFooterButtonChildren(DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN, 'sidebar-footer-right-default')
    : undefined
  const resolvedLeftItem = hasLeftSlotContent
    ? resolveFooterSlotItem(leftItem, 'left')
    : combineFooterItems(nestedLeftItem, directLeftItem) ?? defaultLeftItem
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
