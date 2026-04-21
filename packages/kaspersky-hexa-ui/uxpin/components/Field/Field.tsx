import React from 'react'
import styled from 'styled-components'

import { FieldProps } from '@src/field/types'
import { HelpMessage } from '@src/help-message'
import { Markdown } from '@src/markdown'
import { Tag } from '@src/tag'
import { ToggleButtonGroup } from '@src/toggle-button/ToggleButtonGroup'
import { ToggleButtonSize } from '@src/toggle-button/types'

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
import Textbox from '../Textbox/Textbox'
import TimeInput from '../TimeInput/TimeInput'
import TimePickerRange from '../TimePickerRange/TimePickerRange'
import Toggle from '../Toggle/Toggle'
import TreeList from '../TreeList/TreeList'
import Typography from '../Typography/Typography'
import Uploader from '../Uploader/Uploader'

import {
  FrameFill,
  mergeFrameStyle,
  noop
} from '../../preview'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'
import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  hasUXPinChildrenProp,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'

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
  /** UXPin frame style. */
  style?: React.CSSProperties,
  /** Backward-compatible tooltip content. */
  tooltip?: React.ReactNode,
  codeComponentProps?: Partial<UXPinFieldProps>,
  overriddenCodeProps?: Partial<UXPinFieldProps>
}

type ControlState = {
  disabled?: boolean,
  readonly?: boolean,
  placeholderText?: string
}

const previewTagItems = [
  { label: 'Tag 1' },
  { label: 'Tag 2' }
]

const previewToggleButtonItems = [
  { text: 'One', value: 'one', mode: 'marina' as const },
  { text: 'Two', value: 'two', mode: 'red' as const },
  { text: 'Three', value: 'three', mode: 'orange' as const }
]

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

type PreviewToggleButtonGroupProps = {
  size: ToggleButtonSize
}

const PreviewToggleButtonGroup = ({
  size
}: PreviewToggleButtonGroupProps): JSX.Element => {
  const [value, setValue] = React.useState<string[]>([previewToggleButtonItems[0].value])

  return (
    <ToggleButtonGroup
      items={previewToggleButtonItems.map(item => ({
        ...item,
        size
      }))}
      value={value}
      onChange={setValue}
    />
  )
}

const getPlaceholder = (
  placeholderText: string | undefined,
  fallback: string
): string => placeholderText ?? fallback

const resolveControl = (
  variant: UXPinFieldVariant,
  state: ControlState
): React.ReactElement | undefined => {
  const { disabled = false, placeholderText, readonly = false } = state

  switch (variant) {
    case 'button':
      return <Button text="Button" disabled={disabled} />
    case 'checkboxGroup':
      return <CheckboxGroupPreview orientation="vertical" disabled={disabled} readonly={readonly} />
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
          placeholder
          readonly={readonly}
        />
      )
    case 'inputDatePickerRange':
      return (
        <DatePickerRange
          disabled={disabled}
          placeholder
          readonly={readonly}
        />
      )
    case 'inputDateTimePicker':
      return (
        <DateTimePicker
          disabled={disabled}
          placeholder
          readonly={readonly}
        />
      )
    case 'inputDateTimePickerRange':
      return (
        <DateTimePickerRange
          disabled={disabled}
          placeholder
          readonly={readonly}
        />
      )
    case 'inputMultiSelect':
      return (
        <MultiSelect
          disabled={disabled}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Select values')}
          readOnly={readonly}
        />
      )
    case 'inputNumber':
      return (
        <Textbox
          disabled={disabled}
          placeholder
          placeholderText={getPlaceholder(placeholderText, '42')}
          readOnly={readonly}
          variant="number"
        />
      )
    case 'inputPassword':
      return (
        <Textbox
          disabled={disabled}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Enter password')}
          readOnly={readonly}
          variant="password"
        />
      )
    case 'inputSelect':
      return (
        <Select
          disabled={disabled}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Select value')}
          readOnly={readonly}
        />
      )
    case 'inputText':
      return (
        <Textbox
          disabled={disabled}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Value')}
          readOnly={readonly}
          variant="text"
        />
      )
    case 'inputTextArea':
      return (
        <Textbox
          counter
          defaultHeight={104}
          disabled={disabled}
          placeholder
          placeholderText={getPlaceholder(placeholderText, 'Value')}
          readOnly={readonly}
          variant="textarea"
        />
      )
    case 'inputTimePicker':
      return (
        <TimeInput
          disabled={disabled}
          placeholder
          readOnly={readonly}
        />
      )
    case 'inputTimePickerRange':
      return (
        <TimePickerRange
          disabled={disabled}
          placeholder
          readOnly={readonly}
        />
      )
    case 'link':
      return <Link href="#" text="Open documentation" />
    case 'multiInput':
      return (
        <FrameFill>
          <div className="hexa-uxpin-field-controls">
            <Textbox placeholder placeholderText="First value" style={{ width: '100%' }} />
            <Textbox placeholder placeholderText="Second value" style={{ width: '100%' }} />
          </div>
        </FrameFill>
      )
    case 'radioGroup':
      return <RadioGroup disabled={disabled} readonly={readonly} />
    case 'segmentedButtonMedium':
      return (
        <SegmentedButton
          disabled={disabled}
          onChange={noop}
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
          onChange={noop}
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
      return <Tag.Group items={previewTagItems.map(item => ({ ...item, disabled, readOnly: readonly }))} />
    case 'text':
      return <Typography type="BTR4">Text preview</Typography>
    case 'toggle':
      return <Toggle disabled={disabled} />
    case 'toggleButtonGroupMedium':
      return <PreviewToggleButtonGroup size="medium" />
    case 'toggleButtonGroupSmall':
      return <PreviewToggleButtonGroup size="small" />
    case 'treeList':
      return <TreeList />
    case 'uploader':
      return <Uploader disabled={disabled} />
    default:
      return (
        <Textbox
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

const applyFieldControlState = (
  child: React.ReactNode,
  disabled?: boolean,
  readonly?: boolean,
  placeholderText?: string
): React.ReactNode => {
  if (!React.isValidElement<Record<string, unknown>>(child)) {
    return child
  }

  if (child.type === React.Fragment) {
    return React.cloneElement(child, undefined, React.Children.map(child.props.children, nestedChild => (
      applyFieldControlState(nestedChild, disabled, readonly, placeholderText)
    )))
  }

  const nextProps: Record<string, unknown> = {}

  if (disabled !== undefined) {
    nextProps.disabled = child.props.disabled ?? disabled
  }

  if (readonly !== undefined) {
    nextProps.readonly = child.props.readonly ?? readonly
    nextProps.readOnly = child.props.readOnly ?? readonly
  }

  if (placeholderText) {
    nextProps.placeholderText = child.props.placeholderText ?? placeholderText
  }

  return React.cloneElement(child, nextProps)
}

const Field = (rawProps: UXPinFieldProps): JSX.Element => {
  const rootRef = useAutoHeightMergeFrame()
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
    style,
    tagsAfter = false,
    text,
    tooltip,
    variant = 'inputText'
  } = runtimeProps
  const visibleChildren = getUXPinChildrenArray(children).filter((child) => !isUXPinHiddenElement(child))
  const labelElement = getFirstFieldLayer(visibleChildren, isUXPinFieldLabelElement)
  const looseBodyChildren = visibleChildren.filter((child) => (
    child !== labelElement
  ))
  const useCustomBody = Boolean(control) || looseBodyChildren.length > 0
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
      ? looseBodyChildren.map((child) => applyFieldControlState(child, disabled, readonly, placeholderText))
      : resolveControl(variant, {
        disabled,
        readonly,
        placeholderText
      })
  )
  const rootStyle = {
    ...mergeFrameStyle(style),
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
          {message && <HelpMessage mode={messageMode} text={message} />}
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
