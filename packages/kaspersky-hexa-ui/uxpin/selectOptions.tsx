import React from 'react'

import { OptionType } from '@src/select/types'

import Icons16Pack, { Placeholder } from '@kaspersky/hexa-ui-icons/16'

import {
  getUXPinChildrenArray,
  resolveUXPinElementChildren
} from './uxpinRuntime'
import {
  isUXPinDropdownItemElement,
  resolveDropdownItemRuntimeProps
} from './components/DropdownItem/DropdownItem'
import { isUXPinHiddenElement } from './components/ToolbarButton/ToolbarButton'

export type SelectOptionIconName = Exclude<keyof typeof Icons16Pack, 'default'>

type BuildSelectOptionsParams = {
  children?: React.ReactNode,
  componentBefore?: boolean,
  iconBefore?: SelectOptionIconName,
  optionsText?: string
}

const DEFAULT_OPTIONS = ['Option 1', 'Option 2', 'Option 3']

export const resolveSelectIcon = (iconName?: SelectOptionIconName): React.ReactNode => {
  if (!iconName) {
    return <Placeholder />
  }

  const IconComponent = Icons16Pack[iconName]

  return IconComponent ? <IconComponent /> : <Placeholder />
}

const optionLabel = (
  label: string,
  componentBefore?: boolean,
  iconBefore?: SelectOptionIconName
): React.ReactNode => {
  if (!componentBefore) {
    return label
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {resolveSelectIcon(iconBefore)}
      <span>{label}</span>
    </span>
  )
}

export const parseOptionsText = (optionsText?: string): string[] => {
  const parsedOptions = (optionsText || '')
    .split(/[\n,;]/)
    .map((item) => item.trim())
    .filter(Boolean)

  return parsedOptions.length ? parsedOptions : DEFAULT_OPTIONS
}

export const buildSelectOptions = ({
  children,
  componentBefore,
  iconBefore,
  optionsText
}: BuildSelectOptionsParams): OptionType[] => {
  const flattenDropdownItems = (nodes: React.ReactNode): React.ReactNode[] => (
    getUXPinChildrenArray(nodes).flatMap((child) => {
      if (!child || isUXPinHiddenElement(child)) {
        return []
      }

      if (isUXPinDropdownItemElement(child)) {
        return [child]
      }

      const nestedChildren = resolveUXPinElementChildren(child)

      return nestedChildren ? flattenDropdownItems(nestedChildren) : []
    })
  )
  const childOptions = flattenDropdownItems(children)
    .filter(isUXPinDropdownItemElement)
    .map((child, index) => {
      const props = resolveDropdownItemRuntimeProps(child.props)
      const text = props.text ?? `Option ${index + 1}`

      return {
        label: optionLabel(text, componentBefore, iconBefore),
        value: text,
        description: props.description ? props.descriptionText : undefined,
        disabled: props.disabled
      }
    })

  if (childOptions.length) {
    return childOptions
  }

  return parseOptionsText(optionsText).map((text) => ({
    label: optionLabel(text, componentBefore, iconBefore),
    value: text
  }))
}
