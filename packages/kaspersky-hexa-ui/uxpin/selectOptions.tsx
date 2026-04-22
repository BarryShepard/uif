import React from 'react'

import { OptionType } from '@src/select/types'

import Icons16Pack, { Placeholder } from '@kaspersky/hexa-ui-icons/16'

import {
  getUXPinChildrenArray,
  getUXPinElementPropSources,
  resolveUXPinElementChildren
} from './uxpinRuntime'
import {
  isUXPinDropdownItemElement,
  resolveDropdownItemNodeRuntimeProps
} from './components/DropdownItem/DropdownItem'
import { isUXPinHiddenElement } from './visibility'

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

const getOptionValue = (
  node: React.ReactNode,
  fallbackText: string,
  index: number
): string => {
  if (React.isValidElement(node) && typeof node.key === 'string' && node.key.length) {
    return node.key
  }

  const explicitValue = getFirstStringProp(node, ['value'])

  if (explicitValue) {
    return explicitValue
  }

  const explicitId = getFirstStringProp(node, ['id', 'uxpId', 'presetElementId', 'uxpinPresetElementId'])

  return explicitId ? `${explicitId}-${index + 1}` : `${fallbackText}-${index + 1}`
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
    .map((child, index) => {
      const props = resolveDropdownItemNodeRuntimeProps(child, index)
      const text = props.text ?? `Option ${index + 1}`
      const value = getOptionValue(child, text, index)

      return {
        label: optionLabel(text, componentBefore, iconBefore),
        value,
        description: props.description ? props.descriptionText : undefined,
        disabled: props.disabled
      }
    })

  if (childOptions.length) {
    return childOptions
  }

  return parseOptionsText(optionsText).map((text, index) => ({
    label: optionLabel(text, componentBefore, iconBefore),
    value: `${text}-${index + 1}`
  }))
}
