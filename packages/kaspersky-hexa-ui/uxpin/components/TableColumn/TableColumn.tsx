import {
  TablePrototypeCellValue,
  TablePrototypeCellType,
  TablePrototypeColumnConfig,
  TablePrototypeFilterState,
  TablePrototypeHeaderState,
  TablePrototypeHeaderVariant,
  TablePrototypeOption,
  TablePrototypeSortState
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

/**
 * Config-only child for the UXPin `Table` prototype.
 * Add it inside `Table` to define a column; it does not render as a separate table block once nested.
 */
export type UXPinTableColumnProps = {
  /** Unique field key used in manual JSON rows and for sort/filter binding. */
  field?: string,
  /** Visible table header title. */
  title?: string,
  /** Column width in pixels. Ignored for checkbox/radio columns because they stay fixed. */
  width?: number,
  /** Stretches the column to share the remaining table width with other fill columns. */
  fill?: boolean,
  /** Defines the renderer for the entire column. */
  cellType?: TablePrototypeCellType,
  /** Enables header sorting for this column. */
  sortable?: boolean,
  /** Applies initial sorting when the table first renders. */
  defaultSort?: TablePrototypeSortState,
  /** Enables header filtering for this column. */
  filterable?: boolean,
  /** Comma- or newline-separated filter items shown inside the column dropdown. Empty value derives options from row data. */
  filterItems?: string,
  /** Shows the Reset filter action inside the column dropdown. */
  resetFilterButton?: boolean,
  /** Adds an info icon to the header title. */
  infoButton?: boolean,
  /** Text shown in the popover when the info icon is clicked. */
  infoText?: string,
  /** Used only in generated mode to override the default example value. */
  sampleValue?: TablePrototypeCellValue,
  /** Text shown next to toggle cells when the row value is enabled. */
  toggleOnText?: string,
  /** Text shown next to toggle cells when the row value is disabled. */
  toggleOffText?: string,
  /** Used by select-based cell types in generated mode. */
  options?: TablePrototypeOption[],
  /** Adds a leading placeholder slot for text/link/tree text cells. */
  elementBefore?: boolean,
  /** Adds a trailing placeholder slot for text/link/tree text cells. */
  elementAfter?: boolean
}

type LegacyUXPinTableColumnProps = {
  key?: string,
  dataIndex?: string,
  headerText?: string,
  headerVariant?: TablePrototypeHeaderVariant,
  headerState?: TablePrototypeHeaderState,
  sort?: TablePrototypeSortState,
  filter?: TablePrototypeFilterState,
  cellVariant?: TablePrototypeCellType,
  infoButton?: boolean,
  buttonInfo?: boolean,
  text?: string,
  elementBeforeSlot?: React.ReactNode,
  elementAfterSlot?: React.ReactNode
}

type TableColumnRuntimeProps = UXPinTableColumnProps & LegacyUXPinTableColumnProps

type TableColumnComponent = React.FC<UXPinTableColumnProps> & {
  uxpinRole?: string,
  defaultProps?: Partial<UXPinTableColumnProps>
}

const TABLE_COLUMN_ROLE = 'hexa-uxpin-table-column'
const TABLE_COLUMN_SEARCH_BOUNDARY_ROLES = new Set([
  'hexa-uxpin-table-placeholder'
])

const hasTableColumnShape = (props: Record<string, unknown> = {}): boolean => (
  'title' in props ||
  'field' in props ||
  'dataIndex' in props ||
  'fill' in props ||
  'cellType' in props ||
  'sortable' in props ||
  'defaultSort' in props ||
  'filterable' in props ||
  'filterItems' in props ||
  'resetFilterButton' in props ||
  'infoButton' in props ||
  'sampleValue' in props ||
  'toggleOnText' in props ||
  'toggleOffText' in props ||
  'headerText' in props ||
  'headerVariant' in props ||
  'headerState' in props ||
  'sort' in props ||
  'filter' in props ||
  'buttonInfo' in props ||
  'cellVariant' in props ||
  'elementBefore' in props ||
  'elementBeforeSlot' in props ||
  'elementAfter' in props ||
  'elementAfterSlot' in props
)

const isTableColumnIdentity = (value?: string): boolean => {
  const normalizedValue = value?.toLowerCase()

  return Boolean(
    normalizedValue &&
    normalizedValue.includes('table-column')
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

const isTableColumnSearchBoundary = (node: React.ReactNode): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      TABLE_COLUMN_SEARCH_BOUNDARY_ROLES.has(String((node.type as { uxpinRole?: string })?.uxpinRole)) ||
      (node.type as { displayName?: string })?.displayName === 'TablePlaceholder' ||
      (node.type as { name?: string })?.name === 'TablePlaceholder'
    )
  ) ||
  getUXPinElementPropSources(node).some((props) => (
    props.name === 'TablePlaceholder' ||
    TABLE_COLUMN_SEARCH_BOUNDARY_ROLES.has(String(props.uxpinRole)) ||
    (typeof props.presetElementId === 'string' && props.presetElementId.toLowerCase().includes('table-placeholder')) ||
    (typeof props.uxpinPresetElementId === 'string' && props.uxpinPresetElementId.toLowerCase().includes('table-placeholder'))
  ))
)

export const isUXPinTableColumnElement = (
  node: React.ReactNode
): boolean => (
  Boolean(
    React.isValidElement(node) &&
    (
      (node.type as TableColumnComponent)?.uxpinRole === TABLE_COLUMN_ROLE ||
      (node.type as { displayName?: string })?.displayName === 'TableColumn' ||
      (node.type as { name?: string })?.name === 'TableColumn' ||
      hasTableColumnShape((node.props as Record<string, unknown>) || {})
    )
  ) ||
  getUXPinElementPropSources(node).some((props) => (
    props.name === 'TableColumn' ||
    isTableColumnIdentity(typeof props.uxpId === 'string' ? props.uxpId : undefined) ||
    isTableColumnIdentity(typeof props.id === 'string' ? props.id : undefined) ||
    isTableColumnIdentity(typeof props.presetElementId === 'string' ? props.presetElementId : undefined) ||
    isTableColumnIdentity(typeof props.uxpinPresetElementId === 'string' ? props.uxpinPresetElementId : undefined) ||
    hasTableColumnShape(props)
  ))
)

export const resolveTableColumnChildren = (
  children: React.ReactNode
): React.ReactNode[] => {
  const columns: React.ReactNode[] = []

  getUXPinChildrenArray(children).forEach((child) => {
    if (!child) {
      return
    }

    if (isUXPinTableColumnElement(child)) {
      columns.push(child)
      return
    }

    if (isTableColumnSearchBoundary(child)) {
      return
    }

    const nestedChildren = resolveUXPinElementChildren(child)

    if (nestedChildren) {
      columns.push(...resolveTableColumnChildren(nestedChildren))
    }
  })

  return columns
}

const resolveTableColumnRuntimeProps = (
  node: React.ReactNode
): TableColumnRuntimeProps => resolveUXPinRuntimeProps(
  (getUXPinElementProps(node) || {}) as TableColumnRuntimeProps,
  TableColumn.defaultProps
)

const resolveTableColumnKey = (
  node: React.ReactNode,
  index: number
): string => {
  if (React.isValidElement(node) && typeof node.key === 'string' && node.key.length) {
    return node.key
  }

  return getFirstStringProp(
    node,
    ['id', 'uxpId', 'presetElementId', 'uxpinPresetElementId']
  ) ?? `uxpin-column-${index + 1}`
}

export const tableColumnElementsToConfigs = (
  children: React.ReactNode
): TablePrototypeColumnConfig[] => (
  resolveTableColumnChildren(children).map((element, index) => {
    const props = resolveTableColumnRuntimeProps(element)
    const resolvedField = props.field ?? props.dataIndex
    const resolvedTitle = props.title ?? props.headerText

    return {
      key: resolveTableColumnKey(element, index),
      field: resolvedField,
      dataIndex: props.dataIndex,
      title: resolvedTitle,
      width: props.width,
      fill: props.fill,
      headerText: props.headerText,
      headerVariant: props.headerVariant,
      headerState: props.headerState,
      sort: props.defaultSort ?? props.sort,
      filter: props.filter,
      sortable: props.sortable,
      filterable: props.filterable,
      filterItems: props.filterItems,
      resetFilterButton: props.resetFilterButton,
      infoButton: props.infoButton ?? props.buttonInfo,
      infoText: props.infoText,
      cellType: props.cellType ?? props.cellVariant,
      cellVariant: props.cellVariant,
      sampleValue: props.sampleValue ?? props.text,
      toggleOnText: props.toggleOnText,
      toggleOffText: props.toggleOffText,
      options: props.options,
      elementBefore: props.elementBefore,
      elementBeforeSlot: props.elementBeforeSlot,
      text: props.text,
      elementAfter: props.elementAfter,
      elementAfterSlot: props.elementAfterSlot
    }
  })
)

const TableColumn: TableColumnComponent = ({
  title,
  field,
  width = 200,
  fill = false,
  cellType = 'text'
}: UXPinTableColumnProps): JSX.Element => (
  <PreviewSurface
    minHeight={40}
    style={{
      width: fill ? '100%' : width,
      minWidth: fill ? undefined : width,
      maxWidth: fill ? '100%' : width
    }}
  >
    <ColumnCard>
      <div className="title">{title ?? 'Table Column'}</div>
      <div className="meta">
        Config child for <code>Table</code>: <code>{field ?? 'field'}</code> · <code>{cellType}</code> · <code>{fill ? 'fill' : `${width}px`}</code>
      </div>
      <div className="meta">
        Use <code>field</code> for row data, <code>title</code> for the header, and turn on sorting/filtering only when needed.
      </div>
    </ColumnCard>
  </PreviewSurface>
)

TableColumn.uxpinRole = TABLE_COLUMN_ROLE
TableColumn.displayName = 'TableColumn'
TableColumn.defaultProps = {
  title: 'Table Column',
  field: 'field',
  width: 200,
  fill: false,
  cellType: 'text',
  sortable: false,
  defaultSort: 'notApplied',
  filterable: false,
  filterItems: '',
  resetFilterButton: false,
  infoButton: false,
  toggleOnText: 'Enabled',
  toggleOffText: 'Disabled',
  elementBefore: false,
  elementAfter: false
}

export default TableColumn

const ColumnCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  color: #1f1f1f;
  padding: 8px 10px;
  border: 1px dashed #c6ccd8;
  border-radius: 8px;
  background: #f8fafc;

  .title {
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
  }

  .meta {
    font-size: 11px;
    line-height: 14px;
    color: #5f6673;
  }
`
