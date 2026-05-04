import { Route } from '@src/breadcrumbs/types'
import React from 'react'
import styled from 'styled-components'

import {
  getUXPinChildrenArray,
  getUXPinElementPropSources,
  getUXPinElementProps,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'

export type UXPinBreadcrumbItemProps = {
  /** Visible text for the breadcrumb item. */
  text?: string,
  /** Marks the item as the current page. */
  current?: boolean,
  /** Shows the disabled state for the item. */
  disabled?: boolean
}

type BreadcrumbItemComponent = React.FC<UXPinBreadcrumbItemProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinBreadcrumbItemProps>
}

const BREADCRUMB_ITEM_ROLE = 'hexa-uxpin-breadcrumb-item'
export const DEFAULT_BREADCRUMB_ITEM_TEXT = 'Current page'

const hasBreadcrumbItemShape = (props: Record<string, unknown> = {}): boolean => (
  'text' in props ||
  'current' in props ||
  'disabled' in props
)

const hasBreadcrumbItemIdentity = (
  node: React.ReactNode
): boolean => (
  getUXPinElementPropSources(node).some((props) => (
    props.name === 'BreadcrumbItem' ||
    (typeof props.uxpId === 'string' && props.uxpId.includes('breadcrumb-item')) ||
    (typeof props.id === 'string' && props.id.includes('breadcrumb-item')) ||
    (typeof props.presetElementId === 'string' && props.presetElementId.includes('breadcrumb-item')) ||
    (typeof props.uxpinPresetElementId === 'string' && props.uxpinPresetElementId.includes('breadcrumb-item'))
  ))
)

export const isUXPinBreadcrumbItemElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinBreadcrumbItemProps> => (
  React.isValidElement(node) &&
  (
    (node.type as BreadcrumbItemComponent)?.uxpinRole === BREADCRUMB_ITEM_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'BreadcrumbItem' ||
    (node.type as { name?: string })?.name === 'BreadcrumbItem' ||
    hasBreadcrumbItemShape((node.props as Record<string, unknown>) || {})
  )
)

const getBreadcrumbItemProps = (
  node: React.ReactNode
): UXPinBreadcrumbItemProps | undefined => {
  if (React.isValidElement<UXPinBreadcrumbItemProps>(node) && isUXPinBreadcrumbItemElement(node)) {
    return node.props
  }

  const props = getUXPinElementProps(node)

  if (!props) {
    return undefined
  }

  const runtimeProps = resolveUXPinRuntimeProps(props) as UXPinBreadcrumbItemProps

  return hasBreadcrumbItemShape(runtimeProps) || hasBreadcrumbItemIdentity(node)
    ? runtimeProps
    : undefined
}

export const resolveBreadcrumbItemChildren = (
  children: React.ReactNode
): Array<React.ReactElement<UXPinBreadcrumbItemProps>> => {
  return resolveBreadcrumbItemPropsChildren(children).map((props, index) => (
    <BreadcrumbItem key={`${props.text ?? DEFAULT_BREADCRUMB_ITEM_TEXT}-${index}`} {...props} />
  ))
}

const resolveBreadcrumbItemPropsChildren = (
  children: React.ReactNode
): UXPinBreadcrumbItemProps[] => {
  const itemProps: UXPinBreadcrumbItemProps[] = []

  getUXPinChildrenArray(children).forEach((child) => {
    if (!child) {
      return
    }

    const props = getBreadcrumbItemProps(child)

    if (props) {
      itemProps.push(props)
      return
    }

    const childProps = getUXPinElementProps(child)
    const nestedChildren = childProps
      ? resolveUXPinChildrenFromProps(childProps)
      : React.isValidElement<{ children?: React.ReactNode }>(child)
        ? child.props.children
        : undefined

    if (nestedChildren) {
      itemProps.push(...resolveBreadcrumbItemPropsChildren(nestedChildren))
    }
  })

  return itemProps
}

export const breadcrumbItemElementsToRoutes = (
  children: React.ReactNode
): Route[] => {
  const items = resolveBreadcrumbItemPropsChildren(children)

  if (!items.length) {
    return []
  }

  const hasExplicitCurrent = items.some((item) => item.current === true)

  return items.map((item, index) => {
    const { current, disabled, text } = item
    const isCurrent = hasExplicitCurrent ? current === true : index === items.length - 1

    return {
      name: text ?? `Step ${index + 1}`,
      disabled,
      url: isCurrent ? undefined : `#/breadcrumb-item-${index + 1}`
    }
  })
}

const BreadcrumbItem: BreadcrumbItemComponent = ({
  current = false,
  disabled = false,
  text = DEFAULT_BREADCRUMB_ITEM_TEXT
}: UXPinBreadcrumbItemProps): JSX.Element => (
  <ItemPreview aria-hidden="true">
    <span className="label">{text}</span>
    {current && <span className="meta">current</span>}
    {disabled && <span className="meta">disabled</span>}
  </ItemPreview>
)

BreadcrumbItem.uxpinRole = BREADCRUMB_ITEM_ROLE
BreadcrumbItem.displayName = 'BreadcrumbItem'
BreadcrumbItem.defaultProps = {
  text: DEFAULT_BREADCRUMB_ITEM_TEXT,
  current: false,
  disabled: false
}

export default BreadcrumbItem

const ItemPreview = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px dashed #c6ccd8;
  background: #f8fafc;
  color: #1f1f1f;
  box-sizing: border-box;

  .label {
    font-size: 12px;
    line-height: 16px;
    font-weight: 500;
  }

  .meta {
    font-size: 10px;
    line-height: 12px;
    color: #5f6673;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
`
