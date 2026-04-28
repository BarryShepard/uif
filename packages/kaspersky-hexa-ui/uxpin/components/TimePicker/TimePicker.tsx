import React from 'react'

import TimeInput, { UXPinTimeInputProps } from '../TimeInput/TimeInput'

export type UXPinTimePickerProps = UXPinTimeInputProps

const TimePicker = (props: UXPinTimePickerProps): JSX.Element => (
  <TimeInput {...props} />
)

export default TimePicker
