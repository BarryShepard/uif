import React from 'react'
import styled from 'styled-components'

import { ArrowDown1, ArrowUp1 } from '@kaspersky/hexa-ui-icons/16'

import {
  getUXPinChildrenArray,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import ActionButton, { UXPinActionButtonProps } from '../ActionButton/ActionButton'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'
import Typography from '../Typography/Typography'

export type UXPinExpandProps = {
  /** Collapsed container max height in pixels. */
  maxHeight?: number,
  /** Text on the expand button. */
  expandText?: string,
  /** Text on the collapse button. */
  collapseText?: string,
  /** Content and optional ActionButton child. */
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinExpandProps>,
  overriddenCodeProps?: Partial<UXPinExpandProps>,
  style?: React.CSSProperties
}

const DEFAULT_EXPAND_CHILDREN = (
  <>
    <Typography type="BTR4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel justo ac nibh luctus volutpat.
      Sed interdum, nisl at dapibus gravida, dui massa mattis sem, vitae viverra lectus arcu eget nibh.
    </Typography>
    <ActionButton variant="button" mode="ghost" size="large" text="Show more" elementAfter />
  </>
)

const ExpandRoot = styled.div`
  width: 100%;
  min-width: 0;

  .hexa-uxpin-expand-content {
    overflow: auto;
    width: 100%;
    min-width: 0;
  }

  .hexa-uxpin-expand-content-collapsed {
    overflow: hidden;
  }

  .hexa-uxpin-expand-button {
    margin-top: 4px;
    width: fit-content;
  }
`

const isActionButtonElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinActionButtonProps> => (
  React.isValidElement(node) &&
  (
    (node.type as { displayName?: string })?.displayName === 'ActionButton' ||
    (node.type as { name?: string })?.name === 'ActionButton'
  )
)

const Expand = (rawProps: UXPinExpandProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const runtimeProps = resolveUXPinRuntimeProps(rawProps)
  const explicitChildren = resolveUXPinChildrenFromProps(rawProps)
  const {
    children = DEFAULT_EXPAND_CHILDREN,
    codeComponentProps: _codeComponentProps,
    collapseText = 'Show less',
    expandText = 'Show more',
    maxHeight = 104,
    overriddenCodeProps: _overriddenCodeProps,
    style
  } = runtimeProps
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [collapsed, setCollapsed] = React.useState(true)
  const [hasOverflow, setHasOverflow] = React.useState(true)
  const resolvedChildren = getUXPinChildrenArray(explicitChildren ?? children)
    .filter((child) => !isUXPinHiddenElement(child))
  const actionButton = resolvedChildren.find(isActionButtonElement)
  const contentChildren = resolvedChildren.filter((child) => child !== actionButton)

  React.useLayoutEffect(() => {
    const contentElement = contentRef.current

    if (!contentElement) {
      return undefined
    }

    const updateOverflow = (): void => {
      setHasOverflow(contentElement.scrollHeight > maxHeight)
    }
    const observer = new ResizeObserver(updateOverflow)

    updateOverflow()
    observer.observe(contentElement)

    return () => observer.disconnect()
  }, [contentChildren, maxHeight])

  const buttonText = collapsed ? expandText : collapseText
  const buttonIcon = collapsed ? <ArrowDown1 /> : <ArrowUp1 />
  const button = actionButton
    ? React.cloneElement(actionButton, {
      elementAfter: true,
      elementAfterSlot: undefined,
      onClick: () => setCollapsed((current) => !current),
      text: buttonText
    })
    : (
      <ActionButton
        elementAfter
        mode="ghost"
        onClick={() => setCollapsed((current) => !current)}
        size="large"
        text={buttonText}
        variant="button"
      />
    )

  return (
    <ExpandRoot ref={rootRef} style={style}>
      <div
        ref={contentRef}
        className={[
          'hexa-uxpin-expand-content',
          collapsed ? 'hexa-uxpin-expand-content-collapsed' : ''
        ].filter(Boolean).join(' ')}
        style={collapsed ? { maxHeight } : undefined}
      >
        {contentChildren}
      </div>
      {hasOverflow && (
        <div className="hexa-uxpin-expand-button">
          {React.isValidElement<UXPinActionButtonProps>(button)
            ? React.cloneElement(button, { elementAfterSlot: buttonIcon })
            : button}
        </div>
      )}
    </ExpandRoot>
  )
}

Expand.displayName = 'Expand'

export default Expand
