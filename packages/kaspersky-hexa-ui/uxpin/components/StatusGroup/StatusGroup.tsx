import React from 'react'
import styled from 'styled-components'

import {
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import Status from '../Status/Status'
import { getVisibleUXPinChildrenArray } from '../../visibility'

export type UXPinStatusGroupProps = {
  /** Group orientation. */
  orientation?: 'vertical' | 'horizontal',
  /** Editable status children. */
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinStatusGroupProps>,
  overriddenCodeProps?: Partial<UXPinStatusGroupProps>
}

const DEFAULT_STATUS_GROUP_CHILDREN = (
  <>
    <Status text="Active" mode="positive" />
    <Status text="In progress" mode="inprogress" />
    <Status text="Critical" mode="critical" />
  </>
)

const StatusGroupRoot = styled.div<{ orientation?: 'vertical' | 'horizontal' }>`
  display: flex;
  flex-direction: ${({ orientation = 'vertical' }) => orientation === 'horizontal' ? 'row' : 'column'};
  align-items: flex-start;
  gap: ${({ orientation = 'vertical' }) => orientation === 'horizontal' ? 16 : 4}px;
  width: 100%;
  min-width: 0;
`

const StatusGroup = (rawProps: UXPinStatusGroupProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const {
    children = DEFAULT_STATUS_GROUP_CHILDREN,
    codeComponentProps: _codeComponentProps,
    orientation = 'vertical',
    overriddenCodeProps: _overriddenCodeProps
  } = resolveUXPinRuntimeProps(rawProps)
  const visibleChildren = getVisibleUXPinChildrenArray(children)

  return (
    <div ref={rootRef} style={{ height: 'fit-content', width: '100%' }}>
      <StatusGroupRoot orientation={orientation}>
        {visibleChildren.length ? visibleChildren : DEFAULT_STATUS_GROUP_CHILDREN}
      </StatusGroupRoot>
    </div>
  )
}

StatusGroup.displayName = 'StatusGroup'

export default StatusGroup
