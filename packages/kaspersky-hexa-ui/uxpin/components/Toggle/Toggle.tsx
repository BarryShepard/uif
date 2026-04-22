import React from 'react'

import { Toggle as HexaToggle } from '@src/toggle'
import { ToggleProps } from '@src/toggle/types'

import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinToggleProps = Omit<ToggleProps, 'checked' | 'children' | 'labelPosition' | 'value'> & {
  /** Initial selected state. */
  selected?: boolean,
  /** Toggle value state. */
  value?: boolean,
  /** Label when value is enabled. */
  valueTextEnabled?: string,
  /** Label when value is disabled. */
  valueTextDisabled?: string,
  /** Label position around the toggle. */
  valuePosition?: 'before' | 'after',
  codeComponentProps?: Partial<UXPinToggleProps>,
  overriddenCodeProps?: Partial<UXPinToggleProps>
}

const Toggle = (rawProps: UXPinToggleProps): JSX.Element => {
  const {
    codeComponentProps: _codeComponentProps,
    disabled = false,
    onChange,
    overriddenCodeProps: _overriddenCodeProps,
    selected = false,
    value,
    valuePosition = 'after',
    valueTextDisabled = 'Disabled',
    valueTextEnabled = 'Enabled',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const propChecked = Boolean(value || selected)
  const [checked, setChecked] = React.useState(Boolean(propChecked))

  React.useEffect(() => {
    setChecked(Boolean(propChecked))
  }, [propChecked])

  return (
    <HexaToggle
      checked={checked}
      disabled={disabled}
      labelPosition={valuePosition}
      onChange={(nextValue, event) => {
        setChecked(nextValue)
        onChange?.(nextValue, event)
      }}
      {...props}
    >
      {checked ? valueTextEnabled : valueTextDisabled}
    </HexaToggle>
  )
}

Toggle.displayName = 'Toggle'

export default Toggle
