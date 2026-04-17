import React, { CSSProperties, useLayoutEffect, useMemo, useRef } from 'react'
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

export type UXPinMenuProps = {
  /** Collapses the menu to icon-only mode. */
  minimized?: boolean,
  /** Shows the menu header with logo, title, and description. */
  header?: boolean,
  /** Shows the footer user/settings area. */
  footer?: boolean,
  /** Slot for the header logo. */
  logo?: React.ReactNode,
  /** Header title text. */
  title?: string,
  /** Header subtitle text. */
  description?: string,
  /** MenuItem children shown in the navigation tree. */
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

const useSyncMenuFrameHeight = (): React.RefObject<HTMLDivElement> => {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const rootElement = rootRef.current
    const mergeComponent = rootElement?.closest('.merge-component') as HTMLDivElement | null

    if (!rootElement || !mergeComponent) {
      return undefined
    }

    const previousHeight = mergeComponent.style.height
    const previousMinHeight = mergeComponent.style.minHeight

    const syncFrameHeight = (): void => {
      const measuredHeight = rootElement.getBoundingClientRect().height

      if (measuredHeight > 0) {
        const nextHeight = `${Math.ceil(measuredHeight)}px`
        mergeComponent.style.height = nextHeight
        mergeComponent.style.minHeight = nextHeight
      }
    }

    syncFrameHeight()

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(syncFrameHeight)
      : undefined

    resizeObserver?.observe(rootElement)
    window.addEventListener('resize', syncFrameHeight)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncFrameHeight)
      mergeComponent.style.height = previousHeight
      mergeComponent.style.minHeight = previousMinHeight
    }
  }, [])

  return rootRef
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
  const rootRef = useSyncMenuFrameHeight()
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
    <PreviewRoot
      ref={rootRef}
      style={mergeFrameStyle({
        minWidth: 280,
        width: '100%',
        height: resolvedFrameHeight,
        minHeight: resolvedFrameHeight,
        ...style
      })}
    >
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
  description: 'Kaspersky Next',
  children: defaultMenuItemChildren
}

Menu.displayName = 'Menu'

export default Menu
