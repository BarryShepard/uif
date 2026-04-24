import React from 'react'

import { Toolbar as HexaToolbar } from '@src/toolbar'

import { FrameFill } from '../../preview'
import {
  getUXPinChildrenArray,
  getUXPinElementPropSources,
  resolveUXPinElementChildren
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../../visibility'
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
  element: React.ReactNode
): React.ReactNode => (
  resolveUXPinElementChildren(element) ??
  (
    React.isValidElement(element) && typeof element.type === 'function'
      ? (element.type as ToolbarRightItemsComponent).defaultProps?.children
      : undefined
  )
)

const hasToolbarRightItemsIdentity = (
  node: React.ReactNode
): boolean => getUXPinElementPropSources(node).some((props) => (
  props.name === 'ToolbarRightItems' ||
  (typeof props.uxpId === 'string' && props.uxpId.includes('toolbar-right-items')) ||
  (typeof props.id === 'string' && props.id.includes('toolbar-right-items')) ||
  (typeof props.presetElementId === 'string' && props.presetElementId.includes('toolbar-right-items')) ||
  (typeof props.uxpinPresetElementId === 'string' && props.uxpinPresetElementId.includes('toolbar-right-items'))
))

export const isUXPinToolbarRightItemsElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as ToolbarRightItemsComponent)?.uxpinRole === TOOLBAR_RIGHT_ITEMS_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'ToolbarRightItems' ||
      (node.type as { name?: string })?.name === 'ToolbarRightItems'
    )
  ) ||
  hasToolbarRightItemsIdentity(node)
)

export const resolveToolbarRightItemsChildren = (
  children: React.ReactNode
): React.ReactNode[] => {
  const elements: React.ReactNode[] = []

  getUXPinChildrenArray(children).forEach((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinToolbarRightItemsElement(child)) {
      elements.push(child)
      return
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    if (nestedChildren) {
      elements.push(...resolveToolbarRightItemsChildren(nestedChildren))
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
          <React.Fragment
            key={React.isValidElement(element) && element.key !== null
              ? element.key
              : `toolbar-right-items-${index + 1}`}
          >
            {resolveElementChildren(element)}
          </React.Fragment>
      ))}
      </>
  )
}

const ToolbarRightItems: ToolbarRightItemsComponent = ({
  children = DEFAULT_TOOLBAR_RIGHT_ITEMS_CHILDREN,
  overriddenCodeProps
}: UXPinToolbarRightItemsProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame({
    skipIfWithinSelector: '[data-hexa-uxpin-toolbar-root="true"]'
  })
  const resolvedChildren = overriddenCodeProps?.children ?? children

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
          right={toolbarChildrenToItems(resolvedChildren, 'toolbar-right-preview')}
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
