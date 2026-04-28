import React from 'react'

import { CodeCompare as HexaCodeCompare } from '@src/code-compare'
import { IVersionOption } from '@src/code-compare/types'

import {
  previewCode,
  previewCodeCompareOptions,
  previewUpdatedCode
} from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

type UXPinVersionOption = {
  value: string | number,
  label: string,
  description?: string
}

type CodeCompareProps = {
  compareMode?: 'split' | 'unified',
  oldValue?: string,
  newValue?: string,
  loading?: boolean,
  options?: UXPinVersionOption[],
  oldVersion?: UXPinVersionOption,
  newVersion?: UXPinVersionOption,
  codeComponentProps?: Partial<CodeCompareProps>,
  overriddenCodeProps?: Partial<CodeCompareProps>
}

const [oldVersion, newVersion] = previewCodeCompareOptions as [IVersionOption, IVersionOption]

const CodeCompare = ({
  options,
  oldValue,
  newValue,
  ...props
}: CodeCompareProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({ options, oldValue, newValue, ...props }) as CodeCompareProps
  const {
    codeComponentProps: _codeComponentProps,
    overriddenCodeProps: _overriddenCodeProps,
    options: resolvedOptions,
    oldValue: resolvedOldValue,
    newValue: resolvedNewValue,
    oldVersion: resolvedOldVersion,
    newVersion: resolvedNewVersion,
    ...resolvedProps
  } = resolved

  return (
    <HexaCodeCompare
      options={(resolvedOptions ?? previewCodeCompareOptions) as IVersionOption[]}
      oldValue={resolvedOldValue ?? previewCode}
      newValue={resolvedNewValue ?? previewUpdatedCode}
      oldVersion={(resolvedOldVersion as IVersionOption | undefined) ?? oldVersion}
      newVersion={(resolvedNewVersion as IVersionOption | undefined) ?? newVersion}
      {...resolvedProps}
    />
  )
}

export default CodeCompare
