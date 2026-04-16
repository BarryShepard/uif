import React from 'react'
import styled from 'styled-components'

import { Dropdown as HexaDropdown } from '@src/dropdown'
import {
  DropdownItemProps as HexaDropdownItemProps
} from '@src/dropdown/types'

import { Placeholder } from '@kaspersky/hexa-ui-icons/16'

import { FrameFill } from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import Button from '../Button/Button'

export type UXPinDropdownItemVariant = 'default' | 'buttons' | 'submenu'

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
  elementBeforeSlot?: React.ReactNode,
  /** Main item text. */
  text?: string,
  /** Shows secondary description. */
  description?: boolean,
  /** Secondary description text. */
  descriptionText?: string,
  /** Shows trailing content. */
  elementAfter?: boolean,
  /** Slot for trailing content. */
  elementAfterSlot?: React.ReactNode,
  /** Shows second trailing content slot. */
  elementAfter2?: boolean,
  /** Second trailing content slot. */
  elementAfterSlot2?: React.ReactNode,
  /** Nested DropdownItem nodes or action buttons. */
  children?: React.ReactNode,
  /** UXPin interaction hook for item click. */
  onClick?: HexaDropdownItemProps['onClick'],
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
  variant: 'default',
  disabled: false,
  selected: false,
  elementBefore: false,
  text: 'Dropdown item',
  description: false,
  descriptionText: 'Additional item description',
  elementAfter: false,
  elementAfter2: false
}

const hasDropdownItemShape = (props: Record<string, unknown> = {}): boolean => (
  'elementBefore' in props ||
  'elementBeforeSlot' in props ||
  'descriptionText' in props ||
  'elementAfter' in props ||
  'elementAfter2' in props ||
  'elementAfterSlot2' in props ||
  'selected' in props
)

const resolveDropdownItemRuntimeProps = (
  rawProps: UXPinDropdownItemProps = {}
): UXPinDropdownItemProps => ({
  ...DROPDOWN_ITEM_DEFAULT_PROPS,
  ...rawProps,
  ...(rawProps.overriddenCodeProps || {})
})

const resolveSlot = (
  enabled: boolean | undefined,
  slot: React.ReactNode
): React.ReactNode | undefined => (
  enabled ? slot ?? <Placeholder /> : undefined
)

const resolveDropdownItemKey = (
  element: React.ReactElement<UXPinDropdownItemProps>,
  prefix: string,
  index: number
): string => {
  if (typeof element.key === 'string' && element.key.length) {
    return element.key
  }

  return `${prefix}-${index + 1}`
}

const resolveDropdownItemChildren = (
  element: React.ReactElement<UXPinDropdownItemProps>,
  runtimeProps: UXPinDropdownItemProps
): React.ReactNode => (
  runtimeProps.overriddenCodeProps?.children ??
  runtimeProps.children ??
  element.props.overriddenCodeProps?.children ??
  element.props.children
)

export const isUXPinDropdownItemElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinDropdownItemProps> => (
  React.isValidElement(node) &&
  (
    (node.type as DropdownItemComponent)?.uxpinRole === DROPDOWN_ITEM_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'DropdownItem' ||
    (node.type as { name?: string })?.name === 'DropdownItem' ||
    hasDropdownItemShape((node.props as Record<string, unknown>) || {})
  )
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
  element: React.ReactElement<UXPinDropdownItemProps>,
  index: number,
  prefix: string
): DropdownOverlayBuildResult => {
  const runtimeProps = resolveDropdownItemRuntimeProps(element.props)
  const {
    description = false,
    descriptionText,
    disabled = false,
    elementBefore = false,
    elementBeforeSlot,
    onClick,
    selected = false,
    text = `Dropdown item ${index + 1}`,
    variant = 'default'
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

  const hasSubitems = nested.items.length > 0

  return {
    items: [{
      key,
      type: variant === 'submenu' || hasSubitems ? 'submenu' : undefined,
      title: text,
      children: hasSubitems ? nested.items : text,
      disabled,
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

  React.Children.forEach(children, (child, index) => {
    if (!child) {
      return
    }

    if (isUXPinDropdownItemElement(child)) {
      const itemResult = dropdownItemElementToOverlay(child, index, prefix)

      result.items.push(...itemResult.items)
      result.selectedKeys.push(...itemResult.selectedKeys)
      return
    }

    if (
      React.isValidElement<{ children?: React.ReactNode, overriddenCodeProps?: { children?: React.ReactNode } }>(child) &&
      (child.props.children || child.props.overriddenCodeProps?.children)
    ) {
      const nestedResult = dropdownChildrenToOverlay(
        child.props.overriddenCodeProps?.children ?? child.props.children,
        `${prefix}-${index + 1}`
      )

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
    variant = 'default'
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
            : (
                <HexaDropdown.MenuItem
                  key="preview"
                  disabled={disabled}
                  componentsBefore={componentsBefore ? [componentsBefore] : undefined}
                  componentsAfter={componentsAfter}
                  description={description ? descriptionText : undefined}
                >
                  {text}
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
