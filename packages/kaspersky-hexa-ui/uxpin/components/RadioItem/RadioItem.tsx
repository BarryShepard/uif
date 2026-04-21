import React from 'react'

import {
  getUXPinPropSources,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'

export type UXPinRadioItemProps = {
  /** Marks radio item as selected. */
  selected?: boolean,
  /** Radio label text. */
  text?: string,
  /** Radio value. */
  value?: string,
  /** Disables the item. */
  disabled?: boolean,
  /** Makes the item readonly. */
  readonly?: boolean,
  codeComponentProps?: Partial<UXPinRadioItemProps>,
  overriddenCodeProps?: Partial<UXPinRadioItemProps>
}

type RadioItemComponent = React.FC<UXPinRadioItemProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinRadioItemProps>
}

const RADIO_ITEM_ROLE = 'hexa-uxpin-radio-item'

const hasRadioItemShape = (props: Record<string, unknown> = {}): boolean => (
  'selected' in props &&
  'text' in props &&
  'value' in props
)

export const isUXPinRadioItemElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinRadioItemProps> => (
  React.isValidElement(node) &&
  (
    (node.type as RadioItemComponent)?.uxpinRole === RADIO_ITEM_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'RadioItem' ||
    (node.type as { name?: string })?.name === 'RadioItem' ||
    getUXPinPropSources(node.props).some(hasRadioItemShape)
  )
)

export const resolveRadioItemRuntimeProps = (
  rawProps: UXPinRadioItemProps = {}
): UXPinRadioItemProps => resolveUXPinRuntimeProps(rawProps, RadioItem.defaultProps)

const RadioItem: RadioItemComponent = (_props: UXPinRadioItemProps): JSX.Element => null as unknown as JSX.Element

RadioItem.uxpinRole = RADIO_ITEM_ROLE
RadioItem.displayName = 'RadioItem'
RadioItem.defaultProps = {
  selected: false,
  text: 'Radio option',
  value: 'radio-option'
}

export default RadioItem
