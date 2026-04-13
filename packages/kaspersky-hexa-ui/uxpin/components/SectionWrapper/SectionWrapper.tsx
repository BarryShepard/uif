import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'

export type UXPinSectionWrapperProps = {
  /** Section content. Place GroupWrapper, Toolbar, Table, forms, or cards here. */
  children?: React.ReactNode,
  style?: CSSProperties
}

const sectionWrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: '100%',
  minWidth: 0,
  flex: '0 0 auto',
  boxSizing: 'border-box'
}

const SectionWrapperRoot = styled.div`
  > * {
    flex: 0 0 auto !important;
  }
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
  style
}: UXPinSectionWrapperProps): JSX.Element => (
  <SectionWrapperRoot
    style={mergeFrameStyle({
      ...sectionWrapperStyle,
      ...style
    })}
    data-hexa-uxpin-section-wrapper="true"
  >
    {children ?? <EmptySectionWrapperHint />}
  </SectionWrapperRoot>
)

SectionWrapper.displayName = 'SectionWrapper'

export default SectionWrapper
