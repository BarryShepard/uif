import React from 'react'
import styled from 'styled-components'

import { FrameFill } from '../../preview'
import {
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'
import Icon from '../Icon/Icon'
import Status from '../Status/Status'
import Tag from '../Tag/Tag'
import Typography from '../Typography/Typography'

export type UXPinElementsStackProps = {
  /** Editable horizontal children. */
  children?: React.ReactNode,
  /** Horizontal gap between items in pixels. */
  gap?: number,
  codeComponentProps?: Partial<UXPinElementsStackProps>,
  overriddenCodeProps?: Partial<UXPinElementsStackProps>
}

const DEFAULT_ELEMENTS_STACK_CHILDREN = (
  <>
    <Icon name="Placeholder" size="small" />
    <Status text="Active" mode="positive" />
    <Tag label="Tag" />
    <Typography type="BTR4">Text</Typography>
  </>
)

const ElementsStackRoot = styled.div<{ gap?: number }>`
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: ${({ gap = 4 }) => gap}px;
  width: fit-content;
  max-width: 100%;
  min-width: 0;
`

const ElementsStack = (rawProps: UXPinElementsStackProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame({ width: 'fit-content' })
  const {
    children = DEFAULT_ELEMENTS_STACK_CHILDREN,
    codeComponentProps: _codeComponentProps,
    gap = 4,
    overriddenCodeProps: _overriddenCodeProps
  } = resolveUXPinRuntimeProps(rawProps)
  const visibleChildren = React.Children.toArray(children).filter((child) => !isUXPinHiddenElement(child))

  return (
    <div ref={rootRef}>
      <FrameFill style={{ height: 'fit-content', width: 'fit-content' }}>
        <ElementsStackRoot gap={gap}>
          {visibleChildren}
        </ElementsStackRoot>
      </FrameFill>
    </div>
  )
}

ElementsStack.displayName = 'ElementsStack'

export default ElementsStack
