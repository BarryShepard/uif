import React from 'react'

import { Checkbox as HexaCheckbox } from '@src/checkbox'
import { CheckboxOption, CheckboxProps } from '@src/checkbox/types'

import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  getUXPinElementPropSources,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../../visibility'

export type UXPinCheckboxProps = CheckboxProps & {
  /** UXPin preset element id. */
  uxpId?: string,
  /** Checkbox label text. */
  text?: string,
  codeComponentProps?: Partial<UXPinCheckboxProps>,
  overriddenCodeProps?: Partial<UXPinCheckboxProps>
}

type CheckboxComponent = React.FC<UXPinCheckboxProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinCheckboxProps>
}

type CheckboxOptionBuildOptions = {
  disabled?: boolean,
  readonly?: boolean
}

export type CheckboxOptionsBuildResult = {
  options: CheckboxOption[],
  checkedValues: Array<CheckboxProps['value']>
}

const CHECKBOX_ROLE = 'hexa-uxpin-checkbox'

const hasCheckboxShape = (props: Record<string, unknown> = {}): boolean => (
  'text' in props ||
  'checked' in props ||
  'indeterminate' in props ||
  (
    'children' in props &&
    'value' in props
  )
)

const getCheckboxText = (
  props: UXPinCheckboxProps,
  index: number
): React.ReactNode => {
  if (props.text) {
    return props.text
  }

  if (typeof props.children === 'string' || typeof props.children === 'number') {
    return props.children
  }

  return `Option ${index + 1}`
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

const resolveCheckboxPresetDefaults = (
  node: React.ReactNode
): Partial<UXPinCheckboxProps> => {
  const id = getFirstStringProp(node, ['uxpId', 'presetElementId', 'uxpinPresetElementId'])?.toLowerCase()
  const itemNumber = id?.match(/checkbox-group-item-(\d+)/)?.[1]

  if (!itemNumber) {
    return {}
  }

  return {
    checked: itemNumber === '1',
    text: `Option ${itemNumber}`,
    value: `option-${itemNumber}`
  }
}

export const resolveUXPinCheckboxRuntimeProps = (
  rawProps: UXPinCheckboxProps = {}
): UXPinCheckboxProps => resolveUXPinRuntimeProps(rawProps, Checkbox.defaultProps)

export const resolveUXPinCheckboxNodeRuntimeProps = (
  node: React.ReactNode
): UXPinCheckboxProps => (
  resolveUXPinRuntimeProps(
    (getUXPinElementProps(node) || {}) as UXPinCheckboxProps,
    {
      ...Checkbox.defaultProps,
      ...resolveCheckboxPresetDefaults(node)
    }
  )
)

export const isUXPinCheckboxElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as CheckboxComponent)?.uxpinRole === CHECKBOX_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'Checkbox' ||
      (node.type as { name?: string })?.name === 'Checkbox'
    )
  ) ||
  getUXPinElementPropSources(node).some((props) => (
    hasCheckboxShape(props) ||
    props.name === 'Checkbox' ||
    (
      typeof props.uxpId === 'string' &&
      props.uxpId.toLowerCase().includes('checkbox-group-item')
    ) ||
    (
      typeof props.presetElementId === 'string' &&
      props.presetElementId.toLowerCase().includes('checkbox-group-item')
    ) ||
    (
      typeof props.uxpinPresetElementId === 'string' &&
      props.uxpinPresetElementId.toLowerCase().includes('checkbox-group-item')
    )
  ))
)

export const checkboxElementToOption = (
  element: React.ReactNode,
  index: number,
  options: CheckboxOptionBuildOptions = {}
): { option: CheckboxOption, checked?: CheckboxProps['value'] } => {
  const runtimeProps = resolveUXPinCheckboxNodeRuntimeProps(element)
  const {
    checked,
    children: _children,
    codeComponentProps: _codeComponentProps,
    disabled,
    overriddenCodeProps: _overriddenCodeProps,
    readonly,
    text: _text,
    uxpId: _uxpId,
    value,
    ...props
  } = runtimeProps
  const resolvedValue = value ?? `option-${index + 1}`
  const option: CheckboxOption = {
    ...props,
    disabled: disabled ?? options.disabled,
    readonly: readonly ?? options.readonly,
    label: getCheckboxText(runtimeProps, index),
    value: resolvedValue
  }

  return {
    option,
    checked: checked ? resolvedValue : undefined
  }
}

const getCheckboxChildren = (
  children: React.ReactNode
): React.ReactNode[] => (
  getUXPinChildrenArray(children).flatMap((child) => {
    if (!child || isUXPinHiddenElement(child)) {
      return []
    }

    if (isUXPinCheckboxElement(child)) {
      return [child]
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    return nestedChildren ? getCheckboxChildren(nestedChildren) : []
  })
)

export const checkboxChildrenToOptions = (
  children: React.ReactNode,
  options: CheckboxOptionBuildOptions = {}
): CheckboxOptionsBuildResult => {
  const result: CheckboxOptionsBuildResult = {
    checkedValues: [],
    options: []
  }

  getCheckboxChildren(children).forEach((child, index) => {
    const item = checkboxElementToOption(child, index, options)

    result.options.push(item.option)

    if (item.checked !== undefined) {
      result.checkedValues.push(item.checked)
    }
  })

  return result
}

const Checkbox: CheckboxComponent = (rawProps: UXPinCheckboxProps): JSX.Element => {
  const {
    children,
    codeComponentProps: _codeComponentProps,
    overriddenCodeProps: _overriddenCodeProps,
    text,
    uxpId: _uxpId,
    ...props
  } = resolveUXPinCheckboxRuntimeProps(rawProps)

  return (
    <HexaCheckbox {...props}>
      {text ?? children ?? 'Checkbox'}
    </HexaCheckbox>
  )
}

Checkbox.uxpinRole = CHECKBOX_ROLE
Checkbox.displayName = 'Checkbox'
Checkbox.defaultProps = {
  value: 'checkbox'
}

export default Checkbox
