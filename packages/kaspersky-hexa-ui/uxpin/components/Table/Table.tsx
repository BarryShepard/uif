import {
  TablePrototype,
  TablePrototypeProps,
  defaultTablePrototypeColumns
} from '@src/table/preview/TablePrototype'
import React, { CSSProperties, useMemo } from 'react'

import { mergeFrameStyle } from '../../preview'

import { tableColumnElementsToConfigs } from '../TableColumn/TableColumn'

type UXPinTableProps = Omit<TablePrototypeProps, 'columns' | 'style'> & {
  children?: React.ReactNode,
  style?: CSSProperties
}

const Table = ({
  children,
  rows = 5,
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
      rows={rows}
      size={size}
      style={mergeFrameStyle(style)}
    />
  )
}

Table.defaultProps = {
  rows: 5,
  size: 'standard'
}

Table.displayName = 'Table'

export default Table
