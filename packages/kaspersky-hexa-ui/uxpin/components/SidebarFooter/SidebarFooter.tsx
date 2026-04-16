import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { Button } from '@src/button'

import { mergeFrameStyle } from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

export type UXPinSidebarFooterProps = {
  /** Shows the right footer zone with additional destructive action. */
  additionalContent?: boolean,
  /** Left footer slot. Defaults to Save and Cancel buttons. */
  leftContent?: React.ReactNode,
  /** Right footer slot. Defaults to Delete button. */
  rightContent?: React.ReactNode,
  children?: React.ReactNode,
  style?: CSSProperties
}

type SidebarFooterRuntimeProps = UXPinSidebarFooterProps & {
  onCancel?: () => void
}

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

  .sidebar-footer-right {
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

const SIDEBAR_FOOTER_ROLE = 'hexa-uxpin-sidebar-footer'

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
    leftContent,
    rightContent,
    style
  } = rawProps
  const { onCancel } = rawProps as SidebarFooterRuntimeProps
  const rootRef = useAutoHeightMergeFrame({
    skipIfWithinSelector: '[data-hexa-uxpin-sidebar="true"]'
  })
  const resolvedLeftContent = children ?? leftContent ?? defaultLeftContentWithCancel(onCancel)

  return (
    <SidebarFooterRoot ref={rootRef} style={mergeFrameStyle(style)}>
      <div className="sidebar-footer-left">
        {resolvedLeftContent}
      </div>
      {additionalContent && (
        <div className="sidebar-footer-right">
          {rightContent ?? defaultRightContent}
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
