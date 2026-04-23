import { useTestAttribute } from '@helpers/hooks/useTestAttribute'
import React, { FC } from 'react'

import { StyledToolbarDivider } from './toolbarCss'
import { ToolbarDividerProps } from './types'

export const ToolbarDivider: FC<ToolbarDividerProps> = (rawProps: ToolbarDividerProps) => {
  const { testAttributes, ...props } = useTestAttribute(rawProps)

  return (
    <StyledToolbarDivider
      direction="vertical"
      mode="bold"
      {...testAttributes}
      {...props}
    />
  )
}

ToolbarDivider.displayName = 'ToolbarDivider'
