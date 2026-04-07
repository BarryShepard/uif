import {
  TablePrototypeDataMode,
  TablePrototype,
  TablePrototypeRow,
  TablePrototypeSelectionMode,
  TablePrototypeSize,
  defaultTablePrototypeColumns
} from '@src/table/preview/TablePrototype'
import React, { CSSProperties, useMemo } from 'react'

import { mergeFrameStyle } from '../../preview'

import { tableColumnElementsToConfigs } from '../TableColumn/TableColumn'

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
  showPagination?: boolean,
  size?: TablePrototypeSize,
  children?: React.ReactNode,
  style?: CSSProperties
}

const Table = ({
  children,
  dataMode,
  dataSource,
  dataSourceJson,
  rowsCount = 5,
  rowsPerPage = 5,
  showPaginationSummary = true,
  showRowsPerPageSelector = true,
  selectionMode = 'none',
  showPagination = false,
  size = 'standard',
  style
}: UXPinTableProps): JSX.Element => {
  const columns = useMemo(() => {
    const resolvedColumns = tableColumnElementsToConfigs(children)
    return resolvedColumns.length ? resolvedColumns : defaultTablePrototypeColumns
  }, [children])

  return (
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
      showPagination={showPagination}
      size={size}
      style={mergeFrameStyle(style)}
    />
  )
}

Table.defaultProps = {
  rowsCount: 5,
  rowsPerPage: 5,
  showPaginationSummary: true,
  showRowsPerPageSelector: true,
  selectionMode: 'none',
  showPagination: false,
  size: 'standard'
}

Table.displayName = 'Table'

export default Table
