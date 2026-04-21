import React from 'react'

import { Indicator } from '@src/indicator'
import { Status as HexaStatus } from '@src/status'
import { StatusMode, StatusProps } from '@src/status/types'

import Icons16Pack, { Placeholder } from '@kaspersky/hexa-ui-icons/16'

import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinStatusMode =
  | 'critical'
  | 'default'
  | 'high'
  | 'in incident'
  | 'info'
  | 'inprogress'
  | 'low'
  | 'medium'
  | 'new'
  | 'notactive'
  | 'positive'
  | 'resolved'
  | 'update'

export type UXPinStatusComponentBefore = 'icon' | 'indicator'
export type StatusIconName = Exclude<keyof typeof Icons16Pack, 'default'>

export type UXPinStatusProps = Omit<StatusProps, 'icon' | 'label' | 'mode'> & {
  /** Status mode. */
  mode?: UXPinStatusMode | StatusMode,
  /** Visual element before text. */
  componentBefore?: UXPinStatusComponentBefore,
  /** Icon before text. */
  iconBefore?: StatusIconName,
  /** Status text. */
  text?: string,
  codeComponentProps?: Partial<UXPinStatusProps>,
  overriddenCodeProps?: Partial<UXPinStatusProps>
}

const resolveMode = (mode?: UXPinStatusProps['mode']): StatusMode => {
  switch (mode) {
    case 'in incident':
      return 'inIncident'
    case 'inprogress':
      return 'inProgress'
    case 'notactive':
      return 'not-active'
    default:
      return (mode ?? 'positive') as StatusMode
  }
}

const resolveNamedIcon = (iconName?: StatusIconName): React.ReactNode => {
  if (!iconName) {
    return <Placeholder />
  }

  const IconComponent = Icons16Pack[iconName]

  return IconComponent ? <IconComponent /> : <Placeholder />
}

const Status = (rawProps: UXPinStatusProps): JSX.Element => {
  const {
    codeComponentProps: _codeComponentProps,
    componentBefore = 'indicator',
    iconBefore = 'Placeholder',
    mode = 'positive',
    overriddenCodeProps: _overriddenCodeProps,
    text = 'Active',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedMode = resolveMode(mode)
  const icon = componentBefore === 'icon'
    ? resolveNamedIcon(iconBefore)
    : componentBefore === 'indicator' && resolvedMode !== 'default'
      ? <Indicator mode={resolvedMode} />
      : undefined

  return (
    <HexaStatus
      icon={icon}
      label={text}
      mode={componentBefore === 'indicator' ? 'default' : resolvedMode}
      {...props}
    />
  )
}

Status.displayName = 'Status'

export default Status
