import { TablePrototype, TablePrototypeColumnConfig } from '@src/table/preview/TablePrototype'
import React from 'react'

import { Story } from './_commonConstants'

const prototypeColumns: TablePrototypeColumnConfig[] = [
  {
    key: 'select',
    width: 88,
    headerVariant: 'checkbox',
    headerState: 'active',
    cellVariant: 'checkbox'
  },
  {
    key: 'asset',
    width: 240,
    headerText: 'Asset',
    headerVariant: 'text+filters+sort',
    headerState: 'enabled',
    sort: 'ascending',
    filter: 'applied',
    cellVariant: 'treeLink',
    elementBefore: true,
    text: 'Endpoint'
  },
  {
    key: 'owner',
    width: 220,
    headerText: 'Owner',
    headerVariant: 'text+filters+sort',
    headerState: 'hover',
    sort: 'notApplied',
    filter: 'notApplied',
    buttonInfo: true,
    cellVariant: 'text',
    elementBefore: true,
    elementAfter: true,
    text: 'Operator'
  },
  {
    key: 'status',
    width: 180,
    headerText: 'Status',
    headerVariant: 'text',
    headerState: 'enabled',
    cellVariant: 'status',
    text: 'Protected'
  },
  {
    key: 'tags',
    width: 240,
    headerText: 'Tags',
    headerVariant: 'text',
    headerState: 'disabled',
    cellVariant: 'tag-group',
    text: 'Region'
  },
  {
    key: 'actions',
    width: 152,
    headerText: 'Actions',
    headerVariant: 'text',
    headerState: 'active',
    cellVariant: 'actions'
  }
]

export const PrototypeBuilder: Story = {
  render: () => (
    <TablePrototype
      columns={prototypeColumns}
      rows={6}
      size="standard"
    />
  ),
  parameters: {
    controls: {
      exclude: /.*/
    }
  }
}
