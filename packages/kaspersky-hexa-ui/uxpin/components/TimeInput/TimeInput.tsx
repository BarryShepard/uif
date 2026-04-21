import React from 'react'

import { TimeInput as HexaTimeInput } from '@src/time-input'
import { TimeInputProps } from '@src/time-input/types'

import { FrameFill } from '../../preview'
import { UX_TIME_FORMAT } from '../../dateTimeUtils'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinTimeInputProps = Omit<TimeInputProps, 'format' | 'placeholder'> & {
  /** Shows the placeholder mask. */
  placeholder?: boolean,
  codeComponentProps?: Partial<UXPinTimeInputProps>,
  overriddenCodeProps?: Partial<UXPinTimeInputProps>
}

const TimeInput = (rawProps: UXPinTimeInputProps): JSX.Element => {
  const {
    codeComponentProps: _codeComponentProps,
    overriddenCodeProps: _overriddenCodeProps,
    placeholder = true,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)

  return (
    <FrameFill>
      <HexaTimeInput
        format={UX_TIME_FORMAT}
        placeholder={placeholder ? UX_TIME_FORMAT : undefined}
        {...props}
      />
    </FrameFill>
  )
}

export default TimeInput
