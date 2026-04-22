import React from 'react'

import {
  getUXPinElementProps,
  getUXPinElementPropSources,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'

export type UXPinRadioItemProps = {
  /** UXPin preset element id. */
  uxpId?: string,
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
  'selected' in props ||
  'text' in props ||
  'value' in props
)

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

const resolveRadioItemPresetDefaults = (
  node: React.ReactNode
): Partial<UXPinRadioItemProps> => {
  const id = getFirstStringProp(node, ['uxpId', 'presetElementId', 'uxpinPresetElementId'])?.toLowerCase()
  const itemNumber = id?.match(/radio-group-item-(\d+)/)?.[1]

  if (!itemNumber) {
    return {}
  }

  return {
    selected: itemNumber === '1',
    text: `Option ${itemNumber}`,
    value: `option-${itemNumber}`
  }
}

const isRadioItemPresetElement = (
  props: Record<string, unknown>
): boolean => (
  (
    typeof props.uxpId === 'string' &&
    props.uxpId.toLowerCase().includes('radio-group-item')
  ) ||
  (
    typeof props.presetElementId === 'string' &&
    props.presetElementId.toLowerCase().includes('radio-group-item')
  ) ||
  (
    typeof props.uxpinPresetElementId === 'string' &&
    props.uxpinPresetElementId.toLowerCase().includes('radio-group-item')
  )
)

export const isUXPinRadioItemElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as RadioItemComponent)?.uxpinRole === RADIO_ITEM_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'RadioItem' ||
      (node.type as { name?: string })?.name === 'RadioItem'
    )
  ) ||
  getUXPinElementPropSources(node).some((props) => (
    hasRadioItemShape(props) ||
    props.name === 'RadioItem' ||
    isRadioItemPresetElement(props)
  ))
)

export const resolveRadioItemRuntimeProps = (
  rawProps: UXPinRadioItemProps = {}
): UXPinRadioItemProps => resolveUXPinRuntimeProps(rawProps, RadioItem.defaultProps)

export const resolveRadioItemNodeRuntimeProps = (
  node: React.ReactNode
): UXPinRadioItemProps => (
  resolveUXPinRuntimeProps(
    (getUXPinElementProps(node) || {}) as UXPinRadioItemProps,
    {
      ...RadioItem.defaultProps,
      ...resolveRadioItemPresetDefaults(node)
    }
  )
)

const RadioItem: RadioItemComponent = (_props: UXPinRadioItemProps): JSX.Element => null as unknown as JSX.Element

RadioItem.uxpinRole = RADIO_ITEM_ROLE
RadioItem.displayName = 'RadioItem'
RadioItem.defaultProps = {
  selected: false,
  text: 'Radio option',
  value: 'radio-option'
}

export default RadioItem
