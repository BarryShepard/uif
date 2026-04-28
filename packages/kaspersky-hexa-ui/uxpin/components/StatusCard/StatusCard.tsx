import React from 'react'

import { StatusCard as HexaStatusCard } from '@src/status-card'
import { StatusCardProps } from '@src/status-card/types'

import { previewStatusCardActions } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

type UXPinStatusCardAction = {
  text?: string,
  mode?: 'primary' | 'secondary' | 'tertiary' | 'ai' | 'dangerFilled' | 'dangerOutlined',
  disabled?: boolean
}

export type UXPinStatusCardProps = {
  title?: string,
  mode?: StatusCardProps['mode'],
  size?: StatusCardProps['size'],
  image?: boolean,
  iconVariant?: StatusCardProps['iconVariant'],
  width?: number,
  actions?: UXPinStatusCardAction[],
  description?: string,
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinStatusCardProps>,
  overriddenCodeProps?: Partial<UXPinStatusCardProps>
}

const StatusCard = ({
  actions,
  description,
  mode,
  title,
  ...props
}: UXPinStatusCardProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({ actions, description, mode, title, ...props }) as UXPinStatusCardProps
  const {
    actions: resolvedActions,
    codeComponentProps: _codeComponentProps,
    description: resolvedDescription,
    mode: resolvedMode,
    overriddenCodeProps: _overriddenCodeProps,
    title: resolvedTitle,
    ...resolvedProps
  } = resolved

  return (
    <HexaStatusCard
      actions={(resolvedActions ?? previewStatusCardActions) as StatusCardProps['actions']}
      description={resolvedDescription ?? 'Status card description'}
      mode={resolvedMode ?? 'success'}
      title={resolvedTitle ?? 'Status card'}
      {...resolvedProps}
    />
  )
}

export default StatusCard
