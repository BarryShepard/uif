import React from 'react'

type AutoHeightMergeFrameOptions = {
  width?: React.CSSProperties['width'],
  minWidth?: React.CSSProperties['minWidth'],
  skipIfWithinSelector?: string
}

const WRAPPER_BOUNDARY_SELECTOR = [
  '[data-hexa-uxpin-page-wrapper="true"]',
  '[data-hexa-uxpin-section-wrapper="true"]',
  '[data-hexa-uxpin-group-wrapper="true"]'
].join(', ')

export const useAutoHeightMergeFrame = (
  options: AutoHeightMergeFrameOptions = {}
): React.RefObject<HTMLDivElement> => {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const {
    minWidth,
    skipIfWithinSelector,
    width
  } = options

  React.useLayoutEffect(() => {
    if (skipIfWithinSelector && rootRef.current?.closest(skipIfWithinSelector)) {
      return undefined
    }

    const rootElement = rootRef.current
    const mergeComponent = rootElement?.closest('.merge-component') as HTMLDivElement | null

    if (!mergeComponent) {
      return undefined
    }

    const wrapperBoundary = rootElement?.parentElement?.closest(WRAPPER_BOUNDARY_SELECTOR)
    const wrapperMergeComponent = wrapperBoundary?.closest('.merge-component')

    if (wrapperMergeComponent === mergeComponent) {
      return undefined
    }

    const previousHeight = mergeComponent.style.height
    const previousMinHeight = mergeComponent.style.minHeight
    const previousWidth = mergeComponent.style.width
    const previousMinWidth = mergeComponent.style.minWidth

    mergeComponent.style.height = 'auto'
    mergeComponent.style.minHeight = '0'

    if (width !== undefined) {
      mergeComponent.style.width = String(width)
    }

    if (minWidth !== undefined) {
      mergeComponent.style.minWidth = String(minWidth)
    }

    return () => {
      mergeComponent.style.height = previousHeight
      mergeComponent.style.minHeight = previousMinHeight
      mergeComponent.style.width = previousWidth
      mergeComponent.style.minWidth = previousMinWidth
    }
  }, [minWidth, skipIfWithinSelector, width])

  return rootRef
}
