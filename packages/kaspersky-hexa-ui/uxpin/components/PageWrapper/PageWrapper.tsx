import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import { buildFlexHeightChildSelectors, wrapperChildrenCss } from '../wrapperFlexLayout'

export type UXPinPageWrapperProps = {
  /** Page content. Place PageHeader, Toolbar, SectionWrapper, Table, or other page blocks here. */
  children?: React.ReactNode,
  /** When enabled, the page stretches to available width. When disabled, width is fixed to the `width` value. */
  flexWidth?: boolean,
  /** Fixed page width in px used when `flexWidth` is disabled. */
  width?: number,
  style?: CSSProperties,
  codeComponentProps?: Partial<UXPinPageWrapperProps>,
  overriddenCodeProps?: Partial<UXPinPageWrapperProps>
}

const DEFAULT_PAGE_WIDTH = 1200

const pageWrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  height: '100%',
  minWidth: 0,
  minHeight: 0,
  overflow: 'auto',
  padding: 24,
  boxSizing: 'border-box'
}

const getPageWidthStyle = (flexWidth: boolean, width: number): CSSProperties => (
  flexWidth
    ? {
      width: '100%',
      maxWidth: '100%',
      flex: '1 1 auto',
      alignSelf: 'stretch'
    }
    : {
      width,
      maxWidth: '100%',
      flex: `0 1 ${width}px`,
      alignSelf: 'flex-start'
    }
)

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

const getDirectMergeComponent = (element: HTMLDivElement | null): HTMLDivElement | null => {
  const parentElement = element?.parentElement

  if (!parentElement || !parentElement.classList.contains('merge-component')) {
    return null
  }

  return parentElement as HTMLDivElement
}

const useSyncPageWrapperFrameSize = (
  rootRef: React.RefObject<HTMLDivElement>,
  options: { flexWidth: boolean }
): void => {
  const { flexWidth } = options

  React.useLayoutEffect(() => {
    const rootElement = rootRef.current
    const mergeComponent = getDirectMergeComponent(rootElement)

    if (!rootElement || !mergeComponent) {
      return undefined
    }

    const previousHeight = mergeComponent.style.height
    const previousMinHeight = mergeComponent.style.minHeight
    const previousWidth = mergeComponent.style.width
    const previousMinWidth = mergeComponent.style.minWidth
    const previousMaxWidth = mergeComponent.style.maxWidth
    const previousFlex = mergeComponent.style.flex

    const syncFrameSize = (): void => {
      const { height, width } = rootElement.getBoundingClientRect()

      if (height > 0) {
        const nextHeight = `${Math.ceil(height)}px`
        mergeComponent.style.height = nextHeight
        mergeComponent.style.minHeight = nextHeight
      }

      if (!flexWidth && width > 0) {
        const nextWidth = `${Math.ceil(width)}px`
        mergeComponent.style.width = nextWidth
        mergeComponent.style.minWidth = nextWidth
        mergeComponent.style.maxWidth = nextWidth
        mergeComponent.style.flex = `0 0 ${nextWidth}`
      }
    }

    syncFrameSize()

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(syncFrameSize)
      : undefined

    resizeObserver?.observe(rootElement)
    window.addEventListener('resize', syncFrameSize)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncFrameSize)
      mergeComponent.style.height = previousHeight
      mergeComponent.style.minHeight = previousMinHeight
      mergeComponent.style.width = previousWidth
      mergeComponent.style.minWidth = previousMinWidth
      mergeComponent.style.maxWidth = previousMaxWidth
      mergeComponent.style.flex = previousFlex
    }
  }, [flexWidth, rootRef])
}

const PageWrapper = (rawProps: UXPinPageWrapperProps): JSX.Element => {
  const {
    children,
    codeComponentProps: _codeComponentProps,
    flexWidth = true,
    overriddenCodeProps: _overriddenCodeProps,
    style,
    width = DEFAULT_PAGE_WIDTH
  } = resolveUXPinRuntimeProps(rawProps)
  const rootRef = useAutoHeightMergeFrame({
    disabled: true,
    markFillShell: true
  })
  useSyncPageWrapperFrameSize(rootRef, { flexWidth })

  return (
    <PageWrapperRoot
      ref={rootRef}
      style={mergeFrameStyle({
        ...pageWrapperStyle,
        ...getPageWidthStyle(flexWidth, width),
        ...style
      })}
      data-hexa-uxpin-page-wrapper="true"
    >
      {children ?? <EmptyPageWrapperHint />}
    </PageWrapperRoot>
  )
}

PageWrapper.defaultProps = {
  flexWidth: true,
  width: DEFAULT_PAGE_WIDTH
}

PageWrapper.displayName = 'PageWrapper'

export default PageWrapper
