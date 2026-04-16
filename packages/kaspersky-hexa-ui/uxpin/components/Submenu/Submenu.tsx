import React, { CSSProperties, useLayoutEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { Submenu as HexaSubmenu } from '@src/submenu'
import { RowProps, SubmenuItemProps as HexaSubmenuItemProps } from '@src/submenu/types'

import { mergeFrameStyle } from '../../preview'
import {
  defaultSubmenuItemChildren,
  isUXPinSubmenuItemElement,
  submenuChildrenToItems
} from '../SubmenuItem/SubmenuItem'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'

export type UXPinSubmenuProps = {
  /** Initial active item key. If a child SubmenuItem is selected, it wins over this value. */
  defaultActiveKey?: string,
  /** Shows drag handles on all submenu items. */
  draggable?: boolean,
  /** Truncates long item labels. */
  truncateText?: boolean,
  /** Collapses or expands nested items when clicking item text. */
  collapseOnTextClick?: boolean,
  /** Slot above the submenu items. */
  elementBefore?: React.ReactNode,
  /** Slot below the submenu items. */
  elementAfter?: React.ReactNode,
  /** SubmenuItem children. Non-item children render as a content area. */
  children?: React.ReactNode,
  style?: CSSProperties
}

const SubmenuRoot = styled.div`
  display: flex;
  width: fit-content;
  height: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;

  > .submenu-direct-content {
    flex: 1 1 auto;
    min-width: 0;
    overflow: auto;
    padding: 24px;
    box-sizing: border-box;
  }

  .submenu-direct-content:empty {
    display: none;
  }
`

const useSyncSubmenuFrameSize = (): React.RefObject<HTMLDivElement> => {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const rootElement = rootRef.current
    const mergeComponent = rootElement?.closest('.merge-component') as HTMLDivElement | null

    if (!rootElement || !mergeComponent) {
      return undefined
    }

    const previousHeight = mergeComponent.style.height
    const previousMinHeight = mergeComponent.style.minHeight
    const previousWidth = mergeComponent.style.width
    const previousMinWidth = mergeComponent.style.minWidth
    const previousMaxWidth = mergeComponent.style.maxWidth

    const syncFrameSize = (): void => {
      const { height, width } = rootElement.getBoundingClientRect()

      if (height > 0) {
        const nextHeight = `${Math.ceil(height)}px`
        mergeComponent.style.height = nextHeight
        mergeComponent.style.minHeight = nextHeight
      }

      if (width > 0) {
        const nextWidth = `${Math.ceil(width)}px`
        mergeComponent.style.width = nextWidth
        mergeComponent.style.minWidth = nextWidth
        mergeComponent.style.maxWidth = nextWidth
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
    }
  }, [])

  return rootRef
}

const resolveSubmenuItems = (children?: React.ReactNode): SubmenuItemsResolution => {
  const resolved = submenuChildrenToItems(children)

  if (resolved.items.length) {
    return resolved
  }

  return submenuChildrenToItems(defaultSubmenuItemChildren)
}

type SubmenuItemsResolution = {
  items: HexaSubmenuItemProps[],
  selectedKey?: string
}

const applySubmenuItemSettings = (
  items: HexaSubmenuItemProps[],
  options: { draggable: boolean }
): HexaSubmenuItemProps[] => items.map((item) => {
  if (item.type !== 'row') {
    return item
  }

  return {
    ...item,
    draggable: options.draggable,
    children: item.children
      ? applySubmenuItemSettings(item.children, options) as RowProps[]
      : undefined
  }
})

const getDirectContentChildren = (
  children: React.ReactNode
): React.ReactNode[] => (
  React.Children.toArray(children).filter((child) => (
    child &&
    !isUXPinHiddenElement(child) &&
    !isUXPinSubmenuItemElement(child)
  ))
)

const Submenu = ({
  children,
  collapseOnTextClick = true,
  defaultActiveKey,
  draggable = false,
  elementAfter,
  elementBefore,
  style,
  truncateText = true
}: UXPinSubmenuProps): JSX.Element => {
  const rootRef = useSyncSubmenuFrameSize()
  const resolvedChildren = children ?? defaultSubmenuItemChildren
  const resolvedFrameHeight = style?.height ?? '100vh'
  const { items: resolvedItems, selectedKey } = useMemo(
    () => resolveSubmenuItems(resolvedChildren),
    [resolvedChildren]
  )
  const items = useMemo(
    () => applySubmenuItemSettings(resolvedItems, { draggable }),
    [resolvedItems, draggable]
  )
  const directContent = useMemo(
    () => getDirectContentChildren(children),
    [children]
  )

  return (
    <SubmenuRoot ref={rootRef} style={mergeFrameStyle({
      ...style,
      width: 'fit-content',
      minWidth: 232,
      maxWidth: 'fit-content',
      height: resolvedFrameHeight,
      minHeight: resolvedFrameHeight
    })}>
      <HexaSubmenu
        collapseOnTextClick={collapseOnTextClick}
        defaultActiveKey={selectedKey ?? defaultActiveKey}
        elementAfter={elementAfter}
        elementBefore={elementBefore}
        items={items}
        truncateText={truncateText}
      />
      {directContent.length > 0 && (
        <div className="submenu-direct-content">
          {directContent}
        </div>
      )}
    </SubmenuRoot>
  )
}

Submenu.defaultProps = {
  children: defaultSubmenuItemChildren,
  collapseOnTextClick: true,
  draggable: false,
  truncateText: true
}

Submenu.displayName = 'Submenu'

export default Submenu
