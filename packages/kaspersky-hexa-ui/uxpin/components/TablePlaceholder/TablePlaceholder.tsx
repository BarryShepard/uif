import {
  TablePrototypePlaceholderConfig,
  TablePrototypePlaceholderImage
} from '@src/table/preview/TablePrototype'
import React from 'react'
import styled from 'styled-components'

import { PreviewSurface } from '../../preview'
import {
  getUXPinChildrenArray,
  getUXPinElementProps,
  getUXPinElementPropSources,
  resolveUXPinElementChildren,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'

import Button from '../Button/Button'

export type UXPinTablePlaceholderProps = {
  /** Image size inside the empty table placeholder. */
  size?: 'small' | 'medium',
  /** Shows or hides the placeholder image. */
  image?: boolean,
  /** Selects the placeholder illustration. */
  imageType?: TablePrototypePlaceholderImage,
  /** Main placeholder title. */
  titleText?: string,
  /** Shows or hides secondary description text. */
  description?: boolean,
  /** Description text value when description is enabled. */
  descriptionText?: string,
  /** Action buttons shown in a horizontal row below the text. */
  children?: React.ReactNode
}

type TablePlaceholderComponent = React.FC<UXPinTablePlaceholderProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinTablePlaceholderProps>
}

const TABLE_PLACEHOLDER_ROLE = 'hexa-uxpin-table-placeholder'

const DEFAULT_TABLE_PLACEHOLDER_CHILDREN = (
  <>
    <Button text="Create" mode="primary" />
    <Button text="Import" mode="secondary" />
  </>
)

const hasTablePlaceholderShape = (props: Record<string, unknown> = {}): boolean => (
  'titleText' in props ||
  'descriptionText' in props ||
  'imageType' in props
)

const resolveElementChildren = (
  element: React.ReactNode
): React.ReactNode => {
  const elementChildren = resolveUXPinElementChildren(element)

  if (elementChildren !== undefined) {
    return elementChildren
  }

  if (React.isValidElement<UXPinTablePlaceholderProps>(element)) {
    return (
      element.props.children ??
      (typeof element.type === 'function'
        ? (element.type as TablePlaceholderComponent).defaultProps?.children
        : undefined)
    )
  }

  return TablePlaceholder.defaultProps?.children
}

export const isUXPinTablePlaceholderElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as TablePlaceholderComponent)?.uxpinRole === TABLE_PLACEHOLDER_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'TablePlaceholder' ||
      (node.type as { name?: string })?.name === 'TablePlaceholder' ||
      hasTablePlaceholderShape((node.props as Record<string, unknown>) || {})
    )
  ) ||
  getUXPinElementPropSources(node).some((props) => (
    props.name === 'TablePlaceholder' ||
    (typeof props.uxpId === 'string' && props.uxpId.toLowerCase().includes('table-placeholder')) ||
    (typeof props.id === 'string' && props.id.toLowerCase().includes('table-placeholder')) ||
    (typeof props.presetElementId === 'string' && props.presetElementId.toLowerCase().includes('table-placeholder')) ||
    (typeof props.uxpinPresetElementId === 'string' && props.uxpinPresetElementId.toLowerCase().includes('table-placeholder')) ||
    hasTablePlaceholderShape(props)
  ))
)

export const resolveTablePlaceholderChildren = (
  children: React.ReactNode
): React.ReactNode[] => {
  const placeholders: React.ReactNode[] = []

  getUXPinChildrenArray(children).forEach((child) => {
    if (!child) {
      return
    }

    if (isUXPinTablePlaceholderElement(child)) {
      placeholders.push(child)
      return
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    if (nestedChildren) {
      placeholders.push(...resolveTablePlaceholderChildren(nestedChildren))
    }
  })

  return placeholders
}

const resolveTablePlaceholderRuntimeProps = (
  node: React.ReactNode
): UXPinTablePlaceholderProps => resolveUXPinRuntimeProps(
  (getUXPinElementProps(node) || {}) as UXPinTablePlaceholderProps,
  TablePlaceholder.defaultProps
)

export const resolveTablePlaceholderConfig = (
  children: React.ReactNode
): TablePrototypePlaceholderConfig | undefined => {
  const [element] = resolveTablePlaceholderChildren(children)

  if (!element) {
    return undefined
  }

  const props = resolveTablePlaceholderRuntimeProps(element)

  return {
    size: props.size,
    image: props.image,
    imageType: props.imageType,
    titleText: props.titleText,
    description: props.description,
    descriptionText: props.descriptionText,
    children: resolveElementChildren(element)
  }
}

const TablePlaceholder: TablePlaceholderComponent = ({
  children = DEFAULT_TABLE_PLACEHOLDER_CHILDREN,
  description = true,
  descriptionText = 'There is no table data to display yet.',
  image = true,
  imageType = 'no data',
  size = 'small',
  titleText = 'No data'
}: UXPinTablePlaceholderProps): JSX.Element => (
  <PreviewSurface minHeight={180}>
    <PlaceholderCard>
      <div className="title">{titleText}</div>
      <div className="meta">
        Empty table placeholder · {size} · {image ? imageType : 'no image'}
      </div>
      {description && <div className="description">{descriptionText}</div>}
      <ActionPreview>
        {children}
      </ActionPreview>
    </PlaceholderCard>
  </PreviewSurface>
)

TablePlaceholder.uxpinRole = TABLE_PLACEHOLDER_ROLE
TablePlaceholder.displayName = 'TablePlaceholder'
TablePlaceholder.defaultProps = {
  children: DEFAULT_TABLE_PLACEHOLDER_CHILDREN,
  description: true,
  descriptionText: 'There is no table data to display yet.',
  image: true,
  imageType: 'no data',
  size: 'small',
  titleText: 'No data'
}

export default TablePlaceholder

const PlaceholderCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  min-height: 120px;
  padding: 24px;
  border-radius: 8px;
  background: #f4f6fa;
  box-sizing: border-box;
  color: #1f1f1f;
  text-align: center;

  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
  }

  .meta,
  .description {
    font-size: 12px;
    line-height: 16px;
    color: #5f6673;
  }
`

const ActionPreview = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;

  > * {
    width: auto !important;
    min-width: 0;
    flex: 0 0 auto;
  }
`
