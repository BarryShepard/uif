import React from 'react'

import { Toolbar as HexaToolbar } from '@src/toolbar'

import { FrameFill } from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import ToolbarButton, { isUXPinHiddenElement, toolbarChildrenToItems } from '../ToolbarButton/ToolbarButton'

export type UXPinToolbarLeftItemsProps = {
  children?: React.ReactNode,
  overriddenCodeProps?: {
    children?: React.ReactNode
  }
}

type ToolbarLeftItemsComponent = React.FC<UXPinToolbarLeftItemsProps> & {
  uxpinRole?: string
}

const TOOLBAR_LEFT_ITEMS_ROLE = 'hexa-uxpin-toolbar-left-items'

export const DEFAULT_TOOLBAR_LEFT_ITEMS_CHILDREN = (
  <>
    <ToolbarButton
      text="Button 1"
      iconBefore={true}
    />
    <ToolbarButton
      text="Button 2"
      variant="dropdown"
      iconBefore={true}
      iconAfter={true}
    />
    <ToolbarButton
      text="Button 3"
    />
  </>
)

const resolveElementChildren = (
  element: React.ReactElement<UXPinToolbarLeftItemsProps>
): React.ReactNode => (
  element.props.overriddenCodeProps?.children ??
  element.props.children ??
  (typeof element.type === 'function'
    ? (element.type as ToolbarLeftItemsComponent).defaultProps?.children
    : undefined)
)

export const isUXPinToolbarLeftItemsElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinToolbarLeftItemsProps> => (
  React.isValidElement(node) &&
  (
    (node.type as ToolbarLeftItemsComponent)?.uxpinRole === TOOLBAR_LEFT_ITEMS_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'ToolbarLeftItems' ||
    (node.type as { name?: string })?.name === 'ToolbarLeftItems'
  )
)

export const resolveToolbarLeftItemsChildren = (
  children: React.ReactNode
): Array<React.ReactElement<UXPinToolbarLeftItemsProps>> => {
  const elements: Array<React.ReactElement<UXPinToolbarLeftItemsProps>> = []

  React.Children.forEach(children, (child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinToolbarLeftItemsElement(child)) {
      elements.push(child)
      return
    }

    if (
      React.isValidElement<{ children?: React.ReactNode, overriddenCodeProps?: { children?: React.ReactNode } }>(child) &&
      (child.props?.children || child.props?.overriddenCodeProps?.children)
    ) {
      elements.push(...resolveToolbarLeftItemsChildren(
        child.props?.overriddenCodeProps?.children ?? child.props.children
      ))
    }
  })

  return elements
}

export const resolveToolbarLeftItemsChildNodes = (
  children: React.ReactNode
): React.ReactNode | undefined => {
  const elements = resolveToolbarLeftItemsChildren(children)

  if (!elements.length) {
    return undefined
  }

  return (
    <>
      {elements.map((element, index) => (
        <React.Fragment key={element.key ?? `toolbar-left-items-${index + 1}`}>
          {resolveElementChildren(element)}
        </React.Fragment>
      ))}
    </>
  )
}

const ToolbarLeftItems: ToolbarLeftItemsComponent = ({
  children = DEFAULT_TOOLBAR_LEFT_ITEMS_CHILDREN,
  overriddenCodeProps
}: UXPinToolbarLeftItemsProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const resolvedChildren = overriddenCodeProps?.children ?? children

  return (
    <div ref={rootRef} style={{ width: '100%' }}>
      <FrameFill
        style={{
          height: 'fit-content'
        }}
      >
        <HexaToolbar
          autoDropdown={true}
          left={toolbarChildrenToItems(resolvedChildren, 'toolbar-left-preview')}
        />
      </FrameFill>
    </div>
  )
}

ToolbarLeftItems.uxpinRole = TOOLBAR_LEFT_ITEMS_ROLE
ToolbarLeftItems.displayName = 'ToolbarLeftItems'
ToolbarLeftItems.defaultProps = {
  children: DEFAULT_TOOLBAR_LEFT_ITEMS_CHILDREN
}

export default ToolbarLeftItems
