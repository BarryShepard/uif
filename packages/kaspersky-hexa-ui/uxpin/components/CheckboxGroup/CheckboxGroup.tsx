import React from 'react'

import { CheckboxGroupProps } from '@src/checkbox/types'
import { Checkbox as HexaCheckbox } from '@src/checkbox'

import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'
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
    <Checkbox text="Option 1" value="option-1" checked />
    <Checkbox text="Option 2" value="option-2" />
    <Checkbox text="Option 3" value="option-3" />
    <Checkbox text="Option 4" value="option-4" />
    <Checkbox text="Option 5" value="option-5" />
  </>
)

const CheckboxGroup = (rawProps: UXPinCheckboxGroupProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const {
    children = DEFAULT_CHECKBOX_GROUP_CHILDREN,
    codeComponentProps: _codeComponentProps,
    defaultValue,
    disabled = false,
    orientation = 'vertical',
    overriddenCodeProps: _overriddenCodeProps,
    readonly = false,
    value,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const { options, checkedValues } = checkboxChildrenToOptions(children, {
    disabled,
    readonly
  })
  const resolvedOptions = options.length ? options : checkboxChildrenToOptions(DEFAULT_CHECKBOX_GROUP_CHILDREN, {
    disabled,
    readonly
  }).options
  const resolvedDefaultValue = defaultValue ?? checkedValues

  return (
    <div ref={rootRef} style={{ height: 'fit-content', width: '100%' }}>
      <HexaCheckbox.Group
        direction={orientation}
        disabled={disabled}
        readonly={readonly}
        options={resolvedOptions as CheckboxGroupProps['options']}
        value={value}
        defaultValue={resolvedDefaultValue}
        {...props}
      />
    </div>
  )
}

CheckboxGroup.displayName = 'CheckboxGroup'

export default CheckboxGroup
