import React, { CSSProperties } from 'react'

import { Toolbar as HexaToolbar } from '@src/toolbar'
import { ToolbarProps as OriginToolbarProps, ToolbarItems } from '@src/toolbar/types'

import { mergeFrameStyle } from '../../preview'
import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  resolveUXPinElementChildren,
  resolveUXPinMergedChildrenFromProps
} from '../../uxpinRuntime'
import { getVisibleUXPinChildrenArray, isUXPinHiddenElement } from '../../visibility'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import ToolbarLeftItems, {
  isUXPinToolbarLeftItemsElement
} from '../ToolbarLeftItems/ToolbarLeftItems'
import ToolbarRightItems, {
  isUXPinToolbarRightItemsElement
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
  overriddenCodeProps?: Partial<UXPinToolbarProps & LegacyUXPinToolbarProps>,
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
  codeComponentProps?: {
    children?: React.ReactNode
  },
  overriddenCodeProps?: {
    children?: React.ReactNode,
    codeComponentProps?: {
      children?: React.ReactNode
    }
  }
}

const resolveToolbarSectionChildren = (
  element: React.ReactNode
): React.ReactNode | undefined => {
  const props = getUXPinElementProps(element) as ToolbarSectionElementProps | undefined
  const defaultChildren = React.isValidElement(element) && typeof element.type === 'function'
    ? (element.type as { defaultProps?: Partial<ToolbarSectionElementProps> }).defaultProps?.children
    : undefined
  const resolvedChildren = resolveUXPinMergedChildrenFromProps(props, defaultChildren) ?? resolveUXPinElementChildren(element)

  if (resolvedChildren !== undefined) {
    return resolvedChildren
  }

  if (props) {
    const ownChildren = (
      props.overriddenCodeProps?.children ??
      props.overriddenCodeProps?.codeComponentProps?.children ??
      props.codeComponentProps?.children ??
      props.children
    )

    if (ownChildren !== undefined) {
      return ownChildren
    }
  }

  return React.isValidElement(element) && typeof element.type === 'function'
    ? defaultChildren
    : undefined
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
  overriddenCodeProps,
  ...props
}: ToolbarRuntimeProps): JSX.Element => {
  const {
    autoDropdown,
    children,
    left,
    leftItems,
    leftLimit,
    right,
    rightItems,
    search,
    style
  } = {
    ...props,
    ...(overriddenCodeProps || {})
  }
  const rootRef = useAutoHeightMergeFrame()
  const resolvedChildren = resolveUXPinMergedChildrenFromProps(
    { children, overriddenCodeProps },
    DEFAULT_TOOLBAR_CHILDREN
  ) ?? DEFAULT_TOOLBAR_CHILDREN
  const directChildren = getVisibleUXPinChildrenArray(resolvedChildren)
  const hasHiddenSearchElement = getUXPinChildrenArray(resolvedChildren).some((child) => (
    isUXPinToolbarSearchElement(child) &&
    isUXPinHiddenElement(child)
  ))
  const leftSectionElement = (
    directChildren.find(isUXPinToolbarLeftItemsElement) ??
    directChildren.find((child) => !isUXPinToolbarSearchElement(child) && !isUXPinToolbarRightItemsElement(child)) ??
    null
  )
  const rightSectionElement = (
    [...directChildren].reverse().find(isUXPinToolbarRightItemsElement) ??
    [...directChildren].reverse().find((child) => (
      !isUXPinToolbarSearchElement(child) && child !== leftSectionElement
    )) ??
    null
  )
  const legacyLeftItems = Array.isArray(left) && left.length ? left : undefined
  const legacyRightItems = Array.isArray(right) && right.length ? right : undefined
  const showLeftItems = leftItems ?? (!legacyLeftItems && !legacyRightItems ? true : Boolean(legacyLeftItems?.length))
  const showSearch = (search ?? false) && !hasHiddenSearchElement
  const showRightItems = rightItems ?? (!legacyLeftItems && !legacyRightItems ? true : Boolean(legacyRightItems?.length))

  let resolvedLeft: ToolbarItems[] | undefined

  if (legacyLeftItems) {
    resolvedLeft = showLeftItems ? legacyLeftItems : undefined
  } else if (showLeftItems) {
    const resolvedLeftButtons = resolveToolbarSectionItems(leftSectionElement, 'toolbar-left')

    resolvedLeft = resolvedLeftButtons.length
      ? resolvedLeftButtons
      : undefined
  }

  const resolvedRightItems: ToolbarItems[] = []

  if (showSearch) {
    const searchProps = resolveToolbarSearchChildProps(directChildren) ?? DEFAULT_TOOLBAR_SEARCH_PROPS
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
