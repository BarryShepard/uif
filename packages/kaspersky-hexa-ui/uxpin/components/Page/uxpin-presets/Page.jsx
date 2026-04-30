import React from 'react';

import Button from '../../Button/Button';
import BreadcrumbItem from '../../BreadcrumbItem/BreadcrumbItem';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';
import GroupWrapper from '../../GroupWrapper/GroupWrapper';
import Menu from '../../Menu/Menu';
import MenuItem from '../../MenuItem/MenuItem';
import PageHeader from '../../PageHeader/PageHeader';
import PageWrapper from '../../PageWrapper/PageWrapper';
import SectionWrapper from '../../SectionWrapper/SectionWrapper';
import SidebarFooter from '../../SidebarFooter/SidebarFooter';
import SidebarFooterLeftItems from '../../SidebarFooterLeftItems/SidebarFooterLeftItems';
import SidebarFooterRightItems from '../../SidebarFooterRightItems/SidebarFooterRightItems';
import Submenu from '../../Submenu/Submenu';
import SubmenuItem from '../../SubmenuItem/SubmenuItem';
import Page from '../Page';

export default (
  <Page
    uxpId="page-1"
    menu={true}
    submenu={true}
    pageHeader={true}
    pageFooter={true}
  >
    <Menu
      uxpId="page-menu"
      minimized={false}
      header={true}
      footer={true}
      title="Configuration Service"
      description="Kaspersky Next"
    >
      <MenuItem
        uxpId="page-menu-item-1"
        label="Administration server"
        elementBefore={true}
        elementBeforeIcon="StorageServer"
        state="enabled"
      />
      <MenuItem
        uxpId="page-menu-item-2"
        label="Console navigation"
        elementBefore={true}
        elementBeforeIcon="Map"
        state="enabled"
      />
      <MenuItem
        uxpId="page-menu-item-3"
        label="Monitoring"
        elementBefore={true}
        elementBeforeIcon="EngineeringStation"
        state="enabled"
      />
    </Menu>
    <Submenu
      uxpId="page-submenu"
      draggable={false}
      truncateText={true}
    >
      <SubmenuItem
        uxpId="page-submenu-item-1"
        variant="item"
        text="Overview"
        selected={true}
        iconBefore={true}
        iconBeforeSlot="Browser"
      />
      <SubmenuItem
        uxpId="page-submenu-item-2"
        variant="item"
        text="Assets"
        iconBefore={true}
        iconBeforeSlot="StorageServer"
      />
      <SubmenuItem
        uxpId="page-submenu-item-3"
        variant="item"
        text="Policies"
        iconBefore={true}
        iconBeforeSlot="Shield"
      />
    </Submenu>
    <PageHeader
      uxpId="page-header"
      title="Page title"
      description={false}
      descriptionText="Page description"
      iconBefore={false}
      breadcrumbs={false}
      tagsAfter={false}
      elementAfter={false}
    >
      <Breadcrumbs
        uxpId="page-header-breadcrumbs"
        size="small"
      >
        <BreadcrumbItem
          uxpId="page-header-breadcrumb-current"
          text="Current page"
          current={false}
          disabled={false}
        />
      </Breadcrumbs>
    </PageHeader>
    <PageWrapper
      uxpId="page-wrapper"
      flexWidth={true}
    >
      <SectionWrapper
        uxpId="page-section-wrapper-1"
        flexHeight={false}
      >
        <GroupWrapper
          uxpId="page-group-wrapper-1"
          flexHeight={false}
          flexWidth={true}
        />
      </SectionWrapper>
    </PageWrapper>
    <SidebarFooter
      uxpId="page-footer"
      additionalContent={false}
    >
      <SidebarFooterLeftItems uxpId="page-footer-left-items">
        <Button
          uxpId="page-footer-save"
          mode="primary"
          size="medium"
          text="Save"
          style={{ width: 'fit-content' }}
        />
        <Button
          uxpId="page-footer-cancel"
          mode="secondary"
          size="medium"
          text="Cancel"
          style={{ width: 'fit-content' }}
        />
      </SidebarFooterLeftItems>
      <SidebarFooterRightItems uxpId="page-footer-right-items">
        <Button
          uxpId="page-footer-delete"
          mode="dangerOutlined"
          size="medium"
          text="Delete"
          style={{ width: 'fit-content' }}
        />
      </SidebarFooterRightItems>
    </SidebarFooter>
  </Page>
);
