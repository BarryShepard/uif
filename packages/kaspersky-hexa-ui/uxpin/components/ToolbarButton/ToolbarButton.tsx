import React from 'react'

import { DropdownItemProps } from '@src/dropdown/types'
import { Toolbar as HexaToolbar } from '@src/toolbar'
import { ToolbarItems } from '@src/toolbar/types'

import Icons16Pack, { ArrowDown1, Placeholder } from '@kaspersky/hexa-ui-icons/16'

import { FrameFill } from '../../preview'
import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  getUXPinElementPropSources,
  hasUXPinChildrenProp,
  isUXPinHiddenElement,
  resolveUXPinElementChildren,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import {
  dropdownNodeToOverlay,
  isUXPinDropdownElement
} from '../Dropdown/Dropdown'
import {
  isUXPinToolbarDividerElement,
  toolbarDividerElementToItem
} from '../ToolbarDivider/ToolbarDivider'

export { isUXPinHiddenElement }

export type UXPinToolbarButtonVariant = 'default' | 'dropdown' | 'toggle'
export type ToolbarButtonIconName = Exclude<keyof typeof Icons16Pack, 'default'>

export type UXPinToolbarButtonProps = {
  /** Visual button variant. */
  variant?: UXPinToolbarButtonVariant,
  /** Shows the disabled state. */
  disabled?: boolean,
  /** Shows the icon before the button text. */
  iconBefore?: boolean,
  /** Icon name for the leading icon. */
  iconBeforeSlot?: ToolbarButtonIconName,
  /** Button text. */
  text?: string,
  /** Hides the button text while keeping icons and state. */
  hideText?: boolean,
  /** Shows the icon after the button text. */
  iconAfter?: boolean,
  /** Icon name for the trailing icon. */
  iconAfterSlot?: ToolbarButtonIconName,
  /** Shows the critical indicator dot near the icon. */
  indicator?: boolean,
  /** Nested Dropdown component used as overlay for dropdown variant. */
  children?: React.ReactNode,
  /** @deprecated Use nested Dropdown child instead. */
  dropdown?: React.ReactNode,
  codeComponentProps?: Partial<UXPinToolbarButtonProps>,
  overriddenCodeProps?: Partial<UXPinToolbarButtonProps>
}

type ToolbarButtonComponent = React.FC<UXPinToolbarButtonProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinToolbarButtonProps>
}

const resolveToolbarButtonRuntimeProps = (
  rawProps: UXPinToolbarButtonProps = {}
): UXPinToolbarButtonProps => resolveUXPinRuntimeProps(
  rawProps,
  ToolbarButton.defaultProps
)

const resolveToolbarButtonChildren = (
  rawProps: UXPinToolbarButtonProps
): React.ReactNode | undefined => (
  hasUXPinChildrenProp(rawProps)
    ? resolveUXPinChildrenFromProps(rawProps)
    : undefined
)

const findToolbarButtonDropdownNode = (
  children: React.ReactNode
): React.ReactNode | undefined => {
  const childNodes = getUXPinChildrenArray(children)

  for (const child of childNodes) {
    if (!child || isUXPinHiddenElement(child)) {
      continue
    }

    if (isUXPinDropdownElement(child)) {
      return child
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    if (nestedChildren) {
      const nestedDropdown = findToolbarButtonDropdownNode(nestedChildren)

      if (nestedDropdown) {
        return nestedDropdown
      }
    }
  }

  return undefined
}

const resolveToolbarButtonDropdownNode = (
  rawProps: UXPinToolbarButtonProps
): React.ReactNode | undefined => {
  const runtimeChildren = resolveToolbarButtonChildren(rawProps)
  const nestedDropdown = runtimeChildren
    ? findToolbarButtonDropdownNode(runtimeChildren)
    : undefined

  if (nestedDropdown) {
    return nestedDropdown
  }

  const runtimeProps = resolveToolbarButtonRuntimeProps(rawProps)

  return runtimeProps.dropdown
}

type ToolbarButtonPreviewProps = Pick<
UXPinToolbarButtonProps,
'disabled' | 'hideText' | 'iconAfter' | 'iconAfterSlot' | 'iconBefore' | 'iconBeforeSlot' | 'indicator' | 'text' | 'variant'
>

const ToolbarButtonPreview = ({
  disabled = false,
  hideText = false,
  iconAfter = false,
  iconAfterSlot,
  iconBefore = false,
  iconBeforeSlot,
  indicator = false,
  text = 'Button',
  variant = 'default'
}: ToolbarButtonPreviewProps): JSX.Element => {
  const [pressed, setPressed] = React.useState(false)
  const resolvedIconBefore = resolveToolbarButtonIcon(iconBefore, iconBeforeSlot)
  const resolvedIconAfter = resolveToolbarButtonIcon(
    iconAfter,
    iconAfterSlot,
    variant === 'dropdown' ? <ArrowDown1 /> : undefined
  )

  return (
    <HexaToolbar.Button
      disabled={disabled}
      iconBefore={resolvedIconBefore}
      iconAfter={resolvedIconAfter}
      showIndicator={indicator}
      isPressed={variant === 'toggle' ? pressed : undefined}
      onClick={variant === 'toggle' ? (() => setPressed((current) => !current)) : undefined}
    >
      {hideText ? undefined : text}
    </HexaToolbar.Button>
  )
}

const TOOLBAR_BUTTON_ROLE = 'hexa-uxpin-toolbar-button'

const DEFAULT_DROPDOWN_OVERLAY: DropdownItemProps[] = [
  { children: 'Action 1' },
  { children: 'Action 2' },
  { children: 'Action 3' }
]

const hasToolbarButtonOwnShape = (props: Record<string, unknown> = {}): boolean => (
  'variant' in props ||
  'disabled' in props ||
  'iconBefore' in props ||
  'iconBeforeSlot' in props ||
  'text' in props ||
  'hideText' in props ||
  'iconAfter' in props ||
  'iconAfterSlot' in props ||
  'indicator' in props ||
  'dropdown' in props
)

const hasToolbarButtonShape = (props: Record<string, unknown> = {}): boolean => {
  const codeComponentProps = props.codeComponentProps as Record<string, unknown> | undefined
  const overriddenCodeProps = props.overriddenCodeProps as Record<string, unknown> | undefined
  const overriddenCodeComponentProps = overriddenCodeProps?.codeComponentProps as Record<string, unknown> | undefined

  return (
    hasToolbarButtonOwnShape(props) ||
    hasToolbarButtonOwnShape(codeComponentProps || {}) ||
    hasToolbarButtonOwnShape(overriddenCodeProps || {}) ||
    hasToolbarButtonOwnShape(overriddenCodeComponentProps || {})
  )
}

const isToolbarButtonIdentity = (value?: string): boolean => {
  const normalizedValue = value?.toLowerCase()

  return Boolean(
    normalizedValue &&
    normalizedValue.includes('toolbar') &&
    normalizedValue.includes('button')
  )
}

const hasToolbarButtonIdentity = (
  node: React.ReactNode
): boolean => getUXPinElementPropSources(node).some((props) => (
  props.name === 'ToolbarButton' ||
  isToolbarButtonIdentity(typeof props.uxpId === 'string' ? props.uxpId : undefined) ||
  isToolbarButtonIdentity(typeof props.id === 'string' ? props.id : undefined) ||
  isToolbarButtonIdentity(typeof props.presetElementId === 'string' ? props.presetElementId : undefined) ||
  isToolbarButtonIdentity(typeof props.uxpinPresetElementId === 'string' ? props.uxpinPresetElementId : undefined)
))

const resolveNamedIcon = (
  iconName?: ToolbarButtonIconName | React.ReactNode
): React.ReactNode => {
  if (!iconName) {
    return null
  }

  if (React.isValidElement(iconName)) {
    return iconName
  }

  if (typeof iconName !== 'string') {
    return iconName
  }

  const IconComponent = Icons16Pack[iconName as ToolbarButtonIconName]

  return IconComponent ? <IconComponent /> : null
}

const resolveToolbarButtonIcon = (
  enabled: boolean | undefined,
  slot?: ToolbarButtonIconName | React.ReactNode,
  fallback?: React.ReactNode
): React.ReactNode | undefined => (
  enabled ? resolveNamedIcon(slot) ?? fallback ?? <Placeholder /> : undefined
)

export const resolveToolbarButtonItemKey = (
  node: React.ReactNode,
  prefix: string,
  index: number
): string => {
  if (React.isValidElement(node) && typeof node.key === 'string' && node.key.length) {
    return node.key
  }

  return `${prefix}-${index + 1}`
}

export const isUXPinToolbarButtonElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as ToolbarButtonComponent)?.uxpinRole === TOOLBAR_BUTTON_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'ToolbarButton' ||
      (node.type as { name?: string })?.name === 'ToolbarButton'
    )
  ) ||
  hasToolbarButtonIdentity(node) ||
  getUXPinElementPropSources(node).some(hasToolbarButtonOwnShape)
)

export const toolbarButtonElementToItem = (
  element: React.ReactNode,
  index: number,
  prefix = 'toolbar-button'
): ToolbarItems => {
  const elementProps = (getUXPinElementProps(element) || {}) as UXPinToolbarButtonProps
  const runtimeProps = resolveToolbarButtonRuntimeProps(elementProps)
  const {
    disabled = false,
    dropdown,
    hideText = false,
    iconAfter = false,
    iconAfterSlot,
    iconBefore = false,
    iconBeforeSlot,
    indicator = false,
    text = `Button ${index + 1}`,
    variant = 'default'
  } = runtimeProps

  const key = resolveToolbarButtonItemKey(element, prefix, index)
  const resolvedIconBefore = resolveToolbarButtonIcon(iconBefore, iconBeforeSlot)
  const resolvedIconAfter = resolveToolbarButtonIcon(
    iconAfter,
    iconAfterSlot,
    variant === 'dropdown' ? <ArrowDown1 /> : undefined
  )

  const resolvedLabel = hideText ? undefined : text

  if (variant === 'dropdown') {
    const dropdownOverlay = dropdownNodeToOverlay(
      resolveToolbarButtonDropdownNode(elementProps) ?? dropdown
    )

    return {
      type: 'dropdown',
      key,
      label: resolvedLabel,
      disabled,
      iconBefore: resolvedIconBefore,
      iconAfter: resolvedIconAfter,
      showIndicator: indicator,
      overlay: dropdownOverlay?.items ?? DEFAULT_DROPDOWN_OVERLAY,
      popupMaxHeight: dropdownOverlay?.maxHeight,
      selectedItemsKeys: dropdownOverlay?.selectedKeys
    }
  }

  if (variant === 'toggle') {
    return {
      type: 'children',
      key,
      children: (
        <ToolbarButtonPreview
          disabled={disabled}
          hideText={hideText}
          iconAfter={iconAfter}
          iconAfterSlot={iconAfterSlot}
          iconBefore={iconBefore}
          iconBeforeSlot={iconBeforeSlot}
          indicator={indicator}
          text={text}
          variant={variant}
        />
      )
    }
  }

  return {
    type: 'button',
    key,
    label: resolvedLabel,
    disabled,
    iconBefore: resolvedIconBefore,
    iconAfter: resolvedIconAfter,
    showIndicator: indicator
  }
}

export const toolbarNodeToItem = (
  node: React.ReactNode,
  index: number,
  prefix: string
): ToolbarItems | null => {
  if (!node || isUXPinHiddenElement(node)) {
    return null
  }

  if (
    React.isValidElement<{ children?: React.ReactNode }>(node) &&
    node.type === React.Fragment
  ) {
    return null
  }

  if (isUXPinToolbarButtonElement(node)) {
    return toolbarButtonElementToItem(node, index, prefix)
  }

  if (isUXPinToolbarDividerElement(node)) {
    return toolbarDividerElementToItem(node, index, prefix)
  }

  if (React.isValidElement(node)) {
    return {
      type: 'children',
      key: resolveToolbarButtonItemKey(node, prefix, index),
      children: node
    }
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return {
      type: 'children',
      key: `${prefix}-${index + 1}`,
      children: <span>{node}</span>
    }
  }

  return null
}

export const toolbarChildrenToItems = (
  children: React.ReactNode,
  prefix: string
): ToolbarItems[] => {
  const items: ToolbarItems[] = []

  getUXPinChildrenArray(children).forEach((child, index) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    const item = toolbarNodeToItem(child, index, prefix)

    if (item) {
      items.push(item)
    }
  })

  return items
}

const ToolbarButton: ToolbarButtonComponent = (props: UXPinToolbarButtonProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
  const runtimeProps = resolveToolbarButtonRuntimeProps(props)

  return (
    <div ref={rootRef} style={{ width: '100%' }}>
      <FrameFill style={{ height: 'fit-content' }}>
        <ToolbarButtonPreview
          disabled={runtimeProps.disabled}
          hideText={runtimeProps.hideText}
          iconAfter={runtimeProps.iconAfter}
          iconAfterSlot={runtimeProps.iconAfterSlot}
          iconBefore={runtimeProps.iconBefore}
          iconBeforeSlot={runtimeProps.iconBeforeSlot}
          indicator={runtimeProps.indicator}
          text={runtimeProps.text}
          variant={runtimeProps.variant}
        />
      </FrameFill>
    </div>
  )
}

ToolbarButton.uxpinRole = TOOLBAR_BUTTON_ROLE
ToolbarButton.displayName = 'ToolbarButton'
ToolbarButton.defaultProps = {
  variant: 'default',
  disabled: false,
  iconBefore: false,
  text: 'Button',
  hideText: false,
  iconAfter: false,
  indicator: false
}

export default ToolbarButton
