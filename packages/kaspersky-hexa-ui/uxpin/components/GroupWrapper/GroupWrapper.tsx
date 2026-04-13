import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'

export type UXPinGroupWrapperProps = {
  /** Group content. Place controls, form fields, cards, tables, or any other blocks here. */
  children?: React.ReactNode,
  /** When enabled, the group stretches to available width. When disabled, width is fixed to 872px. */
  flexWidth?: boolean,
  style?: CSSProperties
}

const getGroupWidthStyle = (flexWidth: boolean): CSSProperties => (
  flexWidth
    ? {
      width: '100%',
      maxWidth: '100%',
      flex: '1 1 auto',
      alignSelf: 'stretch'
    }
    : {
      width: 872,
      maxWidth: '100%',
      flex: '0 1 872px',
      alignSelf: 'flex-start'
    }
)

const EmptyGroupWrapperHint = (): JSX.Element => (
  <div
    style={{
      minHeight: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px dashed rgba(31, 41, 55, 0.18)',
      borderRadius: 12,
      color: 'rgba(31, 41, 55, 0.48)',
      fontSize: 14,
      lineHeight: '20px'
    }}
  >
    Drop group content here
  </div>
)

const GroupWrapperRoot = styled.div`
  > * {
    flex: 0 0 auto !important;
  }
`

const GroupWrapper = ({
  children,
  flexWidth = true,
  style
}: UXPinGroupWrapperProps): JSX.Element => (
  <GroupWrapperRoot
    style={mergeFrameStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minWidth: 0,
      boxSizing: 'border-box',
      ...getGroupWidthStyle(flexWidth),
      ...style
    })}
    data-hexa-uxpin-group-wrapper="true"
  >
    {children ?? <EmptyGroupWrapperHint />}
  </GroupWrapperRoot>
)

GroupWrapper.defaultProps = {
  flexWidth: true
}

GroupWrapper.displayName = 'GroupWrapper'

export default GroupWrapper
