import React from 'react'

import Icons16Pack, { Placeholder } from '@kaspersky/hexa-ui-icons/16'

import {
  getUXPinPropSources,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'

export type SegmentedButtonItemIconName = Exclude<keyof typeof Icons16Pack, 'default'>

export type UXPinSegmentedButtonItemProps = {
  /** Marks item as selected. */
  selected?: boolean,
  /** Item text. */
  text?: string,
  /** Item value. */
  value?: string,
  /** Shows icon before text. */
  iconBefore?: boolean,
  /** Icon name before text. */
  iconBeforeSlot?: SegmentedButtonItemIconName,
  /** Shows counter after text. */
  counter?: boolean,
  /** Counter value. */
  counterValue?: string,
  /** Disables the item. */
  disabled?: boolean,
  codeComponentProps?: Partial<UXPinSegmentedButtonItemProps>,
  overriddenCodeProps?: Partial<UXPinSegmentedButtonItemProps>
}

type SegmentedButtonItemComponent = React.FC<UXPinSegmentedButtonItemProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinSegmentedButtonItemProps>
}

const SEGMENTED_BUTTON_ITEM_ROLE = 'hexa-uxpin-segmented-button-item'

const hasSegmentedButtonItemShape = (props: Record<string, unknown> = {}): boolean => (
  'selected' in props &&
  'text' in props &&
  'counter' in props
)

export const isUXPinSegmentedButtonItemElement = (
  node: React.ReactNode
): node is React.ReactElement<UXPinSegmentedButtonItemProps> => (
  React.isValidElement(node) &&
  (
    (node.type as SegmentedButtonItemComponent)?.uxpinRole === SEGMENTED_BUTTON_ITEM_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'SegmentedButtonItem' ||
    (node.type as { name?: string })?.name === 'SegmentedButtonItem' ||
    getUXPinPropSources(node.props).some(hasSegmentedButtonItemShape)
  )
)

export const resolveSegmentedButtonItemRuntimeProps = (
  rawProps: UXPinSegmentedButtonItemProps = {}
): UXPinSegmentedButtonItemProps => resolveUXPinRuntimeProps(rawProps, SegmentedButtonItem.defaultProps)

export const resolveSegmentedButtonItemIcon = (
  iconName?: SegmentedButtonItemIconName
): React.ReactNode => {
  if (!iconName) {
    return <Placeholder />
  }

  const IconComponent = Icons16Pack[iconName]

  return IconComponent ? <IconComponent /> : <Placeholder />
}

const SegmentedButtonItem: SegmentedButtonItemComponent = (_props: UXPinSegmentedButtonItemProps): JSX.Element => (
  null as unknown as JSX.Element
)

SegmentedButtonItem.uxpinRole = SEGMENTED_BUTTON_ITEM_ROLE
SegmentedButtonItem.displayName = 'SegmentedButtonItem'
SegmentedButtonItem.defaultProps = {
  selected: false,
  text: 'Segment',
  value: 'segment',
  iconBefore: false,
  iconBeforeSlot: 'Placeholder',
  counter: false,
  counterValue: '1'
}

export default SegmentedButtonItem
