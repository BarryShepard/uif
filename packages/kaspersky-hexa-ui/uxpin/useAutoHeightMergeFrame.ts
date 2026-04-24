import React from 'react'

import { FILL_SHELL_ATTRIBUTE } from './components/wrapperFlexLayout'

type AutoHeightMergeFrameOptions = {
  disabled?: boolean,
  markFillShell?: boolean,
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
    disabled,
    markFillShell = false,
    minWidth,
    skipIfWithinSelector,
    width
  } = options

  React.useLayoutEffect(() => {
    if (disabled && !markFillShell) {
      return undefined
    }

    const rootElement = rootRef.current
    const mergeComponent = rootElement?.closest('.merge-component') as HTMLDivElement | null

    if (!mergeComponent) {
      return undefined
    }

    const previousFillShell = mergeComponent.getAttribute(FILL_SHELL_ATTRIBUTE)

    if (markFillShell) {
      mergeComponent.setAttribute(FILL_SHELL_ATTRIBUTE, 'true')
    }

    const previousHeight = mergeComponent.style.height
    const previousMinHeight = mergeComponent.style.minHeight
    const previousWidth = mergeComponent.style.width
    const previousMinWidth = mergeComponent.style.minWidth

    const restoreFillShell = () => {
      if (!markFillShell) {
        return
      }

      if (previousFillShell === null) {
        mergeComponent.removeAttribute(FILL_SHELL_ATTRIBUTE)
      } else {
        mergeComponent.setAttribute(FILL_SHELL_ATTRIBUTE, previousFillShell)
      }
    }

    if (skipIfWithinSelector && rootElement?.closest(skipIfWithinSelector)) {
      return restoreFillShell
    }

    if (!disabled) {
      const wrapperBoundary = rootElement?.parentElement?.closest(WRAPPER_BOUNDARY_SELECTOR)
      const wrapperMergeComponent = wrapperBoundary?.closest('.merge-component')

      if (wrapperMergeComponent === mergeComponent) {
        return restoreFillShell
      }

      mergeComponent.style.height = 'auto'
      mergeComponent.style.minHeight = '0'

      if (width !== undefined) {
        mergeComponent.style.width = String(width)
      }

      if (minWidth !== undefined) {
        mergeComponent.style.minWidth = String(minWidth)
      }
    }

    return () => {
      restoreFillShell()
      mergeComponent.style.height = previousHeight
      mergeComponent.style.minHeight = previousMinHeight
      mergeComponent.style.width = previousWidth
      mergeComponent.style.minWidth = previousMinWidth
    }
  }, [disabled, markFillShell, minWidth, skipIfWithinSelector, width])

  return rootRef
}
