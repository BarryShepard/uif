import React from 'react'

import { ActionButton as HexaActionButton } from '@src/action-button'
import { ActionButtonMode, ActionButtonProps } from '@src/action-button/types'

import Icons16Pack, { Placeholder } from '@kaspersky/hexa-ui-icons/16'

import { FrameFill } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

export type UXPinActionButtonVariant = 'button' | 'iconbutton'

export type UXPinActionButtonMode = 'ghost' | 'filled' | 'ghostinverted' | 'onlight' | ActionButtonMode

export type ActionButtonIconName = Exclude<keyof typeof Icons16Pack, 'default'>

export type UXPinActionButtonProps = Omit<ActionButtonProps, 'icon' | 'elementAfter' | 'mode'> & {
  /** UXPin preset element id. */
  uxpId?: string,
  /** Button presentation variant. */
  variant?: UXPinActionButtonVariant,
  /** Visual mode. */
  mode?: UXPinActionButtonMode,
  /** Button text for button variant. */
  text?: string,
  /** Shows the icon before text. */
  iconBefore?: boolean,
  /** Icon name for the leading slot. */
  iconBeforeSlot?: ActionButtonIconName | React.ReactNode,
  /** Shows the trailing element. */
  elementAfter?: boolean,
  /** Icon name for the trailing slot. */
  elementAfterSlot?: ActionButtonIconName | React.ReactNode,
  codeComponentProps?: Partial<UXPinActionButtonProps>,
  overriddenCodeProps?: Partial<UXPinActionButtonProps>
}

const resolveMode = (mode?: UXPinActionButtonMode): ActionButtonMode => {
  switch (mode) {
    case 'ghostinverted':
      return 'ghostInverted'
    case 'onlight':
      return 'onLight'
    default:
      return (mode ?? 'ghost') as ActionButtonMode
  }
}

const resolveNamedIcon = (iconName?: ActionButtonIconName | React.ReactNode): React.ReactNode => {
  if (!iconName) {
    return null
  }

  if (React.isValidElement(iconName)) {
    return iconName
  }

  if (typeof iconName !== 'string') {
    return iconName
  }

  const IconComponent = Icons16Pack[iconName as ActionButtonIconName]

  return IconComponent ? <IconComponent /> : null
}

const ActionButton = (rawProps: UXPinActionButtonProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame({ width: 'fit-content' })
  const {
    codeComponentProps: _codeComponentProps,
    disabled = false,
    elementAfter = false,
    elementAfterSlot,
    iconBefore = true,
    iconBeforeSlot = 'Placeholder',
    mode = 'ghost',
    overriddenCodeProps: _overriddenCodeProps,
    size = 'medium',
    text = 'Action',
    uxpId: _uxpId,
    variant = 'iconbutton',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const showIcon = variant === 'iconbutton' || iconBefore
  const icon = showIcon ? resolveNamedIcon(iconBeforeSlot) ?? <Placeholder /> : undefined
  const resolvedElementAfter = elementAfter
    ? resolveNamedIcon(elementAfterSlot) ?? <Placeholder />
    : undefined

  return (
    <div ref={rootRef}>
      <FrameFill style={{ height: 'fit-content', width: 'fit-content' }}>
        <HexaActionButton
          disabled={disabled}
          elementAfter={resolvedElementAfter}
          icon={icon}
          mode={resolveMode(mode)}
          noIcon={!showIcon}
          size={size}
          {...props}
        >
          {variant === 'button' ? text : undefined}
        </HexaActionButton>
      </FrameFill>
    </div>
  )
}

ActionButton.displayName = 'ActionButton'

export default ActionButton
