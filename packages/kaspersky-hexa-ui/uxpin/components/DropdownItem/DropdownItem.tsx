import React from 'react'
import styled from 'styled-components'

import { Dropdown as HexaDropdown } from '@src/dropdown'
import {
  DropdownItemProps as HexaDropdownItemProps
} from '@src/dropdown/types'

import Icons16Pack, { Placeholder } from '@kaspersky/hexa-ui-icons/16'

import { FrameFill } from '../../preview'
import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  getUXPinElementPropSources,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import Button from '../Button/Button'
import Link from '../Link/Link'
import Textbox from '../Textbox/Textbox'
import { isUXPinHiddenElement } from '../../visibility'

export type UXPinDropdownItemVariant =
  | 'buttons'
  | 'divider'
  | 'error'
  | 'headline'
  | 'input'
  | 'link'
  | 'loading'
  | 'slot'
  | 'stickyfooter'
  | 'stickyheader'
  | 'submenu'
  | 'text'

export type DropdownItemIconName = Exclude<keyof typeof Icons16Pack, 'default'>

export type UXPinDropdownItemProps = {
  /** Item presentation. Use buttons for a horizontal action row. */
  variant?: UXPinDropdownItemVariant,
  /** Disables item interactions. */
  disabled?: boolean,
  /** Marks item as selected in selectable dropdown variants. */
  selected?: boolean,
  /** Shows leading content. */
  elementBefore?: boolean,
  /** Slot for leading content. */
  elementBeforeSlot?: DropdownItemIconName | React.ReactNode,
  /** Main item text. */
  text?: string,
  /** Shows secondary description. */
  description?: boolean,
  /** Secondary description text. */
  descriptionText?: string,
  /** Shows trailing content. */
  elementAfter?: boolean,
  /** Slot for trailing content. */
  elementAfterSlot?: DropdownItemIconName | React.ReactNode,
  /** Shows second trailing content slot. */
  elementAfter2?: boolean,
  /** Second trailing content slot. */
  elementAfterSlot2?: DropdownItemIconName | React.ReactNode,
  /** Nested DropdownItem nodes or action buttons. */
  children?: React.ReactNode,
  /** UXPin interaction hook for item click. */
  onClick?: HexaDropdownItemProps['onClick'],
  codeComponentProps?: Partial<UXPinDropdownItemProps>,
  overriddenCodeProps?: Partial<UXPinDropdownItemProps>
}

export type DropdownOverlayBuildResult = {
  items: HexaDropdownItemProps[],
  selectedKeys: string[]
}

type DropdownItemComponent = React.FC<UXPinDropdownItemProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinDropdownItemProps>
}

const DROPDOWN_ITEM_ROLE = 'hexa-uxpin-dropdown-item'

export const DEFAULT_DROPDOWN_ACTION_CHILDREN = (
  <>
    <Button text="Apply" mode="primary" size="small" />
    <Button text="Cancel" mode="secondary" size="small" />
  </>
)

const DROPDOWN_ITEM_DEFAULT_PROPS: Partial<UXPinDropdownItemProps> = {
  variant: 'text',
  disabled: false,
  selected: false,
  elementBefore: false,
  text: 'Dropdown item',
  description: false,
  descriptionText: 'Additional item description',
  elementAfter: false,
  elementAfterSlot: 'Placeholder',
  elementAfter2: false,
  elementAfterSlot2: 'Placeholder'
}

const hasDropdownItemOwnShape = (props: Record<string, unknown> = {}): boolean => (
  'variant' in props ||
  'elementBefore' in props ||
  'elementBeforeSlot' in props ||
  'text' in props ||
  'description' in props ||
  'descriptionText' in props ||
  'elementAfter' in props ||
  'elementAfterSlot' in props ||
  'elementAfter2' in props ||
  'elementAfterSlot2' in props ||
  'selected' in props
)

export const resolveDropdownItemRuntimeProps = (
  rawProps: UXPinDropdownItemProps = {},
  defaults: Partial<UXPinDropdownItemProps> = {}
): UXPinDropdownItemProps => resolveUXPinRuntimeProps(rawProps, {
  ...DROPDOWN_ITEM_DEFAULT_PROPS,
  ...defaults
})

const getFirstStringProp = (
  node: React.ReactNode,
  propNames: string[]
): string | undefined => {
  for (const props of getUXPinElementPropSources(node)) {
    for (const propName of propNames) {
      const value = props[propName]

      if (typeof value === 'string' && value.length) {
        return value
      }
    }
  }

  return undefined
}

const isDropdownItemIdentity = (value?: string): boolean => {
  const normalizedValue = value?.toLowerCase()

  return Boolean(
    normalizedValue &&
    (
      normalizedValue.includes('dropdown-item') ||
      normalizedValue.includes('select-option') ||
      normalizedValue.includes('multi-select-option')
    )
  )
}

const getDropdownItemIdentity = (node: React.ReactNode): string | undefined => {
  const propNames = ['presetElementId', 'uxpinPresetElementId', 'uxpId', 'name', 'id']

  for (const props of getUXPinElementPropSources(node)) {
    for (const propName of propNames) {
      const value = props[propName]

      if (typeof value === 'string' && isDropdownItemIdentity(value)) {
        return value
      }
    }
  }

  return getFirstStringProp(node, propNames)
}

const getDropdownItemPresetIndex = (node: React.ReactNode): number | undefined => {
  const identity = getDropdownItemIdentity(node)
  const match = identity?.toLowerCase().match(/(?:dropdown-item|select-option|multi-select-option)-(\d+)/)
  const parsedIndex = match ? Number(match[1]) : undefined

  return parsedIndex && Number.isFinite(parsedIndex) ? parsedIndex : undefined
}

const getDropdownItemPresetDefaults = (
  node: React.ReactNode,
  index: number
): Partial<UXPinDropdownItemProps> => {
  const identity = getDropdownItemIdentity(node)?.toLowerCase()
  const presetIndex = getDropdownItemPresetIndex(node) ?? index + 1

  if (!identity || !isDropdownItemIdentity(identity)) {
    return {}
  }

  if (identity.includes('select-option') || identity.includes('multi-select-option')) {
    return {
      selected: presetIndex === 1,
      text: `Option ${presetIndex}`
    }
  }

  if (identity.includes('dropdown-item')) {
    return {
      description: presetIndex === 2,
      descriptionText: 'Additional description',
      elementBefore: presetIndex === 3,
      elementAfter: presetIndex === 3,
      selected: presetIndex === 1,
      text: `Option ${presetIndex}`
    }
  }

  return {}
}

export const resolveDropdownItemNodeRuntimeProps = (
  node: React.ReactNode,
  index = 0
): UXPinDropdownItemProps => (
  resolveDropdownItemRuntimeProps(
    (getUXPinElementProps(node) || {}) as UXPinDropdownItemProps,
    getDropdownItemPresetDefaults(node, index)
  )
)

const resolveNamedIcon = (iconName?: DropdownItemIconName | React.ReactNode): React.ReactNode => {
  if (!iconName) {
    return null
  }

  if (React.isValidElement(iconName)) {
    return iconName
  }

  if (typeof iconName !== 'string') {
    return iconName
  }

  const IconComponent = Icons16Pack[iconName as DropdownItemIconName]

  return IconComponent ? <IconComponent /> : null
}

const resolveSlot = (
  enabled: boolean | undefined,
  slot: DropdownItemIconName | React.ReactNode
): React.ReactNode | undefined => (
  enabled ? resolveNamedIcon(slot) ?? <Placeholder /> : undefined
)

const resolveDropdownItemKey = (
  element: React.ReactNode,
  prefix: string,
  index: number
): string => {
  if (React.isValidElement(element) && typeof element.key === 'string' && element.key.length) {
    return element.key
  }

  const explicitId = getFirstStringProp(element, ['id', 'uxpId'])

  if (explicitId) {
    return explicitId
  }

  const presetId = getFirstStringProp(element, ['presetElementId', 'uxpinPresetElementId'])

  if (presetId) {
    return `${prefix}-${presetId}-${index + 1}`
  }

  return `${prefix}-${index + 1}`
}

const resolveDropdownItemChildren = (
  element: React.ReactNode,
  runtimeProps: UXPinDropdownItemProps
): React.ReactNode => (
  resolveUXPinElementChildren(element) ?? runtimeProps.children
)

export const isUXPinDropdownItemElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as DropdownItemComponent)?.uxpinRole === DROPDOWN_ITEM_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'DropdownItem' ||
      (node.type as { name?: string })?.name === 'DropdownItem'
    )
  ) ||
  isDropdownItemIdentity(getDropdownItemIdentity(node)) ||
  getUXPinElementPropSources(node).some(hasDropdownItemOwnShape)
)

const buildDropdownItemComponentsAfter = ({
  elementAfter,
  elementAfter2,
  elementAfterSlot,
  elementAfterSlot2
}: UXPinDropdownItemProps): React.ReactNode[] | undefined => {
  const componentsAfter = [
    resolveSlot(elementAfter, elementAfterSlot),
    resolveSlot(elementAfter2, elementAfterSlot2)
  ].filter(Boolean) as React.ReactNode[]

  return componentsAfter.length ? componentsAfter : undefined
}

export const dropdownItemElementToOverlay = (
  element: React.ReactNode,
  index: number,
  prefix: string
): DropdownOverlayBuildResult => {
  const runtimeProps = resolveDropdownItemNodeRuntimeProps(element, index)
  const {
    description = false,
    descriptionText,
    disabled = false,
    elementBefore = false,
    elementBeforeSlot,
    onClick,
    selected = false,
    text = `Dropdown item ${index + 1}`,
    variant = 'text'
  } = runtimeProps
  const key = resolveDropdownItemKey(element, prefix, index)
  const children = resolveDropdownItemChildren(element, runtimeProps)
  const nested = dropdownChildrenToOverlay(children, `${key}-child`)
  const componentsBefore = resolveSlot(elementBefore, elementBeforeSlot)
  const componentsAfter = buildDropdownItemComponentsAfter(runtimeProps)

  if (variant === 'buttons') {
    return {
      items: [{
        type: 'innerActions',
        key,
        children: (
          <DropdownItemActions>
            {children ?? DEFAULT_DROPDOWN_ACTION_CHILDREN}
          </DropdownItemActions>
        )
      }],
      selectedKeys: []
    }
  }

  if (variant === 'divider') {
    return {
      items: [{
        type: 'divider',
        key,
        children: ''
      }],
      selectedKeys: []
    }
  }

  const hasSubitems = nested.items.length > 0
  const itemChildren = variant === 'input'
    ? <Textbox placeholder placeholderText="Input value" />
    : variant === 'link'
      ? <Link text={text} />
      : variant === 'slot'
        ? children ?? text
        : variant === 'loading'
          ? 'Loading...'
          : text

  return {
    items: [{
      key,
      type: variant === 'submenu' || hasSubitems ? 'submenu' : undefined,
      title: text,
      children: hasSubitems ? nested.items : itemChildren,
      disabled: disabled || variant === 'loading' || variant === 'headline',
      className: [
        variant === 'error' ? 'hexa-uxpin-dropdown-item-error' : '',
        variant === 'headline' ? 'hexa-uxpin-dropdown-item-headline' : '',
        variant === 'stickyheader' ? 'hexa-uxpin-dropdown-item-sticky-header' : '',
        variant === 'stickyfooter' ? 'hexa-uxpin-dropdown-item-sticky-footer' : ''
      ].filter(Boolean).join(' ') || undefined,
      description: description ? descriptionText : undefined,
      componentsBefore: componentsBefore ? [componentsBefore] : undefined,
      componentsAfter,
      onClick
    }],
    selectedKeys: [
      ...(selected ? [key] : []),
      ...nested.selectedKeys
    ]
  }
}

export const dropdownChildrenToOverlay = (
  children: React.ReactNode,
  prefix = 'dropdown-item'
): DropdownOverlayBuildResult => {
  const result: DropdownOverlayBuildResult = {
    items: [],
    selectedKeys: []
  }

  getUXPinChildrenArray(children).forEach((child, index) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinDropdownItemElement(child)) {
      const itemResult = dropdownItemElementToOverlay(child, index, prefix)

      result.items.push(...itemResult.items)
      result.selectedKeys.push(...itemResult.selectedKeys)
      return
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    if (nestedChildren) {
      const nestedResult = dropdownChildrenToOverlay(nestedChildren, `${prefix}-${index + 1}`)

      result.items.push(...nestedResult.items)
      result.selectedKeys.push(...nestedResult.selectedKeys)
    }
  })

  return result
}

const DropdownItem = (props: UXPinDropdownItemProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const runtimeProps = resolveDropdownItemRuntimeProps(props)
  const {
    description = false,
    descriptionText,
    disabled = false,
    elementBefore = false,
    elementBeforeSlot,
    selected = false,
    text = 'Dropdown item',
    variant = 'text'
  } = runtimeProps
  const componentsBefore = resolveSlot(elementBefore, elementBeforeSlot)
  const componentsAfter = buildDropdownItemComponentsAfter(runtimeProps)

  return (
    <div ref={rootRef} style={{ width: '100%' }}>
      <FrameFill style={{ height: 'fit-content' }}>
        <HexaDropdown.Menu selectedKeys={selected ? ['preview'] : []}>
          {variant === 'buttons'
            ? (
                <HexaDropdown.InnerActions>
                  <DropdownItemActions>
                    {runtimeProps.children ?? DEFAULT_DROPDOWN_ACTION_CHILDREN}
                  </DropdownItemActions>
                </HexaDropdown.InnerActions>
              )
            : variant === 'divider'
              ? <HexaDropdown.MenuDivider />
            : (
                <HexaDropdown.MenuItem
                  key="preview"
                  disabled={disabled || variant === 'loading' || variant === 'headline'}
                  className={[
                    variant === 'error' ? 'hexa-uxpin-dropdown-item-error' : '',
                    variant === 'headline' ? 'hexa-uxpin-dropdown-item-headline' : '',
                    variant === 'stickyheader' ? 'hexa-uxpin-dropdown-item-sticky-header' : '',
                    variant === 'stickyfooter' ? 'hexa-uxpin-dropdown-item-sticky-footer' : ''
                  ].filter(Boolean).join(' ') || undefined}
                  componentsBefore={componentsBefore ? [componentsBefore] : undefined}
                  componentsAfter={componentsAfter}
                  description={description ? descriptionText : undefined}
                >
                  {variant === 'input'
                    ? <Textbox placeholder placeholderText="Input value" />
                    : variant === 'link'
                      ? <Link text={text} />
                      : variant === 'slot'
                        ? runtimeProps.children ?? text
                        : variant === 'loading'
                          ? 'Loading...'
                          : text}
                </HexaDropdown.MenuItem>
              )}
        </HexaDropdown.Menu>
      </FrameFill>
    </div>
  )
}

DropdownItem.uxpinRole = DROPDOWN_ITEM_ROLE
DropdownItem.displayName = 'DropdownItem'
DropdownItem.defaultProps = DROPDOWN_ITEM_DEFAULT_PROPS

export default DropdownItem as DropdownItemComponent

const DropdownItemActions = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  > * {
    width: auto !important;
    min-width: 0;
    flex: 0 0 auto;
  }
`
