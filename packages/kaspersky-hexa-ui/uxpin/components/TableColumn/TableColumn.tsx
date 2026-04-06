import {
  TablePrototypeCellVariant,
  TablePrototypeColumnConfig,
  TablePrototypeFilterState,
  TablePrototypeHeaderState,
  TablePrototypeHeaderVariant,
  TablePrototypeSortState
} from '@src/table/preview/TablePrototype'
import React from 'react'
import styled from 'styled-components'

import { PreviewSurface } from '../../preview'

export type UXPinTableColumnProps = TablePrototypeColumnConfig & {
  headerVariant?: TablePrototypeHeaderVariant,
  headerState?: TablePrototypeHeaderState,
  sort?: TablePrototypeSortState,
  filter?: TablePrototypeFilterState,
  cellVariant?: TablePrototypeCellVariant
}

type TableColumnComponent = React.FC<UXPinTableColumnProps> & {
  uxpinRole?: string
}

const TABLE_COLUMN_ROLE = 'hexa-uxpin-table-column'

const hasTableColumnShape = (props: Record<string, unknown> = {}): boolean => (
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
): node is React.ReactElement<UXPinTableColumnProps> => (
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
): Array<React.ReactElement<UXPinTableColumnProps>> => {
  const columns: Array<React.ReactElement<UXPinTableColumnProps>> = []

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
  resolveTableColumnChildren(children).map((element, index) => ({
    key: typeof element.key === 'string' && element.key.length
      ? element.key
      : `uxpin-column-${index + 1}`,
    width: element.props.width,
    headerText: element.props.headerText,
    headerVariant: element.props.headerVariant,
    headerState: element.props.headerState,
    sort: element.props.sort,
    filter: element.props.filter,
    buttonInfo: element.props.buttonInfo,
    cellVariant: element.props.cellVariant,
    elementBefore: element.props.elementBefore,
    elementBeforeSlot: element.props.elementBeforeSlot,
    text: element.props.text,
    elementAfter: element.props.elementAfter,
    elementAfterSlot: element.props.elementAfterSlot
  }))
)

const TableColumn: TableColumnComponent = ({
  buttonInfo = false,
  cellVariant = 'text',
  filter = 'notApplied',
  headerState = 'enabled',
  headerText = 'Column',
  headerVariant = 'text',
  sort = 'notApplied',
  text = 'Value'
}: UXPinTableColumnProps): JSX.Element => (
  <PreviewSurface minHeight={88}>
    <ColumnCard>
      <div className="title">{headerText}</div>
      <div className="line">Header: {headerVariant}</div>
      <div className="line">Header state: {headerState}</div>
      <div className="line">Sort: {sort}</div>
      <div className="line">Filter: {filter}</div>
      <div className="line">Info button: {buttonInfo ? 'on' : 'off'}</div>
      <div className="line">Cell: {cellVariant}</div>
      <div className="line">Text: {text}</div>
    </ColumnCard>
  </PreviewSurface>
)

TableColumn.uxpinRole = TABLE_COLUMN_ROLE
TableColumn.displayName = 'TableColumn'

export default TableColumn

const ColumnCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  color: #1f1f1f;

  .title {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  .line {
    font-size: 12px;
    line-height: 16px;
    color: #5f6673;
  }
`
