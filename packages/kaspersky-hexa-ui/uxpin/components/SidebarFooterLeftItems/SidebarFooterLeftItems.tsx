import React from 'react'
import styled from 'styled-components'

import { FrameFill } from '../../preview'
import {
  getUXPinPropSources,
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import Button from '../Button/Button'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'

export type UXPinSidebarFooterLeftItemsProps = {
  children?: React.ReactNode,
  overriddenCodeProps?: {
    children?: React.ReactNode
  }
}

type SidebarFooterLeftItemsComponent = React.FC<UXPinSidebarFooterLeftItemsProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinSidebarFooterLeftItemsProps>
}

const SIDEBAR_FOOTER_LEFT_ITEMS_ROLE = 'hexa-uxpin-sidebar-footer-left-items'
const SIDEBAR_FOOTER_LEFT_ITEMS_SLOT_ID = 'sidebar-footer-left-items'

const PreviewRoot = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  gap: var(--spacing--gap_related, 8px);
`

export const DEFAULT_SIDEBAR_FOOTER_LEFT_ITEMS_CHILDREN = (
  <>
    <Button mode="primary" size="medium" text="Save" style={{ width: 'fit-content' }} />
    <Button mode="secondary" size="medium" text="Cancel" style={{ width: 'fit-content' }} />
  </>
)

type SidebarFooterButtonProps = React.ComponentProps<typeof Button> & {
  codeComponentId?: string,
  codeComponentPresetId?: string,
  codeComponentProps?: Partial<React.ComponentProps<typeof Button>>,
  hidden?: boolean,
  isHidden?: boolean,
  isVisible?: boolean,
  name?: string,
  overriddenCodeProps?: Partial<React.ComponentProps<typeof Button>>,
  presetElementId?: string,
  stateIa?: string,
  uxpinHidden?: boolean,
  uxpinPresetElementId?: string,
  uxpinTargetElementType?: string,
  uxpId?: string,
  visible?: boolean
}

const getSidebarFooterButtonIdentity = (
  node: React.ReactElement
): string => {
  const identities = [
    typeof node.key === 'string' ? node.key : undefined,
    ...getUXPinPropSources(node.props).flatMap((props) => [
      props.name,
      props.presetElementId,
      props.uxpId,
      props.uxpinPresetElementId,
      props.id
    ])
  ]

  return identities
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase()
}

const getSidebarFooterButtonDefaults = (
  identity: string
): Partial<React.ComponentProps<typeof Button>> => {
  if (identity.includes('delete')) {
    return { mode: 'dangerOutlined', size: 'medium', text: 'Delete' }
  }

  if (identity.includes('cancel')) {
    return { mode: 'secondary', size: 'medium', text: 'Cancel' }
  }

  if (identity.includes('save')) {
    return { mode: 'primary', size: 'medium', text: 'Save' }
  }

  return { mode: 'primary', size: 'medium', text: 'Button' }
}

const isSidebarFooterButtonElement = (
  node: React.ReactNode
): node is React.ReactElement<SidebarFooterButtonProps> => (
  React.isValidElement(node) &&
  (
    (node.type as { displayName?: string })?.displayName === 'Button' ||
    (node.type as { name?: string })?.name === 'Button' ||
    getSidebarFooterButtonIdentity(node).includes('sidebar-footer-') ||
    getSidebarFooterButtonIdentity(node).includes('button') ||
    getUXPinPropSources(node.props).some((props) => (
      props.uxpinTargetElementType === 'CodeComponent' &&
      (
        'mode' in props ||
        'text' in props ||
        'disabled' in props ||
        'flex' in props
      )
    ))
  )
)

const renderSidebarFooterButtonChild = (
  child: React.ReactNode,
  index: number,
  prefix: string
): React.ReactNode => {
  if (!child || isUXPinHiddenElement(child)) {
    return null
  }

  if (
    React.isValidElement<{ children?: React.ReactNode }>(child) &&
    child.type === React.Fragment
  ) {
    return (
      <React.Fragment key={`${prefix}-fragment-${index + 1}`}>
        {renderSidebarFooterButtonChildren(child.props.children, `${prefix}-fragment-${index + 1}`)}
      </React.Fragment>
    )
  }

  if (!isSidebarFooterButtonElement(child)) {
    return child
  }

  const identity = getSidebarFooterButtonIdentity(child)
  const runtimeProps = resolveUXPinRuntimeProps<SidebarFooterButtonProps>(
    child.props,
    getSidebarFooterButtonDefaults(identity)
  )
  const {
    codeComponentId: _codeComponentId,
    codeComponentPresetId: _codeComponentPresetId,
    codeComponentProps: _codeComponentProps,
    hidden: _hidden,
    isHidden: _isHidden,
    isVisible: _isVisible,
    name: _name,
    overriddenCodeProps: _overriddenCodeProps,
    presetElementId: _presetElementId,
    stateIa: _stateIa,
    uxpinHidden: _uxpinHidden,
    uxpinPresetElementId: _uxpinPresetElementId,
    uxpinTargetElementType: _uxpinTargetElementType,
    uxpId: _uxpId,
    visible: _visible,
    ...buttonProps
  } = runtimeProps

  return (
    <Button
      key={child.key ?? `${prefix}-button-${index + 1}`}
      {...buttonProps}
    />
  )
}

export const renderSidebarFooterButtonChildren = (
  children: React.ReactNode,
  prefix = 'sidebar-footer-button'
): React.ReactNode[] => (
  React.Children.toArray(children)
    .map((child, index) => renderSidebarFooterButtonChild(child, index, prefix))
    .filter((child): child is React.ReactNode => child !== null && child !== undefined)
)

const resolveElementChildren = (
  element: React.ReactElement<UXPinSidebarFooterLeftItemsProps>
): React.ReactNode => {
  if (!hasUXPinChildrenProp(element.props)) {
    return DEFAULT_SIDEBAR_FOOTER_LEFT_ITEMS_CHILDREN
  }

  return renderSidebarFooterButtonChildren(
    resolveUXPinChildrenFromProps(element.props),
    'sidebar-footer-left-items'
  )
}

const hasSidebarFooterLeftItemsSlotIdentity = (
  node: React.ReactNode
): boolean => (
  React.isValidElement(node) &&
  (
    (typeof node.key === 'string' && node.key.includes(SIDEBAR_FOOTER_LEFT_ITEMS_SLOT_ID)) ||
    getUXPinPropSources(node.props).some((props) => (
      (typeof props.uxpId === 'string' && props.uxpId.includes(SIDEBAR_FOOTER_LEFT_ITEMS_SLOT_ID)) ||
      (typeof props.id === 'string' && props.id.includes(SIDEBAR_FOOTER_LEFT_ITEMS_SLOT_ID)) ||
      (typeof props.presetElementId === 'string' && props.presetElementId.includes(SIDEBAR_FOOTER_LEFT_ITEMS_SLOT_ID)) ||
      (typeof props.uxpinPresetElementId === 'string' && props.uxpinPresetElementId.includes(SIDEBAR_FOOTER_LEFT_ITEMS_SLOT_ID)) ||
      props.name === 'SidebarFooterLeftItems'
    ))
  )
)

export const isUXPinSidebarFooterLeftItemsElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinSidebarFooterLeftItemsProps> => (
  React.isValidElement(node) &&
  (
    (node.type as SidebarFooterLeftItemsComponent)?.uxpinRole === SIDEBAR_FOOTER_LEFT_ITEMS_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'SidebarFooterLeftItems' ||
    (node.type as { name?: string })?.name === 'SidebarFooterLeftItems' ||
    hasSidebarFooterLeftItemsSlotIdentity(node)
  )
)

export const resolveSidebarFooterLeftItemsChildren = (
  children: React.ReactNode
): React.ReactNode | undefined => {
  const elements: Array<React.ReactElement<UXPinSidebarFooterLeftItemsProps>> = []

  React.Children.forEach(children, (child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinSidebarFooterLeftItemsElement(child)) {
      elements.push(child)
      return
    }

    if (React.isValidElement(child)) {
      const nestedChildren = resolveUXPinElementChildren(child)
      const nested = nestedChildren
        ? resolveSidebarFooterLeftItemsChildren(nestedChildren)
        : undefined

      if (nested) {
        elements.push(
          <SidebarFooterLeftItems key={`sidebar-footer-left-items-nested-${elements.length + 1}`}>
            {nested}
          </SidebarFooterLeftItems>
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
        <React.Fragment key={element.key ?? `sidebar-footer-left-items-${index + 1}`}>
          {resolveElementChildren(element)}
        </React.Fragment>
      ))}
    </>
  )
}

const SidebarFooterLeftItems: SidebarFooterLeftItemsComponent = (
  rawProps: UXPinSidebarFooterLeftItemsProps
): JSX.Element => {
  const resolvedChildren = hasUXPinChildrenProp(rawProps)
    ? renderSidebarFooterButtonChildren(
      resolveUXPinChildrenFromProps(rawProps),
      'sidebar-footer-left-items-preview'
    )
    : DEFAULT_SIDEBAR_FOOTER_LEFT_ITEMS_CHILDREN

  return (
    <FrameFill style={{ height: 'fit-content', width: 'fit-content' }}>
      <PreviewRoot>
        {resolvedChildren}
      </PreviewRoot>
    </FrameFill>
  )
}

SidebarFooterLeftItems.uxpinRole = SIDEBAR_FOOTER_LEFT_ITEMS_ROLE
SidebarFooterLeftItems.displayName = 'SidebarFooterLeftItems'

export default SidebarFooterLeftItems
