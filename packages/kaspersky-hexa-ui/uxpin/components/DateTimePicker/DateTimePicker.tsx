import React from 'react'

import { Calendar as HexaDatePicker } from '@src/datepicker'
import { CalendarProps } from '@src/datepicker/types'

import {
  parseUXDateValue,
  UX_DATE_TIME_FNS_FORMAT,
  UX_DATE_TIME_FORMAT
} from '../../dateTimeUtils'
import { FrameFill, mergeFrameStyle } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinDateTimePickerProps = Omit<CalendarProps, 'format' | 'placeholder' | 'showTime' | 'value'> & {
  /** Shows the placeholder mask. */
  placeholder?: boolean,
  /** Date-time value in DD/MM/YYYY hh:mm:ss mask. */
  value?: string,
  codeComponentProps?: Partial<UXPinDateTimePickerProps>,
  overriddenCodeProps?: Partial<UXPinDateTimePickerProps>
}

const DateTimePicker = (rawProps: UXPinDateTimePickerProps): JSX.Element => {
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
      <HexaDatePicker
        format={UX_DATE_TIME_FORMAT}
        placeholder={placeholder ? UX_DATE_TIME_FORMAT : undefined}
        showTime
        style={mergeFrameStyle(style)}
        value={parseUXDateValue(value, UX_DATE_TIME_FNS_FORMAT)}
        {...props}
      />
    </FrameFill>
  )
}

DateTimePicker.displayName = 'DateTimePicker'

export default DateTimePicker
