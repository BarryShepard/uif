import {
  TablePrototypeDataMode,
  TablePrototype,
  TablePrototypeSelectionMode,
  TablePrototypeSize,
  defaultTablePrototypeColumns
} from '@src/table/preview/TablePrototype'
import React, { CSSProperties, useMemo } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'
import {
  hasUXPinChildrenProp,
  resolveUXPinChildrenFromProps,
  resolveUXPinRuntimeProps
} from '../../uxpinRuntime'
import { useAutoHeightMergeFrame } from '../../useAutoHeightMergeFrame'

import TableColumn, {
  resolveTableColumnChildren,
  tableColumnElementsToConfigs
} from '../TableColumn/TableColumn'
import TablePlaceholder, {
  resolveTablePlaceholderConfig
} from '../TablePlaceholder/TablePlaceholder'

type UXPinTableProps = {
  /** "generated" creates sample rows automatically, "manual" uses dataSourceJson. */
  dataMode?: TablePrototypeDataMode,
  /** Preferred manual authoring format in UXPin. Expects a JSON array of rows. */
  dataSourceJson?: string,
  /** Total number of generated rows when dataMode is "generated". */
  rowsCount?: number,
  /** How many rows are visible on one page when pagination is enabled. */
  rowsPerPage?: UXPinRowsPerPage,
  /** Shows the total summary block next to pagination controls. */
  showPaginationSummary?: boolean,
  /** Shows the rows-per-page selector on the right side of pagination. */
  showRowsPerPageSelector?: boolean,
  /** Adds the built-in selection column. Its width is fixed by the table. */
  selectionMode?: TablePrototypeSelectionMode,
  /** Controls vertical sizing: "hug" follows content, "fill" fills the available wrapper/frame height. */
  heightMode?: UXPinTableHeightMode,
  showPagination?: boolean,
  size?: TablePrototypeSize,
  children?: React.ReactNode,
  codeComponentProps?: Partial<UXPinTableProps>,
  overriddenCodeProps?: Partial<UXPinTableProps>,
  style?: CSSProperties
}

type UXPinRowsPerPage = '20 on page' | '50 on page' | '100 on page'
type UXPinTableHeightMode = 'hug' | 'fill'

const PreviewRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  width: 100%;
  min-width: 0;
  min-height: 0;
  align-self: stretch;
  background: transparent;
  box-sizing: border-box;
`

const ROWS_PER_PAGE_BY_OPTION: Record<UXPinRowsPerPage, number> = {
  '20 on page': 20,
  '50 on page': 50,
  '100 on page': 100
}

const DEFAULT_TABLE_CHILDREN = (
  <>
    <TableColumn
      title="Asset"
      field="asset"
      width={240}
      cellType="treeLink"
      sortable={true}
      filterable={true}
    />
    <TableColumn
      title="Status"
      field="status"
      width={180}
      cellType="status"
    />
    <TableColumn
      title="Owner"
      field="owner"
      width={220}
      cellType="text"
      sortable={true}
      filterable={true}
      infoButton={true}
    />
    <TableColumn
      title="Actions"
      field="controls"
      width={152}
      cellType="actions"
    />
    <TablePlaceholder
      size="small"
      image={true}
      imageType="no data"
      titleText="No data"
      description={true}
      descriptionText="There is no table data to display yet."
    />
  </>
)

const TABLE_DEFAULT_PROPS: Partial<UXPinTableProps> = {
  children: DEFAULT_TABLE_CHILDREN,
  rowsCount: 30,
  rowsPerPage: '20 on page',
  showPaginationSummary: true,
  showRowsPerPageSelector: true,
  selectionMode: 'checkbox',
  heightMode: 'hug',
  showPagination: true,
  size: 'compact'
}

const resolveRowsPerPage = (
  rowsPerPage: UXPinRowsPerPage | number | undefined
): number => {
  if (typeof rowsPerPage === 'number') {
    return rowsPerPage
  }

  return rowsPerPage ? ROWS_PER_PAGE_BY_OPTION[rowsPerPage] : 20
}

const Table = (rawProps: UXPinTableProps): JSX.Element => {
  const runtimeProps = resolveUXPinRuntimeProps(rawProps, TABLE_DEFAULT_PROPS)
  const runtimeChildren = hasUXPinChildrenProp(rawProps)
    ? resolveUXPinChildrenFromProps(rawProps)
    : runtimeProps.children
  const {
    dataMode,
    dataSourceJson,
    rowsCount = 30,
    rowsPerPage = '20 on page',
    showPaginationSummary = true,
    showRowsPerPageSelector = true,
    selectionMode = 'checkbox',
    heightMode = 'hug',
    showPagination = true,
    size = 'compact',
    style
  } = runtimeProps
  const children = runtimeChildren ?? DEFAULT_TABLE_CHILDREN

  const resolvedChildren = useMemo(() => {
    const resolvedColumns = resolveTableColumnChildren(children)
    return resolvedColumns.length ? resolvedColumns : DEFAULT_TABLE_CHILDREN
  }, [children])
  const columns = useMemo(() => {
    const resolvedColumns = tableColumnElementsToConfigs(resolvedChildren)
    return resolvedColumns.length ? resolvedColumns : defaultTablePrototypeColumns
  }, [resolvedChildren])
  const placeholder = useMemo(
    () => resolveTablePlaceholderConfig(children) ?? resolveTablePlaceholderConfig(DEFAULT_TABLE_CHILDREN),
    [children]
  )
  const resolvedRowsPerPage = resolveRowsPerPage(rowsPerPage)
  const shouldFillHeight = heightMode === 'fill'
  const rootRef = useAutoHeightMergeFrame({
    containWidth: shouldFillHeight,
    disabled: shouldFillHeight,
    markFillShell: shouldFillHeight
  })

  return (
    <PreviewRoot ref={rootRef} data-hexa-uxpin-table-root="true" data-hexa-uxpin-table-height-mode={heightMode} style={mergeFrameStyle({
      width: '100%',
      height: shouldFillHeight ? '100%' : 'auto',
      flex: shouldFillHeight ? '1 1 auto' : '0 0 auto',
      minHeight: 0,
      ...style
    })}>
      <TablePrototype
        columns={columns}
        placeholder={placeholder}
        dataMode={dataMode}
        dataSourceJson={dataSourceJson}
        rowsCount={rowsCount}
        rowsPerPage={resolvedRowsPerPage}
        showPaginationSummary={showPaginationSummary}
        showRowsPerPageSelector={showRowsPerPageSelector}
        selectionMode={selectionMode}
        fillFrameHeight={shouldFillHeight}
        showPagination={showPagination}
        size={size}
        style={mergeFrameStyle({
          width: '100%',
          height: shouldFillHeight ? '100%' : undefined,
          flex: shouldFillHeight ? 1 : undefined,
          minHeight: 0
        })}
      />
    </PreviewRoot>
  )
}

Table.defaultProps = TABLE_DEFAULT_PROPS

Table.displayName = 'Table'

export default Table
