import React from 'react'

import { SegmentedButton as HexaSegmentedButton } from '@src/segmented-button'
import { SegmentedButtonOption, SegmentedButtonProps } from '@src/segmented-button/types'

import { previewSegmentedButtonItems } from '../../preview'
import {
  getUXPinChildrenArray,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { isUXPinHiddenElement } from '../ToolbarButton/ToolbarButton'
import SegmentedButtonItem, {
  isUXPinSegmentedButtonItemElement,
  resolveSegmentedButtonItemIcon,
  resolveSegmentedButtonItemRuntimeProps
} from '../SegmentedButtonItem/SegmentedButtonItem'

export type UXPinSegmentedButtonProps = Omit<SegmentedButtonProps, 'items' | 'onChange' | 'value'> & {
  /** Editable segmented button items. */
  children?: React.ReactNode,
  /** Controlled selected values. */
  value?: string[],
  /** Handler. */
  onChange?: SegmentedButtonProps['onChange'],
  codeComponentProps?: Partial<UXPinSegmentedButtonProps>,
  overriddenCodeProps?: Partial<UXPinSegmentedButtonProps>
}

const DEFAULT_SEGMENTED_BUTTON_CHILDREN = (
  <>
    <SegmentedButtonItem text="One" value="one" selected />
    <SegmentedButtonItem text="Two" value="two" />
    <SegmentedButtonItem text="Three" value="three" counter counterValue="3" />
  </>
)

const segmentedButtonChildrenToItems = (
  children: React.ReactNode
): { items: SegmentedButtonOption[], selectedValues: string[] } => {
  const result: { items: SegmentedButtonOption[], selectedValues: string[] } = {
    items: [],
    selectedValues: []
  }

  getUXPinChildrenArray(children).forEach((child, index) => {
    if (!isUXPinSegmentedButtonItemElement(child) || isUXPinHiddenElement(child)) {
      return
    }

    const props = resolveSegmentedButtonItemRuntimeProps(child.props)
    const value = props.value ?? `segment-${index + 1}`
    const componentsBefore = props.iconBefore
      ? [resolveSegmentedButtonItemIcon(props.iconBeforeSlot)]
      : undefined
    const componentsAfter = props.counter
      ? [<span key="counter">{props.counterValue}</span>]
      : undefined

    if (props.selected) {
      result.selectedValues.push(value)
    }

    result.items.push({
      componentsAfter,
      componentsBefore,
      disabled: props.disabled,
      text: props.text,
      value
    })
  })

  return result
}

const SegmentedButton = (rawProps: UXPinSegmentedButtonProps): JSX.Element => {
  const {
    children = DEFAULT_SEGMENTED_BUTTON_CHILDREN,
    codeComponentProps: _codeComponentProps,
    onChange = () => undefined,
    overriddenCodeProps: _overriddenCodeProps,
    size = 'medium',
    value,
    ...props
  } = resolveUXPinRuntimeProps(rawProps)
  const built = segmentedButtonChildrenToItems(children)
  const items = built.items.length ? built.items : previewSegmentedButtonItems
  const initialValue = value ?? (built.selectedValues.length ? built.selectedValues : [items[0]?.value].filter(Boolean))
  const [previewValue, setPreviewValue] = React.useState<string[]>(initialValue)

  React.useEffect(() => {
    if (value !== undefined) {
      setPreviewValue(value)
    }
  }, [value])

  const resolvedValue = value ?? previewValue

  return (
    <HexaSegmentedButton
      items={items}
      onChange={(nextValue) => {
        if (value === undefined) {
          setPreviewValue(nextValue)
        }
        onChange?.(nextValue)
      }}
      size={size}
      value={resolvedValue}
      {...props}
    />
  )
}

export default SegmentedButton
