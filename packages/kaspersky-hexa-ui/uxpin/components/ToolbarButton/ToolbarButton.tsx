import React from 'react'

import { DropdownItemProps } from '@src/dropdown/types'
import { Toolbar as HexaToolbar } from '@src/toolbar'
import { ToolbarItems } from '@src/toolbar/types'

import { ArrowDown1, Placeholder } from '@kaspersky/hexa-ui-icons/16'

import { FrameFill } from '../../preview'
import {
  getUXPinElementPropSources,
  isUXPinHiddenElement
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import { dropdownNodeToOverlay } from '../Dropdown/Dropdown'

export { isUXPinHiddenElement }

export type UXPinToolbarButtonVariant = 'default' | 'dropdown' | 'toggle'

export type UXPinToolbarButtonProps = {
  /** Visual button variant. */
  variant?: UXPinToolbarButtonVariant,
  /** Shows the disabled state. */
  disabled?: boolean,
  /** Shows the icon before the button text. */
  iconBefore?: boolean,
  /** Slot for the leading icon. */
  iconBeforeSlot?: React.ReactNode,
  /** Button text. */
  text?: string,
  /** Hides the button text while keeping icons and state. */
  hideText?: boolean,
  /** Shows the icon after the button text. */
  iconAfter?: boolean,
  /** Slot for the trailing icon. */
  iconAfterSlot?: React.ReactNode,
  /** Shows the critical indicator dot near the icon. */
  indicator?: boolean,
  /** Dropdown instance used as overlay for dropdown variant. */
  dropdown?: React.ReactNode,
  overriddenCodeProps?: Partial<UXPinToolbarButtonProps>
}

type ToolbarButtonComponent = React.FC<UXPinToolbarButtonProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinToolbarButtonProps>
}

const resolveToolbarButtonRuntimeProps = (
  rawProps: UXPinToolbarButtonProps = {}
): UXPinToolbarButtonProps => ({
  ...(ToolbarButton.defaultProps || {}),
  ...rawProps,
  ...(rawProps.overriddenCodeProps || {})
})

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
  const overriddenCodeProps = props.overriddenCodeProps as Record<string, unknown> | undefined

  return hasToolbarButtonOwnShape(props) || hasToolbarButtonOwnShape(overriddenCodeProps || {})
}

const resolveToolbarButtonIcon = (
  enabled: boolean | undefined,
  slot: React.ReactNode,
  fallback?: React.ReactNode
): React.ReactNode | undefined => (
  enabled ? slot ?? fallback ?? <Placeholder /> : undefined
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
): node is React.ReactElement<UXPinToolbarButtonProps> => (
  React.isValidElement(node) &&
  (
    (node.type as ToolbarButtonComponent)?.uxpinRole === TOOLBAR_BUTTON_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'ToolbarButton' ||
    (node.type as { name?: string })?.name === 'ToolbarButton' ||
    hasToolbarButtonShape((node.props as Record<string, unknown>) || {})
  )
)

export const toolbarButtonElementToItem = (
  element: React.ReactElement<UXPinToolbarButtonProps>,
  index: number,
  prefix = 'toolbar-button'
): ToolbarItems => {
  const runtimeProps = resolveToolbarButtonRuntimeProps(element.props)
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
    const dropdownOverlay = dropdownNodeToOverlay(dropdown)

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

  React.Children.forEach(children, (child, index) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.type === React.Fragment
    ) {
      items.push(...toolbarChildrenToItems(child.props.children, `${prefix}-${index + 1}`))
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
