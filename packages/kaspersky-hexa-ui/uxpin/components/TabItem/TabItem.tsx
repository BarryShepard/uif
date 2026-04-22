import React from 'react'
import styled from 'styled-components'

import { Tabs as HexaTabs } from '@src/tabs'

import { FrameFill } from '../../preview'
import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  getUXPinElementPropSources,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../../visibility'

export type UXPinTabItemProps = {
  /** Marks this tab as initially active in parent Tabs. */
  selected?: boolean,
  /** Disables the tab. */
  disabled?: boolean,
  /** Tab label text. */
  text?: string,
  /** Shows a small indicator next to the tab text. */
  indicator?: boolean,
  /** Tab content. */
  children?: React.ReactNode,
  overriddenCodeProps?: Partial<UXPinTabItemProps>
}

type TabItemComponent = React.FC<UXPinTabItemProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinTabItemProps>
}

export type TabItemsBuildResult = {
  panes: React.ReactNode[],
  selectedKey?: string
}

const TAB_ITEM_ROLE = 'hexa-uxpin-tab-item'

const TAB_ITEM_DEFAULT_PROPS: Partial<UXPinTabItemProps> = {
  selected: false,
  disabled: false,
  text: 'Tab',
  indicator: false
}

const TabItemPreviewRoot = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 8px;
  color: var(--tabs--unselected--enabled--color, #1d1e20);
  box-sizing: border-box;

  &.selected {
    color: var(--tabs--selected--enabled--color, #1d84ff);
  }

  &.disabled {
    color: var(--text-icons-elements--disabled, #a8adba);
  }
`

const hasTabItemShape = (props: Record<string, unknown> = {}): boolean => (
  'selected' in props ||
  'disabled' in props ||
  'indicator' in props ||
  (
    'text' in props &&
    Object.keys(props).some((key) => key !== 'children')
  )
)

const resolveTabItemRuntimeProps = (
  rawProps: UXPinTabItemProps = {}
): UXPinTabItemProps => ({
  ...resolveUXPinRuntimeProps(rawProps, TAB_ITEM_DEFAULT_PROPS)
})

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

const resolveTabItemKey = (
  element: React.ReactNode,
  index: number
): string => {
  const explicitId = getFirstStringProp(element, ['id', 'uxpId'])

  if (explicitId) {
    return explicitId
  }

  const presetId = getFirstStringProp(element, ['presetElementId', 'uxpinPresetElementId'])

  if (presetId) {
    return `${presetId}-${index + 1}`
  }

  if (React.isValidElement(element) && typeof element.key === 'string' && element.key.length) {
    return element.key
  }

  return `tab-${index + 1}`
}

const resolveTabItemLabel = ({
  indicator,
  text
}: UXPinTabItemProps): React.ReactNode => (
  indicator
    ? <HexaTabs.TabPaneHead text={text ?? 'Tab'} indicator />
    : text ?? 'Tab'
)

const hasTabItemIdentity = (
  node: React.ReactNode
): boolean => (
  (
    React.isValidElement(node) &&
    typeof node.key === 'string' &&
    (
      node.key.toLowerCase().includes('tab-item') ||
      node.key.toLowerCase().includes('sidebar-tab')
    )
  ) ||
  getUXPinElementPropSources(node).some((props) => (
    (typeof props.uxpId === 'string' && (
      props.uxpId.toLowerCase().includes('tab-item') ||
      props.uxpId.toLowerCase().includes('sidebar-tab')
    )) ||
    (typeof props.id === 'string' && (
      props.id.toLowerCase().includes('tab-item') ||
      props.id.toLowerCase().includes('sidebar-tab')
    )) ||
    (typeof props.presetElementId === 'string' && (
      props.presetElementId.toLowerCase().includes('tab-item') ||
      props.presetElementId.toLowerCase().includes('sidebar-tab')
    )) ||
    (typeof props.uxpinPresetElementId === 'string' && (
      props.uxpinPresetElementId.toLowerCase().includes('tab-item') ||
      props.uxpinPresetElementId.toLowerCase().includes('sidebar-tab')
    )) ||
    props.name === 'TabItem'
  ))
)

export const isUXPinTabItemElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as TabItemComponent)?.uxpinRole === TAB_ITEM_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'TabItem' ||
      (node.type as { name?: string })?.name === 'TabItem'
    )
  ) ||
  hasTabItemIdentity(node) ||
  getUXPinElementPropSources(node).some(hasTabItemShape)
)

const getTabItemChildren = (
  children: React.ReactNode
): React.ReactNode[] => {
  const items: React.ReactNode[] = []

  getUXPinChildrenArray(children).forEach((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinTabItemElement(child)) {
      items.push(child)
      return
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    if (nestedChildren) {
      items.push(...getTabItemChildren(nestedChildren))
    }
  })

  return items
}

export const hasUXPinTabItemChildren = (children: React.ReactNode): boolean => (
  getTabItemChildren(children).length > 0
)

export const tabChildrenToPanes = (
  children: React.ReactNode
): TabItemsBuildResult => {
  const result: TabItemsBuildResult = {
    panes: []
  }

  getTabItemChildren(children).forEach((child) => {
    const childProps = getUXPinElementProps(child) as UXPinTabItemProps | undefined

    if (!childProps) {
      return
    }

    const index = result.panes.length
    const runtimeProps = resolveTabItemRuntimeProps(childProps)
    const key = resolveTabItemKey(child, index)
    const {
      disabled = false,
      children: content,
      selected = false
    } = runtimeProps

    result.panes.push(
      <HexaTabs.TabPane
        disabled={disabled}
        key={key}
        tab={resolveTabItemLabel(runtimeProps)}
      >
        {content ?? resolveUXPinElementChildren(child) ?? <span />}
      </HexaTabs.TabPane>
    )

    if (selected) {
      result.selectedKey = key
    }
  })

  return result
}

const TabItem = (rawProps: UXPinTabItemProps): JSX.Element => {
  const {
    disabled = false,
    selected = false,
    text = 'Tab'
  } = resolveTabItemRuntimeProps(rawProps)

  return (
    <FrameFill style={{ height: 'fit-content', width: 'fit-content' }}>
      <TabItemPreviewRoot className={[selected ? 'selected' : '', disabled ? 'disabled' : ''].filter(Boolean).join(' ')}>
        {text}
      </TabItemPreviewRoot>
    </FrameFill>
  )
}

TabItem.uxpinRole = TAB_ITEM_ROLE
TabItem.displayName = 'TabItem'
TabItem.defaultProps = TAB_ITEM_DEFAULT_PROPS

export const defaultTabItemChildren = (
  <>
    <TabItem text="Tab 1" selected />
    <TabItem text="Tab 2" />
    <TabItem text="Tab 3" />
  </>
)

export default TabItem
