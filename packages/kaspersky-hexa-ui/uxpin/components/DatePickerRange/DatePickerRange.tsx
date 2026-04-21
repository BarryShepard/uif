import React from 'react'

import { RangePicker } from '@src/datepicker'
import { RangePickerProps } from '@src/datepicker/types'

import {
  parseUXDateRangeValue,
  UX_DATE_FNS_FORMAT,
  UX_DATE_FORMAT
} from '../../dateTimeUtils'
import { FrameFill, mergeFrameStyle } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinDatePickerRangeProps = Omit<RangePickerProps, 'format' | 'placeholder' | 'value'> & {
  /** Shows the placeholder mask. */
  placeholder?: boolean,
  /** Date range in DD/MM/YYYY - DD/MM/YYYY mask. */
  value?: string,
  codeComponentProps?: Partial<UXPinDatePickerRangeProps>,
  overriddenCodeProps?: Partial<UXPinDatePickerRangeProps>
}

const DatePickerRange = (rawProps: UXPinDatePickerRangeProps): JSX.Element => {
  const {
    codeComponentProps: _codeComponentProps,
    overriddenCodeProps: _overriddenCodeProps,
    placeholder = true,
    style,
    value,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)

  return (
    <FrameFill>
      <RangePicker
        format={UX_DATE_FORMAT}
        placeholder={placeholder ? [UX_DATE_FORMAT, UX_DATE_FORMAT] : undefined}
        style={mergeFrameStyle(style)}
        value={parseUXDateRangeValue(value, UX_DATE_FNS_FORMAT)}
        {...props}
      />
    </FrameFill>
  )
}

DatePickerRange.displayName = 'DatePickerRange'

export default DatePickerRange
