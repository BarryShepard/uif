import React from 'react'

import { Radio as HexaRadio } from '@src/radio'
import { RadioOption, RadioProps } from '@src/radio/types'

import {
  getUXPinChildrenArray,
  resolveUXPinElementChildren,
  resolveUXPinMergedChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'
import RadioItem, {
  isUXPinRadioItemElement,
  resolveRadioItemNodeRuntimeProps
} from '../RadioItem/RadioItem'

export type UXPinRadioGroupProps = Omit<RadioProps, 'options' | 'value' | 'vertical'> & {
  /** Group orientation. */
  orientation?: 'vertical' | 'horizontal',
  /** Controlled selected value. */
  value?: string,
  /** Initial selected value. */
  defaultValue?: string,
  /** Editable radio items. */
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinRadioGroupProps>,
  overriddenCodeProps?: Partial<UXPinRadioGroupProps>
}

const DEFAULT_RADIO_GROUP_CHILDREN = (
  <>
    <RadioItem uxpId="radio-group-item-1" text="Option 1" value="option-1" selected />
    <RadioItem uxpId="radio-group-item-2" text="Option 2" value="option-2" />
    <RadioItem uxpId="radio-group-item-3" text="Option 3" value="option-3" />
    <RadioItem uxpId="radio-group-item-4" text="Option 4" value="option-4" />
    <RadioItem uxpId="radio-group-item-5" text="Option 5" value="option-5" />
  </>
)

const getRadioChildren = (
  children: React.ReactNode
): React.ReactNode[] => (
  getUXPinChildrenArray(children).flatMap((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return []
    }

    if (isUXPinRadioItemElement(child)) {
      return [child]
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    return nestedChildren ? getRadioChildren(nestedChildren) : []
  })
)

const radioChildrenToOptions = (
  children: React.ReactNode,
  disabled?: boolean,
  readonly?: boolean
): { options: RadioOption[], selectedValue?: string } => {
  const result: { options: RadioOption[], selectedValue?: string } = {
    options: []
  }

  getRadioChildren(children).forEach((child, index) => {
    const props = resolveRadioItemNodeRuntimeProps(child)
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
    defaultValue,
    disabled = false,
    onChange,
    orientation = 'vertical',
    overriddenCodeProps: _overriddenCodeProps,
    readonly = false,
    value,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedChildren = resolveUXPinMergedChildrenFromProps(rawProps, DEFAULT_RADIO_GROUP_CHILDREN)
  const { options, selectedValue } = radioChildrenToOptions(resolvedChildren, disabled, readonly)
  const resolvedOptions = options.length
    ? options
    : radioChildrenToOptions(DEFAULT_RADIO_GROUP_CHILDREN, disabled, readonly).options
  const controlledValue = typeof value === 'string' && value.length ? value : undefined
  const inferredValue = defaultValue ?? selectedValue ?? resolvedOptions[0]?.value
  const [previewValue, setPreviewValue] = React.useState(controlledValue ?? inferredValue)

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setPreviewValue(controlledValue)
    }
  }, [controlledValue])

  React.useEffect(() => {
    if (controlledValue === undefined) {
      setPreviewValue(inferredValue)
    }
  }, [controlledValue, inferredValue])

  return (
    <div ref={rootRef} style={{ height: 'fit-content', width: '100%' }}>
      <HexaRadio
        {...props}
        disabled={disabled}
        onChange={(event) => {
          if (controlledValue === undefined) {
            setPreviewValue(event.target.value)
          }

          onChange?.(event)
        }}
        options={resolvedOptions}
        readonly={readonly}
        value={controlledValue ?? previewValue}
        vertical={orientation === 'vertical'}
      />
    </div>
  )
}

RadioGroup.displayName = 'RadioGroup'

export default RadioGroup
