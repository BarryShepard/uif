import React from 'react';

import Button from '../../Button/Button';
import TablePlaceholder from '../TablePlaceholder';

export default (
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
);
