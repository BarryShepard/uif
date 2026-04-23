import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import { buildFlexHeightChildSelectors, wrapperChildrenCss } from '../wrapperFlexLayout'

export type UXPinGroupWrapperProps = {
  /** Group content. Place controls, form fields, cards, tables, or any other blocks here. */
  children?: React.ReactNode,
  /** When enabled, the group fills available vertical space and can stretch fill-height children. */
  flexHeight?: boolean,
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

const getGroupHeightStyle = (flexHeight: boolean): CSSProperties => (
  flexHeight
    ? {
      height: '100%',
      flex: '1 1 auto'
    }
    : {
      height: 'auto'
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

const groupWrapperFlexHeightSelectors = buildFlexHeightChildSelectors(
  "[data-hexa-uxpin-table-height-mode='fill']"
)

const GroupWrapperRoot = styled.div<{ $flexHeight?: boolean }>`
  ${wrapperChildrenCss}

  ${({ $flexHeight }) => $flexHeight && `
    ${groupWrapperFlexHeightSelectors} {
      flex: 1 1 auto !important;
      min-height: 0;
    }
  `}
`

const GroupWrapper = ({
  children,
  flexHeight = false,
  flexWidth = true,
  style
}: UXPinGroupWrapperProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame({
    disabled: flexHeight
  })

  return (
    <GroupWrapperRoot
      $flexHeight={flexHeight}
      ref={rootRef}
      style={mergeFrameStyle({
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        minWidth: 0,
        minHeight: 0,
        boxSizing: 'border-box',
        ...getGroupWidthStyle(flexWidth),
        ...getGroupHeightStyle(flexHeight),
        ...style
      })}
      data-hexa-uxpin-group-wrapper="true"
      data-hexa-uxpin-flex-height={flexHeight ? 'true' : 'false'}
    >
      {children ?? <EmptyGroupWrapperHint />}
    </GroupWrapperRoot>
  )
}

GroupWrapper.defaultProps = {
  flexHeight: false,
  flexWidth: true
}

GroupWrapper.displayName = 'GroupWrapper'

export default GroupWrapper
