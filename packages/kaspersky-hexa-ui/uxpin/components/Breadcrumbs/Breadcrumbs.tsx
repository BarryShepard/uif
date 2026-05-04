import { Breadcrumbs as HexaBreadcrumbs } from '@src/breadcrumbs'
import { BreadcrumbsProps, BreadcrumbsSize, Route } from '@src/breadcrumbs/types'
import React from 'react'

import {
  getUXPinChildrenArray,
  getUXPinElementPropSources,
  getUXPinElementProps,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'

import BreadcrumbItem, {
  breadcrumbItemElementsToRoutes
} from '../BreadcrumbItem/BreadcrumbItem'

export type UXPinBreadcrumbsProps = {
  /** Visual size of the breadcrumbs. */
  size?: BreadcrumbsSize,
  children?: React.ReactNode
}

type LegacyUXPinBreadcrumbsProps = {
  routes?: BreadcrumbsProps['routes'],
  stepCount?: 1 | 2 | 3 | 4,
  more?: boolean
}

type BreadcrumbsRuntimeProps = Omit<BreadcrumbsProps, 'routes'> & UXPinBreadcrumbsProps & LegacyUXPinBreadcrumbsProps

type BreadcrumbsComponent = React.FC<UXPinBreadcrumbsProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinBreadcrumbsProps>
}

type BreadcrumbsPreviewDefaults = Partial<Pick<UXPinBreadcrumbsProps, 'size'>>

const BREADCRUMBS_ROLE = 'hexa-uxpin-breadcrumbs'
const DEFAULT_BREADCRUMB_CHILD = (
  <BreadcrumbItem
    text="Current page"
    current={false}
    disabled={false}
  />
)

const hasBreadcrumbsShape = (props: Record<string, unknown> = {}): boolean => (
  'routes' in props ||
  'size' in props
)

const hasBreadcrumbsIdentity = (
  node: React.ReactNode
): boolean => (
  getUXPinElementPropSources(node).some((props) => (
    props.name === 'Breadcrumbs' ||
    (typeof props.uxpId === 'string' && props.uxpId.includes('breadcrumbs')) ||
    (typeof props.id === 'string' && props.id.includes('breadcrumbs')) ||
    (typeof props.presetElementId === 'string' && props.presetElementId.includes('breadcrumbs')) ||
    (typeof props.uxpinPresetElementId === 'string' && props.uxpinPresetElementId.includes('breadcrumbs'))
  ))
)

const normalizeRoutes = (routes: Route[]): Route[] => (
  routes.map((route, index, list) => ({
    ...route,
    url: index === list.length - 1 ? undefined : route.url ?? `#/breadcrumb-step-${index + 1}`
  }))
)

const resolveElementChildren = (
  element: React.ReactElement<BreadcrumbsRuntimeProps>
): React.ReactNode => (
  element.props.children ??
  (typeof element.type === 'function'
    ? (element.type as BreadcrumbsComponent).defaultProps?.children
    : undefined)
)

export const resolveUXPinBreadcrumbsProps = (
  rawProps: BreadcrumbsRuntimeProps = {},
  defaults: BreadcrumbsPreviewDefaults = {}
): BreadcrumbsProps => {
  const {
    children,
    codeComponentProps: _codeComponentProps,
    id: _id,
    name: _name,
    overriddenCodeProps: _overriddenCodeProps,
    presetElementId: _presetElementId,
    routes,
    size: rawSize,
    uxpinPresetElementId: _uxpinPresetElementId,
    uxpinTargetElementType: _uxpinTargetElementType,
    uxpId: _uxpId,
    ...rest
  } = rawProps as BreadcrumbsRuntimeProps & Record<string, unknown>

  const size = rawSize ?? defaults.size ?? 'medium'
  const resolvedChildren = children ?? DEFAULT_BREADCRUMB_CHILD
  const childRoutes = breadcrumbItemElementsToRoutes(resolvedChildren)
  const baseRoutes = routes?.length
    ? routes
    : childRoutes

  return {
    ...rest,
    size,
    routes: normalizeRoutes(baseRoutes)
  }
}

export const isUXPinBreadcrumbsElement = (
  node: React.ReactNode
): node is React.ReactElement<BreadcrumbsRuntimeProps> => (
  React.isValidElement(node) &&
  (
    (node.type as BreadcrumbsComponent)?.uxpinRole === BREADCRUMBS_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'Breadcrumbs' ||
    (node.type as { name?: string })?.name === 'Breadcrumbs' ||
    hasBreadcrumbsShape((node.props as Record<string, unknown>) || {})
  )
)

const getBreadcrumbsProps = (
  node: React.ReactNode
): BreadcrumbsRuntimeProps | undefined => {
  if (React.isValidElement<BreadcrumbsRuntimeProps>(node) && isUXPinBreadcrumbsElement(node)) {
    return node.props
  }

  const props = getUXPinElementProps(node)

  if (!props) {
    return undefined
  }

  const runtimeProps = resolveUXPinRuntimeProps(props) as BreadcrumbsRuntimeProps

  return hasBreadcrumbsShape(runtimeProps) || hasBreadcrumbsIdentity(node)
    ? runtimeProps
    : undefined
}

export const resolveBreadcrumbsChildren = (
  children: React.ReactNode
): Array<React.ReactElement<BreadcrumbsRuntimeProps>> => {
  const breadcrumbs: Array<React.ReactElement<BreadcrumbsRuntimeProps>> = []

  getUXPinChildrenArray(children).forEach((child, index) => {
    if (!child) {
      return
    }

    const props = getBreadcrumbsProps(child)

    if (props) {
      breadcrumbs.push(
        <Breadcrumbs key={`${props.size ?? 'breadcrumbs'}-${index}`} {...props}>
          {props.children}
        </Breadcrumbs>
      )
      return
    }

    const childProps = getUXPinElementProps(child)
    const nestedChildren = childProps
      ? resolveUXPinChildrenFromProps(childProps)
      : React.isValidElement<{ children?: React.ReactNode }>(child)
        ? child.props.children
        : undefined

    if (nestedChildren) {
      breadcrumbs.push(...resolveBreadcrumbsChildren(nestedChildren))
    }
  })

  return breadcrumbs
}

export const resolveBreadcrumbsChildProps = (
  children: React.ReactNode,
  defaults: BreadcrumbsPreviewDefaults = {}
): BreadcrumbsProps | undefined => {
  const [element] = resolveBreadcrumbsChildren(children)

  if (!element) {
    return undefined
  }

  return resolveUXPinBreadcrumbsProps(
    {
      ...(element.props || {}) as BreadcrumbsRuntimeProps,
      children: resolveElementChildren(element)
    },
    defaults
  )
}

const Breadcrumbs: BreadcrumbsComponent = ({
  children = DEFAULT_BREADCRUMB_CHILD,
  size,
  ...props
}: UXPinBreadcrumbsProps): JSX.Element => (
  <HexaBreadcrumbs
    {...resolveUXPinBreadcrumbsProps({
      children,
      ...props,
      size
    })}
  />
)

Breadcrumbs.uxpinRole = BREADCRUMBS_ROLE
Breadcrumbs.displayName = 'Breadcrumbs'
Breadcrumbs.defaultProps = {
  children: DEFAULT_BREADCRUMB_CHILD
}

export default Breadcrumbs
