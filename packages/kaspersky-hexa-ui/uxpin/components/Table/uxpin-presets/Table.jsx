import React from 'react';

import Table from '../Table';
import TableColumn from '../../TableColumn/TableColumn';
import TablePlaceholder from '../../TablePlaceholder/TablePlaceholder';
import Button from '../../Button/Button';

export default (
  <Table
    uxpId="table-1"
    rowsCount={5}
    rowsPerPage="20 on page"
    showPagination={true}
    showPaginationSummary={true}
    showRowsPerPageSelector={true}
    selectionMode="checkbox"
    heightMode="hug"
    size="compact"
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
    <TablePlaceholder
      uxpId="table-placeholder-1"
      size="small"
      image={true}
      imageType="no data"
      titleText="No data"
      description={true}
      descriptionText="There is no table data to display yet."
    >
      <Button
        uxpId="table-placeholder-button-1"
        text="Create"
        mode="primary"
      />
      <Button
        uxpId="table-placeholder-button-2"
        text="Import"
        mode="secondary"
      />
    </TablePlaceholder>
  </Table>
);
