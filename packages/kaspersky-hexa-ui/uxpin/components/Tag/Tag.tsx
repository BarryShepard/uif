import React from 'react'
import styled from 'styled-components'

import { Tag as HexaTag } from '@src/tag'
import { TagProps } from '@src/tag/types'

import { FrameFill } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'

export type UXPinTagProps = TagProps & {
  /** UXPin preset element id. */
  uxpId?: string,
  /** Tag text. */
  label?: React.ReactNode,
  codeComponentProps?: Partial<TagProps>,
  overriddenCodeProps?: Partial<TagProps>
}

const TagRoot = styled.div`
  display: inline-flex;
  flex: 0 0 auto;
  height: fit-content;
  max-width: none;
  vertical-align: top;
  width: fit-content;

  .ant-tag {
    align-items: flex-start;
    height: auto;
    margin: 0;
    max-width: none;
    min-height: 20px;
    white-space: nowrap;
  }

  .kl-components-tag-text {
    overflow: visible;
    text-overflow: clip;
    white-space: nowrap;
  }
`

const useSyncTagMergeFrame = (): React.RefObject<HTMLDivElement> => {
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const rootElement = rootRef.current
    const mergeComponent = rootElement?.closest('.merge-component') as HTMLDivElement | null

    if (!rootElement || !mergeComponent) {
      return undefined
    }

    const previousHeight = mergeComponent.style.height
    const previousMinHeight = mergeComponent.style.minHeight
    const previousWidth = mergeComponent.style.width
    const previousMinWidth = mergeComponent.style.minWidth
    const previousMaxWidth = mergeComponent.style.maxWidth

    const syncFrameSize = (): void => {
      const tagElement = rootElement.querySelector('.ant-tag') as HTMLElement | null
      const measuredElement = tagElement ?? rootElement
      const { height, width } = measuredElement.getBoundingClientRect()

      if (height > 0) {
        const nextHeight = `${Math.ceil(height)}px`
        mergeComponent.style.height = nextHeight
        mergeComponent.style.minHeight = nextHeight
      }

      if (width > 0) {
        const nextWidth = `${Math.ceil(width)}px`
        mergeComponent.style.width = nextWidth
        mergeComponent.style.minWidth = nextWidth
        mergeComponent.style.maxWidth = nextWidth
      }
    }

    syncFrameSize()

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(syncFrameSize)
      : undefined
    const tagElement = rootElement.querySelector('.ant-tag') as HTMLElement | null

    resizeObserver?.observe(rootElement)
    if (tagElement) {
      resizeObserver?.observe(tagElement)
    }
    const frameId = window.requestAnimationFrame(syncFrameSize)
    window.addEventListener('resize', syncFrameSize)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncFrameSize)
      mergeComponent.style.height = previousHeight
      mergeComponent.style.minHeight = previousMinHeight
      mergeComponent.style.width = previousWidth
      mergeComponent.style.minWidth = previousMinWidth
      mergeComponent.style.maxWidth = previousMaxWidth
    }
  }, [])

  return rootRef
}

const Tag = (rawProps: UXPinTagProps): JSX.Element => {
  const rootRef = useSyncTagMergeFrame()
  const {
    codeComponentProps: _codeComponentProps,
    label = 'Tag',
    mode = 'neutral',
    overriddenCodeProps: _overriddenCodeProps,
    size = 'small',
    uxpId: _uxpId,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)

  return (
    <TagRoot ref={rootRef}>
      <FrameFill style={{ height: 'fit-content', width: 'fit-content' }}>
        <HexaTag
          label={label}
          mode={mode}
          size={size}
          {...props}
        />
      </FrameFill>
    </TagRoot>
  )
}

Tag.displayName = 'Tag'

export default Tag
