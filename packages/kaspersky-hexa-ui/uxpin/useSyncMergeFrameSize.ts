import React, { useLayoutEffect, useRef } from 'react'

type SyncMergeFrameSizeOptions = {
  syncHeight?: boolean,
  syncWidth?: boolean
}

export const useSyncMergeFrameSize = ({
  syncHeight = true,
  syncWidth = true
}: SyncMergeFrameSizeOptions = {}): React.RefObject<HTMLDivElement> => {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const rootElement = rootRef.current
    const mergeComponent = rootElement?.closest('.merge-component') as HTMLDivElement | null

    if (!rootElement || !mergeComponent) {
      return undefined
    }

    const previousHeight = mergeComponent.style.height
    const previousMinHeight = mergeComponent.style.minHeight
    const previousWidth = mergeComponent.style.width
    const previousMinWidth = mergeComponent.style.minWidth

    const syncFrameSize = (): void => {
      const { height, width } = rootElement.getBoundingClientRect()

      if (syncHeight && height > 0) {
        const nextHeight = `${Math.ceil(height)}px`
        mergeComponent.style.height = nextHeight
        mergeComponent.style.minHeight = nextHeight
      }

      if (syncWidth && width > 0) {
        const nextWidth = `${Math.ceil(width)}px`
        mergeComponent.style.width = nextWidth
        mergeComponent.style.minWidth = nextWidth
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
    }
  }, [syncHeight, syncWidth])

  return rootRef
}
