import cn from 'classnames'
import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { Button as HexaButton } from '@src/button'
import { Dropdown as HexaDropdown } from '@src/dropdown'
import dropdownStyles from '@src/dropdown/styles/Dropdown.module.scss'
import { DropdownItemProps as HexaDropdownItemProps } from '@src/dropdown/types'

import { mergeFrameStyle } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import DropdownItem, {
  dropdownChildrenToOverlay,
  DropdownOverlayBuildResult
} from '../DropdownItem/DropdownItem'

export type UXPinDropdownVariant =
  'single choice' |
  'multiple choice' |
  'tree single choice' |
  'tree multiple choice' |
  'with subitems'

export type UXPinDropdownProps = {
  /** Dropdown selection and nesting mode. */
  variant?: UXPinDropdownVariant,
  /** Max menu height in pixels. Overflow becomes scrollable. */
  maxHeight?: number,
  /** Sticky header slot. */
  stickyHeader?: React.ReactNode,
  /** Sticky footer slot. Defaults to Reset filter action. */
  stickyFooter?: React.ReactNode,
  /** DropdownItem children. */
  children?: React.ReactNode,
  overriddenCodeProps?: Partial<UXPinDropdownProps>,
  style?: CSSProperties
}

type DropdownComponent = React.FC<UXPinDropdownProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinDropdownProps>
}

export const DROPDOWN_ROLE = 'hexa-uxpin-dropdown'

export type DropdownNodeOverlayResult = DropdownOverlayBuildResult & {
  maxHeight?: number,
  variant?: UXPinDropdownVariant
}

const DEFAULT_DROPDOWN_CHILDREN = (
  <>
    <DropdownItem text="Option 1" selected />
    <DropdownItem text="Option 2" description descriptionText="Additional description" />
    <DropdownItem text="Option 3" elementBefore elementAfter />
  </>
)

const DEFAULT_STICKY_FOOTER = (
  <HexaButton mode="tertiary" size="small" text="Reset filter" />
)

const resolveDropdownRuntimeProps = (
  rawProps: UXPinDropdownProps = {}
): UXPinDropdownProps => resolveUXPinRuntimeProps(rawProps, Dropdown.defaultProps)

export const isUXPinDropdownElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinDropdownProps> => (
  React.isValidElement(node) &&
  (
    (node.type as DropdownComponent)?.uxpinRole === DROPDOWN_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'Dropdown' ||
    (node.type as { name?: string })?.name === 'Dropdown'
  )
)

const stringifyKey = (key: React.Key | null | undefined, fallback: string): string => (
  key === null || key === undefined ? fallback : String(key)
)

const isMultipleVariant = (variant: UXPinDropdownVariant): boolean => (
  variant === 'multiple choice' || variant === 'tree multiple choice'
)

const renderOverlayItem = (
  item: HexaDropdownItemProps,
  index: number
): React.ReactNode => {
  const key = stringifyKey(item.key, `dropdown-rendered-item-${index + 1}`)

  switch (item.type) {
    case 'submenu': {
      const nestedItems = Array.isArray(item.children) ? item.children : []

      return (
        <HexaDropdown.SubMenu
          key={key}
          className={item.className}
          disabled={item.disabled}
          title={item.title}
        >
          {nestedItems.map(renderOverlayItem)}
        </HexaDropdown.SubMenu>
      )
    }
    case 'divider':
      return <HexaDropdown.MenuDivider key={key} />
    case 'innerActions':
      return (
        <HexaDropdown.InnerActions key={key}>
          {item.children}
        </HexaDropdown.InnerActions>
      )
    default:
      return (
        <HexaDropdown.MenuItem
          key={key}
          className={item.className}
          disabled={item.disabled}
          componentsBefore={item.componentsBefore}
          componentsAfter={item.componentsAfter}
          description={item.description}
          onClick={item.onClick}
        >
          {item.children}
        </HexaDropdown.MenuItem>
      )
  }
}

const renderStickySlot = (
  key: string,
  slot: React.ReactNode,
  position: 'header' | 'footer'
): React.ReactNode => {
  if (!slot) {
    return null
  }

  return (
    <li
      key={key}
      className={position === 'header'
        ? dropdownStyles.dropdownItemStickyHeader
        : dropdownStyles.dropdownItemStickyFooter}
    >
      {slot}
    </li>
  )
}

const resolveDropdownOverlay = (
  children: React.ReactNode
): DropdownOverlayBuildResult => {
  const overlay = dropdownChildrenToOverlay(children, 'dropdown-item')

  if (overlay.items.length) {
    return overlay
  }

  return dropdownChildrenToOverlay(DEFAULT_DROPDOWN_CHILDREN, 'dropdown-item')
}

export const dropdownNodeToOverlay = (
  node: React.ReactNode
): DropdownNodeOverlayResult | undefined => {
  if (!isUXPinDropdownElement(node)) {
    return undefined
  }

  const runtimeProps = resolveDropdownRuntimeProps(node.props)
  const overlay = resolveDropdownOverlay(runtimeProps.children)

  return {
    ...overlay,
    maxHeight: runtimeProps.maxHeight,
    variant: runtimeProps.variant
  }
}

const Dropdown: DropdownComponent = (props: UXPinDropdownProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const runtimeProps = resolveDropdownRuntimeProps(props)
  const {
    children = DEFAULT_DROPDOWN_CHILDREN,
    maxHeight = 280,
    stickyFooter = DEFAULT_STICKY_FOOTER,
    stickyHeader,
    style,
    variant = 'single choice'
  } = runtimeProps
  const { items, selectedKeys } = React.useMemo(
    () => resolveDropdownOverlay(children),
    [children]
  )
  const selectedSignature = selectedKeys.join('|')
  const [activeSelectedKeys, setActiveSelectedKeys] = React.useState<string[]>(selectedKeys)
  const multiple = isMultipleVariant(variant)

  React.useEffect(() => {
    setActiveSelectedKeys(selectedKeys)
  }, [selectedSignature])

  const handleSelect = ({ key }: { key: React.Key }): void => {
    const selectedKey = String(key)

    setActiveSelectedKeys((current) => (
      multiple
        ? Array.from(new Set([...current, selectedKey]))
        : [selectedKey]
    ))
  }

  const handleDeselect = ({ key }: { key: React.Key }): void => {
    const deselectedKey = String(key)

    setActiveSelectedKeys((current) => current.filter((itemKey) => itemKey !== deselectedKey))
  }

  return (
    <DropdownFrame
      ref={rootRef}
      style={mergeFrameStyle({
        height: 'fit-content',
        ...style
      })}
      data-hexa-uxpin-dropdown-root="true"
    >
      <DropdownSurface
        className={cn(dropdownStyles.dropdownOverlay, 'ant-dropdown')}
        $maxHeight={maxHeight}
      >
        <HexaDropdown.Menu
          multiple={multiple}
          onDeselect={multiple ? handleDeselect : undefined}
          onSelect={handleSelect}
          selectedKeys={activeSelectedKeys}
          triggerSubMenuAction="click"
        >
          {renderStickySlot('dropdown-sticky-header', stickyHeader, 'header')}
          {items.map(renderOverlayItem)}
          {renderStickySlot('dropdown-sticky-footer', stickyFooter, 'footer')}
        </HexaDropdown.Menu>
      </DropdownSurface>
    </DropdownFrame>
  )
}

Dropdown.uxpinRole = DROPDOWN_ROLE
Dropdown.displayName = 'Dropdown'
Dropdown.defaultProps = {
  variant: 'single choice',
  maxHeight: 280,
  stickyFooter: DEFAULT_STICKY_FOOTER,
  children: DEFAULT_DROPDOWN_CHILDREN
}

export default Dropdown

const DropdownFrame = styled.div`
  min-width: 180px;
`

const DropdownSurface = styled.div<{ $maxHeight: number }>`
  position: relative;
  display: block;
  width: 100%;

  > .ant-dropdown-menu {
    width: 100%;
    max-height: ${({ $maxHeight }) => Math.max($maxHeight, 100)}px;
    overflow-y: auto;
  }
`
