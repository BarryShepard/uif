import React from 'react'

import { CheckboxGroupProps } from '@src/checkbox/types'
import { Checkbox as HexaCheckbox } from '@src/checkbox'

import {
  resolveUXPinMergedChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import Checkbox, {
  checkboxChildrenToOptions
} from '../Checkbox/Checkbox'

export type UXPinCheckboxGroupProps = Omit<CheckboxGroupProps, 'direction' | 'options'> & {
  /** Group orientation. */
  orientation?: 'vertical' | 'horizontal',
  /** Editable checkbox children. */
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinCheckboxGroupProps>,
  overriddenCodeProps?: Partial<UXPinCheckboxGroupProps>
}

const DEFAULT_CHECKBOX_GROUP_CHILDREN = (
  <>
    <Checkbox uxpId="checkbox-group-item-1" text="Option 1" value="option-1" checked />
    <Checkbox uxpId="checkbox-group-item-2" text="Option 2" value="option-2" />
    <Checkbox uxpId="checkbox-group-item-3" text="Option 3" value="option-3" />
    <Checkbox uxpId="checkbox-group-item-4" text="Option 4" value="option-4" />
    <Checkbox uxpId="checkbox-group-item-5" text="Option 5" value="option-5" />
  </>
)

const CheckboxGroup = (rawProps: UXPinCheckboxGroupProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const {
    children = DEFAULT_CHECKBOX_GROUP_CHILDREN,
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
  const resolvedChildren = resolveUXPinMergedChildrenFromProps(rawProps, DEFAULT_CHECKBOX_GROUP_CHILDREN)
  const { options, checkedValues } = checkboxChildrenToOptions(resolvedChildren, {
    disabled,
    readonly
  })
  const resolvedOptions = options.length ? options : checkboxChildrenToOptions(DEFAULT_CHECKBOX_GROUP_CHILDREN, {
    disabled,
    readonly
  }).options
  const controlledValue = Array.isArray(value) && value.length ? value : undefined
  const defaultCheckedValue = Array.isArray(defaultValue) && defaultValue.length ? defaultValue : undefined
  const inferredValue = defaultCheckedValue ?? checkedValues
  const [previewValue, setPreviewValue] = React.useState(controlledValue ?? inferredValue)
  const inferredValueSignature = inferredValue.join('|')

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setPreviewValue(controlledValue)
    }
  }, [controlledValue])

  React.useEffect(() => {
    if (controlledValue === undefined) {
      setPreviewValue(inferredValue)
    }
  }, [controlledValue, inferredValueSignature])

  return (
    <div ref={rootRef} style={{ height: 'fit-content', width: '100%' }}>
      <HexaCheckbox.Group
        direction={orientation}
        disabled={disabled}
        readonly={readonly}
        options={resolvedOptions as CheckboxGroupProps['options']}
        onChange={(nextValue) => {
          if (controlledValue === undefined) {
            setPreviewValue(nextValue)
          }

          onChange?.(nextValue)
        }}
        value={controlledValue ?? previewValue}
        {...props}
      />
    </div>
  )
}

CheckboxGroup.displayName = 'CheckboxGroup'

export default CheckboxGroup
