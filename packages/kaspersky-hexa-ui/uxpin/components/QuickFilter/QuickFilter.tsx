import React from 'react'

import { QuickFilter as HexaQuickFilter } from '@src/quick-filter'
import { QuickFilterProps } from '@src/quick-filter/types'

import { FrameFill, previewQuickFilterFilters } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinQuickFilterProps = {
  className?: string,
  labelPosition?: 'before' | 'top',
  disabled?: boolean,
  filters?: QuickFilterProps['filters'],
  codeComponentProps?: Partial<UXPinQuickFilterProps>,
  overriddenCodeProps?: Partial<UXPinQuickFilterProps>
}

const QuickFilter = ({
  filters,
  ...props
}: UXPinQuickFilterProps): JSX.Element => {
  const resolved = resolveUXPinRuntimeProps({ filters, ...props }) as UXPinQuickFilterProps
  const {
    codeComponentProps: _codeComponentProps,
    filters: resolvedFilters,
    overriddenCodeProps: _overriddenCodeProps,
    ...resolvedProps
  } = resolved

  return (
    <FrameFill>
      <HexaQuickFilter filters={(resolvedFilters ?? previewQuickFilterFilters) as QuickFilterProps['filters']} {...resolvedProps} />
    </FrameFill>
  )
}

export default QuickFilter
