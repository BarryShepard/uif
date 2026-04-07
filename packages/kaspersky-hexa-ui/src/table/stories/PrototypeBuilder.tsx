import { TablePrototype, TablePrototypeColumnConfig } from '@src/table/preview/TablePrototype'
import { tablePrototypeRichManualDataJson } from '@src/table/preview/manualDataExamples'
import React from 'react'

import { Story } from './_commonConstants'

const prototypeColumns: TablePrototypeColumnConfig[] = [
  {
    key: 'enabled',
    field: 'enabled',
    width: 22,
    title: '',
    cellType: 'checkbox'
  },
  {
    key: 'asset',
    field: 'asset',
    width: 240,
    title: 'Asset',
    sortable: true,
    filterable: true,
    sort: 'ascending',
    filter: 'applied',
    cellType: 'treeLink'
  },
  {
    key: 'owner',
    field: 'owner',
    width: 220,
    title: 'Owner',
    sortable: true,
    filterable: true,
    infoButton: true,
    infoText: 'Owner column displays the responsible person for the entity shown in the row.',
    cellType: 'text'
  },
  {
    key: 'status',
    field: 'status',
    width: 180,
    title: 'Status',
    cellType: 'status'
  },
  {
    key: 'tags',
    field: 'tags',
    width: 240,
    title: 'Tags',
    filterable: true,
    cellType: 'tag-group'
  },
  {
    key: 'actions',
    field: 'actions',
    width: 152,
    title: 'Actions',
    cellType: 'actions'
  }
]

export const PrototypeBuilder: Story = {
  render: () => (
    <TablePrototype
      columns={prototypeColumns}
      dataMode="manual"
      dataSourceJson={tablePrototypeRichManualDataJson}
      rowsPerPage={4}
      selectionMode="checkbox"
      showPagination={true}
      size="standard"
    />
  ),
  parameters: {
    controls: {
      exclude: /.*/
    }
  }
}
