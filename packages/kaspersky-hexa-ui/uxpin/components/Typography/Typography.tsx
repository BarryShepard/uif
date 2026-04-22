import React from 'react'

import { Text as HexaTypography } from '@src/typography'
import { TextProps } from '@src/typography/text'

import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinTypographyStyle =
  | 'heading/H1 (48, 56)/Semibold'
  | 'heading/H2 (32, 40)/Semibold'
  | 'heading/H3 (28, 32)/Semibold'
  | 'heading/H4 (24, 32)/Semibold'
  | 'heading/H5 (20, 24)/Semibold'
  | 'heading/H6 (16, 24)/Semibold'
  | 'body text/P2 (16, 24)/Regular'
  | 'body text/P3 (14, 20)/Regular'
  | 'body text/P4 (12, 16)/Regular'
  | 'body text/P5 (10, 12)/Regular'
  | 'body text/P2 (16, 24)/Medium'
  | 'body text/P3 (14, 20)/Medium'
  | 'body text/P4 (12, 16)/Medium'
  | 'body text/P5 (10, 12)/Medium'
  | 'mono text/P3 (14, 20)/Regular'
  | 'mono text/P4 (12, 16)/Regular'

export type UXPinTypographyProps = Omit<TextProps, 'type'> & {
  /** Typography style. */
  type?: UXPinTypographyStyle,
  /** Main text. */
  text?: string,
  /** Shows description text after main text. */
  description?: boolean,
  /** Description text. */
  descriptionText?: string,
  codeComponentProps?: Partial<UXPinTypographyProps>,
  overriddenCodeProps?: Partial<UXPinTypographyProps>
}

const typographyStyleMap: Record<UXPinTypographyStyle, NonNullable<TextProps['type']>> = {
  'heading/H1 (48, 56)/Semibold': 'H1',
  'heading/H2 (32, 40)/Semibold': 'H2',
  'heading/H3 (28, 32)/Semibold': 'H3',
  'heading/H4 (24, 32)/Semibold': 'H4',
  'heading/H5 (20, 24)/Semibold': 'H5',
  'heading/H6 (16, 24)/Semibold': 'H6',
  'body text/P2 (16, 24)/Regular': 'BTR2',
  'body text/P3 (14, 20)/Regular': 'BTR3',
  'body text/P4 (12, 16)/Regular': 'BTR4',
  'body text/P5 (10, 12)/Regular': 'BTR5',
  'body text/P2 (16, 24)/Medium': 'BTM2',
  'body text/P3 (14, 20)/Medium': 'BTM3',
  'body text/P4 (12, 16)/Medium': 'BTM4',
  'body text/P5 (10, 12)/Medium': 'BTM5',
  'mono text/P3 (14, 20)/Regular': 'MTR3',
  'mono text/P4 (12, 16)/Regular': 'MTR4'
}

export const resolveTypographyType = (
  type?: UXPinTypographyStyle | TextProps['type']
): TextProps['type'] => (
  type && type in typographyStyleMap
    ? typographyStyleMap[type as UXPinTypographyStyle]
    : type as TextProps['type'] ?? 'BTR3'
)

const Typography = (rawProps: UXPinTypographyProps): JSX.Element => {
  const {
    children = 'Typography preview',
    codeComponentProps: _codeComponentProps,
    description = false,
    descriptionText = 'Description',
    overriddenCodeProps: _overriddenCodeProps,
    text,
    type = 'body text/P3 (14, 20)/Regular',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedType = resolveTypographyType(type)

  return (
    <>
      <HexaTypography type={resolvedType} {...props}>
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
