import React from 'react'

import { WeeklySchedule as HexaWeeklySchedule } from '@src/weekly-schedule'
import { WeeklyScheduleProps } from '@src/weekly-schedule/types'

import {
  previewDaysOfWeek,
  previewLegend,
  previewWeeklyScheduleState
} from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinWeeklyScheduleProps = {
  initialState?: WeeklyScheduleProps['initialState'],
  daysOfWeek?: WeeklyScheduleProps['daysOfWeek'],
  legend?: WeeklyScheduleProps['legend'],
  codeComponentProps?: Partial<UXPinWeeklyScheduleProps>,
  overriddenCodeProps?: Partial<UXPinWeeklyScheduleProps>
}

const WeeklySchedule = ({
  daysOfWeek,
  initialState,
  legend,
  ...props
}: UXPinWeeklyScheduleProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({ daysOfWeek, initialState, legend, ...props }) as UXPinWeeklyScheduleProps
  const {
    codeComponentProps: _codeComponentProps,
    daysOfWeek: resolvedDaysOfWeek,
    initialState: resolvedInitialState,
    legend: resolvedLegend,
    overriddenCodeProps: _overriddenCodeProps,
    ...resolvedProps
  } = resolved
  const [state, setState] = React.useState(resolvedInitialState ?? previewWeeklyScheduleState)

  React.useEffect(() => {
    setState(resolvedInitialState ?? previewWeeklyScheduleState)
  }, [resolvedInitialState])

  return (
    <HexaWeeklySchedule
      daysOfWeek={resolvedDaysOfWeek ?? previewDaysOfWeek}
      initialState={state}
      legend={resolvedLegend ?? previewLegend}
      onChange={(nextValue) => {
        setState(nextValue)
      }}
      {...resolvedProps}
    />
  )
}

export default WeeklySchedule
