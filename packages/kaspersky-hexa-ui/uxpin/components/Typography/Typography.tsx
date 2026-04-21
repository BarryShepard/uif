import React from 'react'

import { Text as HexaTypography } from '@src/typography'
import { TextProps } from '@src/typography/text'

import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinTypographyProps = TextProps & {
  /** Main text. */
  text?: string,
  /** Shows description text after main text. */
  description?: boolean,
  /** Description text. */
  descriptionText?: string,
  codeComponentProps?: Partial<UXPinTypographyProps>,
  overriddenCodeProps?: Partial<UXPinTypographyProps>
}

const Typography = (rawProps: UXPinTypographyProps): JSX.Element => {
  const {
    children = 'Typography preview',
    codeComponentProps: _codeComponentProps,
    description = false,
    descriptionText = 'Description',
    overriddenCodeProps: _overriddenCodeProps,
    text,
  type = 'BTR3',
  ...props
  } = resolveUXPinRuntimeProps(rawProps)

  return (
    <>
      <HexaTypography type={type} {...props}>
        {text ?? children}
      </HexaTypography>
      {description && (
        <HexaTypography type="BTR4" color="secondary">
          {descriptionText}
        </HexaTypography>
      )}
    </>
  )
}

export default Typography
