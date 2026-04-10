import React from 'react';

import BreadcrumbItem from '../../BreadcrumbItem/BreadcrumbItem';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';
import PageHeader from '../PageHeader';

export default (
  <PageHeader
    uxpId="page-header-1"
    title="Page title"
    description={false}
    descriptionText="Page description"
    iconBefore={false}
    breadcrumbs={false}
    tagsAfter={false}
    elementAfter={false}
  >
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
  </PageHeader>
);
