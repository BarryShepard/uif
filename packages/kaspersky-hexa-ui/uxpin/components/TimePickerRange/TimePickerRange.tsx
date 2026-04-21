import React from 'react'
import styled from 'styled-components'

import { RangeSeparator } from '@helpers/components/range-separator'
import { TimeInput as HexaTimeInput } from '@src/time-input'
import { TimeInputProps } from '@src/time-input/types'

import { parseUXTimeRangeValue, UX_TIME_FORMAT } from '../../dateTimeUtils'
import { FrameFill } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinTimePickerRangeProps = Omit<TimeInputProps, 'format' | 'placeholder' | 'value'> & {
  /** Shows the placeholder mask. */
  placeholder?: boolean,
  /** Time range in hh:mm:ss - hh:mm:ss mask. */
  value?: string,
  codeComponentProps?: Partial<UXPinTimePickerRangeProps>,
  overriddenCodeProps?: Partial<UXPinTimePickerRangeProps>
}

const TimePickerRangeRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;

  > * {
    flex: 1 1 0;
    min-width: 0;
  }
`

const TimePickerRange = (rawProps: UXPinTimePickerRangeProps): JSX.Element => {
  const {
    codeComponentProps: _codeComponentProps,
    overriddenCodeProps: _overriddenCodeProps,
    placeholder = true,
    value,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const [startValue, endValue] = parseUXTimeRangeValue(value)
  const resolvedPlaceholder = placeholder ? UX_TIME_FORMAT : undefined

  return (
    <FrameFill>
      <TimePickerRangeRoot>
        <HexaTimeInput
          format={UX_TIME_FORMAT}
          placeholder={resolvedPlaceholder}
          value={startValue}
          {...props}
        />
        <RangeSeparator />
        <HexaTimeInput
          format={UX_TIME_FORMAT}
          placeholder={resolvedPlaceholder}
          value={endValue}
          {...props}
        />
      </TimePickerRangeRoot>
    </FrameFill>
  )
}

TimePickerRange.displayName = 'TimePickerRange'

export default TimePickerRange
