import React from 'react'

import { ExpandableText as HexaExpandableText } from '@src/expandable-text'

import { previewLongText } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinExpandableTextProps = {
  children?: React.ReactNode,
  altText?: string,
  textType?: string,
  className?: string,
  codeComponentProps?: Partial<UXPinExpandableTextProps>,
  overriddenCodeProps?: Partial<UXPinExpandableTextProps>
}

const ExpandableText = ({
  children,
  altText,
  ...props
}: UXPinExpandableTextProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({ children, altText, ...props }) as UXPinExpandableTextProps
  const {
    codeComponentProps: _codeComponentProps,
    altText: resolvedAltText,
    children: resolvedChildren,
    overriddenCodeProps: _overriddenCodeProps,
    ...resolvedProps
  } = resolved

  return (
    <HexaExpandableText altText={(resolvedAltText ?? 'Toggle text visibility') as string | undefined} {...resolvedProps}>
      {resolvedChildren ?? previewLongText}
    </HexaExpandableText>
  )
}

export default ExpandableText
