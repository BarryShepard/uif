import React from 'react';

import Sidebar from '../Sidebar';
import SidebarFooter from '../../SidebarFooter/SidebarFooter';
import Submenu from '../../Submenu/Submenu';
import SubmenuItem from '../../SubmenuItem/SubmenuItem';
import Tabs from '../../Tabs/Tabs';
import TabItem from '../../TabItem/TabItem';

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
    <Submenu
      uxpId="sidebar-submenu"
      draggable={false}
      truncateText={true}
    >
      <SubmenuItem uxpId="sidebar-submenu-item-1" text="Overview" selected={true} iconBefore={true} iconBeforeSlot="Browser" />
      <SubmenuItem uxpId="sidebar-submenu-item-2" text="Assets" iconBefore={true} iconBeforeSlot="StorageServer" />
      <SubmenuItem uxpId="sidebar-submenu-item-3" text="Policies" iconBefore={true} iconBeforeSlot="Shield" />
      <SubmenuItem uxpId="sidebar-submenu-item-4" text="Reports" iconBefore={true} iconBeforeSlot="Folder" />
      <SubmenuItem uxpId="sidebar-submenu-item-5" text="Settings" iconBefore={true} iconBeforeSlot="SettingsGear" />
    </Submenu>
    <Tabs
      uxpId="sidebar-tabs"
      defaultActiveKey="tab-1"
      noMargin={true}
    >
      <TabItem uxpId="sidebar-tab-1" text="Tab 1" selected={true} />
      <TabItem uxpId="sidebar-tab-2" text="Tab 2" />
      <TabItem uxpId="sidebar-tab-3" text="Tab 3" indicator={true} />
    </Tabs>
    <SidebarFooter
      uxpId="sidebar-footer"
      additionalContent={true}
    />
  </Sidebar>
);
