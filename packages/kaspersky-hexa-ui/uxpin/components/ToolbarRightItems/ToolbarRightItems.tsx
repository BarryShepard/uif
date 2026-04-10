import React from 'react'

import { Toolbar as HexaToolbar } from '@src/toolbar'

import { FrameFill } from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import ToolbarButton, { toolbarChildrenToItems } from '../ToolbarButton/ToolbarButton'

export type UXPinToolbarRightItemsProps = {
  children?: React.ReactNode,
  overriddenCodeProps?: {
    children?: React.ReactNode
  }
}

type ToolbarRightItemsComponent = React.FC<UXPinToolbarRightItemsProps> & {
  uxpinRole?: string
}

const TOOLBAR_RIGHT_ITEMS_ROLE = 'hexa-uxpin-toolbar-right-items'

export const DEFAULT_TOOLBAR_RIGHT_ITEMS_CHILDREN = (
  <>
    <ToolbarButton
      text="Filter"
      iconBefore={true}
      hideText={true}
      indicator={false}
    />
    <ToolbarButton
      text="Settings"
      iconBefore={true}
      hideText={true}
      indicator={false}
    />
  </>
)

const resolveElementChildren = (
  element: React.ReactElement<UXPinToolbarRightItemsProps>
): React.ReactNode => (
  element.props.overriddenCodeProps?.children ??
  element.props.children ??
  (typeof element.type === 'function'
    ? (element.type as ToolbarRightItemsComponent).defaultProps?.children
    : undefined)
)

export const isUXPinToolbarRightItemsElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinToolbarRightItemsProps> => (
  React.isValidElement(node) &&
  (
    (node.type as ToolbarRightItemsComponent)?.uxpinRole === TOOLBAR_RIGHT_ITEMS_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'ToolbarRightItems' ||
    (node.type as { name?: string })?.name === 'ToolbarRightItems'
  )
)

export const resolveToolbarRightItemsChildren = (
  children: React.ReactNode
): Array<React.ReactElement<UXPinToolbarRightItemsProps>> => {
  const elements: Array<React.ReactElement<UXPinToolbarRightItemsProps>> = []

  React.Children.forEach(children, (child) => {
    if (!child) {
      return
    }

    if (isUXPinToolbarRightItemsElement(child)) {
      elements.push(child)
      return
    }

    if (
      React.isValidElement<{ children?: React.ReactNode, overriddenCodeProps?: { children?: React.ReactNode } }>(child) &&
      (child.props?.children || child.props?.overriddenCodeProps?.children)
    ) {
      elements.push(...resolveToolbarRightItemsChildren(
        child.props?.overriddenCodeProps?.children ?? child.props.children
      ))
    }
  })

  return elements
}

export const resolveToolbarRightItemsChildNodes = (
  children: React.ReactNode
): React.ReactNode | undefined => {
  const elements = resolveToolbarRightItemsChildren(children)

  if (!elements.length) {
    return undefined
  }

  return (
    <>
      {elements.map((element, index) => (
        <React.Fragment key={element.key ?? `toolbar-right-items-${index + 1}`}>
          {resolveElementChildren(element)}
        </React.Fragment>
      ))}
    </>
  )
}

const ToolbarRightItems: ToolbarRightItemsComponent = ({
  children = DEFAULT_TOOLBAR_RIGHT_ITEMS_CHILDREN
}: UXPinToolbarRightItemsProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame({
    skipIfWithinSelector: '[data-hexa-uxpin-toolbar-root="true"]'
  })

  return (
    <div ref={rootRef} style={{ width: 'fit-content', minWidth: 0, maxWidth: '100%' }}>
      <FrameFill
        style={{
          height: 'fit-content',
          width: 'fit-content',
          minWidth: 0,
          maxWidth: '100%'
        }}
      >
        <HexaToolbar
          right={toolbarChildrenToItems(children, 'toolbar-right-preview')}
        />
      </FrameFill>
    </div>
  )
}

ToolbarRightItems.uxpinRole = TOOLBAR_RIGHT_ITEMS_ROLE
ToolbarRightItems.displayName = 'ToolbarRightItems'
ToolbarRightItems.defaultProps = {
  children: DEFAULT_TOOLBAR_RIGHT_ITEMS_CHILDREN
}

export default ToolbarRightItems
