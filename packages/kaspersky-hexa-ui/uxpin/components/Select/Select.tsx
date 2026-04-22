import React from 'react'

import { Select as HexaSelect } from '@src/select'
import { SelectProps } from '@src/select/types'

import { FrameFill, mergeFrameStyle } from '../../preview'
import { buildSelectOptions, SelectOptionIconName } from '../../selectOptions'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'
import Dropdown from '../Dropdown/Dropdown'
import DropdownItem from '../DropdownItem/DropdownItem'

export type UXPinSelectProps = Omit<SelectProps, 'options' | 'placeholder' | 'showSearch'> & {
  /** Enables option search. */
  withSearch?: boolean,
  /** Newline, comma, or semicolon separated option values. */
  optionsText?: string,
  /** Shows icons before option text. */
  componentBefore?: boolean,
  /** Icon before option text. */
  iconBefore?: SelectOptionIconName,
  /** Shows the trailing select arrow. */
  elementAfter?: boolean,
  /** Disables dropdown opening animation for instant UXPin feedback. */
  instantDropdown?: boolean,
  /** Shows placeholder text. */
  placeholder?: boolean,
  /** Placeholder content. */
  placeholderText?: string,
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinSelectProps>,
  overriddenCodeProps?: Partial<UXPinSelectProps>
}

const DEFAULT_SELECT_CHILDREN = (
  <Dropdown>
    <DropdownItem text="Option 1" selected />
    <DropdownItem text="Option 2" />
    <DropdownItem text="Option 3" />
  </Dropdown>
)

const Select = (rawProps: UXPinSelectProps): JSX.Element => {
  const {
    children = DEFAULT_SELECT_CHILDREN,
    codeComponentProps: _codeComponentProps,
    componentBefore = false,
    elementAfter = true,
    iconBefore = 'Placeholder',
    instantDropdown = true,
    optionsText,
    overriddenCodeProps: _overriddenCodeProps,
    placeholder = true,
    placeholderText = 'Select value',
    style,
    withSearch = false,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const dropdownPerformanceProps = instantDropdown ? { transitionName: '' } : {}
  const options = buildSelectOptions({
    children,
    componentBefore,
    iconBefore,
    optionsText
  })

  return (
    <FrameFill>
      <HexaSelect
        {...dropdownPerformanceProps}
        optionFilterProp="label"
        options={options}
        placeholder={placeholder ? placeholderText : undefined}
        showArrow={elementAfter}
        showSearch={withSearch}
        style={mergeFrameStyle(style)}
        {...props}
      />
    </FrameFill>
  )
}

Select.displayName = 'Select'

export default Select
