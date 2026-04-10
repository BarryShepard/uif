import React, { useState } from 'react'

import { Toolbar as HexaToolbar } from '@src/toolbar'

import { FrameFill } from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

export type UXPinToolbarSearchVariant = 'default' | 'collapsible'

export type UXPinToolbarSearchProps = {
  /** Search presentation mode. */
  variant?: UXPinToolbarSearchVariant,
  /** Placeholder text inside the search field. */
  placeholderText?: string,
  overriddenCodeProps?: Partial<UXPinToolbarSearchProps>
}

type ToolbarSearchComponent = React.FC<UXPinToolbarSearchProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinToolbarSearchProps>
}

const TOOLBAR_SEARCH_ROLE = 'hexa-uxpin-toolbar-search'

export const DEFAULT_TOOLBAR_SEARCH_PROPS: Pick<UXPinToolbarSearchProps, 'variant' | 'placeholderText'> = {
  variant: 'default',
  placeholderText: 'Search'
}

const hasToolbarSearchOwnShape = (props: Record<string, unknown> = {}): boolean => (
  'variant' in props ||
  'placeholderText' in props
)

const hasToolbarSearchShape = (props: Record<string, unknown> = {}): boolean => {
  const overriddenCodeProps = props.overriddenCodeProps as Record<string, unknown> | undefined

  return hasToolbarSearchOwnShape(props) || hasToolbarSearchOwnShape(overriddenCodeProps || {})
}

export const isUXPinToolbarSearchElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinToolbarSearchProps> => (
  React.isValidElement(node) &&
  (
    (node.type as ToolbarSearchComponent)?.uxpinRole === TOOLBAR_SEARCH_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'ToolbarSearch' ||
    (node.type as { name?: string })?.name === 'ToolbarSearch' ||
    hasToolbarSearchShape((node.props as Record<string, unknown>) || {})
  )
)

export const resolveToolbarSearchChildren = (
  children: React.ReactNode
): Array<React.ReactElement<UXPinToolbarSearchProps>> => {
  const searchItems: Array<React.ReactElement<UXPinToolbarSearchProps>> = []

  React.Children.forEach(children, (child) => {
    if (!child) {
      return
    }

    if (isUXPinToolbarSearchElement(child)) {
      searchItems.push(child)
      return
    }

    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.props?.children
    ) {
      searchItems.push(...resolveToolbarSearchChildren(child.props.children))
    }
  })

  return searchItems
}

export const resolveToolbarSearchChildProps = (
  children: React.ReactNode
): UXPinToolbarSearchProps | undefined => {
  const [element] = resolveToolbarSearchChildren(children)

  if (!element) {
    return undefined
  }

  return {
    ...DEFAULT_TOOLBAR_SEARCH_PROPS,
    ...(element.props || {}),
    ...(element.props?.overriddenCodeProps || {})
  }
}

const ToolbarSearch: ToolbarSearchComponent = ({
  variant = 'default',
  placeholderText = 'Search'
}: UXPinToolbarSearchProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const [value, setValue] = useState('')
  const SearchComponent = variant === 'collapsible'
    ? HexaToolbar.CollapsibleSearch
    : HexaToolbar.Search

  return (
    <div ref={rootRef} style={{ width: 'max-content', minWidth: 0 }}>
      <FrameFill
        style={{
          height: 'fit-content',
          width: 'max-content',
          minWidth: 0
        }}
      >
        <SearchComponent
          value={value}
          placeholder={placeholderText}
          onChange={(nextValue) => setValue(String(nextValue ?? ''))}
          onClearClick={() => setValue('')}
        />
      </FrameFill>
    </div>
  )
}

ToolbarSearch.uxpinRole = TOOLBAR_SEARCH_ROLE
ToolbarSearch.displayName = 'ToolbarSearch'
ToolbarSearch.defaultProps = DEFAULT_TOOLBAR_SEARCH_PROPS

export default ToolbarSearch
