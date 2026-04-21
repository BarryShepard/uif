import React from 'react'

import { Radio as HexaRadio } from '@src/radio'
import { RadioOption, RadioProps } from '@src/radio/types'

import {
  getUXPinChildrenArray,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'
import RadioItem, {
  isUXPinRadioItemElement,
  resolveRadioItemRuntimeProps
} from '../RadioItem/RadioItem'

export type UXPinRadioGroupProps = Omit<RadioProps, 'options' | 'value' | 'vertical'> & {
  /** Group orientation. */
  orientation?: 'vertical' | 'horizontal',
  /** Editable radio items. */
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinRadioGroupProps>,
  overriddenCodeProps?: Partial<UXPinRadioGroupProps>
}

const DEFAULT_RADIO_GROUP_CHILDREN = (
  <>
    <RadioItem text="Option 1" value="option-1" selected />
    <RadioItem text="Option 2" value="option-2" />
    <RadioItem text="Option 3" value="option-3" />
    <RadioItem text="Option 4" value="option-4" />
    <RadioItem text="Option 5" value="option-5" />
  </>
)

const radioChildrenToOptions = (
  children: React.ReactNode,
  disabled?: boolean,
  readonly?: boolean
): { options: RadioOption[], selectedValue?: string } => {
  const result: { options: RadioOption[], selectedValue?: string } = {
    options: []
  }

  getUXPinChildrenArray(children).forEach((child, index) => {
    if (!isUXPinRadioItemElement(child) || isUXPinHiddenElement(child)) {
      return
    }

    const props = resolveRadioItemRuntimeProps(child.props)
    const value = props.value ?? `option-${index + 1}`

    if (props.selected) {
      result.selectedValue = value
    }

    result.options.push({
      disabled: props.disabled ?? disabled,
      label: props.text ?? `Option ${index + 1}`,
      readonly: props.readonly ?? readonly,
      value
    })
  })

  return result
}

const RadioGroup = (rawProps: UXPinRadioGroupProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const {
    children = DEFAULT_RADIO_GROUP_CHILDREN,
    codeComponentProps: _codeComponentProps,
    disabled = false,
    orientation = 'vertical',
    overriddenCodeProps: _overriddenCodeProps,
    readonly = false,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const { options, selectedValue } = radioChildrenToOptions(children, disabled, readonly)
  const resolvedOptions = options.length
    ? options
    : radioChildrenToOptions(DEFAULT_RADIO_GROUP_CHILDREN, disabled, readonly).options

  return (
    <div ref={rootRef} style={{ height: 'fit-content', width: '100%' }}>
      <HexaRadio
        disabled={disabled}
        options={resolvedOptions}
        readonly={readonly}
        value={selectedValue ?? resolvedOptions[0]?.value}
        vertical={orientation === 'vertical'}
        {...props}
      />
    </div>
  )
}

RadioGroup.displayName = 'RadioGroup'

export default RadioGroup
