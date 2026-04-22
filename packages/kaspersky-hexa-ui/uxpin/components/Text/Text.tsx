import React from 'react'

import { Text as HexaText } from '@src/typography'
import { TextProps } from '@src/typography/text'

import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'
import {
  resolveTypographyType,
  UXPinTypographyStyle
} from '../Typography/Typography'

export type UXPinTextProps = Omit<TextProps, 'type'> & {
  /** Typography style. */
  type?: UXPinTypographyStyle,
  /** Text value. */
  text?: string,
  codeComponentProps?: Partial<UXPinTextProps>,
  overriddenCodeProps?: Partial<UXPinTextProps>
}

const Text = (rawProps: UXPinTextProps): JSX.Element => {
  const {
    children,
    codeComponentProps: _codeComponentProps,
    overriddenCodeProps: _overriddenCodeProps,
    text = 'Text',
    type = 'body text/P3 (14, 20)/Regular',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedType = resolveTypographyType(type)

  return (
    <HexaText type={resolvedType} {...props}>
      {text ?? children}
    </HexaText>
  )
}

Text.displayName = 'Text'

export default Text
