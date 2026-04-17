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

const hasOwnProp = (
  source: Record<string, unknown> | undefined,
  key: string
): boolean => Boolean(source && Object.prototype.hasOwnProperty.call(source, key))

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
): React.ReactNode | undefined => (
  props?.overriddenCodeProps?.children ??
  props?.overriddenCodeProps?.codeComponentProps?.children ??
  props?.codeComponentProps?.children ??
  props?.children
)

export const resolveUXPinElementChildren = (
  element: React.ReactNode
): React.ReactNode | undefined => {
  if (!React.isValidElement<UXPinPropsContainer>(element)) {
    return undefined
  }

  return resolveUXPinChildrenFromProps(element.props)
}
