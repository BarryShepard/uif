import React from 'react'

import { Checkbox as HexaCheckbox } from '@src/checkbox'
import { CheckboxOption, CheckboxProps } from '@src/checkbox/types'

import {
  getUXPinPropSources,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'

export type UXPinCheckboxProps = CheckboxProps & {
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

export const resolveUXPinCheckboxRuntimeProps = (
  rawProps: UXPinCheckboxProps = {}
): UXPinCheckboxProps => resolveUXPinRuntimeProps(rawProps, Checkbox.defaultProps)

export const isUXPinCheckboxElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinCheckboxProps> => (
  React.isValidElement(node) &&
  (
    (node.type as CheckboxComponent)?.uxpinRole === CHECKBOX_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'Checkbox' ||
    (node.type as { name?: string })?.name === 'Checkbox' ||
    getUXPinPropSources(node.props).some(hasCheckboxShape)
  )
)

export const checkboxElementToOption = (
  element: React.ReactElement<UXPinCheckboxProps>,
  index: number,
  options: CheckboxOptionBuildOptions = {}
): { option: CheckboxOption, checked?: CheckboxProps['value'] } => {
  const runtimeProps = resolveUXPinCheckboxRuntimeProps(element.props)
  const {
    checked,
    children: _children,
    codeComponentProps: _codeComponentProps,
    disabled,
    overriddenCodeProps: _overriddenCodeProps,
    readonly,
    text: _text,
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

export const checkboxChildrenToOptions = (
  children: React.ReactNode,
  options: CheckboxOptionBuildOptions = {}
): CheckboxOptionsBuildResult => {
  const result: CheckboxOptionsBuildResult = {
    checkedValues: [],
    options: []
  }

  React.Children.forEach(children, (child, index) => {
    if (!child || isUXPinHiddenElement(child)) {
      return
    }

    if (isUXPinCheckboxElement(child)) {
      const item = checkboxElementToOption(child, index, options)

      result.options.push(item.option)

      if (item.checked !== undefined) {
        result.checkedValues.push(item.checked)
      }
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
