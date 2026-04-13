import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'

export type UXPinPageWrapperProps = {
  /** Page content. Place PageHeader, Toolbar, SectionWrapper, Table, or other page blocks here. */
  children?: React.ReactNode,
  style?: CSSProperties
}

const pageWrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  width: '100%',
  height: '100%',
  minWidth: 0,
  minHeight: 0,
  flex: '1 1 auto',
  alignSelf: 'stretch',
  overflow: 'auto',
  padding: 24,
  boxSizing: 'border-box'
}

const PageWrapperRoot = styled.div`
  > * {
    flex: 0 0 auto !important;
  }

  > [data-hexa-uxpin-table-height-mode='fill'],
  > [data-hexa-uxpin-section-wrapper]:has([data-hexa-uxpin-table-height-mode='fill']),
  > [data-hexa-uxpin-group-wrapper]:has([data-hexa-uxpin-table-height-mode='fill']) {
    flex: 1 1 auto !important;
    min-height: 0;
  }
`

const EmptyPageWrapperHint = (): JSX.Element => (
  <div
    style={{
      minHeight: 96,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px dashed rgba(31, 41, 55, 0.24)',
      borderRadius: 12,
      color: 'rgba(31, 41, 55, 0.56)',
      fontSize: 14,
      lineHeight: '20px'
    }}
  >
    Drop page content here
  </div>
)

const PageWrapper = ({
  children,
  style
}: UXPinPageWrapperProps): JSX.Element => (
  <PageWrapperRoot
    style={mergeFrameStyle({
      ...pageWrapperStyle,
      ...style
    })}
    data-hexa-uxpin-page-wrapper="true"
  >
    {children ?? <EmptyPageWrapperHint />}
  </PageWrapperRoot>
)

PageWrapper.displayName = 'PageWrapper'

export default PageWrapper
