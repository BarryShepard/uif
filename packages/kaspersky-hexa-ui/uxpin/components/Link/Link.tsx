import React from 'react'

import { Link as HexaLink } from '@src/link'
import { LinkProps } from '@src/link/types'

import Icons16Pack, { LinkExternal } from '@kaspersky/hexa-ui-icons/16'

import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type LinkIconName = Exclude<keyof typeof Icons16Pack, 'default'>

export type UXPinLinkProps = Omit<LinkProps, 'decoration' | 'icon' | 'iconPosition' | 'size'> & {
  /** Link size. */
  size?: 'medium' | 'small',
  /** Shows an icon before text. */
  iconBefore?: boolean,
  /** Icon name before text. */
  iconBeforeSlot?: LinkIconName,
  /** Shows an icon after text. */
  iconAfter?: boolean,
  /** Icon name after text. */
  iconAfterSlot?: LinkIconName,
  codeComponentProps?: Partial<UXPinLinkProps>,
  overriddenCodeProps?: Partial<UXPinLinkProps>
}

const resolveNamedIcon = (iconName?: LinkIconName): React.ReactNode => {
  if (!iconName) {
    return null
  }

  const IconComponent = Icons16Pack[iconName]

  return IconComponent ? <IconComponent /> : null
}

const Link = (rawProps: UXPinLinkProps): JSX.Element => {
  const {
    codeComponentProps: _codeComponentProps,
    href = '#',
    iconAfter = false,
    iconAfterSlot = 'LinkExternal',
    iconBefore = false,
    iconBeforeSlot = 'Placeholder',
    overriddenCodeProps: _overriddenCodeProps,
    size = 'medium',
    text = 'Open documentation',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const showIcon = iconBefore || iconAfter
  const icon = iconBefore
    ? resolveNamedIcon(iconBeforeSlot) ?? <LinkExternal />
    : resolveNamedIcon(iconAfterSlot) ?? <LinkExternal />

  return (
    <HexaLink
      decoration={showIcon ? 'icon' : 'none'}
      href={href}
      icon={icon}
      iconPosition={iconBefore ? 'before' : 'after'}
      size={size === 'small' ? 'noSize' : 'medium'}
      text={text}
      {...props}
    />
  )
}

export default Link
