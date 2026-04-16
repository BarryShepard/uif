import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

export type UXPinSectionWrapperProps = {
  /** Section content. Place GroupWrapper, Toolbar, Table, forms, or cards here. */
  children?: React.ReactNode,
  /** When enabled, the section fills available vertical space and can stretch fill-height children. */
  flexHeight?: boolean,
  style?: CSSProperties
}

const sectionWrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: '100%',
  minWidth: 0,
  minHeight: 0,
  flex: '0 0 auto',
  boxSizing: 'border-box'
}

const getSectionHeightStyle = (flexHeight: boolean): CSSProperties => (
  flexHeight
    ? {
      height: '100%',
      flex: '1 1 auto',
      alignSelf: 'stretch'
    }
    : {
      height: 'auto',
      flex: '0 0 auto'
    }
)

const SectionWrapperRoot = styled.div<{ $flexHeight?: boolean }>`
  > * {
    flex: 0 0 auto !important;
  }

  ${({ $flexHeight }) => $flexHeight && `
    > [data-hexa-uxpin-table-height-mode='fill'],
    > [data-hexa-uxpin-group-wrapper][data-hexa-uxpin-flex-height='true'] {
      flex: 1 1 auto !important;
      min-height: 0;
    }
  `}
`

const EmptySectionWrapperHint = (): JSX.Element => (
  <div
    style={{
      minHeight: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px dashed rgba(31, 41, 55, 0.2)',
      borderRadius: 12,
      color: 'rgba(31, 41, 55, 0.5)',
      fontSize: 14,
      lineHeight: '20px'
    }}
  >
    Drop section content here
  </div>
)

const SectionWrapper = ({
  children,
  flexHeight = false,
  style
}: UXPinSectionWrapperProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame({
    disabled: flexHeight
  })

  return (
    <SectionWrapperRoot
      $flexHeight={flexHeight}
      ref={rootRef}
      style={mergeFrameStyle({
        ...sectionWrapperStyle,
        ...getSectionHeightStyle(flexHeight),
        ...style
      })}
      data-hexa-uxpin-section-wrapper="true"
      data-hexa-uxpin-flex-height={flexHeight ? 'true' : 'false'}
    >
      {children ?? <EmptySectionWrapperHint />}
    </SectionWrapperRoot>
  )
}

SectionWrapper.defaultProps = {
  flexHeight: false
}

SectionWrapper.displayName = 'SectionWrapper'

export default SectionWrapper
