import React from 'react'

import { TextDiff as HexaTextDiff } from '@src/text-diff'
import { TextDiffProps } from '@src/text-diff/types'

import { previewCode, previewUpdatedCode } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinTextDiffProps = {
  className?: string,
  newText?: string,
  oldText?: string,
  textType?: TextDiffProps['textType'],
  codeComponentProps?: Partial<UXPinTextDiffProps>,
  overriddenCodeProps?: Partial<UXPinTextDiffProps>
}

const TextDiff = ({
  newText,
  oldText,
  ...props
}: UXPinTextDiffProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({ newText, oldText, ...props }) as UXPinTextDiffProps
  const {
    codeComponentProps: _codeComponentProps,
    newText: resolvedNewText,
    oldText: resolvedOldText,
    overriddenCodeProps: _overriddenCodeProps,
    ...resolvedProps
  } = resolved

  return <HexaTextDiff newText={resolvedNewText ?? previewUpdatedCode} oldText={resolvedOldText ?? previewCode} {...resolvedProps} />
}

export default TextDiff
