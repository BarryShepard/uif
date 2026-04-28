import React, { CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { MENU_COLLAPSED_WIDTH, MENU_EXPANDED_WIDTH } from '@src/menu/Menu'
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
const WRAPPER_BOUNDARY_SELECTOR = [
  '[data-hexa-uxpin-page-wrapper="true"]',
  '[data-hexa-uxpin-section-wrapper="true"]',
  '[data-hexa-uxpin-group-wrapper="true"]'
].join(', ')

const PreviewRoot = styled.div`
  display: flex;
  height: 100%;
  min-height: 100%;
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

const getDirectMergeComponent = (element: HTMLDivElement | null): HTMLDivElement | null => {
  const parentElement = element?.parentElement

  if (!parentElement || !parentElement.classList.contains('merge-component')) {
    return null
  }

  return parentElement as HTMLDivElement
}

const useSyncMenuFrameSize = (): React.RefObject<HTMLDivElement> => {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const rootElement = rootRef.current
    const mergeComponent = getDirectMergeComponent(rootElement)

    if (!rootElement || !mergeComponent) {
      return undefined
    }

    const wrapperBoundary = rootElement.parentElement?.closest(WRAPPER_BOUNDARY_SELECTOR)
    const isWithinWrapperShell = Boolean(wrapperBoundary)

    const previousHeight = mergeComponent.style.height
    const previousMinHeight = mergeComponent.style.minHeight
    const previousWidth = mergeComponent.style.width
    const previousMinWidth = mergeComponent.style.minWidth
    const previousMaxWidth = mergeComponent.style.maxWidth
    const previousFlex = mergeComponent.style.flex

    const syncFrameSize = (): void => {
      const { height, width } = rootElement.getBoundingClientRect()

      if (height > 0) {
        const nextHeight = `${Math.ceil(height)}px`
        mergeComponent.style.height = nextHeight
        mergeComponent.style.minHeight = nextHeight
      }

      if (width > 0 && !isWithinWrapperShell) {
        const nextWidth = `${Math.ceil(width)}px`
        mergeComponent.style.width = nextWidth
        mergeComponent.style.minWidth = nextWidth
        mergeComponent.style.maxWidth = nextWidth
        mergeComponent.style.flex = `0 0 ${nextWidth}`
      }
    }

    syncFrameSize()

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(syncFrameSize)
      : undefined

    resizeObserver?.observe(rootElement)
    window.addEventListener('resize', syncFrameSize)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncFrameSize)
      mergeComponent.style.height = previousHeight
      mergeComponent.style.minHeight = previousMinHeight
      mergeComponent.style.width = previousWidth
      mergeComponent.style.minWidth = previousMinWidth
      mergeComponent.style.maxWidth = previousMaxWidth
      mergeComponent.style.flex = previousFlex
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
  const rootRef = useSyncMenuFrameSize()
  const [currentMinimized, setCurrentMinimized] = useState(minimized)
  const resolvedMenuChildren = useMemo(() => resolveMenuChildren(children), [children])
  const derivedNavItems = useMemo(
    () => menuItemElementsToNavItems(resolvedMenuChildren),
    [resolvedMenuChildren]
  )
  const previewUserItems = useMemo(() => (
    footer ? withPreviewUserAvailabilityItems(storyNavUserItems) : undefined
  ), [footer])
  const resolvedFrameHeight = style?.height ?? '100vh'
  const menuWidth = currentMinimized ? MENU_COLLAPSED_WIDTH : MENU_EXPANDED_WIDTH

  useEffect(() => {
    setCurrentMinimized(minimized)
  }, [minimized])

  return (
    <PreviewRoot
      ref={rootRef}
      style={mergeFrameStyle({
        ...style,
        flex: `0 0 ${menuWidth}px`,
        maxWidth: menuWidth,
        minWidth: menuWidth,
        width: menuWidth,
        height: resolvedFrameHeight,
        minHeight: resolvedFrameHeight
      })}
    >
      <MenuPreviewShell
        applyAppTheme={true}
        beforeItems={EMPTY_ITEMS}
        collapsedWidth={MENU_COLLAPSED_WIDTH}
        favItems={EMPTY_ITEMS}
        minimized={currentMinimized}
        minimizerBottom={false}
        navItems={cloneNavItems(derivedNavItems)}
        navUserItems={previewUserItems}
        onMinimizedChange={setCurrentMinimized}
        showHeader={header}
        headerDescription={description}
        headerLogo={logo}
        headerTitle={title}
        style={mergeFrameStyle({
          flex: `0 0 ${menuWidth}px`,
          maxWidth: menuWidth,
          minWidth: menuWidth,
          width: menuWidth,
          height: '100%',
          minHeight: '100%'
        })}
        width={MENU_EXPANDED_WIDTH}
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
