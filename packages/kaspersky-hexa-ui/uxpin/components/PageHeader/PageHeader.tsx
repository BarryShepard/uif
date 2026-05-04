import React from 'react'

import { Button } from '@src/button'
import { PageHeader as HexaPageHeader } from '@src/page-header'
import { PageHeaderProps } from '@src/page-header/types'
import { TagGroupProps } from '@src/tag/types'

import { Placeholder } from '@kaspersky/hexa-ui-icons/24'

import { FrameFill, previewPageHeaderTags } from '../../preview'

import BreadcrumbItem from '../BreadcrumbItem/BreadcrumbItem'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'
import { resolveBreadcrumbsChildProps } from '../Breadcrumbs/Breadcrumbs'

export type UXPinPageHeaderProps = {
  /** Main page title. */
  title?: string,
  /** Shows secondary page description text. */
  description?: boolean,
  /** Description text value when description is enabled. */
  descriptionText?: string,
  /** Shows the leading icon slot before the title. */
  iconBefore?: boolean,
  /** Slot content for the leading icon area. */
  iconBeforeSlot?: React.ReactNode,
  /** Shows breadcrumbs above the title. */
  breadcrumbs?: boolean,
  /** Shows preview tags after the title. */
  tagsAfter?: boolean,
  /** Shows the trailing action/content area. */
  elementAfter?: boolean,
  /** Slot content for the trailing area. */
  elementAfterSlot?: React.ReactNode,
  children?: React.ReactNode
}

type PageHeaderComponent = React.FC<UXPinPageHeaderProps> & {
  uxpinRole?: string
}

const PAGE_HEADER_ROLE = 'hexa-uxpin-page-header'

const getDirectMergeComponent = (element: HTMLDivElement | null): HTMLDivElement | null => {
  const parentElement = element?.parentElement

  if (!parentElement || !parentElement.classList.contains('merge-component')) {
    return null
  }

  return parentElement as HTMLDivElement
}

const useDirectAutoHeightMergeFrame = (): React.RefObject<HTMLDivElement> => {
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const rootElement = rootRef.current
    const mergeComponent = getDirectMergeComponent(rootElement)

    if (!rootElement || !mergeComponent) {
      return undefined
    }

    const previousHeight = mergeComponent.style.height
    const previousMinHeight = mergeComponent.style.minHeight

    mergeComponent.style.height = 'auto'
    mergeComponent.style.minHeight = '0'

    return () => {
      mergeComponent.style.height = previousHeight
      mergeComponent.style.minHeight = previousMinHeight
    }
  }, [])

  return rootRef
}

const resolveToggleSlot = (
  value: boolean | undefined,
  slot: React.ReactNode,
  fallback: React.ReactNode
): React.ReactNode | undefined => {
  return value ? slot ?? fallback : undefined
}

const resolveDescription = (
  description: UXPinPageHeaderProps['description'],
  descriptionText: string
): string | undefined => {
  return description ? descriptionText : undefined
}

const resolveTagsAfter = (
  tagsAfter: UXPinPageHeaderProps['tagsAfter']
): TagGroupProps['items'] | undefined => (
  tagsAfter ? previewPageHeaderTags : undefined
)

const resolveBreadcrumbs = (
  breadcrumbs: UXPinPageHeaderProps['breadcrumbs'],
  children: React.ReactNode
): PageHeaderProps['breadcrumbs'] => {
  if (breadcrumbs === false) {
    return undefined
  }

  return resolveBreadcrumbsChildProps(children, { size: 'small' })
}

const DEFAULT_PAGE_HEADER_CHILDREN = (
  <Breadcrumbs size="small">
    <BreadcrumbItem
      text="Current page"
      current={false}
      disabled={false}
    />
  </Breadcrumbs>
)

const PageHeader: PageHeaderComponent = ({
  breadcrumbs = false,
  children = DEFAULT_PAGE_HEADER_CHILDREN,
  description = false,
  descriptionText = 'Page description',
  elementAfter = false,
  elementAfterSlot,
  iconBefore = false,
  iconBeforeSlot,
  tagsAfter = false,
  title = 'Page title',
}: UXPinPageHeaderProps): JSX.Element => {
  const rootRef = useDirectAutoHeightMergeFrame()

  return (
    <div
      ref={rootRef}
      data-hexa-uxpin-page-header="true"
      style={{ minWidth: 0, width: '100%' }}
    >
      <FrameFill style={{ height: 'fit-content' }}>
        <HexaPageHeader
          breadcrumbs={resolveBreadcrumbs(breadcrumbs, children)}
          description={resolveDescription(description, descriptionText)}
          elementAfter={resolveToggleSlot(
            elementAfter,
            elementAfterSlot,
            <Button text="Create" />
          )}
          iconBefore={resolveToggleSlot(
            iconBefore,
            iconBeforeSlot,
            <Placeholder />
          )}
          tagsAfter={resolveTagsAfter(tagsAfter)}
          title={title}
        />
      </FrameFill>
    </div>
  )
}

PageHeader.defaultProps = {
  breadcrumbs: false,
  children: DEFAULT_PAGE_HEADER_CHILDREN,
  description: false,
  elementAfter: false,
  iconBefore: false,
  tagsAfter: false
}

PageHeader.uxpinRole = PAGE_HEADER_ROLE
PageHeader.displayName = 'PageHeader'

export default PageHeader
