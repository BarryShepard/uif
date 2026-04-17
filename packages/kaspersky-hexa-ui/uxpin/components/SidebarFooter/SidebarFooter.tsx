import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { Button } from '@src/button'

import { mergeFrameStyle } from '../../preview'
import {
  getUXPinPropSources,
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import SidebarFooterLeftItems, {
  isUXPinSidebarFooterLeftItemsElement,
  resolveSidebarFooterLeftItemsChildren
} from '../SidebarFooterLeftItems/SidebarFooterLeftItems'
import SidebarFooterRightItems, {
  isUXPinSidebarFooterRightItemsElement,
  resolveSidebarFooterRightItemsChildren
} from '../SidebarFooterRightItems/SidebarFooterRightItems'

export type UXPinSidebarFooterProps = {
  /** Shows the right footer zone with additional destructive action. */
  additionalContent?: boolean,
  /** Left footer slot. Defaults to Save and Cancel buttons. */
  leftContent?: React.ReactNode,
  /** Right footer slot. Defaults to Delete button. */
  rightContent?: React.ReactNode,
  children?: React.ReactNode,
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

const defaultRightContent = (
  <Button mode="dangerOutlined" size="medium" text="Delete" />
)

const defaultLeftContentWithCancel = (onCancel?: () => void): React.ReactNode => (
  <>
    <Button mode="primary" size="medium" text="Save" />
    <Button mode="secondary" onClick={onCancel} size="medium" text="Cancel" />
  </>
)

const defaultSidebarFooterChildren = (
  <>
    <SidebarFooterLeftItems />
    <SidebarFooterRightItems />
  </>
)

const SIDEBAR_FOOTER_ROLE = 'hexa-uxpin-sidebar-footer'

type SidebarFooterComponent = React.FC<UXPinSidebarFooterProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinSidebarFooterProps>
}

const hasSidebarFooterOwnShape = (props: Record<string, unknown> = {}): boolean => (
  'additionalContent' in props ||
  'leftContent' in props ||
  'rightContent' in props ||
  React.Children.toArray(resolveUXPinChildrenFromProps(props)).some((child) => (
    isUXPinSidebarFooterLeftItemsElement(child) ||
    isUXPinSidebarFooterRightItemsElement(child)
  ))
)

const hasSidebarFooterShape = (props: Record<string, unknown> = {}): boolean => {
  return getUXPinPropSources(props).some(hasSidebarFooterOwnShape)
}

export const isUXPinSidebarFooterElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinSidebarFooterProps> => (
  React.isValidElement(node) &&
  (
    (node.type as SidebarFooterComponent)?.uxpinRole === SIDEBAR_FOOTER_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'SidebarFooter' ||
    (node.type as { name?: string })?.name === 'SidebarFooter' ||
    hasSidebarFooterShape(node.props as Record<string, unknown>)
  )
)

const SidebarFooter = (rawProps: UXPinSidebarFooterProps): JSX.Element => {
  const resolvedProps = resolveUXPinRuntimeProps(rawProps)
  const {
    additionalContent = false,
    children,
    leftContent,
    rightContent,
    style
  } = resolvedProps
  const { onCancel } = rawProps as SidebarFooterRuntimeProps
  const rootRef = useAutoHeightMergeFrame({
    skipIfWithinSelector: '[data-hexa-uxpin-sidebar="true"]'
  })
  const resolvedChildren = hasUXPinChildrenProp(rawProps)
    ? resolveUXPinChildrenFromProps(rawProps)
    : children
  const hasExplicitFooterChildren = React.Children.count(resolvedChildren) > 0
  const leftItemsContent = resolveSidebarFooterLeftItemsChildren(resolvedChildren)
  const rightItemsContent = resolveSidebarFooterRightItemsChildren(resolvedChildren)
  const hasResolvedFooterZones = Boolean(leftItemsContent || rightItemsContent)
  const resolvedLeftContent = leftItemsContent ?? leftContent ?? (
    hasExplicitFooterChildren && hasResolvedFooterZones ? null : defaultLeftContentWithCancel(onCancel)
  )
  const resolvedRightContent = rightItemsContent ?? rightContent ?? (
    hasExplicitFooterChildren && hasResolvedFooterZones ? null : defaultRightContent
  )

  return (
    <SidebarFooterRoot ref={rootRef} style={mergeFrameStyle(style)}>
      <div className="sidebar-footer-left">
        {resolvedLeftContent}
      </div>
      {additionalContent && (
        <div className="sidebar-footer-right">
          {resolvedRightContent}
        </div>
      )}
    </SidebarFooterRoot>
  )
}

SidebarFooter.uxpinRole = SIDEBAR_FOOTER_ROLE
SidebarFooter.defaultProps = {
  additionalContent: false
}

export { defaultSidebarFooterChildren }

SidebarFooter.displayName = 'SidebarFooter'

export default SidebarFooter
