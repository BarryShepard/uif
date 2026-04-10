import React from 'react';

import Table from '../Table';
import TableColumn from '../../TableColumn/TableColumn';

export default (
  <Table
    uxpId="table-1"
    rowsCount={5}
    rowsPerPage={5}
    showPagination={true}
    showPaginationSummary={true}
    showRowsPerPageSelector={true}
    selectionMode="checkbox"
    size="standard"
  >
    <TableColumn
      uxpId="table-column-1"
      title="Asset"
      field="asset"
      width={240}
      cellType="treeLink"
      sortable={true}
      filterable={true}
    />
    <TableColumn
      uxpId="table-column-2"
      title="Status"
      field="status"
      width={180}
      cellType="status"
    />
    <TableColumn
      uxpId="table-column-3"
      title="Owner"
      field="owner"
      width={220}
      cellType="text"
      sortable={true}
      filterable={true}
      infoButton={true}
    />
    <TableColumn
      uxpId="table-column-4"
      title="Actions"
      field="controls"
      width={152}
      cellType="actions"
    />
  </Table>
);
