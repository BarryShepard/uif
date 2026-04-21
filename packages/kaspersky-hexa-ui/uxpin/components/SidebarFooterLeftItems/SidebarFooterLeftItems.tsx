import React from 'react'
import styled from 'styled-components'

import { FrameFill } from '../../preview'
import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  getUXPinElementPropSources,
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
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

const SIDEBAR_FOOTER_BUTTON_PRESET_DEFAULTS: Record<string, Partial<React.ComponentProps<typeof Button>>> = {
  'sidebar-footer-save': { mode: 'primary', size: 'medium', text: 'Save', style: { width: 'fit-content' } },
  'sidebar-footer-cancel': { mode: 'secondary', size: 'medium', text: 'Cancel', style: { width: 'fit-content' } },
  'sidebar-footer-delete': { mode: 'dangerOutlined', size: 'medium', text: 'Delete', style: { width: 'fit-content' } }
}

type SidebarFooterButtonProps = React.ComponentProps<typeof Button> & {
  codeComponentId?: string,
  codeComponentPresetId?: string,
  codeComponentProps?: Partial<React.ComponentProps<typeof Button>>,
  hidden?: boolean,
  id?: string,
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

const getFirstStringProp = (
  node: React.ReactNode,
  propNames: string[]
): string | undefined => {
  for (const props of getUXPinElementPropSources(node)) {
    for (const propName of propNames) {
      const value = props[propName]

      if (typeof value === 'string' && value.length) {
        return value
      }
    }
  }

  return undefined
}

const getSidebarFooterButtonIdentity = (
  node: React.ReactNode
): string => {
  const identities = [
    React.isValidElement(node) && typeof node.key === 'string' ? node.key : undefined,
    ...getUXPinElementPropSources(node).flatMap((props) => [
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

const getSidebarFooterButtonKey = (
  node: React.ReactNode,
  index: number,
  prefix: string
): string => {
  const explicitId = getFirstStringProp(node, ['id', 'uxpId'])

  if (explicitId) {
    return `${prefix}-${explicitId}`
  }

  const presetId = getFirstStringProp(node, ['presetElementId', 'uxpinPresetElementId'])

  if (presetId) {
    return `${prefix}-${presetId}-${index + 1}`
  }

  if (React.isValidElement(node) && typeof node.key === 'string' && node.key.length) {
    return `${prefix}-${node.key}`
  }

  return `${prefix}-button-${index + 1}`
}

const getSidebarFooterButtonDefaults = (
  node: React.ReactNode,
  identity: string
): Partial<React.ComponentProps<typeof Button>> => {
  const presetId = getFirstStringProp(node, ['presetElementId', 'uxpinPresetElementId'])
  const presetDefaults = presetId ? SIDEBAR_FOOTER_BUTTON_PRESET_DEFAULTS[presetId] : undefined

  if (presetDefaults) {
    return presetDefaults
  }

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

export const isUXPinSidebarFooterButtonElement = (
  node: React.ReactNode
): boolean => {
  const identity = getSidebarFooterButtonIdentity(node)
  const propSources = getUXPinElementPropSources(node)
  const isFooterSlotWrapper = (
    identity.includes('sidebar-footer-left-items') ||
    identity.includes('sidebar-footer-right-items')
  )
  const hasKnownFooterButtonPreset = (
    identity.includes('sidebar-footer-save') ||
    identity.includes('sidebar-footer-cancel') ||
    identity.includes('sidebar-footer-delete')
  )
  const isConcreteButton = React.isValidElement(node) && (
    (node.type as { displayName?: string })?.displayName === 'Button' ||
    (node.type as { name?: string })?.name === 'Button'
  )
  const isCodeComponent = propSources.some((props) => (
    props.uxpinTargetElementType === 'CodeComponent'
  ))
  const hasButtonProps = propSources.some((props) => (
    'mode' in props ||
    'text' in props ||
    'disabled' in props ||
    'flex' in props
  ))

  return (
    !isFooterSlotWrapper &&
    (
      isConcreteButton ||
      hasKnownFooterButtonPreset ||
      identity.includes('button') ||
      (isCodeComponent && hasButtonProps)
    )
  )
}

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

  if (!isUXPinSidebarFooterButtonElement(child)) {
    return React.isValidElement(child) || typeof child === 'string' || typeof child === 'number'
      ? child
      : null
  }

  const childProps = getUXPinElementProps(child)

  if (!childProps) {
    return null
  }

  const identity = getSidebarFooterButtonIdentity(child)
  const runtimeProps = resolveUXPinRuntimeProps<SidebarFooterButtonProps>(
    childProps as SidebarFooterButtonProps,
    getSidebarFooterButtonDefaults(child, identity)
  )
  const {
    codeComponentId: _codeComponentId,
    codeComponentPresetId: _codeComponentPresetId,
    codeComponentProps: _codeComponentProps,
    hidden: _hidden,
    id: _id,
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
      key={getSidebarFooterButtonKey(child, index, prefix)}
      {...buttonProps}
    />
  )
}

export const renderSidebarFooterButtonChildren = (
  children: React.ReactNode,
  prefix = 'sidebar-footer-button'
): React.ReactNode[] => (
  getUXPinChildrenArray(children)
    .map((child, index) => renderSidebarFooterButtonChild(child, index, prefix))
    .filter((child): child is React.ReactNode => child !== null && child !== undefined)
)

const resolveElementChildren = (
  element: React.ReactNode
): React.ReactNode => {
  const props = getUXPinElementProps(element) as UXPinSidebarFooterLeftItemsProps | undefined

  if (!props || !hasUXPinChildrenProp(props)) {
    return DEFAULT_SIDEBAR_FOOTER_LEFT_ITEMS_CHILDREN
  }

  const resolvedChildren = resolveUXPinChildrenFromProps(props)

  if (resolvedChildren === undefined) {
    return DEFAULT_SIDEBAR_FOOTER_LEFT_ITEMS_CHILDREN
  }

  return renderSidebarFooterButtonChildren(
    resolvedChildren,
    'sidebar-footer-left-items'
  )
}

const hasSidebarFooterLeftItemsSlotIdentity = (
  node: React.ReactNode
): boolean => (
  (
    (React.isValidElement(node) && typeof node.key === 'string' && node.key.includes(SIDEBAR_FOOTER_LEFT_ITEMS_SLOT_ID)) ||
    getUXPinElementPropSources(node).some((props) => (
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
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as SidebarFooterLeftItemsComponent)?.uxpinRole === SIDEBAR_FOOTER_LEFT_ITEMS_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'SidebarFooterLeftItems' ||
      (node.type as { name?: string })?.name === 'SidebarFooterLeftItems'
    )
  ) ||
  hasSidebarFooterLeftItemsSlotIdentity(node)
)

export const resolveSidebarFooterLeftItemsChildren = (
  children: React.ReactNode
): React.ReactNode | undefined => {
  const elements: React.ReactNode[] = []

  getUXPinChildrenArray(children).forEach((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinSidebarFooterLeftItemsElement(child)) {
      elements.push(resolveElementChildren(child))
      return
    }

    const nestedChildren = resolveUXPinElementChildren(child)
    const nested = nestedChildren
      ? resolveSidebarFooterLeftItemsChildren(nestedChildren)
      : undefined

    if (nested) {
      elements.push(
        <React.Fragment key={`sidebar-footer-left-items-nested-${elements.length + 1}`}>
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
        <React.Fragment key={`sidebar-footer-left-items-${index + 1}`}>
          {element}
        </React.Fragment>
      ))}
    </>
  )
}

const SidebarFooterLeftItems: SidebarFooterLeftItemsComponent = (
  rawProps: UXPinSidebarFooterLeftItemsProps
): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const runtimeChildren = resolveUXPinChildrenFromProps(rawProps)
  const resolvedChildren = hasUXPinChildrenProp(rawProps) && runtimeChildren !== undefined
    ? renderSidebarFooterButtonChildren(
      runtimeChildren,
      'sidebar-footer-left-items-preview'
    )
    : DEFAULT_SIDEBAR_FOOTER_LEFT_ITEMS_CHILDREN

  return (
    <div ref={rootRef} style={{ width: 'fit-content', minWidth: 0, maxWidth: '100%' }}>
      <FrameFill
        style={{
          height: 'fit-content',
          width: 'fit-content',
          minWidth: 0,
          maxWidth: '100%'
        }}
      >
        <PreviewRoot>
          {resolvedChildren}
        </PreviewRoot>
      </FrameFill>
    </div>
  )
}

SidebarFooterLeftItems.uxpinRole = SIDEBAR_FOOTER_LEFT_ITEMS_ROLE
SidebarFooterLeftItems.displayName = 'SidebarFooterLeftItems'

export default SidebarFooterLeftItems
