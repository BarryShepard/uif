import React from 'react'
import styled from 'styled-components'

import { ArrowDown1, ArrowUp1 } from '@kaspersky/hexa-ui-icons/16'

import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  getUXPinElementPropSources,
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
    <Typography type="body text/P4 (12, 16)/Regular">
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
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as { displayName?: string })?.displayName === 'ActionButton' ||
      (node.type as { name?: string })?.name === 'ActionButton'
    )
  ) ||
  getUXPinElementPropSources(node).some((props) => (
    props.name === 'ActionButton' ||
    (
      typeof props.uxpId === 'string' &&
      props.uxpId.toLowerCase().includes('action')
    ) ||
    (
      typeof props.presetElementId === 'string' &&
      props.presetElementId.toLowerCase().includes('action')
    ) ||
    (
      typeof props.uxpinPresetElementId === 'string' &&
      props.uxpinPresetElementId.toLowerCase().includes('action')
    ) ||
    (
      'variant' in props &&
      'mode' in props &&
      (
        'elementAfter' in props ||
        'iconBefore' in props ||
        'size' in props ||
        'text' in props
      )
    )
  ))
)

const getExpandChildren = (
  children: React.ReactNode
): React.ReactNode[] => (
  getUXPinChildrenArray(children).flatMap((child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      return getExpandChildren(child.props.children)
    }

    return [child]
  })
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
  const resolvedChildren = getExpandChildren(explicitChildren ?? children)
    .filter((child) => !isUXPinHiddenElement(child))
  const actionButton = resolvedChildren.find(isActionButtonElement)
  const actionButtonProps = actionButton
    ? resolveUXPinRuntimeProps<UXPinActionButtonProps>(
      (getUXPinElementProps(actionButton) || {}) as UXPinActionButtonProps
    )
    : undefined
  const contentChildren = resolvedChildren.filter((child) => !isActionButtonElement(child))

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
  const button = (
    <ActionButton
      mode="ghost"
      size="large"
      variant="button"
      {...actionButtonProps}
      elementAfter
      elementAfterSlot={buttonIcon}
      onClick={() => setCollapsed((current) => !current)}
      text={collapsed ? actionButtonProps?.text ?? buttonText : buttonText}
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
          {button}
        </div>
      )}
    </ExpandRoot>
  )
}

Expand.displayName = 'Expand'

export default Expand
