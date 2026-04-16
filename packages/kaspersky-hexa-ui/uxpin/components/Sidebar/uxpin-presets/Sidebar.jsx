import React from 'react';

import Sidebar from '../Sidebar';
import SidebarFooter from '../../SidebarFooter/SidebarFooter';
import Submenu from '../../Submenu/Submenu';

export default (
  <Sidebar
    uxpId="sidebar-1"
    size="medium"
    overlay={true}
    submenu={true}
    footer={true}
    headerElementBefore={false}
    title="Sidebar title"
    elementsAfter={false}
    subtitle={false}
    subtitleText="Sidebar subtitle"
    toggle={false}
    toggleText="Toggle option"
    tabs={true}
  >
    <Submenu uxpId="sidebar-submenu" />
    <SidebarFooter
      uxpId="sidebar-footer"
      additionalContent={false}
    />
  </Sidebar>
);
