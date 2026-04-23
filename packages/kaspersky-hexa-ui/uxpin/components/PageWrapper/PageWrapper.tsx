import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'
import { buildFlexHeightChildSelectors, wrapperChildrenCss } from '../wrapperFlexLayout'

export type UXPinPageWrapperProps = {
  /** Page content. Place PageHeader, Toolbar, SectionWrapper, Table, or other page blocks here. */
  children?: React.ReactNode,
  style?: CSSProperties,
  codeComponentProps?: Partial<UXPinPageWrapperProps>,
  overriddenCodeProps?: Partial<UXPinPageWrapperProps>
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

const pageWrapperFlexHeightSelectors = buildFlexHeightChildSelectors(
  "[data-hexa-uxpin-table-height-mode='fill']",
  "[data-hexa-uxpin-section-wrapper][data-hexa-uxpin-flex-height='true']",
  "[data-hexa-uxpin-group-wrapper][data-hexa-uxpin-flex-height='true']"
)

const PageWrapperRoot = styled.div`
  ${wrapperChildrenCss}

  ${pageWrapperFlexHeightSelectors} {
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

const PageWrapper = (rawProps: UXPinPageWrapperProps): JSX.Element => {
  const {
    children,
    codeComponentProps: _codeComponentProps,
    overriddenCodeProps: _overriddenCodeProps,
    style
  } = resolveUXPinRuntimeProps(rawProps)

  return (
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
}

PageWrapper.displayName = 'PageWrapper'

export default PageWrapper
