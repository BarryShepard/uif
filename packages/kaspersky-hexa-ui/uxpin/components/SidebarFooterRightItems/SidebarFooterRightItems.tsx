import React from 'react'
import styled from 'styled-components'

import { FrameFill } from '../../preview'
import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  getUXPinElementPropSources,
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinElementChildren
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import Button from '../Button/Button'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'
import {
  renderSidebarFooterButtonChildren
} from '../SidebarFooterLeftItems/SidebarFooterLeftItems'

export type UXPinSidebarFooterRightItemsProps = {
  children?: React.ReactNode,
  overriddenCodeProps?: {
    children?: React.ReactNode
  }
}

type SidebarFooterRightItemsComponent = React.FC<UXPinSidebarFooterRightItemsProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinSidebarFooterRightItemsProps>
}

const SIDEBAR_FOOTER_RIGHT_ITEMS_ROLE = 'hexa-uxpin-sidebar-footer-right-items'
const SIDEBAR_FOOTER_RIGHT_ITEMS_SLOT_ID = 'sidebar-footer-right-items'

const PreviewRoot = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  width: max-content;
  gap: var(--spacing--gap_related, 8px);
`

export const DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN = (
  <Button mode="dangerOutlined" size="medium" text="Delete" style={{ width: 'fit-content' }} />
)

const resolveElementChildren = (
  element: React.ReactNode
): React.ReactNode => {
  const props = getUXPinElementProps(element) as UXPinSidebarFooterRightItemsProps | undefined

  if (!props || !hasUXPinChildrenProp(props)) {
    return DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN
  }

  const resolvedChildren = resolveUXPinChildrenFromProps(props)

  if (resolvedChildren === undefined) {
    return DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN
  }

  return renderSidebarFooterButtonChildren(
    resolvedChildren,
    'sidebar-footer-right-items'
  )
}

const hasSidebarFooterRightItemsSlotIdentity = (
  node: React.ReactNode
): boolean => (
  (
    (React.isValidElement(node) && typeof node.key === 'string' && node.key.includes(SIDEBAR_FOOTER_RIGHT_ITEMS_SLOT_ID)) ||
    getUXPinElementPropSources(node).some((props) => (
      (typeof props.uxpId === 'string' && props.uxpId.includes(SIDEBAR_FOOTER_RIGHT_ITEMS_SLOT_ID)) ||
      (typeof props.id === 'string' && props.id.includes(SIDEBAR_FOOTER_RIGHT_ITEMS_SLOT_ID)) ||
      (typeof props.presetElementId === 'string' && props.presetElementId.includes(SIDEBAR_FOOTER_RIGHT_ITEMS_SLOT_ID)) ||
      (typeof props.uxpinPresetElementId === 'string' && props.uxpinPresetElementId.includes(SIDEBAR_FOOTER_RIGHT_ITEMS_SLOT_ID)) ||
      props.name === 'SidebarFooterRightItems'
    ))
  )
)

export const isUXPinSidebarFooterRightItemsElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as SidebarFooterRightItemsComponent)?.uxpinRole === SIDEBAR_FOOTER_RIGHT_ITEMS_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'SidebarFooterRightItems' ||
      (node.type as { name?: string })?.name === 'SidebarFooterRightItems'
    )
  ) ||
  hasSidebarFooterRightItemsSlotIdentity(node)
)

export const resolveSidebarFooterRightItemsChildren = (
  children: React.ReactNode
): React.ReactNode | undefined => {
  const elements: React.ReactNode[] = []

  getUXPinChildrenArray(children).forEach((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinSidebarFooterRightItemsElement(child)) {
      const resolvedChildren = resolveElementChildren(child)

      if (!getUXPinChildrenArray(resolvedChildren).length) {
        return
      }

      elements.push(resolvedChildren)
      return
    }

    const nestedChildren = resolveUXPinElementChildren(child)
    const nested = nestedChildren
      ? resolveSidebarFooterRightItemsChildren(nestedChildren)
      : undefined

    if (nested) {
      elements.push(
        <React.Fragment key={`sidebar-footer-right-items-nested-${elements.length + 1}`}>
          {nested}
        </React.Fragment>
      )
    }
  })

  if (!elements.length) {
    return undefined
  }

  return (
    <>
      {elements.map((element, index) => (
        <React.Fragment key={`sidebar-footer-right-items-${index + 1}`}>
          {element}
        </React.Fragment>
      ))}
    </>
  )
}

const SidebarFooterRightItems: SidebarFooterRightItemsComponent = (
  rawProps: UXPinSidebarFooterRightItemsProps
): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame({
    width: 'max-content',
    minWidth: 'max-content'
  })
  const runtimeChildren = resolveUXPinChildrenFromProps(rawProps)
  const resolvedChildren = hasUXPinChildrenProp(rawProps) && runtimeChildren !== undefined
    ? renderSidebarFooterButtonChildren(
      runtimeChildren,
      'sidebar-footer-right-items-preview'
    )
    : DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN

  return (
    <div ref={rootRef} style={{ width: 'max-content', minWidth: 'max-content' }}>
      <FrameFill
        style={{
          height: 'fit-content',
          width: 'max-content',
          minWidth: 'max-content'
        }}
      >
        <PreviewRoot>
          {resolvedChildren}
        </PreviewRoot>
      </FrameFill>
    </div>
  )
}

SidebarFooterRightItems.uxpinRole = SIDEBAR_FOOTER_RIGHT_ITEMS_ROLE
SidebarFooterRightItems.displayName = 'SidebarFooterRightItems'

export default SidebarFooterRightItems
