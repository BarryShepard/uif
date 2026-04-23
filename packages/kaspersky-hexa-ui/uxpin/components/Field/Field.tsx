import React from 'react'
import styled from 'styled-components'

import { FieldProps } from '@src/field/types'
import { HelpMessage } from '@src/help-message'
import { Markdown } from '@src/markdown'

import Button from '../Button/Button'
import CheckboxGroupPreview from '../CheckboxGroup/CheckboxGroup'
import CodeViewer from '../CodeViewer/CodeViewer'
import DatePicker from '../DatePicker/DatePicker'
import DatePickerRange from '../DatePickerRange/DatePickerRange'
import DateTimePicker from '../DateTimePicker/DateTimePicker'
import DateTimePickerRange from '../DateTimePickerRange/DateTimePickerRange'
import ElementsStack from '../ElementsStack/ElementsStack'
import Expand from '../Expand/Expand'
import FieldLabel, {
  isUXPinFieldLabelElement,
  UXPinFieldLabelProps
} from '../FieldLabel/FieldLabel'
import Link from '../Link/Link'
import MultiSelect from '../MultiSelect/MultiSelect'
import RadioGroup from '../RadioGroup/RadioGroup'
import SegmentedButton from '../SegmentedButton/SegmentedButton'
import SegmentedButtonItem from '../SegmentedButtonItem/SegmentedButtonItem'
import Select from '../Select/Select'
import StatusGroup from '../StatusGroup/StatusGroup'
import TagGroup from '../TagGroup/TagGroup'
import Text from '../Text/Text'
import Textbox from '../Textbox/Textbox'
import TimeInput from '../TimeInput/TimeInput'
import TimePickerRange from '../TimePickerRange/TimePickerRange'
import Toggle from '../Toggle/Toggle'
import ToggleButtonGroup from '../ToggleButtonGroup/ToggleButtonGroup'
import TreeList from '../TreeList/TreeList'
import Uploader from '../Uploader/Uploader'

import {
  FrameFill,
  mergeFrameStyle,
  noop
} from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import {
  getUXPinElementProps,
  hasUXPinChildrenProp,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { getVisibleUXPinChildrenArray } from '../../visibility'

type UXPinFieldVariant =
  | 'button'
  | 'checkboxGroup'
  | 'elementsStack'
  | 'expand'
  | 'inputCodeViever'
  | 'inputCodeViewer'
  | 'inputDatePicker'
  | 'inputDatePickerRange'
  | 'inputDateTimePicker'
  | 'inputDateTimePickerRange'
  | 'inputMultiSelect'
  | 'inputNumber'
  | 'inputPassword'
  | 'inputSelect'
  | 'inputText'
  | 'inputTextArea'
  | 'inputTimePicker'
  | 'inputTimePickerRange'
  | 'link'
  | 'multiInput'
  | 'radioGroup'
  | 'segmentedButtonMedium'
  | 'segmentedButtonSmall'
  | 'space'
  | 'statusGroup'
  | 'tagGroup'
  | 'text'
  | 'toggle'
  | 'toggleButtonGroupMedium'
  | 'toggleButtonGroupSmall'
  | 'treeList'
  | 'uploader'

type UXPinFieldValidationState = 'default' | 'error' | 'success' | 'warning'
type UXPinFieldValidationTrigger = 'always' | 'blur' | 'change' | 'interaction' | 'external'
type UXPinFieldValidationMode = 'manual' | 'rule'
type UXPinFieldValidationRule = 'email' | 'length' | 'mask' | 'numberRange' | 'regex' | 'required' | 'selectionCount'

type UXPinFieldProps = Omit<FieldProps, 'control' | 'label' | 'labelPosition' | 'required' | 'style' | 'tooltip'> & {
  /** Preset control shown inside the field body when the body has no edited children. */
  variant?: UXPinFieldVariant,
  /** Show or hide the field label. */
  label?: boolean,
  /** Backward-compatible label text prop. Use text for new prototypes. */
  labelText?: string,
  /** Label text. */
  text?: string,
  /** Field body control override. */
  control?: React.ReactElement,
  /** Field label/body layers. */
  children?: React.ReactNode,
  /** Makes the label and body disabled. */
  disabled?: boolean,
  /** Makes the label and body readonly. */
  readonly?: boolean,
  /** Shows the required asterisk on the label. */
  required?: boolean,
  /** Shows the info button on the label. */
  buttonInfo?: boolean,
  /** Info popover text. */
  buttonInfoText?: string,
  /** Shows editable tags after the label. */
  tagsAfter?: boolean,
  /** Placeholder for generated or nested body controls. */
  placeholderText?: string,
  /** Vertical distance between the label and the body in pixels. */
  labelPositionRange?: number,
  /** Validation mode. Manual uses validationState directly, rule evaluates the current control value. */
  validationMode?: UXPinFieldValidationMode,
  /** Validation state cascaded to supported nested controls and field message in manual mode. */
  validationState?: UXPinFieldValidationState,
  /** Validation rule used in rule mode. Combine with required for required + format flows. */
  validationRule?: UXPinFieldValidationRule,
  /** Regular expression used by regex or mask validation rules. */
  validationPattern?: string,
  /** When validation becomes visible. Use external with validationVisible for CTA/submit flows. */
  validationTrigger?: UXPinFieldValidationTrigger,
  /** External validation visibility toggle for CTA/submit flows and UXPin interactions. */
  validationVisible?: boolean,
  /** Shows success state for valid values in rule mode. */
  showSuccessState?: boolean,
  /** Success help message shown in rule mode when the value is valid. */
  successMessage?: string,
  /** Trims text values before rule validation. */
  trimValidationValue?: boolean,
  /** Minimum text length for length rule. */
  minLength?: number,
  /** Maximum text length for length rule. */
  maxLength?: number,
  /** Minimum numeric value for numberRange rule. */
  minValue?: number,
  /** Maximum numeric value for numberRange rule. */
  maxValue?: number,
  /** Minimum selected items for selectionCount rule. */
  minSelected?: number,
  /** Maximum selected items for selectionCount rule. */
  maxSelected?: number,
  /** Field width behavior. Flex fills the available row width, fixed uses widthValue. */
  widthMode?: 'flex' | 'fixed',
  /** Field width in pixels when widthMode is fixed. */
  widthValue?: number,
  /** UXPin frame style. */
  style?: React.CSSProperties,
  /** Backward-compatible tooltip content. */
  tooltip?: React.ReactNode,
  codeComponentProps?: Partial<UXPinFieldProps>,
  overriddenCodeProps?: Partial<UXPinFieldProps>
}

type ControlState = {
  disabled?: boolean,
  onBlur?: (...args: any[]) => void,
  onInteraction?: (...args: any[]) => void,
  readonly?: boolean,
  placeholderText?: string,
  showValidation?: boolean,
  validationState?: UXPinFieldValidationState
}

type FieldControlEnhancementState = Pick<
ControlState,
  'disabled' | 'onBlur' | 'onInteraction' | 'placeholderText' | 'readonly' | 'showValidation' | 'validationState'
>

type FieldControlValidationProps = {
  invalid?: boolean,
  validationStatus?: Extract<UXPinFieldValidationState, 'default' | 'error' | 'success'>
}

type FieldRuleValidationResult = {
  isEmpty: boolean,
  isValid: boolean
}

const FieldFrame = styled.div`
  width: 100%;
  height: fit-content;

  .hexa-uxpin-field {
    display: flex;
    flex-direction: column;
    gap: var(--hexa-uxpin-field-label-gap, 4px);
    width: 100%;
    min-width: 0;
    max-width: none;
  }

  .hexa-uxpin-field-control-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    min-width: 0;
  }

  .hexa-uxpin-field-controls {
    display: flex;
    align-items: stretch;
    gap: 8px;
    width: 100%;
    min-width: 0;
  }

  .hexa-uxpin-field-controls > * {
    flex: 1 1 0;
    min-width: 0;
  }
`

const getPlaceholder = (
  placeholderText: string | undefined,
  fallback: string
): string => placeholderText ?? fallback

const getFixedWidth = (widthValue?: number): string => (
  `${Math.max(Number(widthValue) || 0, 1)}px`
)

const EMAIL_VALIDATION_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FIELD_VALIDATION_STATUS_COMPONENTS = new Set([
  'DatePicker',
  'DatePickerRange',
  'DateTimePicker',
  'DateTimePickerRange',
  'MultiSelect',
  'Select',
  'Textbox',
  'TimeInput',
  'TimePickerRange'
])

const FIELD_INVALID_COMPONENTS = new Set([
  'Checkbox',
  'CheckboxGroup',
  'Radio',
  'RadioGroup'
])

const FIELD_INITIAL_VALUE_UNSET = Symbol('field-initial-value-unset')

const getElementTypeName = (
  child: React.ReactNode
): string | undefined => {
  if (!React.isValidElement(child)) {
    return undefined
  }

  if (typeof child.type === 'string') {
    return child.type
  }

  return (
    (child.type as { displayName?: string })?.displayName ||
    (child.type as { name?: string })?.name
  )
}

const isFieldRuleConfigured = (
  validationMode: UXPinFieldValidationMode | undefined,
  validationRule: UXPinFieldValidationRule | undefined,
  validationPattern: string | undefined,
  minLength: number | undefined,
  maxLength: number | undefined,
  minSelected: number | undefined,
  maxSelected: number | undefined,
  minValue: number | undefined,
  maxValue: number | undefined
): boolean => (
  validationMode === 'rule' ||
  validationRule !== undefined ||
  Boolean(validationPattern) ||
  minLength !== undefined ||
  maxLength !== undefined ||
  minSelected !== undefined ||
  maxSelected !== undefined ||
  minValue !== undefined ||
  maxValue !== undefined
)

const getValidationMode = (
  validationMode: UXPinFieldValidationMode | undefined,
  validationRuleConfigured: boolean
): UXPinFieldValidationMode => (
  validationMode ?? (validationRuleConfigured ? 'rule' : 'manual')
)

const getFieldValidationRegex = (
  validationPattern?: string
): RegExp | undefined => {
  if (!validationPattern) {
    return undefined
  }

  try {
    return new RegExp(validationPattern)
  } catch (error) {
    console.error('Hexa UI UXPin Field: invalid validationPattern', error)
    return undefined
  }
}

const unwrapFieldValidationValue = (
  value: unknown
): unknown => {
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'value' in (value as Record<string, unknown>)
  ) {
    return unwrapFieldValidationValue((value as Record<string, unknown>).value)
  }

  return value
}

const isFieldValidationValueEmpty = (
  value: unknown,
  trimValidationValue: boolean
): boolean => {
  const resolvedValue = unwrapFieldValidationValue(value)

  if (resolvedValue === null || resolvedValue === undefined) {
    return true
  }

  if (Array.isArray(resolvedValue)) {
    return resolvedValue.length === 0
  }

  if (typeof resolvedValue === 'string') {
    return (trimValidationValue ? resolvedValue.trim() : resolvedValue).length === 0
  }

  if (typeof resolvedValue === 'boolean') {
    return resolvedValue === false
  }

  return false
}

const getFieldValidationTextValue = (
  value: unknown,
  trimValidationValue: boolean
): string | undefined => {
  const resolvedValue = unwrapFieldValidationValue(value)

  if (typeof resolvedValue === 'string') {
    return trimValidationValue ? resolvedValue.trim() : resolvedValue
  }

  if (typeof resolvedValue === 'number' || typeof resolvedValue === 'boolean') {
    return String(resolvedValue)
  }

  return undefined
}

const getFieldValidationNumberValue = (
  value: unknown
): number | undefined => {
  const resolvedValue = unwrapFieldValidationValue(value)

  if (typeof resolvedValue === 'number' && Number.isFinite(resolvedValue)) {
    return resolvedValue
  }

  if (typeof resolvedValue === 'string') {
    const parsedValue = Number(resolvedValue)

    return Number.isFinite(parsedValue) ? parsedValue : undefined
  }

  return undefined
}

const getFieldSelectionCount = (
  value: unknown
): number => {
  const resolvedValue = unwrapFieldValidationValue(value)

  if (Array.isArray(resolvedValue)) {
    return resolvedValue.length
  }

  return isFieldValidationValueEmpty(resolvedValue, false) ? 0 : 1
}

const getFieldValidationValueFromArgs = (
  args: any[]
): typeof FIELD_INITIAL_VALUE_UNSET | unknown => {
  const [firstArg] = args

  if (firstArg === undefined) {
    return FIELD_INITIAL_VALUE_UNSET
  }

  if (
    firstArg &&
    typeof firstArg === 'object' &&
    'target' in (firstArg as Record<string, unknown>)
  ) {
    const target = (firstArg as { target?: Record<string, unknown> }).target

    if (target) {
      if (typeof target.value !== 'undefined') {
        return target.value
      }

      if (typeof target.checked === 'boolean') {
        return target.checked
      }
    }
  }

  if (
    firstArg &&
    typeof firstArg === 'object' &&
    !Array.isArray(firstArg) &&
    'value' in (firstArg as Record<string, unknown>)
  ) {
    return (firstArg as Record<string, unknown>).value
  }

  return firstArg
}

const evaluateFieldRuleValidation = (
  {
    maxLength,
    maxSelected,
    maxValue,
    minLength,
    minSelected,
    minValue,
    required,
    trimValidationValue,
    validationPattern,
    validationRule
  }: Pick<
    UXPinFieldProps,
      'maxLength' |
      'maxSelected' |
      'maxValue' |
      'minLength' |
      'minSelected' |
      'minValue' |
      'required' |
      'trimValidationValue' |
      'validationPattern' |
      'validationRule'
  >,
  value: unknown
): FieldRuleValidationResult => {
  const isEmpty = isFieldValidationValueEmpty(value, trimValidationValue ?? true)

  if (required && isEmpty) {
    return {
      isEmpty,
      isValid: false
    }
  }

  if (!validationRule || validationRule === 'required') {
    return {
      isEmpty,
      isValid: true
    }
  }

  if (isEmpty) {
    return {
      isEmpty,
      isValid: true
    }
  }

  switch (validationRule) {
    case 'email': {
      const textValue = getFieldValidationTextValue(value, trimValidationValue ?? true)

      return {
        isEmpty,
        isValid: Boolean(textValue && EMAIL_VALIDATION_PATTERN.test(textValue))
      }
    }
    case 'length': {
      const textValue = getFieldValidationTextValue(value, false) ?? ''
      const isLongEnough = minLength === undefined || textValue.length >= minLength
      const isShortEnough = maxLength === undefined || textValue.length <= maxLength

      return {
        isEmpty,
        isValid: isLongEnough && isShortEnough
      }
    }
    case 'mask':
    case 'regex': {
      const regex = getFieldValidationRegex(validationPattern)
      const textValue = getFieldValidationTextValue(value, trimValidationValue ?? true) ?? ''

      return {
        isEmpty,
        isValid: regex ? regex.test(textValue) : true
      }
    }
    case 'numberRange': {
      const numericValue = getFieldValidationNumberValue(value)

      return {
        isEmpty,
        isValid: numericValue !== undefined &&
          (minValue === undefined || numericValue >= minValue) &&
          (maxValue === undefined || numericValue <= maxValue)
      }
    }
    case 'selectionCount': {
      const selectionCount = getFieldSelectionCount(value)

      return {
        isEmpty,
        isValid: (minSelected === undefined || selectionCount >= minSelected) &&
          (maxSelected === undefined || selectionCount <= maxSelected)
      }
    }
    default:
      return {
        isEmpty,
        isValid: true
      }
  }
}

const getRuleValidationState = (
  isVisible: boolean,
  result: FieldRuleValidationResult,
  showSuccessState: boolean
): UXPinFieldValidationState => {
  if (!isVisible) {
    return 'default'
  }

  if (!result.isValid) {
    return 'error'
  }

  return showSuccessState ? 'success' : 'default'
}

const getValidationMessageMode = (
  validationState: UXPinFieldValidationState | undefined,
  messageMode: FieldProps['messageMode']
): FieldProps['messageMode'] => {
  if (
    validationState === 'error' ||
    validationState === 'success' ||
    validationState === 'warning'
  ) {
    return validationState
  }

  return messageMode
}

const getFieldControlValidationProps = (
  validationState: UXPinFieldValidationState | undefined,
  showValidation?: boolean
): FieldControlValidationProps => {
  if (!showValidation || !validationState || validationState === 'default') {
    return {}
  }

  if (validationState === 'warning') {
    return {}
  }

  return {
    invalid: validationState === 'error',
    validationStatus: validationState
  }
}

const mergeFieldEventHandler = (
  existingHandler: ((...args: any[]) => unknown) | undefined,
  nextHandler: ((...args: any[]) => void) | undefined
): ((...args: any[]) => void) | undefined => {
  if (!existingHandler && !nextHandler) {
    return undefined
  }

  return (...args: any[]) => {
    nextHandler?.(...args)
    existingHandler?.(...args)
  }
}

const getFieldControlRuntimeProps = (
  state: ControlState
): FieldControlValidationProps & {
  disabled?: boolean,
  onBlur?: (...args: any[]) => void,
  onClick?: (...args: any[]) => void,
  onChange?: (...args: any[]) => void,
  placeholderText?: string,
  readOnly?: boolean
} => {
  const {
    disabled,
    onBlur,
    onInteraction,
    placeholderText,
    readonly,
    showValidation,
    validationState
  } = state

  return {
    ...getFieldControlValidationProps(validationState, showValidation),
    disabled,
    onBlur,
    onChange: onInteraction,
    onClick: onInteraction,
    placeholderText,
    readOnly: readonly
  }
}

const resolveControl = (
  variant: UXPinFieldVariant,
  state: ControlState
): React.ReactElement | undefined => {
  const {
    disabled = false,
    onBlur,
    onInteraction,
    placeholderText,
    readonly = false,
    showValidation,
    validationState
  } = state
  const validationProps = getFieldControlValidationProps(validationState, showValidation)
  const inputValidationStatus = validationProps.validationStatus
  const invalid = validationProps.invalid

  switch (variant) {
    case 'button':
      return (
        <Button
          disabled={disabled}
          onClick={onInteraction}
          text="Button"
        />
      )
    case 'checkboxGroup':
      return (
        <CheckboxGroupPreview
          disabled={disabled}
          invalid={invalid}
          onChange={onInteraction}
          orientation="vertical"
          readonly={readonly}
        />
      )
    case 'elementsStack':
      return <ElementsStack />
    case 'expand':
      return <Expand />
    case 'inputCodeViever':
    case 'inputCodeViewer':
      return <CodeViewer defaultHeight={240} language="javascript" />
    case 'inputDatePicker':
      return (
        <DatePicker
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          readonly={readonly}
          validationStatus={inputValidationStatus}
        />
      )
    case 'inputDatePickerRange':
      return (
        <DatePickerRange
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          readonly={readonly}
          validationStatus={inputValidationStatus}
        />
      )
    case 'inputDateTimePicker':
      return (
        <DateTimePicker
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          readonly={readonly}
          validationStatus={inputValidationStatus}
        />
      )
    case 'inputDateTimePickerRange':
      return (
        <DateTimePickerRange
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          readonly={readonly}
          validationStatus={inputValidationStatus}
        />
      )
    case 'inputMultiSelect':
      return (
        <MultiSelect
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Select values')}
          readOnly={readonly}
          validationStatus={inputValidationStatus}
        />
      )
    case 'inputNumber':
      return (
        <Textbox
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          placeholderText={getPlaceholder(placeholderText, '42')}
          readOnly={readonly}
          validationStatus={inputValidationStatus}
          variant="number"
        />
      )
    case 'inputPassword':
      return (
        <Textbox
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Enter password')}
          readOnly={readonly}
          validationStatus={inputValidationStatus}
          variant="password"
        />
      )
    case 'inputSelect':
      return (
        <Select
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Select value')}
          readOnly={readonly}
          validationStatus={inputValidationStatus}
        />
      )
    case 'inputText':
      return (
        <Textbox
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Value')}
          readOnly={readonly}
          validationStatus={inputValidationStatus}
          variant="text"
        />
      )
    case 'inputTextArea':
      return (
        <Textbox
          counter
          defaultHeight={104}
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Value')}
          readOnly={readonly}
          validationStatus={inputValidationStatus}
          variant="textarea"
        />
      )
    case 'inputTimePicker':
      return (
        <TimeInput
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          readOnly={readonly}
          validationStatus={inputValidationStatus}
        />
      )
    case 'inputTimePickerRange':
      return (
        <TimePickerRange
          disabled={disabled}
          onBlur={onBlur}
          onChange={onInteraction}
          placeholder
          readOnly={readonly}
          validationStatus={inputValidationStatus}
        />
      )
    case 'link':
      return <Link href="#" onClick={onInteraction} text="Open documentation" />
    case 'multiInput':
      return (
        <FrameFill>
          <div className="hexa-uxpin-field-controls">
            <Textbox
              onBlur={onBlur}
              onChange={onInteraction}
              placeholder
              placeholderText="First value"
              style={{ width: '100%' }}
              validationStatus={inputValidationStatus}
            />
            <Textbox
              onBlur={onBlur}
              onChange={onInteraction}
              placeholder
              placeholderText="Second value"
              style={{ width: '100%' }}
              validationStatus={inputValidationStatus}
            />
          </div>
        </FrameFill>
      )
    case 'radioGroup':
      return (
        <RadioGroup
          disabled={disabled}
          invalid={invalid}
          onChange={onInteraction}
          readonly={readonly}
        />
      )
    case 'segmentedButtonMedium':
      return (
        <SegmentedButton
          disabled={disabled}
          onChange={onInteraction ?? noop}
          size="large"
        >
          <SegmentedButtonItem text="Overview" value="overview" selected />
          <SegmentedButtonItem text="Details" value="details" />
          <SegmentedButtonItem text="Activity" value="activity" />
        </SegmentedButton>
      )
    case 'segmentedButtonSmall':
      return (
        <SegmentedButton
          disabled={disabled}
          onChange={onInteraction ?? noop}
          size="medium"
        >
          <SegmentedButtonItem text="Overview" value="overview" selected />
          <SegmentedButtonItem text="Details" value="details" />
          <SegmentedButtonItem text="Activity" value="activity" />
        </SegmentedButton>
      )
    case 'space':
      return undefined
    case 'statusGroup':
      return <StatusGroup />
    case 'tagGroup':
      return <TagGroup />
    case 'text':
      return <Text text="Text preview" type="body text/P4 (12, 16)/Regular" />
    case 'toggle':
      return <Toggle disabled={disabled} onChange={onInteraction} />
    case 'toggleButtonGroupMedium':
      return <ToggleButtonGroup size="medium" variant="button" />
    case 'toggleButtonGroupSmall':
      return <ToggleButtonGroup size="small" variant="button" />
    case 'treeList':
      return <TreeList />
    case 'uploader':
      return <Uploader disabled={disabled} />
    default:
      return (
        <Textbox
          {...getFieldControlRuntimeProps(state)}
          disabled={disabled}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Value')}
          readOnly={readonly}
          variant="text"
        />
      )
  }
}

const getFirstFieldLayer = <T extends React.ReactElement>(
  children: React.ReactNode[],
  predicate: (node: React.ReactNode) => node is T
): T | undefined => children.find(predicate) as T | undefined

const getFieldControlValueFromNode = (
  node: React.ReactNode
): unknown => {
  if (!React.isValidElement<Record<string, unknown>>(node)) {
    return undefined
  }

  const nodeProps = resolveUXPinRuntimeProps(node.props)

  if (Object.prototype.hasOwnProperty.call(nodeProps, 'value')) {
    return nodeProps.value
  }

  if (Object.prototype.hasOwnProperty.call(nodeProps, 'text')) {
    return nodeProps.text
  }

  if (Object.prototype.hasOwnProperty.call(nodeProps, 'checked')) {
    return nodeProps.checked
  }

  if (Object.prototype.hasOwnProperty.call(nodeProps, 'defaultValue')) {
    return nodeProps.defaultValue
  }

  if (Object.prototype.hasOwnProperty.call(nodeProps, 'defaultText')) {
    return nodeProps.defaultText
  }

  if (Object.prototype.hasOwnProperty.call(nodeProps, 'defaultChecked')) {
    return nodeProps.defaultChecked
  }

  return undefined
}

const getFieldDefaultControlValue = (
  variant: UXPinFieldVariant
): unknown => {
  switch (variant) {
    case 'checkboxGroup':
    case 'inputMultiSelect':
      return []
    case 'inputText':
    case 'inputPassword':
    case 'inputTextArea':
    case 'link':
    case 'multiInput':
      return ''
    default:
      return undefined
  }
}

const resolveInitialFieldControlValue = (
  control: React.ReactElement | undefined,
  looseBodyChildren: React.ReactNode[],
  variant: UXPinFieldVariant
): unknown => {
  const explicitControlValue = control ? getFieldControlValueFromNode(control) : undefined

  if (explicitControlValue !== undefined) {
    return explicitControlValue
  }

  for (const child of looseBodyChildren) {
    const childValue = getFieldControlValueFromNode(child)

    if (childValue !== undefined) {
      return childValue
    }
  }

  return getFieldDefaultControlValue(variant)
}

const applyFieldControlState = (
  child: React.ReactNode,
  state: FieldControlEnhancementState
): React.ReactNode => {
  if (!React.isValidElement<Record<string, unknown>>(child)) {
    return child
  }

  const {
    disabled,
    onBlur,
    onInteraction,
    placeholderText,
    readonly,
    showValidation,
    validationState
  } = state

  if (child.type === React.Fragment) {
    return React.cloneElement(child, undefined, React.Children.map(child.props.children, nestedChild => (
      applyFieldControlState(nestedChild, state)
    )))
  }

  const nextProps: Record<string, unknown> = {}
  const childProps = child.props as Record<string, unknown>
  const typeName = getElementTypeName(child)
  const isDomControl = typeof child.type === 'string' && ['button', 'input', 'select', 'textarea'].includes(child.type)
  const validationProps = getFieldControlValidationProps(validationState, showValidation)

  if (disabled !== undefined) {
    nextProps.disabled = childProps.disabled ?? disabled
  }

  if (readonly !== undefined) {
    nextProps.readonly = childProps.readonly ?? readonly
    nextProps.readOnly = childProps.readOnly ?? readonly
  }

  if (placeholderText) {
    nextProps.placeholderText = childProps.placeholderText ?? placeholderText
  }

  if (FIELD_VALIDATION_STATUS_COMPONENTS.has(typeName || '')) {
    nextProps.validationStatus = childProps.validationStatus ?? validationProps.validationStatus
  } else if (
    isDomControl &&
    validationProps.invalid === true &&
    childProps['aria-invalid'] === undefined
  ) {
    nextProps['aria-invalid'] = true
  }

  if (FIELD_INVALID_COMPONENTS.has(typeName || '') && validationProps.invalid !== undefined) {
    nextProps.invalid = childProps.invalid ?? validationProps.invalid
  }

  if (onBlur) {
    nextProps.onBlur = mergeFieldEventHandler(childProps.onBlur as ((...args: any[]) => unknown) | undefined, onBlur)
  }

  if (onInteraction) {
    nextProps.onChange = mergeFieldEventHandler(childProps.onChange as ((...args: any[]) => unknown) | undefined, onInteraction)
    nextProps.onClick = mergeFieldEventHandler(childProps.onClick as ((...args: any[]) => unknown) | undefined, onInteraction)
  }

  return React.cloneElement(child, nextProps)
}

const Field = (rawProps: UXPinFieldProps): JSX.Element => {
  const runtimeProps = resolveUXPinRuntimeProps(rawProps)
  const {
    additionalComponent,
    buttonInfo = false,
    buttonInfoText = 'Additional information',
    children,
    className,
    codeComponentProps: _codeComponentProps,
    control,
    description,
    disabled = false,
    label = true,
    labelPositionRange = 4,
    labelText,
    message,
    messageMode = 'error',
    overriddenCodeProps: _overriddenCodeProps,
    placeholderText,
    readonly = false,
    required = false,
    showSuccessState = false,
    style,
    successMessage,
    tagsAfter = false,
    text,
    tooltip,
    trimValidationValue = true,
    validationMode,
    validationPattern,
    validationRule,
    validationState = 'default',
    validationTrigger = 'always',
    validationVisible = false,
    maxLength,
    maxSelected,
    maxValue,
    minLength,
    minSelected,
    minValue,
    variant = 'inputText',
    widthMode = 'flex',
    widthValue = 320
  } = runtimeProps
  const resolvedWidth = widthMode === 'fixed' ? getFixedWidth(widthValue) : '100%'
  const rootRef = useAutoHeightMergeFrame({
    width: widthMode === 'fixed' ? resolvedWidth : undefined,
    minWidth: widthMode === 'flex' ? 0 : undefined
  })
  const visibleChildren = getVisibleUXPinChildrenArray(children)
  const labelElement = getFirstFieldLayer(visibleChildren, isUXPinFieldLabelElement)
  const looseBodyChildren = visibleChildren.filter((child) => (
    child !== labelElement
  ))
  const useCustomBody = Boolean(control) || looseBodyChildren.length > 0
  const validationRuleConfigured = isFieldRuleConfigured(
    validationMode,
    validationRule,
    validationPattern,
    minLength,
    maxLength,
    minSelected,
    maxSelected,
    minValue,
    maxValue
  )
  const resolvedValidationMode = getValidationMode(validationMode, validationRuleConfigured)
  const shouldManageValidation = resolvedValidationMode === 'rule' || validationState !== 'default'
  const [hasBlurred, setHasBlurred] = React.useState(false)
  const [hasInteracted, setHasInteracted] = React.useState(false)
  const initialControlValueRef = React.useRef<unknown | typeof FIELD_INITIAL_VALUE_UNSET>(FIELD_INITIAL_VALUE_UNSET)

  if (initialControlValueRef.current === FIELD_INITIAL_VALUE_UNSET) {
    initialControlValueRef.current = resolveInitialFieldControlValue(control, looseBodyChildren, variant)
  }

  const [controlValue, setControlValue] = React.useState<unknown>(
    initialControlValueRef.current === FIELD_INITIAL_VALUE_UNSET
      ? undefined
      : initialControlValueRef.current
  )
  const isValidationVisible = !disabled && !readonly && shouldManageValidation && (
    validationTrigger === 'always' ||
    (validationTrigger === 'blur' && hasBlurred) ||
    ((validationTrigger === 'change' || validationTrigger === 'interaction') && hasInteracted) ||
    (validationTrigger === 'external' && validationVisible)
  )
  const ruleValidationResult = resolvedValidationMode === 'rule'
    ? evaluateFieldRuleValidation({
      maxLength,
      maxSelected,
      maxValue,
      minLength,
      minSelected,
      minValue,
      required,
      trimValidationValue,
      validationPattern,
      validationRule
    }, controlValue)
    : undefined
  const shouldShowRuleSuccess = showSuccessState || Boolean(successMessage)
  const resolvedValidationState = resolvedValidationMode === 'rule'
    ? getRuleValidationState(
      isValidationVisible,
      ruleValidationResult ?? { isEmpty: true, isValid: true },
      shouldShowRuleSuccess
    )
    : (
      isValidationVisible
        ? validationState
        : 'default'
    )
  const resolvedMessageMode = resolvedValidationMode === 'rule'
    ? (
      resolvedValidationState === 'success'
        ? 'success'
        : resolvedValidationState === 'error'
          ? 'error'
          : messageMode
    )
    : getValidationMessageMode(
      validationState !== 'default' ? validationState : undefined,
      messageMode
    )
  const resolvedValidationMessage = resolvedValidationMode === 'rule'
    ? (
      isValidationVisible
        ? (
          ruleValidationResult?.isValid
            ? (resolvedValidationState === 'success' ? successMessage : undefined)
            : message
        )
        : undefined
    )
    : (
      message && (!shouldManageValidation || isValidationVisible)
        ? message
        : undefined
    )
  const handleFieldBlur = React.useCallback((...args: any[]) => {
    const nextValue = getFieldValidationValueFromArgs(args)

    if (nextValue !== FIELD_INITIAL_VALUE_UNSET) {
      setControlValue(nextValue)
    }

    setHasBlurred(true)
  }, [])
  const handleFieldInteraction = React.useCallback((...args: any[]) => {
    const nextValue = getFieldValidationValueFromArgs(args)

    if (nextValue !== FIELD_INITIAL_VALUE_UNSET) {
      setControlValue(nextValue)
    }

    setHasInteracted(true)
  }, [])

  React.useEffect(() => {
    if (disabled || readonly) {
      setHasBlurred(false)
      setHasInteracted(false)
    }
  }, [disabled, readonly])

  const fieldLabelProps = labelElement
    ? resolveUXPinRuntimeProps<UXPinFieldLabelProps>(labelElement.props)
    : {}
  const labelElementProps = getUXPinElementProps(labelElement)
  const hasExplicitLabelChildren = labelElement ? hasUXPinChildrenProp(labelElementProps) : false
  const labelChildren = hasExplicitLabelChildren && labelElement
    ? fieldLabelProps.children
    : undefined
  const labelProps: UXPinFieldLabelProps = {
    buttonInfo: buttonInfo ?? fieldLabelProps.buttonInfo,
    buttonInfoText: buttonInfoText ?? fieldLabelProps.buttonInfoText,
    disabled: disabled || fieldLabelProps.disabled,
    readonly: readonly || fieldLabelProps.readonly,
    required: required ?? fieldLabelProps.required,
    tagsAfter: tagsAfter ?? fieldLabelProps.tagsAfter,
    text: text ?? labelText ?? fieldLabelProps.text ?? 'Label'
  }
  const resolvedLabel = label
    ? labelElement
      ? (
        hasExplicitLabelChildren
          ? React.cloneElement(labelElement, labelProps, labelChildren)
          : React.cloneElement(labelElement, labelProps)
      )
      : <FieldLabel {...labelProps} />
    : null
  const resolvedControl = control ?? (
    useCustomBody
      ? looseBodyChildren.map((child) => applyFieldControlState(child, {
        disabled,
        onBlur: handleFieldBlur,
        onInteraction: handleFieldInteraction,
        placeholderText,
        readonly,
        showValidation: isValidationVisible,
        validationState: resolvedValidationState
      }))
      : resolveControl(variant, {
        disabled,
        onBlur: handleFieldBlur,
        onInteraction: handleFieldInteraction,
        readonly,
        placeholderText,
        showValidation: isValidationVisible,
        validationState: resolvedValidationState
      })
  )
  const rootStyle = {
    ...mergeFrameStyle(style),
    flex: widthMode === 'flex' ? '1 1 0' : '0 0 auto',
    width: resolvedWidth,
    height: 'fit-content',
    '--hexa-uxpin-field-label-gap': `${labelPositionRange}px`
  } as React.CSSProperties

  return (
    <FieldFrame ref={rootRef} style={rootStyle}>
      <div className={['hexa-uxpin-field', className].filter(Boolean).join(' ')}>
        {resolvedLabel}
        <div className="hexa-uxpin-field-control-wrapper">
          <div className="hexa-uxpin-field-controls">
            {resolvedControl}
          </div>
          {description && <HelpMessage text={<Markdown value={description} withoutTextStyle={true} />} />}
          {resolvedValidationMessage && (
            <HelpMessage mode={resolvedMessageMode} text={resolvedValidationMessage} />
          )}
          {additionalComponent}
          {!label && (buttonInfo || tooltip) && (
            <HelpMessage text={<Markdown value={String(buttonInfo ? buttonInfoText : tooltip)} withoutTextStyle={true} />} />
          )}
        </div>
      </div>
    </FieldFrame>
  )
}

export default Field
