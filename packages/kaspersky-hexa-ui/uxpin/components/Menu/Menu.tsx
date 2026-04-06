import React, { CSSProperties, useMemo } from 'react'
import styled from 'styled-components'

import { MenuPreviewShell, cloneNavItems, withPreviewUserAvailabilityItems } from '@src/menu/preview/MenuPreview'
import { navUserItems as storyNavUserItems } from '@src/menu/stories/menu-items'
import { NavItemData } from '@src/menu/types'

import {
  defaultMenuItemChildren,
  menuItemElementsToNavItems,
  resolveMenuItemChildren
} from '../MenuItem/MenuItem'
import { mergeFrameStyle } from '../../preview'

type UXPinMenuProps = {
  minimized?: boolean,
  header?: boolean,
  footer?: boolean,
  logo?: React.ReactNode,
  title?: string,
  description?: string,
  children?: React.ReactNode,
  style?: CSSProperties
}

const EMPTY_ITEMS: NavItemData[] = []

const PreviewRoot = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100%;
  align-self: stretch;
  background: transparent;
  box-sizing: border-box;

  > .ant-layout-sider {
    height: 100%;
    min-height: 100%;
  }
`

const resolveMenuChildren = (children?: React.ReactNode): React.ReactNode => {
  const menuItemChildren = resolveMenuItemChildren(children)

  if (!menuItemChildren.length) {
    return defaultMenuItemChildren
  }

  return menuItemChildren
}

const Menu = ({
  children,
  description = 'Kaspersky Next',
  footer = true,
  header = true,
  logo,
  minimized = false,
  style,
  title = 'Configuration Service'
}: UXPinMenuProps): JSX.Element => {
  const resolvedMenuChildren = useMemo(() => resolveMenuChildren(children), [children])
  const derivedNavItems = useMemo(
    () => menuItemElementsToNavItems(resolvedMenuChildren),
    [resolvedMenuChildren]
  )
  const previewUserItems = useMemo(() => (
    footer ? withPreviewUserAvailabilityItems(storyNavUserItems) : undefined
  ), [footer])
  const resolvedFrameHeight = style?.height ?? '100vh'

  return (
    <PreviewRoot style={mergeFrameStyle({
      minWidth: 280,
      width: '100%',
      height: resolvedFrameHeight,
      minHeight: resolvedFrameHeight,
      ...style
    })}>
      <MenuPreviewShell
        applyAppTheme={true}
        beforeItems={EMPTY_ITEMS}
        collapsedWidth={64}
        favItems={EMPTY_ITEMS}
        minimized={minimized}
        minimizerBottom={false}
        navItems={cloneNavItems(derivedNavItems)}
        navUserItems={previewUserItems}
        showHeader={header}
        headerDescription={description}
        headerLogo={logo}
        headerTitle={title}
        style={mergeFrameStyle({
          minWidth: 280,
          width: '100%',
          height: '100%',
          minHeight: '100%'
        })}
        width="100%"
      />
    </PreviewRoot>
  )
}

Menu.defaultProps = {
  minimized: false,
  header: true,
  footer: true,
  title: 'Configuration Service',
  description: 'Kaspersky Next'
}

Menu.displayName = 'Menu'

export default Menu
