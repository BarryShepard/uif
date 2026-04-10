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
  /** Enables header filtering for this column. */
  filterable?: boolean,
  /** Adds an info icon to the header title. */
  infoButton?: boolean,
  /** Text shown in the popover when the info icon is clicked. */
  infoText?: string,
  /** Used only in generated mode to override the default example value. */
  sampleValue?: TablePrototypeCellValue,
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
  uxpinRole?: string
}

const TABLE_COLUMN_ROLE = 'hexa-uxpin-table-column'

const hasTableColumnShape = (props: Record<string, unknown> = {}): boolean => (
  'title' in props ||
  'field' in props ||
  'dataIndex' in props ||
  'fill' in props ||
  'cellType' in props ||
  'sortable' in props ||
  'filterable' in props ||
  'infoButton' in props ||
  'sampleValue' in props ||
  'headerText' in props ||
  'headerVariant' in props ||
  'headerState' in props ||
  'sort' in props ||
  'filter' in props ||
  'buttonInfo' in props ||
  'cellVariant' in props ||
  'elementBefore' in props ||
  'elementBeforeSlot' in props ||
  'text' in props ||
  'elementAfter' in props ||
  'elementAfterSlot' in props
)

export const isUXPinTableColumnElement = (
  node: React.ReactNode
): node is React.ReactElement<TableColumnRuntimeProps> => (
  React.isValidElement(node) &&
  (
    (node.type as TableColumnComponent)?.uxpinRole === TABLE_COLUMN_ROLE ||
    (node.type as { displayName?: string })?.displayName === 'TableColumn' ||
    (node.type as { name?: string })?.name === 'TableColumn' ||
    hasTableColumnShape((node.props as Record<string, unknown>) || {})
  )
)

export const resolveTableColumnChildren = (
  children: React.ReactNode
): Array<React.ReactElement<TableColumnRuntimeProps>> => {
  const columns: Array<React.ReactElement<TableColumnRuntimeProps>> = []

  React.Children.forEach(children, (child) => {
    if (!child) {
      return
    }

    if (isUXPinTableColumnElement(child)) {
      columns.push(child)
      return
    }

    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.props?.children
    ) {
      columns.push(...resolveTableColumnChildren(child.props.children))
    }
  })

  return columns
}

export const tableColumnElementsToConfigs = (
  children: React.ReactNode
): TablePrototypeColumnConfig[] => (
  resolveTableColumnChildren(children).map((element, index) => {
    const props = (element.props || {}) as TableColumnRuntimeProps
    const resolvedField = props.field ?? props.dataIndex
    const resolvedTitle = props.title ?? props.headerText

    return {
      key: typeof element.key === 'string' && element.key.length
        ? element.key
        : `uxpin-column-${index + 1}`,
      field: resolvedField,
      dataIndex: props.dataIndex,
      title: resolvedTitle,
      width: props.width,
      fill: props.fill,
      headerText: props.headerText,
      headerVariant: props.headerVariant,
      headerState: props.headerState,
      sort: props.sort,
      filter: props.filter,
      sortable: props.sortable,
      filterable: props.filterable,
      infoButton: props.infoButton ?? props.buttonInfo,
      infoText: props.infoText,
      cellType: props.cellType ?? props.cellVariant,
      cellVariant: props.cellVariant,
      sampleValue: props.sampleValue ?? props.text,
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
  filterable: false,
  infoButton: false,
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
