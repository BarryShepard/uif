import { Breadcrumbs as HexaBreadcrumbs } from '@src/breadcrumbs'
import { BreadcrumbsProps, BreadcrumbsSize, Route } from '@src/breadcrumbs/types'
import React from 'react'

import BreadcrumbItem, {
  breadcrumbItemElementsToRoutes,
  hasManualBreadcrumbItems
} from '../BreadcrumbItem/BreadcrumbItem'

export type BreadcrumbsStepCount = 1 | 2 | 3 | 4

export type UXPinBreadcrumbsProps = {
  /** Forces the collapsed breadcrumbs state with the menu icon as the second item. */
  more?: boolean,
  /** Number of preview steps in the simple state. */
  stepCount?: BreadcrumbsStepCount,
  /** Visual size of the breadcrumbs. */
  size?: BreadcrumbsSize,
  /** Optional explicit routes for advanced cases. */
  routes?: BreadcrumbsProps['routes'],
  children?: React.ReactNode
}

type BreadcrumbsRuntimeProps = BreadcrumbsProps & UXPinBreadcrumbsProps

type BreadcrumbsComponent = React.FC<UXPinBreadcrumbsProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinBreadcrumbsProps>
}

type BreadcrumbsPreviewDefaults = Partial<Pick<UXPinBreadcrumbsProps, 'more' | 'size' | 'stepCount'>>

const BREADCRUMBS_ROLE = 'hexa-uxpin-breadcrumbs'
const DEFAULT_STEP_COUNT: BreadcrumbsStepCount = 3
const COLLAPSED_PREVIEW_ROUTE_COUNT = 6

const clampStepCount = (value?: number): BreadcrumbsStepCount => {
  switch (value) {
    case 1:
    case 2:
    case 3:
    case 4:
      return value
    default:
      return DEFAULT_STEP_COUNT
  }
}

const buildPreviewRoutes = (count: number): Route[] => (
  Array.from({ length: count }, (_, index) => ({
    name:
      index === 0
        ? 'Home'
        : index === count - 1
          ? 'Current page'
          : `Step ${index}`,
    url: index === count - 1 ? undefined : `#/breadcrumb-step-${index + 1}`
  }))
)

const resolvePreviewRoutes = (
  more: boolean,
  stepCount: BreadcrumbsStepCount
): Route[] => (
  more
    ? buildPreviewRoutes(Math.max(COLLAPSED_PREVIEW_ROUTE_COUNT, stepCount + 3))
    : buildPreviewRoutes(stepCount)
)

const hasBreadcrumbsShape = (props: Record<string, unknown> = {}): boolean => (
  'more' in props ||
  'stepCount' in props ||
  'routes' in props ||
  'size' in props
)

export const resolveUXPinBreadcrumbsProps = (
  rawProps: BreadcrumbsRuntimeProps = {},
  defaults: BreadcrumbsPreviewDefaults = {}
): BreadcrumbsProps => {
  const {
    children,
    more: rawMore,
    routes,
    size: rawSize,
    stepCount: rawStepCount,
    ...rest
  } = rawProps

  const more = rawMore ?? defaults.more ?? false
  const size = rawSize ?? defaults.size ?? 'medium'
  const stepCount = rawStepCount ?? defaults.stepCount ?? DEFAULT_STEP_COUNT
  const resolvedStepCount = clampStepCount(stepCount)
  const childRoutes = breadcrumbItemElementsToRoutes(children)
  const shouldUseManualItems = hasManualBreadcrumbItems(children)
  const resolvedRoutes = routes?.length
    ? routes
    : shouldUseManualItems
      ? childRoutes
      : childRoutes.length && rawStepCount === undefined && rawMore === undefined
        ? childRoutes
        : resolvePreviewRoutes(more, resolvedStepCount)

  return {
    ...rest,
    size,
    routes: resolvedRoutes
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

export const resolveBreadcrumbsChildren = (
  children: React.ReactNode
): Array<React.ReactElement<BreadcrumbsRuntimeProps>> => {
  const breadcrumbs: Array<React.ReactElement<BreadcrumbsRuntimeProps>> = []

  React.Children.forEach(children, (child) => {
    if (!child) {
      return
    }

    if (isUXPinBreadcrumbsElement(child)) {
      breadcrumbs.push(child)
      return
    }

    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.props?.children
    ) {
      breadcrumbs.push(...resolveBreadcrumbsChildren(child.props.children))
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
    (element.props || {}) as BreadcrumbsRuntimeProps,
    defaults
  )
}

const Breadcrumbs: BreadcrumbsComponent = ({
  children,
  more,
  routes,
  size,
  stepCount,
  ...props
}: UXPinBreadcrumbsProps): JSX.Element => (
  <HexaBreadcrumbs
    {...resolveUXPinBreadcrumbsProps({
      children,
      ...props,
      more,
      routes,
      size,
      stepCount
    })}
  />
)

Breadcrumbs.uxpinRole = BREADCRUMBS_ROLE
Breadcrumbs.displayName = 'Breadcrumbs'
Breadcrumbs.defaultProps = {
  children: <BreadcrumbItem />
}

export default Breadcrumbs
