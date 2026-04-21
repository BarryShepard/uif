import React from 'react'

import { RangePicker } from '@src/datepicker'
import { RangePickerProps } from '@src/datepicker/types'

import {
  parseUXDateRangeValue,
  UX_DATE_TIME_FNS_FORMAT,
  UX_DATE_TIME_FORMAT
} from '../../dateTimeUtils'
import { FrameFill, mergeFrameStyle } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinDateTimePickerRangeProps = Omit<RangePickerProps, 'format' | 'placeholder' | 'showTime' | 'value'> & {
  /** Shows the placeholder mask. */
  placeholder?: boolean,
  /** Date-time range in DD/MM/YYYY hh:mm:ss - DD/MM/YYYY hh:mm:ss mask. */
  value?: string,
  codeComponentProps?: Partial<UXPinDateTimePickerRangeProps>,
  overriddenCodeProps?: Partial<UXPinDateTimePickerRangeProps>
}

const DateTimePickerRange = (rawProps: UXPinDateTimePickerRangeProps): JSX.Element => {
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
        format={UX_DATE_TIME_FORMAT}
        placeholder={placeholder ? [UX_DATE_TIME_FORMAT, UX_DATE_TIME_FORMAT] : undefined}
        showTime
        style={mergeFrameStyle(style)}
        value={parseUXDateRangeValue(value, UX_DATE_TIME_FNS_FORMAT)}
        {...props}
      />
    </FrameFill>
  )
}

DateTimePickerRange.displayName = 'DateTimePickerRange'

export default DateTimePickerRange
