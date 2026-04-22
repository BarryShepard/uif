import React from 'react'
import styled from 'styled-components'

import { FrameFill } from '../../preview'
import {
  getUXPinChildrenArray,
  resolveUXPinMergedChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import ActionButton from '../ActionButton/ActionButton'
import Link from '../Link/Link'
import Tag from '../Tag/Tag'
import { getVisibleUXPinChildrenArray } from '../../visibility'

export type UXPinTagGroupProps = {
  /** Tags layout direction. */
  orientation?: 'horizontal' | 'vertical',
  /** Editable Tag, Link, and ActionButton children. */
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinTagGroupProps>,
  overriddenCodeProps?: Partial<UXPinTagGroupProps>
}

const DEFAULT_TAG_GROUP_CHILDREN = (
  <>
    <Tag uxpId="tag-group-tag-1" label="Tag 1" />
    <Tag uxpId="tag-group-tag-2" label="Tag 2" mode="marina" />
    <Link uxpId="tag-group-link-1" text="Link" href="#" />
    <ActionButton uxpId="tag-group-action-1" variant="button" mode="ghost" size="small" text="Action" />
  </>
)

const TagGroupRoot = styled.div<{ $orientation: 'horizontal' | 'vertical' }>`
  display: inline-flex;
  align-items: ${({ $orientation }) => $orientation === 'vertical' ? 'flex-start' : 'center'};
  flex-direction: ${({ $orientation }) => $orientation === 'vertical' ? 'column' : 'row'};
  flex-wrap: ${({ $orientation }) => $orientation === 'vertical' ? 'nowrap' : 'wrap'};
  gap: ${({ $orientation }) => $orientation === 'vertical' ? 8 : 4}px;
  width: fit-content;
  max-width: 100%;
  min-width: 0;
`

const getTagGroupChildren = (
  children: React.ReactNode
): React.ReactNode[] => (
  getUXPinChildrenArray(children).flatMap((child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      return getTagGroupChildren(child.props.children)
    }

    return [child]
  })
)

const TagGroup = (rawProps: UXPinTagGroupProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame({ width: 'fit-content' })
  const {
    children = DEFAULT_TAG_GROUP_CHILDREN,
    codeComponentProps: _codeComponentProps,
    orientation = 'horizontal',
    overriddenCodeProps: _overriddenCodeProps
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedChildren = resolveUXPinMergedChildrenFromProps(rawProps, DEFAULT_TAG_GROUP_CHILDREN)
  const visibleChildren = getVisibleUXPinChildrenArray(getTagGroupChildren(resolvedChildren))

  return (
    <div ref={rootRef} style={{ display: 'inline-flex', flex: '0 0 auto', height: 'fit-content', width: 'fit-content' }}>
      <FrameFill style={{ height: 'fit-content', width: 'fit-content' }}>
        <TagGroupRoot $orientation={orientation}>
          {visibleChildren}
        </TagGroupRoot>
      </FrameFill>
    </div>
  )
}

TagGroup.displayName = 'TagGroup'

export default TagGroup
