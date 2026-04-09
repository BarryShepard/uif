import React from 'react';

import BreadcrumbItem from '../../BreadcrumbItem/BreadcrumbItem';
import Breadcrumbs from '../Breadcrumbs';

export default (
  <Breadcrumbs
    uxpId="breadcrumbs-1"
    size="small"
  >
    <BreadcrumbItem
      uxpId="breadcrumb-item-1"
      text="Current page"
      current={false}
      disabled={false}
    />
  </Breadcrumbs>
);
