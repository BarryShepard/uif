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

const getUXPinChildrenSource = (
  sources: Array<UXPinPropsContainer | undefined>
): { children?: React.ReactNode, hasChildren: boolean } => {
  let result: { children?: React.ReactNode, hasChildren: boolean } = {
    children: undefined,
    hasChildren: false
  }

  sources.forEach((source) => {
    if (hasOwnProp(source as Record<string, unknown> | undefined, 'children')) {
      result = {
        children: source?.children,
        hasChildren: true
      }
    }
  })

  return result
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

  if (React.isValidElement(children) && children.type === React.Fragment) {
    return getUXPinChildrenArray((children.props as UXPinPropsContainer).children)
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

const getUXPinElementIdentity = (
  node: React.ReactNode
): string | undefined => {
  if (React.isValidElement(node) && typeof node.key === 'string' && node.key.length) {
    return node.key
  }

  for (const props of getUXPinElementPropSources(node)) {
    for (const propName of ['id', 'uxpId', 'presetElementId', 'uxpinPresetElementId']) {
      const value = props[propName]

      if (typeof value === 'string' && value.length) {
        return value
      }
    }
  }

  return undefined
}

function mergeUXPinElementChildren (
  baseChild: React.ReactNode,
  overrideChild: React.ReactNode
): React.ReactNode {
  const baseProps = getUXPinElementProps(baseChild)
  const overrideProps = getUXPinElementProps(overrideChild)

  if (!baseProps || !overrideProps) {
    return overrideChild
  }

  const hasOverrideChildren = hasUXPinChildrenProp(overrideProps)
  const mergedChildren = hasOverrideChildren
    ? mergeUXPinChildren(resolveUXPinChildrenFromProps(baseProps), resolveUXPinChildrenFromProps(overrideProps))
    : undefined
  const mergedProps = {
    ...baseProps,
    ...overrideProps,
    ...(hasOverrideChildren ? { children: mergedChildren } : {})
  }

  if (hasOverrideChildren) {
    mergedProps.overriddenCodeProps = {
      ...baseProps.overriddenCodeProps,
      ...overrideProps.overriddenCodeProps,
      children: mergedChildren
    }
  }

  if (React.isValidElement(baseChild)) {
    return React.cloneElement(baseChild, mergedProps)
  }

  return mergedProps
}

export function mergeUXPinChildren (
  baseChildren: React.ReactNode,
  overrideChildren: React.ReactNode
): React.ReactNode {
  if (
    overrideChildren === null ||
    overrideChildren === undefined ||
    typeof overrideChildren === 'boolean'
  ) {
    return overrideChildren
  }

  const baseArray = getUXPinChildrenArray(baseChildren)
  const overrideArray = getUXPinChildrenArray(overrideChildren)

  if (!baseArray.length || !overrideArray.length) {
    return overrideChildren
  }

  const overrideById = new Map<string, React.ReactNode>()

  overrideArray.forEach((child) => {
    const id = getUXPinElementIdentity(child)

    if (id) {
      overrideById.set(id, child)
    }
  })

  const usedOverrides = new Set<React.ReactNode>()
  const mergedChildren = baseArray.map((baseChild) => {
    const id = getUXPinElementIdentity(baseChild)
    const overrideChild = id ? overrideById.get(id) : undefined

    if (!overrideChild) {
      return baseChild
    }

    usedOverrides.add(overrideChild)

    return mergeUXPinElementChildren(baseChild, overrideChild)
  })

  overrideArray.forEach((child) => {
    if (!usedOverrides.has(child)) {
      mergedChildren.push(child)
    }
  })

  return mergedChildren
}

export function resolveUXPinMergedChildrenFromProps (
  props: UXPinPropsContainer | undefined,
  fallbackChildren?: React.ReactNode
): React.ReactNode | undefined {
  if (!props) {
    return fallbackChildren
  }

  const base = getUXPinChildrenSource([
    props,
    props.codeComponentProps
  ])
  const overrides = getUXPinChildrenSource([
    props.overriddenCodeProps?.codeComponentProps,
    props.overriddenCodeProps
  ])
  const baseChildren = base.hasChildren ? base.children : fallbackChildren

  if (!overrides.hasChildren) {
    return baseChildren
  }

  return mergeUXPinChildren(baseChildren, overrides.children)
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
