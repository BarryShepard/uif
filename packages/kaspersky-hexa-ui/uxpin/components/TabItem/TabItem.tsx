import React from 'react'
import styled from 'styled-components'

import { Tabs as HexaTabs } from '@src/tabs'

import { FrameFill } from '../../preview'
import {
  getUXPinPropSources,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'

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

const resolveTabItemKey = (
  element: React.ReactElement<UXPinTabItemProps>,
  index: number
): string => {
  if (typeof element.key === 'string' && element.key.length) {
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

export const isUXPinTabItemElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinTabItemProps> => (
  React.isValidElement(node) &&
  (
    (node.type as TabItemComponent)?.uxpinRole === TAB_ITEM_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'TabItem' ||
    (node.type as { name?: string })?.name === 'TabItem' ||
    getUXPinPropSources(node.props).some(hasTabItemShape)
  )
)

const getTabItemChildren = (
  children: React.ReactNode
): Array<React.ReactElement<UXPinTabItemProps>> => {
  const items: Array<React.ReactElement<UXPinTabItemProps>> = []

  React.Children.forEach(children, (child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinTabItemElement(child)) {
      items.push(child)
      return
    }

    if (React.isValidElement(child)) {
      const nestedChildren = resolveUXPinElementChildren(child)

      if (nestedChildren) {
        items.push(...getTabItemChildren(nestedChildren))
      }
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
    const index = result.panes.length
    const runtimeProps = resolveTabItemRuntimeProps(child.props)
    const key = resolveTabItemKey(child, index)
    const {
      children: content,
      disabled = false,
      selected = false
    } = runtimeProps

    result.panes.push(
      <HexaTabs.TabPane
        disabled={disabled}
        key={key}
        tab={resolveTabItemLabel(runtimeProps)}
      >
        {content ?? <span />}
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
