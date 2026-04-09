import { Route } from '@src/breadcrumbs/types'
import React from 'react'
import styled from 'styled-components'

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

export const resolveBreadcrumbItemChildren = (
  children: React.ReactNode
): Array<React.ReactElement<UXPinBreadcrumbItemProps>> => {
  const items: Array<React.ReactElement<UXPinBreadcrumbItemProps>> = []

  React.Children.forEach(children, (child) => {
    if (!child) {
      return
    }

    if (isUXPinBreadcrumbItemElement(child)) {
      items.push(child)
      return
    }

    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.props?.children
    ) {
      items.push(...resolveBreadcrumbItemChildren(child.props.children))
    }
  })

  return items
}

const hasOnlyDefaultBreadcrumbItem = (
  items: Array<React.ReactElement<UXPinBreadcrumbItemProps>>
): boolean => (
  items.length === 1 &&
  (items[0].props.text ?? DEFAULT_BREADCRUMB_ITEM_TEXT) === DEFAULT_BREADCRUMB_ITEM_TEXT &&
  items[0].props.current !== false &&
  items[0].props.disabled !== true
)

export const breadcrumbItemElementsToRoutes = (
  children: React.ReactNode
): Route[] => {
  const items = resolveBreadcrumbItemChildren(children)

  if (!items.length) {
    return []
  }

  const hasExplicitCurrent = items.some((item) => item.props.current === true)

  return items.map((item, index) => {
    const { current, disabled, text } = item.props
    const isCurrent = hasExplicitCurrent ? current === true : index === items.length - 1

    return {
      name: text ?? `Step ${index + 1}`,
      disabled,
      url: isCurrent ? undefined : `#/breadcrumb-item-${index + 1}`
    }
  })
}

export const hasManualBreadcrumbItems = (
  children: React.ReactNode
): boolean => {
  const items = resolveBreadcrumbItemChildren(children)

  return items.length > 0 && !hasOnlyDefaultBreadcrumbItem(items)
}

const BreadcrumbItem: BreadcrumbItemComponent = ({
  current = true,
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
  current: true,
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
