import React from 'react'

import { ToggleButton as HexaToggleButton } from '@src/toggle-button'
import {
  ToggleButtonMode,
  ToggleButtonProps,
  ToggleButtonSize
} from '@src/toggle-button/types'

import Icons16Pack, { Placeholder } from '@kaspersky/hexa-ui-icons/16'

import {
  getUXPinElementProps,
  getUXPinElementPropSources,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'

export type ToggleButtonIconName = Exclude<keyof typeof Icons16Pack, 'default'>
export type UXPinToggleButtonVariant = 'button' | 'iconbutton'
export type UXPinToggleButtonSize = ToggleButtonSize | 'extrasmall'

export type UXPinToggleButtonProps = Omit<ToggleButtonProps, 'elementAfter' | 'iconBefore' | 'size' | 'value'> & {
  /** UXPin preset element id. */
  uxpId?: string,
  /** Button presentation variant. */
  variant?: UXPinToggleButtonVariant,
  /** Visual size. */
  size?: UXPinToggleButtonSize,
  /** Shows icon before text. */
  iconBefore?: boolean,
  /** Icon name before text. */
  iconBeforeSlot?: ToggleButtonIconName | React.ReactNode,
  /** Shows trailing element. */
  elementAfter?: boolean,
  /** Icon name for trailing element. */
  elementAfterSlot?: ToggleButtonIconName | React.ReactNode,
  /** Button value. */
  value?: string,
  codeComponentProps?: Partial<UXPinToggleButtonProps>,
  overriddenCodeProps?: Partial<UXPinToggleButtonProps>
}

type ToggleButtonComponent = React.FC<UXPinToggleButtonProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinToggleButtonProps>
}

const TOGGLE_BUTTON_ROLE = 'hexa-uxpin-toggle-button'

const hasToggleButtonShape = (props: Record<string, unknown> = {}): boolean => (
  'selected' in props ||
  'loading' in props ||
  'iconBeforeSlot' in props ||
  'elementAfterSlot' in props ||
  (
    'text' in props &&
    'mode' in props &&
    'value' in props
  )
)

export const isUXPinToggleButtonElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as ToggleButtonComponent)?.uxpinRole === TOGGLE_BUTTON_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'ToggleButton' ||
      (node.type as { name?: string })?.name === 'ToggleButton'
    )
  ) ||
  getUXPinElementPropSources(node).some((props) => (
    hasToggleButtonShape(props) ||
    props.name === 'ToggleButton' ||
    (
      typeof props.uxpId === 'string' &&
      props.uxpId.toLowerCase().includes('toggle-button')
    ) ||
    (
      typeof props.presetElementId === 'string' &&
      props.presetElementId.toLowerCase().includes('toggle-button')
    ) ||
    (
      typeof props.uxpinPresetElementId === 'string' &&
      props.uxpinPresetElementId.toLowerCase().includes('toggle-button')
    )
  ))
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

const resolveToggleButtonPresetDefaults = (
  node: React.ReactNode
): Partial<UXPinToggleButtonProps> => {
  const id = getFirstStringProp(node, ['uxpId', 'presetElementId', 'uxpinPresetElementId'])?.toLowerCase()

  if (!id) {
    return {}
  }

  if (id.includes('toggle-button-group-item-1')) {
    return { text: 'One', value: 'one', selected: true }
  }

  if (id.includes('toggle-button-group-item-2')) {
    return { text: 'Two', value: 'two', selected: false }
  }

  if (id.includes('toggle-button-group-item-3')) {
    return { text: 'Three', value: 'three', selected: false }
  }

  return {}
}

export const resolveToggleButtonRuntimeProps = (
  rawProps: UXPinToggleButtonProps = {}
): UXPinToggleButtonProps => resolveUXPinRuntimeProps(rawProps, ToggleButton.defaultProps)

export const resolveToggleButtonNodeRuntimeProps = (
  node: React.ReactNode
): UXPinToggleButtonProps => (
  resolveUXPinRuntimeProps(
    (getUXPinElementProps(node) || {}) as UXPinToggleButtonProps,
    {
      ...ToggleButton.defaultProps,
      ...resolveToggleButtonPresetDefaults(node)
    }
  )
)

export const resolveToggleButtonSize = (
  size?: UXPinToggleButtonSize
): ToggleButtonSize => (
  size === 'extrasmall' ? 'extraSmall' : size ?? 'medium'
)

const resolveNamedIcon = (iconName?: ToggleButtonIconName | React.ReactNode): React.ReactNode => {
  if (!iconName) {
    return null
  }

  if (React.isValidElement(iconName)) {
    return iconName
  }

  if (typeof iconName !== 'string') {
    return iconName
  }

  const IconComponent = Icons16Pack[iconName as ToggleButtonIconName]

  return IconComponent ? <IconComponent /> : null
}

export const resolveToggleButtonIcon = (
  enabled?: boolean,
  slot?: ToggleButtonIconName | React.ReactNode
): React.ReactNode | undefined => (
  enabled ? resolveNamedIcon(slot) ?? <Placeholder /> : undefined
)

const ToggleButton: ToggleButtonComponent = (rawProps: UXPinToggleButtonProps): JSX.Element => {
  const {
    codeComponentProps: _codeComponentProps,
    elementAfter = false,
    elementAfterSlot = 'Placeholder',
    iconBefore = false,
    iconBeforeSlot = 'Placeholder',
    mode = 'marina',
    onChange,
    overriddenCodeProps: _overriddenCodeProps,
    selected = false,
    size = 'medium',
    text = 'Toggle',
    uxpId: _uxpId,
    value = 'toggle',
    variant = 'button',
    ...props
  } = resolveToggleButtonRuntimeProps(rawProps)
  const iconOnly = variant === 'iconbutton'
  const [previewSelected, setPreviewSelected] = React.useState(Boolean(selected))

  React.useEffect(() => {
    setPreviewSelected(Boolean(selected))
  }, [selected])

  return (
    <HexaToggleButton
      elementAfter={resolveToggleButtonIcon(elementAfter && !iconOnly, elementAfterSlot)}
      iconBefore={resolveToggleButtonIcon(iconOnly || iconBefore, iconBeforeSlot)}
      mode={mode as ToggleButtonMode}
      onChange={(nextValue, checked) => {
        setPreviewSelected(checked)
        onChange?.(nextValue, checked)
      }}
      selected={previewSelected}
      size={resolveToggleButtonSize(size)}
      text={iconOnly ? undefined : text}
      value={value}
      {...props}
    />
  )
}

ToggleButton.uxpinRole = TOGGLE_BUTTON_ROLE
ToggleButton.displayName = 'ToggleButton'
ToggleButton.defaultProps = {
  variant: 'button',
  mode: 'marina',
  size: 'medium',
  selected: false,
  disabled: false,
  loading: false,
  iconBefore: false,
  iconBeforeSlot: 'Placeholder',
  text: 'Toggle',
  value: 'toggle',
  elementAfter: false,
  elementAfterSlot: 'Placeholder'
}

export default ToggleButton
