import React from 'react'

import { Tabs as HexaTabs } from '@src/tabs'
import { TabsProps as HexaTabsProps } from '@src/tabs/types'

import { mergeFrameStyle } from '../../preview'
import {
  getUXPinPropSources,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import {
  hasUXPinTabItemChildren,
  tabChildrenToPanes
} from '../TabItem/TabItem'

export type UXPinTabsProps = HexaTabsProps & {
  overriddenCodeProps?: Partial<HexaTabsProps>,
  codeComponentProps?: Partial<HexaTabsProps>
}

type TabsComponent = React.FC<UXPinTabsProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinTabsProps>
}

const TABS_ROLE = 'hexa-uxpin-tabs'

const hasTabsShape = (props: Record<string, unknown> = {}): boolean => {
  const ownShape = (
    'defaultActiveKey' in props ||
    'activeKey' in props ||
    'tabPosition' in props ||
    'noMargin' in props ||
    'padding' in props
  )

  return (
    ownShape ||
    hasUXPinTabItemChildren(resolveUXPinChildrenFromProps(props)) ||
    getUXPinPropSources(props).some((source) => source !== props && hasTabsShape(source))
  )
}

export const isUXPinTabsElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinTabsProps> => (
  React.isValidElement(node) &&
  (
    (node.type as TabsComponent)?.uxpinRole === TABS_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'Tabs' ||
    (node.type as { name?: string })?.name === 'Tabs' ||
    getUXPinPropSources(node.props).some(hasTabsShape)
  )
)

const getPaneKey = (
  pane: React.ReactNode
): string | undefined => (
  React.isValidElement(pane) && pane.key !== null
    ? String(pane.key)
    : undefined
)

const Tabs: TabsComponent = (rawProps: UXPinTabsProps): JSX.Element => {
  const {
    activeKey,
    codeComponentProps: _codeComponentProps,
    children,
    defaultActiveKey,
    onChange,
    onTabClick,
    overriddenCodeProps: _overriddenCodeProps,
    style,
    ...runtimeProps
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedChildren = children
  const { panes, selectedKey, tabClickHandlers } = tabChildrenToPanes(resolvedChildren)
  const renderedChildren = panes.length ? panes : resolvedChildren ?? null
  const firstPaneKey = panes.length ? getPaneKey(panes[0]) : undefined
  const resolvedInitialActiveKey = activeKey ?? defaultActiveKey ?? selectedKey ?? firstPaneKey ?? '1'
  const [localActiveKey, setLocalActiveKey] = React.useState(resolvedInitialActiveKey)

  React.useEffect(() => {
    setLocalActiveKey(resolvedInitialActiveKey)
  }, [resolvedInitialActiveKey])

  const handleChange = async (nextActiveKey: string): Promise<void | boolean> => {
    const shouldContinue = await onChange?.(nextActiveKey)

    if (shouldContinue === false) {
      return false
    }

    if (activeKey === undefined) {
      setLocalActiveKey(nextActiveKey)
    }

    return shouldContinue
  }

  const handleTabClick: HexaTabsProps['onTabClick'] = (nextActiveKey, event) => {
    void tabClickHandlers[nextActiveKey]?.(nextActiveKey, event)
    onTabClick?.(nextActiveKey, event)
  }

  return (
    <HexaTabs
      {...runtimeProps}
      activeKey={activeKey ?? localActiveKey}
      onChange={handleChange}
      onTabClick={handleTabClick}
      style={mergeFrameStyle(style)}
    >
      {renderedChildren}
    </HexaTabs>
  )
}

Tabs.uxpinRole = TABS_ROLE
Tabs.displayName = 'Tabs'

export default Tabs
