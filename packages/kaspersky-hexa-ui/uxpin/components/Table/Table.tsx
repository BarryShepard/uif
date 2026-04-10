import {
  TablePrototypeDataMode,
  TablePrototype,
  TablePrototypeRow,
  TablePrototypeSelectionMode,
  TablePrototypeSize,
  defaultTablePrototypeColumns
} from '@src/table/preview/TablePrototype'
import React, { CSSProperties, useMemo } from 'react'
import styled from 'styled-components'

import { mergeFrameStyle } from '../../preview'

import TableColumn, {
  resolveTableColumnChildren,
  tableColumnElementsToConfigs
} from '../TableColumn/TableColumn'

type UXPinTableProps = {
  /** "generated" creates sample rows automatically, "manual" uses dataSourceJson/dataSource. */
  dataMode?: TablePrototypeDataMode,
  /** Programmatic manual rows. Mostly useful in stories and tests. */
  dataSource?: TablePrototypeRow[],
  /** Preferred manual authoring format in UXPin. Expects a JSON array of rows. */
  dataSourceJson?: string,
  /** Total number of generated rows when dataMode is "generated". */
  rowsCount?: number,
  /** How many rows are visible on one page when pagination is enabled. */
  rowsPerPage?: number,
  /** Shows the total summary block next to pagination controls. */
  showPaginationSummary?: boolean,
  /** Shows the rows-per-page selector on the right side of pagination. */
  showRowsPerPageSelector?: boolean,
  /** Adds the built-in selection column. Its width is fixed by the table. */
  selectionMode?: TablePrototypeSelectionMode,
  /** Optional fixed UXPin frame height in px. Leave empty to resize directly via the frame. */
  frameHeight?: number,
  showPagination?: boolean,
  size?: TablePrototypeSize,
  children?: React.ReactNode,
  style?: CSSProperties
}

const PreviewRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  align-self: stretch;
  background: transparent;
  box-sizing: border-box;
`

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
  </>
)

const resolveFrameHeightStyle = (
  style: CSSProperties | undefined,
  frameHeight: number | undefined
): Pick<CSSProperties, 'height' | 'maxHeight' | 'minHeight'> => {
  const fallbackHeight = frameHeight !== undefined ? frameHeight : undefined

  return {
    ...(style?.height !== undefined || fallbackHeight !== undefined
      ? { height: style?.height ?? fallbackHeight }
      : {}),
    ...(style?.minHeight !== undefined
      ? { minHeight: style.minHeight }
      : {}),
    ...(style?.maxHeight !== undefined ? { maxHeight: style.maxHeight } : {})
  }
}

const Table = ({
  children = DEFAULT_TABLE_CHILDREN,
  dataMode,
  dataSource,
  dataSourceJson,
  rowsCount = 5,
  rowsPerPage = 5,
  showPaginationSummary = true,
  showRowsPerPageSelector = true,
  selectionMode = 'checkbox',
  frameHeight,
  showPagination = true,
  size = 'standard',
  style
}: UXPinTableProps): JSX.Element => {
  const resolvedChildren = useMemo(() => {
    const resolvedColumns = resolveTableColumnChildren(children)
    return resolvedColumns.length ? resolvedColumns : DEFAULT_TABLE_CHILDREN
  }, [children])
  const columns = useMemo(() => {
    const resolvedColumns = tableColumnElementsToConfigs(resolvedChildren)
    return resolvedColumns.length ? resolvedColumns : defaultTablePrototypeColumns
  }, [resolvedChildren])
  const frameHeightStyle = useMemo(
    () => resolveFrameHeightStyle(style, frameHeight),
    [frameHeight, style]
  )

  return (
    <PreviewRoot style={mergeFrameStyle({
      width: '100%',
      minHeight: 0,
      ...style,
      ...frameHeightStyle
    })}>
      <TablePrototype
        columns={columns}
        dataMode={dataMode}
        dataSource={dataSource}
        dataSourceJson={dataSourceJson}
        rowsCount={rowsCount}
        rowsPerPage={rowsPerPage}
        showPaginationSummary={showPaginationSummary}
        showRowsPerPageSelector={showRowsPerPageSelector}
        selectionMode={selectionMode}
        fillFrameHeight={true}
        showPagination={showPagination}
        size={size}
        style={mergeFrameStyle({
          width: '100%',
          height: '100%',
          flex: 1,
          minHeight: 0
        })}
      />
    </PreviewRoot>
  )
}

Table.defaultProps = {
  children: DEFAULT_TABLE_CHILDREN,
  rowsCount: 5,
  rowsPerPage: 5,
  showPaginationSummary: true,
  showRowsPerPageSelector: true,
  selectionMode: 'checkbox',
  showPagination: true,
  size: 'standard'
}

Table.displayName = 'Table'

export default Table
