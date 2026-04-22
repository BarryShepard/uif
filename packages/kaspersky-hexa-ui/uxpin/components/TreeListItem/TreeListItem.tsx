import React from 'react'

import { DataNode } from '@src/tree/types'

import Icons16Pack, { Folder } from '@kaspersky/hexa-ui-icons/16'

import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  getUXPinElementPropSources,
  hasUXPinChildrenProp,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../../visibility'

export type UXPinTreeListItemVariant = 'readonly' | 'multiplechoice' | 'singlechoice'
export type TreeListItemIconName = Exclude<keyof typeof Icons16Pack, 'default'>

export type UXPinTreeListItemProps = {
  /** UXPin preset element id. */
  uxpId?: string,
  /** Item behavior variant. */
  variant?: UXPinTreeListItemVariant,
  /** Disables the item. */
  disabled?: boolean,
  /** Marks item as selected. */
  selected?: boolean,
  /** Shows icon before text. */
  elementBefore?: boolean,
  /** Icon name before text. */
  elementBeforeSlot?: TreeListItemIconName | React.ReactNode,
  /** Item text. */
  text?: string,
  /** Stable item value. */
  value?: string,
  /** Nested TreeListItem children. */
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinTreeListItemProps>,
  overriddenCodeProps?: Partial<UXPinTreeListItemProps>
}

type TreeListItemComponent = React.FC<UXPinTreeListItemProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinTreeListItemProps>
}

export type TreeListItemBuildResult = {
  nodes: DataNode[],
  selectedKeys: string[],
  expandedKeys: string[]
}

const TREE_LIST_ITEM_ROLE = 'hexa-uxpin-tree-list-item'
const TREE_LIST_ITEM_PRESET_PARENT_KEYS = new Set(['tree-list-item', 'workspace', 'policies'])

const hasTreeListItemShape = (props: Record<string, unknown> = {}): boolean => (
  'value' in props ||
  'text' in props ||
  'disabled' in props ||
  'elementBeforeSlot' in props ||
  'selected' in props ||
  (
    'elementBefore' in props &&
    'variant' in props
  )
)

export const isUXPinTreeListItemElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as TreeListItemComponent)?.uxpinRole === TREE_LIST_ITEM_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'TreeListItem' ||
      (node.type as { name?: string })?.name === 'TreeListItem'
    )
  ) ||
  getUXPinElementPropSources(node).some((props) => (
    hasTreeListItemShape(props) ||
    props.name === 'TreeListItem' ||
    (
      typeof props.uxpId === 'string' &&
      props.uxpId.toLowerCase().includes('tree-list-item')
    ) ||
    (
      typeof props.presetElementId === 'string' &&
      props.presetElementId.toLowerCase().includes('tree-list-item')
    ) ||
    (
      typeof props.uxpinPresetElementId === 'string' &&
      props.uxpinPresetElementId.toLowerCase().includes('tree-list-item')
    )
  ))
)

export const resolveTreeListItemRuntimeProps = (
  rawProps: UXPinTreeListItemProps = {}
): UXPinTreeListItemProps => resolveUXPinRuntimeProps(rawProps, TreeListItem.defaultProps)

const getFirstStringProp = (
  node: React.ReactNode,
  propNames: string[]
): string | undefined => {
  for (const props of getUXPinElementPropSources(node)) {
    for (const propName of propNames) {
      const value = props[propName]

      if (typeof value === 'string' && value.length) {
        return value
      }
    }
  }

  return undefined
}

const resolveTreeListItemPresetDefaults = (
  node: React.ReactNode
): Partial<UXPinTreeListItemProps> => {
  const id = getFirstStringProp(node, ['uxpId', 'presetElementId', 'uxpinPresetElementId'])?.toLowerCase()

  if (!id) {
    return {}
  }

  if (id.includes('tree-list-item-1-2-1')) {
    return { text: 'Default policy', value: 'default-policy' }
  }

  if (id.includes('tree-list-item-1-2')) {
    return { text: 'Policies', value: 'policies' }
  }

  if (id.includes('tree-list-item-1-1')) {
    return { text: 'Devices', value: 'devices' }
  }

  if (id.includes('tree-list-item-1')) {
    return { text: 'Workspace', value: 'workspace', elementBefore: true, selected: true }
  }

  if (id.includes('tree-list-item-2')) {
    return { text: 'Shared', value: 'shared' }
  }

  return {}
}

const createTreeListItemPresetDescriptor = (
  presetElementId: string
): React.ReactNode => ({
  presetElementId,
  uxpinTargetElementType: 'CodeComponent'
} as unknown as React.ReactNode)

const resolveTreeListItemPresetChildren = (
  node: React.ReactNode
): React.ReactNode | undefined => {
  const id = getFirstStringProp(node, ['uxpId', 'presetElementId', 'uxpinPresetElementId'])?.toLowerCase()

  if (!id) {
    return undefined
  }

  switch (id) {
    case 'tree-list-item-1-2':
      return [
        createTreeListItemPresetDescriptor('tree-list-item-1-2-1')
      ]
    case 'tree-list-item-1':
      return [
        createTreeListItemPresetDescriptor('tree-list-item-1-1'),
        createTreeListItemPresetDescriptor('tree-list-item-1-2')
      ]
    default:
      return undefined
  }
}

const resolveTreeListItemChildren = (
  node: React.ReactNode
): React.ReactNode | undefined => {
  const props = getUXPinElementProps(node)

  if (hasUXPinChildrenProp(props)) {
    const children = resolveUXPinElementChildren(node)

    if (children !== undefined) {
      return children
    }
  }

  return resolveTreeListItemPresetChildren(node)
}

export const resolveTreeListItemNodeRuntimeProps = (
  node: React.ReactNode
): UXPinTreeListItemProps => (
  resolveUXPinRuntimeProps(
    (getUXPinElementProps(node) || {}) as UXPinTreeListItemProps,
    {
      ...TreeListItem.defaultProps,
      ...resolveTreeListItemPresetDefaults(node)
    }
  )
)

export const resolveTreeListItemIcon = (
  iconName?: TreeListItemIconName | React.ReactNode
): React.ReactNode => {
  if (!iconName) {
    return <Folder />
  }

  if (React.isValidElement(iconName)) {
    return iconName
  }

  if (typeof iconName !== 'string') {
    return iconName
  }

  const IconComponent = Icons16Pack[iconName as TreeListItemIconName]

  return IconComponent ? <IconComponent /> : <Folder />
}

const resolveTreeListItemKey = (
  node: React.ReactNode,
  prefix: string,
  index: number,
  props: UXPinTreeListItemProps
): string => {
  const explicitValue = getFirstStringProp(node, ['value'])

  if (explicitValue) {
    return explicitValue
  }

  const generatedId = getFirstStringProp(node, ['id'])

  if (generatedId) {
    return generatedId
  }

  if (React.isValidElement(node) && typeof node.key === 'string' && node.key.length) {
    return node.key
  }

  if (props.value) {
    return TREE_LIST_ITEM_PRESET_PARENT_KEYS.has(prefix) ? props.value : `${prefix}-${props.value}`
  }

  return getFirstStringProp(node, ['id', 'uxpId', 'presetElementId', 'uxpinPresetElementId']) ?? `${prefix}-${index + 1}`
}

const renderTitle = (
  text: string,
  elementBefore?: boolean,
  elementBeforeSlot?: TreeListItemIconName | React.ReactNode
): React.ReactNode => {
  if (!elementBefore) {
    return text
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      {resolveTreeListItemIcon(elementBeforeSlot)}
      <span>{text}</span>
    </span>
  )
}

const getTreeListItemChildren = (
  children: React.ReactNode
): React.ReactNode[] => (
  getUXPinChildrenArray(children).flatMap((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return []
    }

    if (isUXPinTreeListItemElement(child)) {
      return [child]
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    return nestedChildren ? getTreeListItemChildren(nestedChildren) : []
  })
)

const hasExplicitTreeListItemElementBefore = (
  node: React.ReactNode
): boolean => (
  getUXPinElementPropSources(node).some((props) => Object.prototype.hasOwnProperty.call(props, 'elementBefore'))
)

const resolveTreeListItemElementBefore = (
  node: React.ReactNode,
  props: UXPinTreeListItemProps,
  options: {
    elementBefore?: boolean,
    elementBeforeExplicit?: boolean
  }
): boolean => {
  if (options.elementBeforeExplicit && options.elementBefore === false) {
    return false
  }

  if (hasExplicitTreeListItemElementBefore(node)) {
    return Boolean(props.elementBefore)
  }

  if (options.elementBeforeExplicit) {
    return Boolean(options.elementBefore)
  }

  return Boolean(props.elementBefore)
}

export const treeListChildrenToData = (
  children: React.ReactNode,
  options: {
    elementBefore?: boolean,
    elementBeforeExplicit?: boolean,
    prefix?: string,
    variant?: UXPinTreeListItemVariant
  } = {}
): TreeListItemBuildResult => {
  const result: TreeListItemBuildResult = {
    expandedKeys: [],
    nodes: [],
    selectedKeys: []
  }

  getTreeListItemChildren(children).forEach((child, index) => {
    const props = resolveTreeListItemNodeRuntimeProps(child)
    const key = resolveTreeListItemKey(child, options.prefix ?? 'tree-list-item', index, props)
    const nested = treeListChildrenToData(resolveTreeListItemChildren(child), {
      elementBefore: options.elementBefore,
      elementBeforeExplicit: options.elementBeforeExplicit,
      prefix: key,
      variant: props.variant ?? options.variant
    })
    const hasChildren = nested.nodes.length > 0
    const elementBefore = resolveTreeListItemElementBefore(child, props, options)

    if (props.selected) {
      result.selectedKeys.push(key)
    }

    if (hasChildren) {
      result.expandedKeys.push(key)
    }

    result.nodes.push({
      checkable: props.variant === 'readonly' ? false : undefined,
      children: hasChildren ? nested.nodes : undefined,
      disabled: props.disabled,
      key,
      title: renderTitle(props.text ?? `Tree item ${index + 1}`, elementBefore, props.elementBeforeSlot)
    })
    result.selectedKeys.push(...nested.selectedKeys)
    result.expandedKeys.push(...nested.expandedKeys)
  })

  return result
}

const TreeListItem: TreeListItemComponent = (_props: UXPinTreeListItemProps): JSX.Element => (
  null as unknown as JSX.Element
)

TreeListItem.uxpinRole = TREE_LIST_ITEM_ROLE
TreeListItem.displayName = 'TreeListItem'
TreeListItem.defaultProps = {
  variant: 'multiplechoice',
  disabled: false,
  selected: false,
  elementBefore: false,
  elementBeforeSlot: 'Folder',
  text: 'Tree item'
}

export default TreeListItem
