import React from 'react'

import { Tag as HexaTag } from '@src/tag'
import { TagProps } from '@src/tag/types'

import { FrameFill } from '../../preview'
import { resolveUXPinRuntimeProps } from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

export type UXPinTagProps = TagProps & {
  /** Tag text. */
  label?: React.ReactNode,
  codeComponentProps?: Partial<TagProps>,
  overriddenCodeProps?: Partial<TagProps>
}

const Tag = (rawProps: UXPinTagProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame({ width: 'fit-content' })
  const {
    codeComponentProps: _codeComponentProps,
    label = 'Tag',
    mode = 'neutral',
    overriddenCodeProps: _overriddenCodeProps,
    size = 'small',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)

  return (
    <div ref={rootRef} style={{ display: 'inline-block', height: 'fit-content', width: 'fit-content' }}>
      <FrameFill style={{ height: 'fit-content', width: 'fit-content' }}>
        <HexaTag
          label={label}
          mode={mode}
          size={size}
          {...props}
        />
      </FrameFill>
    </div>
  )
}

Tag.displayName = 'Tag'

export default Tag
