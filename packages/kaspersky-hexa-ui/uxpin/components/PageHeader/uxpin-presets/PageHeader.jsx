import React from 'react';

import BreadcrumbItem from '../../BreadcrumbItem/BreadcrumbItem';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';
import PageHeader from '../PageHeader';

export default (
  <PageHeader
    uxpId="page-header-1"
    title="Page title"
    description={true}
    descriptionText="Page description"
    iconBefore={true}
    breadcrumbs={true}
    tagsAfter={true}
    elementAfter={true}
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
