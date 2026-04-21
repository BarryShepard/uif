import React from 'react'

import { Calendar as HexaDatePicker } from '@src/datepicker'
import { CalendarProps } from '@src/datepicker/types'

import { FrameFill, mergeFrameStyle } from '../../preview'
import {
  parseUXDateValue,
  UX_DATE_FNS_FORMAT,
  UX_DATE_FORMAT
} from '../../dateTimeUtils'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinDatePickerProps = Omit<CalendarProps, 'format' | 'placeholder' | 'value'> & {
  /** Shows the placeholder mask. */
  placeholder?: boolean,
  /** Date value in DD/MM/YYYY mask. */
  value?: string,
  codeComponentProps?: Partial<UXPinDatePickerProps>,
  overriddenCodeProps?: Partial<UXPinDatePickerProps>
}

const DatePicker = (rawProps: UXPinDatePickerProps): JSX.Element => {
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
        format={UX_DATE_FORMAT}
        placeholder={placeholder ? UX_DATE_FORMAT : undefined}
        style={mergeFrameStyle(style)}
        value={parseUXDateValue(value, UX_DATE_FNS_FORMAT)}
        {...props}
      />
    </FrameFill>
  )
}

export default DatePicker
