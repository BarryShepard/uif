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

import Dropdown from '../Dropdown/Dropdown'
import DropdownItem from '../DropdownItem/DropdownItem'
import ToolbarButton, { toolbarChildrenToItems } from '../ToolbarButton/ToolbarButton'

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
    >
      <Dropdown>
        <DropdownItem text="Action 1" />
        <DropdownItem text="Action 2" />
        <DropdownItem text="Action 3" />
      </Dropdown>
    </ToolbarButton>
    <ToolbarButton
      text="Button 3"
    />
  </>
)

const resolveElementChildren = (
  element: React.ReactNode
): React.ReactNode => (
  resolveUXPinElementChildren(element) ??
  (
    React.isValidElement(element) && typeof element.type === 'function'
      ? (element.type as ToolbarLeftItemsComponent).defaultProps?.children
      : undefined
  )
)

const hasToolbarLeftItemsIdentity = (
  node: React.ReactNode
): boolean => getUXPinElementPropSources(node).some((props) => (
  props.name === 'ToolbarLeftItems' ||
  (typeof props.uxpId === 'string' && props.uxpId.includes('toolbar-left-items')) ||
  (typeof props.id === 'string' && props.id.includes('toolbar-left-items')) ||
  (typeof props.presetElementId === 'string' && props.presetElementId.includes('toolbar-left-items')) ||
  (typeof props.uxpinPresetElementId === 'string' && props.uxpinPresetElementId.includes('toolbar-left-items'))
))

export const isUXPinToolbarLeftItemsElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as ToolbarLeftItemsComponent)?.uxpinRole === TOOLBAR_LEFT_ITEMS_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'ToolbarLeftItems' ||
      (node.type as { name?: string })?.name === 'ToolbarLeftItems'
    )
  ) ||
  hasToolbarLeftItemsIdentity(node)
)

export const resolveToolbarLeftItemsChildren = (
  children: React.ReactNode
): React.ReactNode[] => {
  const elements: React.ReactNode[] = []

  getUXPinChildrenArray(children).forEach((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinToolbarLeftItemsElement(child)) {
      elements.push(child)
      return
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    if (nestedChildren) {
      elements.push(...resolveToolbarLeftItemsChildren(nestedChildren))
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
          <React.Fragment
            key={React.isValidElement(element) && element.key !== null
              ? element.key
              : `toolbar-left-items-${index + 1}`}
          >
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
