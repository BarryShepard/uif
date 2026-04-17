import { Indicator } from '@src/indicator'
import { DividerProps, RowProps, SubmenuItemProps as HexaSubmenuItemProps, TitleProps } from '@src/submenu/types'
import React from 'react'
import styled from 'styled-components'

import Icons16Pack, { Placeholder } from '@kaspersky/hexa-ui-icons/16'
import { ArrowDownSolid, ArrowRightSolid } from '@kaspersky/hexa-ui-icons/8'

import { FrameFill } from '../../preview'
import {
  getUXPinPropSources,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'

export type UXPinSubmenuItemVariant = 'title' | 'divider' | 'item'

export type SubmenuItemIconName = Exclude<keyof typeof Icons16Pack, 'default'>

export type UXPinSubmenuItemProps = {
  /** Item presentation variant. */
  variant?: UXPinSubmenuItemVariant,
  /** Disables item interactions. */
  disabled?: boolean,
  /** Shows nested children expanded by default. */
  expanded?: boolean,
  /** Marks item as selected by default in parent Submenu. */
  selected?: boolean,
  /** Main item text. */
  text?: string,
  /** Shows secondary description text. */
  description?: boolean,
  /** Secondary description text. */
  descriptionText?: string,
  /** Shows the leading icon slot. */
  iconBefore?: boolean,
  /** Icon name for the leading slot. */
  iconBeforeSlot?: SubmenuItemIconName,
  /** Shows trailing slot content. */
  elementAfter?: boolean,
  /** Slot for trailing content. */
  elementAfterSlot?: React.ReactNode,
  /** Shows critical notification indicator. */
  notification?: boolean,
  /** Nested SubmenuItem nodes and optional content for the row. */
  children?: React.ReactNode,
  overriddenCodeProps?: Partial<UXPinSubmenuItemProps>
}

type SubmenuItemComponent = React.FC<UXPinSubmenuItemProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinSubmenuItemProps>
}

export type SubmenuItemsBuildResult = {
  items: HexaSubmenuItemProps[],
  selectedKey?: string
}

const SUBMENU_ITEM_ROLE = 'hexa-uxpin-submenu-item'

const SUBMENU_ITEM_DEFAULT_PROPS: Partial<UXPinSubmenuItemProps> = {
  variant: 'item',
  disabled: false,
  expanded: false,
  selected: false,
  text: 'Submenu item',
  description: false,
  descriptionText: 'Description',
  iconBefore: false,
  iconBeforeSlot: 'Placeholder',
  elementAfter: false,
  notification: false
}

const hasSubmenuItemShape = (props: Record<string, unknown> = {}): boolean => (
  'iconBefore' in props ||
  'iconBeforeSlot' in props ||
  'elementAfterSlot' in props ||
  (
    'text' in props &&
    'descriptionText' in props &&
    'notification' in props
  )
)

const resolveSubmenuItemRuntimeProps = (
  rawProps: UXPinSubmenuItemProps = {}
): UXPinSubmenuItemProps => ({
  ...resolveUXPinRuntimeProps(rawProps, SUBMENU_ITEM_DEFAULT_PROPS)
})

const resolveNamedIcon = (iconName?: SubmenuItemIconName): React.ReactNode => {
  if (!iconName) {
    return null
  }

  const IconComponent = Icons16Pack[iconName]

  return IconComponent ? <IconComponent /> : null
}

const resolveIconBefore = (
  iconBefore?: boolean,
  iconBeforeSlot?: SubmenuItemIconName
): React.ReactNode | undefined => (
  iconBefore ? resolveNamedIcon(iconBeforeSlot) ?? <Placeholder /> : undefined
)

const resolveElementAfter = (
  elementAfter?: boolean,
  elementAfterSlot?: React.ReactNode
): React.ReactNode | undefined => (
  elementAfter ? elementAfterSlot ?? <Placeholder /> : undefined
)

const resolveSubmenuItemKey = (
  element: React.ReactElement<UXPinSubmenuItemProps>,
  prefix: string,
  index: number
): string => {
  if (typeof element.key === 'string' && element.key.length) {
    return element.key
  }

  return `${prefix}-${index + 1}`
}

export const isUXPinSubmenuItemElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinSubmenuItemProps> => (
  React.isValidElement(node) &&
  (
    (node.type as SubmenuItemComponent)?.uxpinRole === SUBMENU_ITEM_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'SubmenuItem' ||
    (node.type as { name?: string })?.name === 'SubmenuItem' ||
    getUXPinPropSources(node.props).some(hasSubmenuItemShape)
  )
)

const getSubmenuItemChildren = (
  children: React.ReactNode
): Array<React.ReactElement<UXPinSubmenuItemProps>> => {
  const items: Array<React.ReactElement<UXPinSubmenuItemProps>> = []

  React.Children.forEach(children, (child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinSubmenuItemElement(child)) {
      items.push(child)
      return
    }

    if (React.isValidElement(child)) {
      const nestedChildren = resolveUXPinElementChildren(child)

      if (nestedChildren) {
        items.push(...getSubmenuItemChildren(nestedChildren))
      }
    }
  })

  return items
}

export const hasUXPinSubmenuItemChildren = (children: React.ReactNode): boolean => (
  getSubmenuItemChildren(children).length > 0
)

const getSubmenuItemContent = (
  children: React.ReactNode
): React.ReactNode | undefined => {
  const content = React.Children.toArray(children).filter((child) => (
    child &&
    !isUXPinHiddenElement(child) &&
    !isUXPinSubmenuItemElement(child) &&
    !(
      React.isValidElement(child) &&
      hasUXPinSubmenuItemChildren(resolveUXPinElementChildren(child))
    )
  ))

  return content.length ? <>{content}</> : undefined
}

export const submenuItemElementToItem = (
  element: React.ReactElement<UXPinSubmenuItemProps>,
  index: number,
  prefix: string
): SubmenuItemsBuildResult => {
  const runtimeProps = resolveSubmenuItemRuntimeProps(element.props)
  const {
    description = false,
    descriptionText,
    disabled = false,
    elementAfter = false,
    elementAfterSlot,
    expanded = false,
    iconBefore = false,
    iconBeforeSlot,
    notification = false,
    selected = false,
    text = `Submenu item ${index + 1}`,
    variant = 'item'
  } = runtimeProps
  const key = resolveSubmenuItemKey(element, prefix, index)
  const children = runtimeProps.children ?? resolveUXPinElementChildren(element)

  if (variant === 'divider') {
    return {
      items: [{ type: 'divider' } satisfies DividerProps]
    }
  }

  if (variant === 'title') {
    return {
      items: [{
        type: 'title',
        key,
        text
      } satisfies TitleProps]
    }
  }

  const nested = submenuChildrenToItems(children, `${key}-child`)
  const nestedRows = nested.items.filter((item): item is RowProps => item.type === 'row')
  const content = getSubmenuItemContent(children)
  const item: RowProps = {
    type: 'row',
    key,
    text,
    disabled,
    expanded,
    description: description ? descriptionText : undefined,
    iconBefore: resolveIconBefore(iconBefore, iconBeforeSlot),
    elementAfter: resolveElementAfter(elementAfter, elementAfterSlot),
    notification: notification ? { type: 'indicator', mode: 'critical' } : undefined,
    children: nestedRows.length ? nestedRows : undefined,
    content
  }

  return {
    items: [item],
    selectedKey: selected ? key : nested.selectedKey
  }
}

export const submenuChildrenToItems = (
  children: React.ReactNode,
  prefix = 'submenu-item'
): SubmenuItemsBuildResult => {
  const result: SubmenuItemsBuildResult = {
    items: []
  }

  getSubmenuItemChildren(children).forEach((element, index) => {
    const next = submenuItemElementToItem(element, index, prefix)

    result.items.push(...next.items)
    result.selectedKey = result.selectedKey ?? next.selectedKey
  })

  return result
}

const SubmenuItemPreviewRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 232px;
  gap: 2px;

  .submenu-item-preview-row {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    min-height: 32px;
    padding: 6px 8px;
    border-radius: 8px;
    color: var(--submenu_item--text--enabled);
    background: var(--submenu_item--bg--enabled);
    box-sizing: border-box;
  }

  .submenu-item-preview-row.selected {
    color: var(--submenu_item--text--enabled_selected);
    background: var(--submenu_item--bg--enabled_selected);
  }

  .submenu-item-preview-row.disabled {
    color: var(--submenu_item--text--disabled);
    background: var(--submenu_item--bg--disabled);
  }

  .submenu-item-preview-title {
    min-height: 16px;
    margin: 16px 8px 0;
    color: var(--submenu--text);
    font-size: 12px;
    line-height: 16px;
  }

  .submenu-item-preview-divider {
    height: 1px;
    margin: 4px 8px;
    background: var(--divider--bg--light);
  }

  .submenu-item-preview-icon,
  .submenu-item-preview-after,
  .submenu-item-preview-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    color: currentColor;
  }

  .submenu-item-preview-labels {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    gap: 2px;
  }

  .submenu-item-preview-text {
    line-height: 20px;
  }

  .submenu-item-preview-row.truncate .submenu-item-preview-text,
  .submenu-item-preview-row.truncate .submenu-item-preview-description {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .submenu-item-preview-description {
    color: var(--text--secondary, var(--submenu_item--text--description--enabled));
    font-size: 12px;
    line-height: 16px;
  }

  .submenu-item-preview-row.disabled .submenu-item-preview-description {
    color: var(--submenu_item--text--description--disabled);
  }

  .submenu-item-preview-children {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-left: 20px;
  }
`

const SubmenuItemPreviewFrame = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()

  return (
    <div ref={rootRef}>
      <FrameFill style={{ height: 'fit-content' }}>
        <SubmenuItemPreviewRoot>
          {children}
        </SubmenuItemPreviewRoot>
      </FrameFill>
    </div>
  )
}

const SubmenuItem = (rawProps: UXPinSubmenuItemProps): JSX.Element => {
  const {
    children,
    description = false,
    descriptionText = 'Description',
    disabled = false,
    elementAfter = false,
    elementAfterSlot,
    expanded = false,
    iconBefore = false,
    iconBeforeSlot,
    notification = false,
    selected = false,
    text = 'Submenu item',
    variant = 'item'
  } = resolveSubmenuItemRuntimeProps(rawProps)
  const nestedItems = getSubmenuItemChildren(children)

  if (variant === 'divider') {
    return (
      <SubmenuItemPreviewFrame>
        <div className="submenu-item-preview-divider" />
      </SubmenuItemPreviewFrame>
    )
  }

  if (variant === 'title') {
    return (
      <SubmenuItemPreviewFrame>
        <div className="submenu-item-preview-title">{text}</div>
      </SubmenuItemPreviewFrame>
    )
  }

  return (
    <SubmenuItemPreviewFrame>
      <div className={[
        'submenu-item-preview-row',
        'truncate',
        selected ? 'selected' : '',
        disabled ? 'disabled' : ''
      ].filter(Boolean).join(' ')}
      >
        {nestedItems.length > 0 && (
          <span className="submenu-item-preview-arrow">
            {expanded ? <ArrowDownSolid /> : <ArrowRightSolid />}
          </span>
        )}
        {iconBefore && (
          <span className="submenu-item-preview-icon">
            {resolveIconBefore(iconBefore, iconBeforeSlot)}
          </span>
        )}
        <span className="submenu-item-preview-labels">
          <span className="submenu-item-preview-text">{text}</span>
          {description && (
            <span className="submenu-item-preview-description">{descriptionText}</span>
          )}
        </span>
        {elementAfter && (
          <span className="submenu-item-preview-after">
            {resolveElementAfter(elementAfter, elementAfterSlot)}
          </span>
        )}
        {notification && (
          <span className="submenu-item-preview-after">
            <Indicator mode="critical" />
          </span>
        )}
      </div>
      {expanded && nestedItems.length > 0 && (
        <div className="submenu-item-preview-children">
          {nestedItems}
        </div>
      )}
    </SubmenuItemPreviewFrame>
  )
}

SubmenuItem.uxpinRole = SUBMENU_ITEM_ROLE
SubmenuItem.displayName = 'SubmenuItem'

SubmenuItem.defaultProps = SUBMENU_ITEM_DEFAULT_PROPS

export const defaultSubmenuItemChildren = (
  <>
    <SubmenuItem
      variant="item"
      text="Overview"
      selected
      iconBefore
      iconBeforeSlot="Browser"
    />
    <SubmenuItem
      variant="item"
      text="Assets"
      iconBefore
      iconBeforeSlot="StorageServer"
    />
    <SubmenuItem
      variant="item"
      text="Policies"
      iconBefore
      iconBeforeSlot="Shield"
    />
    <SubmenuItem
      variant="item"
      text="Reports"
      iconBefore
      iconBeforeSlot="Folder"
    />
    <SubmenuItem
      variant="item"
      text="Settings"
      iconBefore
      iconBeforeSlot="SettingsGear"
    />
  </>
)

export default SubmenuItem
