import React from 'react'
import styled from 'styled-components'

import { FrameFill } from '../../preview'
import {
  getUXPinPropSources,
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinElementChildren,
} from '../../uxpinRuntime'
import Button from '../Button/Button'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'
import { renderSidebarFooterButtonChildren } from '../SidebarFooterLeftItems/SidebarFooterLeftItems'

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
  width: fit-content;
  gap: var(--spacing--gap_related, 8px);
`

export const DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN = (
  <Button mode="dangerOutlined" size="medium" text="Delete" style={{ width: 'fit-content' }} />
)

const resolveElementChildren = (
  element: React.ReactElement<UXPinSidebarFooterRightItemsProps>
): React.ReactNode => {
  if (!hasUXPinChildrenProp(element.props)) {
    return DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN
  }

  return renderSidebarFooterButtonChildren(
    resolveUXPinChildrenFromProps(element.props),
    'sidebar-footer-right-items'
  )
}

const hasSidebarFooterRightItemsSlotIdentity = (
  node: React.ReactNode
): boolean => (
  React.isValidElement(node) &&
  (
    (typeof node.key === 'string' && node.key.includes(SIDEBAR_FOOTER_RIGHT_ITEMS_SLOT_ID)) ||
    getUXPinPropSources(node.props).some((props) => (
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
): node is React.ReactElement<UXPinSidebarFooterRightItemsProps> => (
  React.isValidElement(node) &&
  (
    (node.type as SidebarFooterRightItemsComponent)?.uxpinRole === SIDEBAR_FOOTER_RIGHT_ITEMS_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'SidebarFooterRightItems' ||
    (node.type as { name?: string })?.name === 'SidebarFooterRightItems' ||
    hasSidebarFooterRightItemsSlotIdentity(node)
  )
)

export const resolveSidebarFooterRightItemsChildren = (
  children: React.ReactNode
): React.ReactNode | undefined => {
  const elements: Array<React.ReactElement<UXPinSidebarFooterRightItemsProps>> = []

  React.Children.forEach(children, (child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinSidebarFooterRightItemsElement(child)) {
      elements.push(child)
      return
    }

    if (React.isValidElement(child)) {
      const nestedChildren = resolveUXPinElementChildren(child)
      const nested = nestedChildren
        ? resolveSidebarFooterRightItemsChildren(nestedChildren)
        : undefined

      if (nested) {
        elements.push(
          <SidebarFooterRightItems key={`sidebar-footer-right-items-nested-${elements.length + 1}`}>
            {nested}
          </SidebarFooterRightItems>
        )
      }
    }
  })

  if (!elements.length) {
    return undefined
  }

  return (
    <>
      {elements.map((element, index) => (
        <React.Fragment key={element.key ?? `sidebar-footer-right-items-${index + 1}`}>
          {resolveElementChildren(element)}
        </React.Fragment>
      ))}
    </>
  )
}

const SidebarFooterRightItems: SidebarFooterRightItemsComponent = (
  rawProps: UXPinSidebarFooterRightItemsProps
): JSX.Element => {
  const resolvedChildren = hasUXPinChildrenProp(rawProps)
    ? renderSidebarFooterButtonChildren(
      resolveUXPinChildrenFromProps(rawProps),
      'sidebar-footer-right-items-preview'
    )
    : DEFAULT_SIDEBAR_FOOTER_RIGHT_ITEMS_CHILDREN

  return (
    <FrameFill style={{ height: 'fit-content', width: 'fit-content' }}>
      <PreviewRoot>
        {resolvedChildren}
      </PreviewRoot>
    </FrameFill>
  )
}

SidebarFooterRightItems.uxpinRole = SIDEBAR_FOOTER_RIGHT_ITEMS_ROLE
SidebarFooterRightItems.displayName = 'SidebarFooterRightItems'

export default SidebarFooterRightItems
