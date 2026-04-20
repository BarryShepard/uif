import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

export type UXPinSidebarFooterProps = {
  /** Shows the right footer zone even when the right slot is empty. */
  additionalContent?: boolean,
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
    leftItem,
    rightItem,
    style
  } = resolveUXPinRuntimeProps(rawProps)
  const rootRef = useAutoHeightMergeFrame({
    skipIfWithinSelector: '[data-hexa-uxpin-sidebar="true"]'
  })
  const showRightItem = (
    additionalContent ||
    (rightItem !== undefined && rightItem !== null && rightItem !== false)
  )

  return (
    <SidebarFooterRoot ref={rootRef} style={mergeFrameStyle(style)}>
      <div className="sidebar-footer-left">
        {leftItem}
      </div>
      {showRightItem && (
        <div className="sidebar-footer-right">
          {rightItem}
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
