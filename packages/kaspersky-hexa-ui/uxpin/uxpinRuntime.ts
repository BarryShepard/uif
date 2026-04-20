import React from 'react'

type UXPinPropsContainer = {
  children?: React.ReactNode,
  codeComponentProps?: Record<string, unknown> & {
    children?: React.ReactNode
  },
  overriddenCodeProps?: Record<string, unknown> & {
    children?: React.ReactNode,
    codeComponentProps?: Record<string, unknown> & {
      children?: React.ReactNode
    }
  }
}

export type UXPinRuntimeElementProps = UXPinPropsContainer & Record<string, unknown>

const hasOwnProp = (
  source: Record<string, unknown> | undefined,
  key: string
): boolean => Boolean(source && Object.prototype.hasOwnProperty.call(source, key))

export const isUXPinPlainElement = (
  node: React.ReactNode
): node is UXPinRuntimeElementProps => Boolean(
  node &&
  typeof node === 'object' &&
  !Array.isArray(node) &&
  !React.isValidElement(node) &&
  (
    hasOwnProp(node as Record<string, unknown>, 'uxpinTargetElementType') ||
    hasOwnProp(node as Record<string, unknown>, 'presetElementId') ||
    hasOwnProp(node as Record<string, unknown>, 'uxpinPresetElementId') ||
    hasOwnProp(node as Record<string, unknown>, 'codeComponentId') ||
    hasOwnProp(node as Record<string, unknown>, 'codeComponentProps') ||
    hasOwnProp(node as Record<string, unknown>, 'overriddenCodeProps')
  )
)

export const getUXPinElementProps = (
  node: React.ReactNode
): UXPinRuntimeElementProps | undefined => {
  if (React.isValidElement<UXPinRuntimeElementProps>(node)) {
    return node.props
  }

  if (isUXPinPlainElement(node)) {
    return node
  }

  return undefined
}

export const getUXPinPropSources = (
  props: object = {}
): Array<Record<string, unknown>> => {
  const container = props as UXPinPropsContainer

  return [
    props as Record<string, unknown>,
    container.codeComponentProps,
    container.overriddenCodeProps,
    container.overriddenCodeProps?.codeComponentProps
  ].filter(Boolean) as Array<Record<string, unknown>>
}

export const getUXPinElementPropSources = (
  node: React.ReactNode
): Array<Record<string, unknown>> => {
  const props = getUXPinElementProps(node)

  return props ? getUXPinPropSources(props) : []
}

export const getUXPinChildrenArray = (
  children: React.ReactNode
): React.ReactNode[] => {
  if (children === null || children === undefined || typeof children === 'boolean') {
    return []
  }

  if (Array.isArray(children)) {
    return children.flatMap(getUXPinChildrenArray)
  }

  if (
    React.isValidElement(children) ||
    isUXPinPlainElement(children) ||
    typeof children === 'string' ||
    typeof children === 'number'
  ) {
    return [children]
  }

  return []
}

export const countUXPinChildren = (
  children: React.ReactNode
): number => getUXPinChildrenArray(children).length

export const resolveUXPinRuntimeProps = <T extends object>(
  rawProps: T,
  defaults?: Partial<T>
): T => {
  const container = rawProps as UXPinPropsContainer

  return {
    ...(defaults || {}),
    ...rawProps,
    ...(container.codeComponentProps || {}),
    ...(container.overriddenCodeProps?.codeComponentProps || {}),
    ...(container.overriddenCodeProps || {})
  } as T
}

export const hasUXPinChildrenProp = (
  props: UXPinPropsContainer | undefined
): boolean => Boolean(props && (
  hasOwnProp(props as Record<string, unknown>, 'children') ||
  hasOwnProp(props.codeComponentProps, 'children') ||
  hasOwnProp(props.overriddenCodeProps, 'children') ||
  hasOwnProp(props.overriddenCodeProps?.codeComponentProps, 'children')
))

export const resolveUXPinChildrenFromProps = (
  props: UXPinPropsContainer | undefined
): React.ReactNode | undefined => {
  if (!props) {
    return undefined
  }

  const sources = [
    props.overriddenCodeProps,
    props.overriddenCodeProps?.codeComponentProps,
    props.codeComponentProps,
    props
  ]

  for (const source of sources) {
    if (hasOwnProp(source, 'children')) {
      return source?.children
    }
  }

  return undefined
}

export const resolveUXPinElementChildren = (
  element: React.ReactNode
): React.ReactNode | undefined => {
  const props = getUXPinElementProps(element)

  if (!props) {
    return undefined
  }

  return resolveUXPinChildrenFromProps(props)
}
