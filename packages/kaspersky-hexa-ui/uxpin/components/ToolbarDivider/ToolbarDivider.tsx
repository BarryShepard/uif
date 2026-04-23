import React from 'react'

import { ToolbarDivider as HexaToolbarDivider } from '@src/toolbar'
import { ToolbarItems } from '@src/toolbar/types'

import { FrameFill } from '../../preview'
import { getUXPinElementPropSources } from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

export type UXPinToolbarDividerProps = {
  /** UXPin preset element id. */
  uxpId?: string,
  overriddenCodeProps?: Partial<UXPinToolbarDividerProps>
}

type ToolbarDividerComponent = React.FC<UXPinToolbarDividerProps> & {
  uxpinRole?: string
}

const TOOLBAR_DIVIDER_ROLE = 'hexa-uxpin-toolbar-divider'

const hasToolbarDividerIdentity = (
  node: React.ReactNode
): boolean => (
  getUXPinElementPropSources(node).some((props) => (
    props.name === 'ToolbarDivider' ||
    (
      typeof props.uxpId === 'string' &&
      props.uxpId.toLowerCase().includes('toolbar-divider')
    ) ||
    (
      typeof props.presetElementId === 'string' &&
      props.presetElementId.toLowerCase().includes('toolbar-divider')
    ) ||
    (
      typeof props.uxpinPresetElementId === 'string' &&
      props.uxpinPresetElementId.toLowerCase().includes('toolbar-divider')
    )
  ))
)

export const resolveToolbarDividerItemKey = (
  node: React.ReactNode,
  prefix: string,
  index: number
): string => {
  if (React.isValidElement(node) && typeof node.key === 'string' && node.key.length) {
    return node.key
  }

  return `${prefix}-${index + 1}`
}

export const isUXPinToolbarDividerElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinToolbarDividerProps> => (
  React.isValidElement(node) &&
  (
    (node.type as ToolbarDividerComponent)?.uxpinRole === TOOLBAR_DIVIDER_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'ToolbarDivider' ||
    (node.type as { name?: string })?.name === 'ToolbarDivider' ||
    hasToolbarDividerIdentity(node)
  )
)

export const toolbarDividerElementToItem = (
  element: React.ReactElement<UXPinToolbarDividerProps>,
  index: number,
  prefix = 'toolbar-divider'
): ToolbarItems<'divider'> => ({
  type: 'divider',
  key: resolveToolbarDividerItemKey(element, prefix, index)
})

const ToolbarDivider: ToolbarDividerComponent = (_props: UXPinToolbarDividerProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame({ width: 'fit-content' })

  return (
    <div ref={rootRef} style={{ width: 'fit-content' }}>
      <FrameFill style={{ height: 'fit-content', width: 'fit-content' }}>
        <HexaToolbarDivider />
      </FrameFill>
    </div>
  )
}

ToolbarDivider.uxpinRole = TOOLBAR_DIVIDER_ROLE
ToolbarDivider.displayName = 'ToolbarDivider'

export default ToolbarDivider
