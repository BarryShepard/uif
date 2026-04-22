import React from 'react'

import { ToggleButtonGroup as HexaToggleButtonGroup } from '@src/toggle-button/ToggleButtonGroup'
import { ToggleButtonGroupProps, ToggleButtonProps } from '@src/toggle-button/types'

import {
  getUXPinChildrenArray,
  getUXPinElementPropSources,
  resolveUXPinElementChildren,
  resolveUXPinMergedChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../../visibility'
import ToggleButton, {
  isUXPinToggleButtonElement,
  resolveToggleButtonIcon,
  resolveToggleButtonNodeRuntimeProps,
  resolveToggleButtonSize,
  UXPinToggleButtonProps,
  UXPinToggleButtonVariant
} from '../ToggleButton/ToggleButton'

export type UXPinToggleButtonGroupSize = 'small' | 'medium' | 'meduim'

export type UXPinToggleButtonGroupProps = Omit<ToggleButtonGroupProps, 'items' | 'onChange' | 'value'> & {
  /** Group item size. */
  size?: UXPinToggleButtonGroupSize,
  /** Group item presentation variant. */
  variant?: UXPinToggleButtonVariant,
  /** Editable ToggleButton children. */
  children?: React.ReactNode,
  /** Controlled selected values. */
  value?: string[],
  /** Handler. */
  onChange?: ToggleButtonGroupProps['onChange'],
  codeComponentProps?: Partial<UXPinToggleButtonGroupProps>,
  overriddenCodeProps?: Partial<UXPinToggleButtonGroupProps>
}

const DEFAULT_TOGGLE_BUTTON_GROUP_CHILDREN = (
  <>
    <ToggleButton uxpId="toggle-button-group-item-1" text="One" value="one" selected />
    <ToggleButton uxpId="toggle-button-group-item-2" text="Two" value="two" />
    <ToggleButton uxpId="toggle-button-group-item-3" text="Three" value="three" />
  </>
)

const normalizeGroupSize = (size?: UXPinToggleButtonGroupSize): 'small' | 'medium' => (
  size === 'meduim' ? 'medium' : size ?? 'medium'
)

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

const getToggleButtonValue = (
  node: React.ReactNode,
  index: number
): string => {
  if (React.isValidElement(node) && typeof node.key === 'string' && node.key.length) {
    return node.key
  }

  return getFirstStringProp(node, ['id', 'uxpId', 'presetElementId', 'uxpinPresetElementId']) ?? `toggle-${index + 1}`
}

const getToggleButtonChildren = (
  children: React.ReactNode
): React.ReactNode[] => (
  getUXPinChildrenArray(children).flatMap((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return []
    }

    if (isUXPinToggleButtonElement(child)) {
      return [child]
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    return nestedChildren ? getToggleButtonChildren(nestedChildren) : []
  })
)

const toggleButtonChildrenToItems = (
  children: React.ReactNode,
  groupSize: UXPinToggleButtonGroupSize,
  groupVariant: UXPinToggleButtonVariant
): { items: ToggleButtonProps[], selectedValues: string[] } => {
  const result: { items: ToggleButtonProps[], selectedValues: string[] } = {
    items: [],
    selectedValues: []
  }

  getToggleButtonChildren(children).forEach((child, index) => {
    const props = resolveToggleButtonNodeRuntimeProps(child)
    const value = props.value && props.value !== 'toggle'
      ? props.value
      : getToggleButtonValue(child, index)
    const variant = groupVariant
    const iconOnly = variant === 'iconbutton'
    const item: ToggleButtonProps = {
      disabled: props.disabled,
      elementAfter: resolveToggleButtonIcon(Boolean(props.elementAfter && !iconOnly), props.elementAfterSlot),
      iconBefore: resolveToggleButtonIcon(Boolean(iconOnly || props.iconBefore), props.iconBeforeSlot),
      loading: props.loading,
      mode: props.mode,
      selected: props.selected,
      size: resolveToggleButtonSize(normalizeGroupSize(groupSize)),
      text: iconOnly ? undefined : props.text,
      value
    }

    if (props.selected) {
      result.selectedValues.push(value)
    }

    result.items.push(item)
  })

  return result
}

const ToggleButtonGroup = (rawProps: UXPinToggleButtonGroupProps): JSX.Element => {
  const {
    children = DEFAULT_TOGGLE_BUTTON_GROUP_CHILDREN,
    codeComponentProps: _codeComponentProps,
    disabled = false,
    loading = false,
    onChange = () => undefined,
    overriddenCodeProps: _overriddenCodeProps,
    size = 'medium',
    value,
    variant = 'button',
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const resolvedChildren = resolveUXPinMergedChildrenFromProps(rawProps, DEFAULT_TOGGLE_BUTTON_GROUP_CHILDREN)
  const built = toggleButtonChildrenToItems(resolvedChildren, size, variant)
  const fallbackBuilt = toggleButtonChildrenToItems(DEFAULT_TOGGLE_BUTTON_GROUP_CHILDREN, size, variant)
  const items = built.items.length ? built.items : fallbackBuilt.items
  const inferredValue = built.selectedValues.length
    ? built.selectedValues
    : [items[0]?.value].filter(Boolean)
  const controlledValue = Array.isArray(value) && value.length ? value : undefined
  const initialValue = controlledValue ?? inferredValue
  const [previewValue, setPreviewValue] = React.useState<string[]>(initialValue)
  const inferredValueSignature = [
    ...items.map((item) => item.value),
    '__selected__',
    ...inferredValue
  ].join('|')

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setPreviewValue(controlledValue)
    }
  }, [controlledValue])

  React.useEffect(() => {
    if (controlledValue === undefined) {
      setPreviewValue(inferredValue)
    }
  }, [controlledValue, inferredValueSignature])

  const resolvedValue = controlledValue ?? previewValue

  return (
    <HexaToggleButtonGroup
      disabled={disabled}
      items={items}
      loading={loading}
      onChange={(nextValue) => {
        if (controlledValue === undefined) {
          setPreviewValue(nextValue)
        }
        onChange?.(nextValue)
      }}
      value={resolvedValue}
      {...props}
    />
  )
}

ToggleButtonGroup.displayName = 'ToggleButtonGroup'

export default ToggleButtonGroup
