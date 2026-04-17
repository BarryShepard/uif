import React from 'react'

import { Button as HexaButton } from '@src/button'
import { ButtonProps } from '@src/button/types'

import { FrameFill, mergeFrameStyle } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

type UXPinButtonProps = ButtonProps & {
  /** Stretches button to fill available width. */
  flex?: boolean,
  codeComponentProps?: Partial<ButtonProps & { flex?: boolean }>,
  overriddenCodeProps?: Partial<ButtonProps & { flex?: boolean }>
}

const Button = (rawProps: UXPinButtonProps): JSX.Element => {
  const {
    children = 'Button',
    codeComponentProps: _codeComponentProps,
    flex = false,
    overriddenCodeProps: _overriddenCodeProps,
    text,
    mode = 'primary',
    size = 'medium',
    style,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedText = text ?? (typeof children === 'string' ? children : 'Button')
  const frameStyle: React.CSSProperties = flex
    ? { flex: '1 1 auto', width: '100%' }
    : { flex: '0 0 auto', height: 'fit-content', width: 'fit-content' }
  const buttonStyle = {
    ...mergeFrameStyle(style),
    ...(flex
      ? { flex: '1 1 auto', width: '100%' }
      : { flex: '0 0 auto', width: 'fit-content' })
  }

  return (
    <FrameFill style={frameStyle}>
      <HexaButton
        mode={mode}
        size={size}
        text={resolvedText}
        style={buttonStyle}
        {...props}
      />
    </FrameFill>
  )
}

export default Button
