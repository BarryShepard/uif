import React, { CSSProperties, useLayoutEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { Submenu as HexaSubmenu } from '@src/submenu'
import { RowProps, SubmenuItemProps as HexaSubmenuItemProps } from '@src/submenu/types'

import { mergeFrameStyle } from '../../preview'
import {
  getUXPinPropSources,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import {
  defaultSubmenuItemChildren,
  hasUXPinSubmenuItemChildren,
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
  /** Slot above the submenu items. */
  topSlot?: React.ReactNode,
  /** Slot below the submenu items. */
  bottomSlot?: React.ReactNode,
  /** SubmenuItem children. Non-item children render as a content area. */
  children?: React.ReactNode,
  style?: CSSProperties
}

type UXPinSubmenuRuntimeProps = UXPinSubmenuProps & {
  overriddenCodeProps?: Partial<UXPinSubmenuProps>,
  withinSidebar?: boolean
}

type SubmenuComponent = React.FC<UXPinSubmenuProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinSubmenuProps>
}

const SUBMENU_ROLE = 'hexa-uxpin-submenu'

const hasSubmenuOwnShape = (props: Record<string, unknown> = {}): boolean => (
  'defaultActiveKey' in props ||
  'draggable' in props ||
  'truncateText' in props ||
  'topSlot' in props ||
  'bottomSlot' in props ||
  // Legacy prop names help recognize older UXPin instances after component API cleanup.
  'elementBefore' in props ||
  'elementAfter' in props ||
  'collapseOnTextClick' in props
)

const hasSubmenuShape = (props: Record<string, unknown> = {}): boolean => {
  return (
    hasSubmenuOwnShape(props) ||
    hasUXPinSubmenuItemChildren(resolveUXPinChildrenFromProps(props)) ||
    getUXPinPropSources(props).some((source) => source !== props && hasSubmenuShape(source))
  )
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

const DEFAULT_SUBMENU_FRAME_HEIGHT = '100vh'
const DEFAULT_SUBMENU_MIN_WIDTH = 232

const getSubmenuFrameStyle = (
  style: CSSProperties | undefined,
  frameHeight: CSSProperties['height']
): CSSProperties => mergeFrameStyle({
  ...style,
  width: 'fit-content',
  minWidth: DEFAULT_SUBMENU_MIN_WIDTH,
  maxWidth: 'fit-content',
  height: frameHeight,
  minHeight: frameHeight
})

const useSyncSubmenuFrameSize = (): React.RefObject<HTMLDivElement> => {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const rootElement = rootRef.current
    const mergeComponent = rootElement?.closest('.merge-component') as HTMLDivElement | null

    if (!rootElement || !mergeComponent || rootElement.closest('[data-hexa-uxpin-sidebar="true"]')) {
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
  return resolved
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

export const isUXPinSubmenuElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinSubmenuProps> => (
  React.isValidElement(node) &&
  (
    (node.type as SubmenuComponent)?.uxpinRole === SUBMENU_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'Submenu' ||
    (node.type as { name?: string })?.name === 'Submenu' ||
    getUXPinPropSources(node.props).some(hasSubmenuShape)
  )
)

const Submenu: SubmenuComponent = (rawProps: UXPinSubmenuProps): JSX.Element => {
  const resolvedProps = resolveUXPinRuntimeProps(rawProps as UXPinSubmenuRuntimeProps)
  const {
    bottomSlot,
    children,
    defaultActiveKey,
    draggable = false,
    style,
    topSlot,
    truncateText = true
  } = resolvedProps
  const { withinSidebar = false } = rawProps as UXPinSubmenuRuntimeProps
  const rootRef = useSyncSubmenuFrameSize()
  const resolvedChildren = children
  const resolvedFrameHeight = withinSidebar ? '100%' : style?.height ?? DEFAULT_SUBMENU_FRAME_HEIGHT
  const { items: resolvedItems, selectedKey } = useMemo(
    () => resolveSubmenuItems(resolvedChildren),
    [resolvedChildren]
  )
  const items = useMemo(
    () => applySubmenuItemSettings(resolvedItems, { draggable }),
    [resolvedItems, draggable]
  )
  const directContent = useMemo(
    () => getDirectContentChildren(resolvedChildren),
    [resolvedChildren]
  )

  return (
    <SubmenuRoot ref={rootRef} style={getSubmenuFrameStyle(style, resolvedFrameHeight)}>
      <HexaSubmenu
        defaultActiveKey={selectedKey ?? defaultActiveKey}
        elementAfter={bottomSlot}
        elementBefore={topSlot}
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

Submenu.uxpinRole = SUBMENU_ROLE
Submenu.displayName = 'Submenu'

Submenu.defaultProps = {
  draggable: false,
  truncateText: true
}

export { defaultSubmenuItemChildren }

export default Submenu
