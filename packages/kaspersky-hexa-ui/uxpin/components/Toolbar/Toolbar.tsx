import React, { CSSProperties } from 'react'

import { Toolbar as HexaToolbar } from '@src/toolbar'
import { ToolbarProps as OriginToolbarProps, ToolbarItems } from '@src/toolbar/types'

import { mergeFrameStyle } from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import ToolbarLeftItems, {
  resolveToolbarLeftItemsChildren
} from '../ToolbarLeftItems/ToolbarLeftItems'
import ToolbarRightItems, {
  resolveToolbarRightItemsChildren
} from '../ToolbarRightItems/ToolbarRightItems'
import ToolbarSearch, {
  DEFAULT_TOOLBAR_SEARCH_PROPS,
  isUXPinToolbarSearchElement,
  resolveToolbarSearchChildProps
} from '../ToolbarSearch/ToolbarSearch'
import { toolbarChildrenToItems } from '../ToolbarButton/ToolbarButton'

export type UXPinToolbarProps = {
  /** Shows the left section with action items. */
  leftItems?: boolean,
  /** Shows the search field in the right section. */
  search?: boolean,
  /** Shows the right section with action items. */
  rightItems?: boolean,
  children?: React.ReactNode,
  style?: CSSProperties
}

type LegacyUXPinToolbarProps = Pick<OriginToolbarProps, 'autoDropdown' | 'left' | 'leftLimit' | 'right'>

type ToolbarRuntimeProps = UXPinToolbarProps & LegacyUXPinToolbarProps

const DEFAULT_TOOLBAR_CHILDREN = (
  <>
    <ToolbarLeftItems />
    <ToolbarSearch />
    <ToolbarRightItems />
  </>
)

type ToolbarSectionElementProps = {
  children?: React.ReactNode,
  overriddenCodeProps?: {
    children?: React.ReactNode
  }
}

const resolveToolbarSectionChildren = (
  element: React.ReactNode
): React.ReactNode | undefined => {
  if (!React.isValidElement<ToolbarSectionElementProps>(element)) {
    return undefined
  }

  return (
    element.props.overriddenCodeProps?.children ??
    element.props.children ??
    (typeof element.type === 'function'
      ? (element.type as { defaultProps?: Partial<ToolbarSectionElementProps> }).defaultProps?.children
      : undefined)
  )
}

const resolveToolbarSectionItems = (
  element: React.ReactNode,
  prefix: string
): ToolbarItems[] => {
  const sectionChildren = resolveToolbarSectionChildren(element)

  if (sectionChildren) {
    return toolbarChildrenToItems(sectionChildren, prefix)
  }

  return toolbarChildrenToItems(element, prefix)
}

const Toolbar = ({
  autoDropdown,
  children,
  left,
  leftItems,
  leftLimit,
  right,
  rightItems,
  search,
  style
}: ToolbarRuntimeProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const resolvedChildren = children ?? DEFAULT_TOOLBAR_CHILDREN
  const directChildren = React.Children.toArray(resolvedChildren).filter(React.isValidElement)
  const leftSectionElement = directChildren.find((child) => !isUXPinToolbarSearchElement(child)) ?? null
  const rightSectionElement = [...directChildren].reverse().find((child) => (
    !isUXPinToolbarSearchElement(child) && child !== leftSectionElement
  )) ?? null
  const legacyLeftItems = Array.isArray(left) && left.length ? left : undefined
  const legacyRightItems = Array.isArray(right) && right.length ? right : undefined
  const showLeftItems = leftItems ?? (!legacyLeftItems && !legacyRightItems ? true : Boolean(legacyLeftItems?.length))
  const showSearch = search ?? false
  const showRightItems = rightItems ?? (!legacyLeftItems && !legacyRightItems ? true : Boolean(legacyRightItems?.length))

  let resolvedLeft: ToolbarItems[] | undefined

  if (legacyLeftItems) {
    resolvedLeft = showLeftItems ? legacyLeftItems : undefined
  } else if (showLeftItems) {
    const resolvedLeftButtons = resolveToolbarSectionItems(leftSectionElement, 'toolbar-left')

    resolvedLeft = resolvedLeftButtons.length
      ? resolvedLeftButtons
      : resolveToolbarLeftItemsChildren(resolvedChildren).map((element, index) => ({
        type: 'children' as const,
        key: typeof element.key === 'string' && element.key.length
          ? element.key
          : `toolbar-left-section-${index + 1}`,
        children: (
          <div style={{ display: 'flex', minWidth: 0, width: '100%', flex: '1 1 auto' }}>
            {element}
          </div>
        )
      }))
  }

  const resolvedRightItems: ToolbarItems[] = []

  if (showSearch) {
    const searchProps = resolveToolbarSearchChildProps(resolvedChildren) ?? DEFAULT_TOOLBAR_SEARCH_PROPS
    resolvedRightItems.push({
      type: 'children',
      key: 'toolbar-search',
      children: <ToolbarSearch {...searchProps} />
    })
  }

  if (legacyRightItems) {
    if (showRightItems) {
      resolvedRightItems.push(...legacyRightItems)
    }
  } else if (showRightItems) {
    const resolvedRightButtons = resolveToolbarSectionItems(rightSectionElement, 'toolbar-right')

    if (resolvedRightButtons.length) {
      resolvedRightItems.push(...resolvedRightButtons)
    } else {
      resolvedRightItems.push(...resolveToolbarRightItemsChildren(resolvedChildren).map((element, index) => ({
        type: 'children' as const,
        key: typeof element.key === 'string' && element.key.length
          ? element.key
          : `toolbar-right-section-${index + 1}`,
        children: (
          <div style={{ display: 'flex', width: 'max-content', minWidth: 0 }}>
            {element}
          </div>
        )
      })))
    }
  }

  const resolvedRight = resolvedRightItems.length
    ? resolvedRightItems
    : undefined

  const resolvedStyleRight = resolvedLeft?.length
    ? undefined
    : { marginLeft: 'auto' }

  return (
    <div ref={rootRef} style={mergeFrameStyle(style)} data-hexa-uxpin-toolbar-root="true">
      <HexaToolbar
        autoDropdown={autoDropdown ?? true}
        left={resolvedLeft}
        leftLimit={leftLimit}
        right={resolvedRight}
        styleRight={resolvedStyleRight}
      />
    </div>
  )
}

Toolbar.displayName = 'Toolbar'

export default Toolbar
